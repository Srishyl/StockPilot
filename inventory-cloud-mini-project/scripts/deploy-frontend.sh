#!/usr/bin/env bash
set -euo pipefail
if [ "$#" -ne 2 ]; then echo 'Usage: bash scripts/deploy-frontend.sh BUCKET_NAME DISTRIBUTION_ID'; exit 1; fi
cd "$(dirname "$0")/../frontend"
npm install
npm run build
aws s3 sync dist/ "s3://$1" --delete
aws cloudfront create-invalidation --distribution-id "$2" --paths '/*'
