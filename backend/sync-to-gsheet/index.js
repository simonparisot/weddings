import { google } from "googleapis";
import { JWT } from "google-auth-library";

// 🔹 Load Google Service Account Credentials
const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// 🔹 Setup Google Sheets API Authentication
const auth = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SHEET_ID = process.env.SHEET_ID; // Google Sheet ID
const FIELD_ORDER = ["creation-date", "name", "ok", "nb", "kids", "kidsAge", "veggy", "veggyNb"];

export const handler = async (event) => {
    try {
        console.log("Received DynamoDB Stream event:", JSON.stringify(event, null, 2));

        // Process each new record individually
        const updates = event.Records.map(record => {
            if (record.eventName !== "INSERT") {
                console.log("Skipping non-INSERT event.");
                return null;
            }

            const newItem = record.dynamodb.NewImage;
            if (!newItem) return null;

            const row = FIELD_ORDER.map(field => {
                if (field === "creation-date") {
                    return newItem["creation-date"]?.S || "";
                }

                const dataObject = newItem.data?.M;
                if (!dataObject) return ""; // If missing, return empty value

                const fieldValue = dataObject[field];
                if (fieldValue?.S) return fieldValue.S;
                if (fieldValue?.N) return fieldValue.N;
                if (fieldValue?.BOOL !== undefined) return fieldValue.BOOL.toString();
                
                return ""; // Default empty value if field is not found
            });

            console.log(`Extracted row: ${JSON.stringify(row)}`);
            return row;
        }).filter(row => row !== null); // Remove null entries

        if (updates.length === 0) {
            console.log("No new data to update.");
            return { statusCode: 204, body: "No new data to update." };
        }

        console.log("Appending new rows to Google Sheets:", updates);

        // 🔹 Append new data to Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "Sheet1!A2", // Append below the headers
            valueInputOption: "RAW",
            requestBody: { values: updates },
        });

        console.log("Sync complete.");
        return { statusCode: 200, body: "Data successfully synced to Google Sheets." };

    } catch (error) {
        console.error("Error syncing data:", error);
        return { statusCode: 500, body: "Internal Server Error" };
    }
};
