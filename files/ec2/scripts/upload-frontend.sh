#!/bin/bash

set -e

echo "🚀 Uploading frontend to S3..."

BUILD_DIR="app/frontend/dist"
BUCKET_NAME=$1

aws s3 sync $BUILD_DIR s3://$BUCKET_NAME --delete

echo "✅ Frontend uploaded successfully"
