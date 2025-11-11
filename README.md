# Wedding & Baby Websites

A collection of custom wedding and baby announcement websites built for friends and family since my own wedding in 2019.

## Design Philosophy

These websites were created with the following principles:
- **Vanilla & Simple**: Minimal frameworks, straightforward HTML/CSS/JavaScript
- **Cost-effective**: Near-zero hosting costs using AWS S3 for static sites
- **Low Traffic Optimized**: Perfect for wedding invitations (a few hundred guests max)
- **Reusable Components**: Shared Lambda functions and utilities across projects

## 🌐 Live Websites

### Wedding Sites

#### Audrey & Simon ([audreyetsimon.fr](https://audreyetsimon.fr))
My own wedding, June 29th, 2019 and my first baby gift list ([/naissance](https://audreyetsimon.fr/naissance)), May 31st 2022. Includes the main features: wedding and baby gift list, powered by Stripe, and main website sections and design.

#### Thomas & Raphaël ([thomasandraphael.eu](https://damm8czy1z7b1.cloudfront.net))
Wedding of Thomas & Raphaël, February 29th, 2020.

#### Diane & Guillaume ([dianeetguillaume.fr](https://d37mdmzl3mlorn.cloudfront.net))
Wedding of Diane & Guillaume, June 21st, 2021 and their baby gift list sub-site ([/naissance](https://d37mdmzl3mlorn.cloudfront.net/naissance)).

#### Valérie & Christophe ([valerieetchristophe.fr](https://valerieetchristophe.fr))
Wedding of Valérie & Christophe, June 3rd, 2023. Added multi-lingual support (here French and Italian) with automatic locale detection Lambda function. Added also RSVP guest sign up.

#### Maud & Arnaud ([armaud.fr](https://armaud.fr))
Wedding of Maud & Arnaud, August 24th, 2024.

#### Blanche & Antoine ([blancheetantoine.fr](https://blancheetantoine.fr))
Wedding of Blanche & Antoine, September 13th, 2025. Added automatic sync of RSVP system with a Google sheet for easy tracking by the bride and groom.

#### Éléonore & Martial ([eleonoreetmartial.fr](https://eleonoreetmartial.fr))
Wedding of Éléonore & Martial, June 20 and 21st, 2026. 

## 📁 Repository Structure

```
.
├── frontend/                     # Static S3-served vanillaJS frontend
│   ├── audreyetsimon.fr/         # My wedding site + gift list + baby gift list
│   ├── thomasandraphael.eu/      # Thomas & Raphaël's wedding
│   ├── dianeetguillaume.fr/      # Diane & Guillaume's wedding + baby gift list
│   ├── valerieetchristophe.fr/   # Valérie & Christophe's wedding (bilingual + RSVP)
│   ├── mariage-arnaud/           # Maud & Arnaud's wedding
│   ├── blancheetantoine.fr/      # Blanche & Antoine's wedding
│   └── eleonoreetmartial.fr/     # Eléonore & Martial's wedding
│
├── backend/                      # Reusable Lambda functions
│   ├── LambdaPaymentStripe/      # Stripe payment Lambda functions
│   ├── store-to-dynamodb/        # API Gateway → DynamoDB storage
│   └── sync-to-gsheet/           # DynamoDB Stream → Google Sheets sync
│
└── .github/workflows/            # GitHub Actions for S3 deployment
```

## 🔧 Technical Stack

### Frontend
- **Pure HTML5/CSS3/JavaScript** - No frameworks, no build process
- **Responsive Design** - Mobile-first with separate `style-mobile.css`
- **Google Fonts** - EB Garamond, custom fonts for specific sites
- **Stripe.js** - Client-side payment handling
- **WebP Images** - Optimized images for fast loading

### Backend & Infrastructure
- **AWS S3** - Static website hosting
- **AWS Lambda** - Serverless functions for payments and RSVP
- **AWS API Gateway** - RESTful endpoints with Lambda integration
- **AWS DynamoDB** - NoSQL database for RSVP and payment records
- **DynamoDB Streams** - Real-time data synchronization
- **Google Sheets** - For RSVP data display for the bride and groom. Fed by DynamoDB Streams.
- **Stripe Checkout** - Payment processing for gift registries
- **GitHub Actions** - Automated deployment to S3

### Lambda Functions

**LambdaPaymentStripe**
  - Creates Stripe Checkout sessions
  - Hosted payment page by Stripe
  - Supports both fixed-price products and custom amounts
  - Supports Stripe Connected Accounts
  - DynamoDB storage for payment records

**store-to-dynamodb**
- Receives POST requests via API Gateway
- Stores JSON payloads in DynamoDB with timestamps
- Used for RSVP form submissions
- Returns creation timestamp on success

**sync-to-gsheet**
- Triggered by DynamoDB Streams on INSERT events
- Syncs new RSVP data to Google Sheets in real-time
- Maps DynamoDB format to spreadsheet columns
- Uses Google Service Account authentication

## 🚀 Deployment

### Static Sites
Automated deployment via GitHub Actions:
- Triggers on push to `main` branch
- Syncs files to S3 bucket
- Sets no-cache headers on HTML/CSS/JS files
- Uses AWS credentials from GitHub Secrets

### Lambda Functions
Manual deployment using `updateLambda.sh`:
```bash
# Example: Deploy payment Lambda
./updateLambda.sh LambdaPaymentStripe wedding-payment-function
```

## 💰 Cost Structure

**Most AWS costs are included in the free tier**
- S3 storage and requests : Free tier covers typical usage (few hundred KB, low traffic)
- Lambda: Free tier covers typical usage
- DynamoDB: Free tier (≤25GB, ≤200M requests)
- CloudFront (optional): Free tier
**The only real costs are:**
- Domain name and DNS zone: 0.50$ /month using AWS Route53
- Stripe fees: 1.5% + 0.25€ for typical UE cards payments

## 📄 License

Personal projects - feel free to use as inspiration or template for your own wedding sites!