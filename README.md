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

#### [audreyetsimon.fr](https://audreyetsimon.fr)
My own wedding, June 2019. Custom built without frameworks, hosted on S3. Includes a sub-site for the wedding gift list with Stripe payment integration and DynamoDB storage.

#### [thomasandraphael.eu](https://thomasandraphael.eu)
Wedding of Thomas & Raphaël, February 2020. Custom built, hosted on S3. Features a guest list RSVP system and wedding gift registry.

#### [dianeetguillaume.fr](https://dianeetguillaume.fr)
Wedding of Diane & Guillaume, 2021. Custom built, hosted on S3. Includes photo galleries from the wedding and a baby announcement sub-site (`/naissance`).

#### [blancheetantoine.fr](https://blancheetantoine.fr)
Wedding of Blanche & Antoine, September 2025. Modern design with EB Garamond font. Features RSVP system with dietary preferences and kids tracking, plus an integrated wedding gift list with Stripe payments.

#### [eleonoreetmartial.fr](https://eleonoreetmartial.fr)
Wedding of Eléonore & Martial. Similar structure to Blanche & Antoine's site with RSVP and gift list functionality.

#### [valerieetchristophe.fr](https://valerieetchristophe.fr)
Wedding of Valérie & Christophe. Bilingual site (French/Italian) with language detection Lambda function. Uses a redirect-language Lambda for automatic locale detection.

#### mariage-arnaud
Wedding site for Arnaud (work in progress or archived).

### Baby Announcement Sites

Several wedding sites include baby announcement sub-pages (e.g., `dianeetguillaume.fr/naissance`) with photo galleries and gift registries.

## 📁 Repository Structure

```
.
├── audreyetsimon.fr/          # My wedding site + gift list
├── thomasandraphael.eu/       # Thomas & Raphaël's wedding
├── dianeetguillaume.fr/       # Diane & Guillaume's wedding + baby
├── blancheetantoine.fr/       # Blanche & Antoine's wedding
├── eleonoreetmartial.fr/      # Eléonore & Martial's wedding
├── valerieetchristophe.fr/    # Valérie & Christophe's wedding (bilingual)
├── mariage-arnaud/            # Arnaud's wedding
│
├── LambdaPaymentStripe/       # Stripe payment Lambda functions
│   ├── v1/                    # Original charge API version
│   ├── v2/                    # Checkout session version
│   └── v3/                    # Latest TypeScript version
│
├── generic/                   # Reusable Lambda functions
│   ├── store-to-dynamodb/     # API Gateway → DynamoDB storage
│   └── sync-to-gsheet/        # DynamoDB Stream → Google Sheets sync
│
├── download_images.py         # Utility to download images from URLs
├── process_images.py          # Batch image processor for Instagram format
├── process_custom.py          # Custom single-image processor
├── updateLambda.sh            # Deploy Lambda functions to AWS
└── .github/workflows/         # GitHub Actions for S3 deployment
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
- **Google Sheets API** - RSVP data collection and monitoring
- **Stripe Checkout** - Payment processing for gift registries
- **GitHub Actions** - Automated deployment to S3

### Lambda Functions

#### LambdaPaymentStripe
Three versions of Stripe payment integration:

- **v1**: Original implementation using Stripe Charges API
  - Direct charge creation with token-based payments
  - DynamoDB storage for payment records
  - Test API key hardcoded (legacy)

- **v2**: Stripe Checkout Sessions
  - Creates Stripe Checkout sessions
  - Supports both fixed-price products and custom amounts
  - Hosted payment page by Stripe

- **v3**: Modern TypeScript implementation
  - Built with TypeScript for better type safety
  - Supports Stripe Connected Accounts
  - Configurable success/cancel URLs
  - Custom product metadata (name, description, image)

#### Generic Lambdas

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

## 🛠️ Utility Scripts

### download_images.py
Downloads images from various sources (La Redoute, Christofle, Unsplash, etc.) for wedding gift lists. Includes Unsplash API integration for retrieving high-quality images.

### process_images.py
Batch processes images for wedding gift lists:
- Crops to Instagram's 4:5 aspect ratio
- Resizes to 1080×1350px
- Converts to WebP format (quality 80)
- Optimizes file sizes for web delivery

### process_custom.py
Single-file version of `process_images.py` for processing individual custom images.

### updateLambda.sh
Deployment script for Lambda functions:
```bash
./updateLambda.sh <directory> <lambda-function-name>
```
- Zips Lambda code
- Deploys to AWS using AWS CLI
- Uses `perso` AWS profile
- Targets `eu-west-1` region

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
# Example: Deploy payment Lambda v3
./updateLambda.sh LambdaPaymentStripe/v3 wedding-payment-function
```

## 💾 Data Flow

### RSVP System
1. User fills out RSVP form on website
2. JavaScript (`savethedate.js`) sends POST to API Gateway
3. `store-to-dynamodb` Lambda stores response
4. DynamoDB Stream triggers `sync-to-gsheet` Lambda
5. Data appears in Google Sheets for tracking

### Payment System
1. User selects gift from website list
2. JavaScript (`payment.js`) calls payment Lambda
3. Lambda creates Stripe Checkout session
4. User redirected to Stripe-hosted payment page
5. On success, redirect to `/merci.html` thank-you page

## 🎨 Common Features

### RSVP Forms
- Multi-step questionnaires
- Guest count tracking
- Kids attendance and age collection
- Dietary preferences (vegetarian options)
- Validation and back navigation

### Gift Lists
- Photo galleries with gift items
- Fixed-price and custom amount options
- Stripe payment integration
- Thank-you pages after purchase
- Mobile-responsive grid layouts

### Photo Galleries
- Google Photos integration links
- Organized by event sections (ceremony, reception, etc.)
- Custom background images
- Hover effects and transitions

## 💰 Cost Structure

**Monthly AWS Costs** (per site, typical):
- S3 Storage: ~$0.10/month (few hundred KB)
- S3 Requests: ~$0.01/month (low traffic)
- Lambda: Free tier covers typical usage
- DynamoDB: Free tier (≤25GB, ≤200M requests)
- CloudFront (optional): ~$0.50/month

**Total**: $0-2/month per site at wedding-level traffic

## 🌟 Key Design Patterns

1. **Progressive Disclosure**: RSVP forms reveal questions one at a time
2. **Optimistic UI**: Immediate feedback before server responses
3. **Graceful Degradation**: Works without JavaScript for basic viewing
4. **Mobile-First**: Separate mobile stylesheets for optimal UX
5. **Serverless Architecture**: Pay only for actual usage
6. **JAMstack Approach**: JavaScript, APIs, and Markup

## 📝 Development Tips

1. **Testing Payments**: Use Stripe test keys in development
2. **Image Optimization**: Always run images through `process_images.py`
3. **Cache Busting**: Add `?v=X.X.X` to CSS/JS URLs when updating
4. **Lambda Logs**: Check CloudWatch for debugging Lambda functions
5. **S3 Permissions**: Ensure buckets have public read access for static hosting

## 🔒 Security Notes

- Never commit AWS credentials or Stripe secret keys
- Use environment variables for Lambda secrets
- Enable CORS only for specific domains in production
- Use Stripe webhooks for payment verification (not implemented in v1/v2)
- Service account credentials for Google Sheets stored in Lambda env vars

## 📄 License

Personal projects - feel free to use as inspiration or template for your own wedding sites!