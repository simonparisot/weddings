import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));
    try {
        // Extract HTTP method correctly from requestContext.http
        if (event.requestContext?.http?.method !== 'POST') {
            console.warn("Invalid HTTP method:", event.requestContext?.http?.method);
            return {
                statusCode: 405,
                body: JSON.stringify({ message: 'Method Not Allowed' }),
            };
        }

        let requestBody;
        try {
            requestBody = JSON.parse(event.body);
            console.log("Parsed request body:", requestBody);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid JSON format' }),
            };
        }

        const createdAt = new Date().toISOString();
        console.log("Generated timestamp:", createdAt);

        const params = {
            TableName: TABLE_NAME,
            Item: {
                "creation-date": createdAt,
                data: requestBody,
            },
        };

        console.log("DynamoDB put params:", params);
        await dynamoDB.send(new PutCommand(params));
        console.log("Item successfully stored in DynamoDB");

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Item successfully stored', "creation-date": createdAt }),
        };
    } catch (error) {
        console.error("Error storing item:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
