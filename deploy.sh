#!/bin/bash

echo "Deploying website to S3..."
# Deploy to S3
aws s3 sync blancheetantoine.fr/ s3://blancheetantoine.fr/ --delete

# Set no-cache for frequently changing files
aws s3 cp blancheetantoine.fr/index.html s3://blancheetantoine.fr/index.html --cache-control "no-cache"
aws s3 cp blancheetantoine.fr/style.css s3://blancheetantoine.fr/style.css --cache-control "no-cache"
aws s3 cp blancheetantoine.fr/style-mobile.css s3://blancheetantoine.fr/style-mobile.css --cache-control "no-cache"
aws s3 cp blancheetantoine.fr/savethedate.js s3://blancheetantoine.fr/savethedate.js --cache-control "no-cache"
aws s3 cp blancheetantoine.fr/payment.js s3://blancheetantoine.fr/payment.js --cache-control "no-cache"
aws s3 cp blancheetantoine.fr/liste.html s3://blancheetantoine.fr/liste.html --cache-control "no-cache"

echo "Deployment complete!" 