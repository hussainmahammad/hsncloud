#!/bin/bash

set -e

echo "🚀 Invalidating CloudFront cache..."

DISTRIBUTION_ID=$1

aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Cache invalidated" 
