# Serverless Cloud-Based Inventory Management System

A two-person cloud computing lab mini-project using **AWS SAM, Lambda (Python), API Gateway HTTP API, DynamoDB, Cognito, S3, CloudFront, Vite and AWS Amplify Auth**.

## Features
- Cognito email/password sign-in (admin provisions users)
- Create, list and edit products; delete empty-stock products via API
- Record stock received and sales, with atomic DynamoDB transactions
- Reject overselling and repeated transaction IDs
- Low-stock dashboard, revenue summary, transaction history
- Inventory CSV export

**Limitations:** Intended for small class demos. Lists use DynamoDB Scan and can become expensive at scale. SKU uniqueness is not enforced across products; use a dedicated SKU lock record or unique-index design for production. Transactions are recorded at the product's price at transaction time. No separate role permissions; all authenticated users have access. Product image upload and CSV transaction export are not included. Restock requests require client-generated unique IDs. A timeout may leave a transaction committed even if the browser sees an error; the same ID must be reused for a safe retry. The demo UI creates a new ID per click, not an automatic retry system.

## Requirements
- AWS account with permission to deploy IAM roles, Lambda, DynamoDB, Cognito, API Gateway, S3, CloudFront
- AWS CLI v2 configured (`aws configure`)
- AWS SAM CLI (`sam --version`)
- Node.js 20+ and npm
- Python 3.12 for local tests
- A region supported by these services, e.g. `ap-south-1`

## Project layout
```
backend/app.py              Python Lambda routes
frontend/src/main.js        Cognito sign-in, dashboard, forms
frontend/src/style.css      Responsive styling
frontend/.env.example       Frontend environment variables
template.yaml               SAM/CloudFormation infrastructure
tests/test_app.py           Unit tests
scripts/deploy-frontend.sh  S3 upload and CloudFront invalidation
docs/LAB_REPORT.md          Submission report
```

## 1. Set up AWS
1. Sign in to AWS and enable AWS Budgets / billing alerts. Confirm free-tier eligibility and limits; resources are not guaranteed free.
2. Install and configure AWS CLI with credentials for your account. Do not commit credentials.
3. Install AWS SAM CLI and Node.js.
4. From the project root, run:

```bash
sam build
sam deploy --guided
```

Choose a stack name such as `inventory-mini`, region `ap-south-1`, allow IAM role creation (`CAPABILITY_IAM`), and save the settings to `samconfig.toml`. SAM deploy may ask you to confirm API authorization behavior. The HTTP API requires Cognito JWT for every endpoint, including `/health`.

Record the outputs `ApiUrl`, `UserPoolId`, `UserPoolClientId`, `WebsiteBucketName`, `CloudFrontUrl`, `DistributionId`, and `Region`:

```bash
aws cloudformation describe-stacks --stack-name inventory-mini --region ap-south-1 --query 'Stacks[0].Outputs' --output table
```

## 2. Create a Cognito demo account

For a quick instructor demo, create an account through AWS CLI:

```bash
aws cognito-idp admin-create-user \
  --user-pool-id YOUR_USER_POOL_ID \
  --username instructor@example.com \
  --user-attributes Name=email,Value=instructor@example.com Name=email_verified,Value=true \
  --temporary-password 'TempPass123!' \
  --message-action SUPPRESS \
  --region ap-south-1
```

Use an email address you control. Cognito can require a new password at first login; the web UI supports the `NEW_PASSWORD_REQUIRED` challenge. Alternatively, set a permanent password in the Cognito console. Never hard-code passwords in project files or publicly shared screenshots.

## 3. Configure frontend

```bash
cd frontend
cp .env.example .env
npm install
```

On Windows PowerShell use `Copy-Item .env.example .env`.

Edit `.env` with stack outputs:

```
VITE_API_URL=https://YOUR_API_ID.execute-api.ap-south-1.amazonaws.com
VITE_AWS_REGION=ap-south-1
VITE_USER_POOL_ID=ap-south-1_YOUR_POOL_ID
VITE_USER_POOL_CLIENT_ID=YOUR_CLIENT_ID
```

The region variable is informational; Amplify infers it from the user pool ID.

Local testing:

```bash
npm run dev
```

Open the displayed Vite URL, usually `http://localhost:5173`, and sign in.

## 4. Deploy frontend to S3 + CloudFront

From the frontend directory:

```bash
npm run build
aws s3 sync dist/ s3://YOUR_WEBSITE_BUCKET --delete --region ap-south-1
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths '/*'
```

Open `CloudFrontUrl`. The S3 bucket is private; CloudFront reads it using Origin Access Control. CloudFront distribution provisioning may take time. Use HTTPS CloudFront URL, not S3 website endpoint.

Or run the helper:

```bash
bash scripts/deploy-frontend.sh YOUR_WEBSITE_BUCKET YOUR_DISTRIBUTION_ID
```

## 5. API endpoints
All routes require `Authorization: Bearer <Cognito access token>`.

| Method | Route | JSON body / purpose |
|---|---|---|
| GET | /health | Authorized health check |
| GET | /products | List products |
| POST | /products | `{ "name":"Notebook", "sku":"NB01", "priceCents":4500, "quantity":10, "lowStockThreshold":5 }` |
| PUT | /products/{productId} | `{ "name":"Notebook A5", "sku":"NB01", "priceCents":4900, "lowStockThreshold":5 }` |
| DELETE | /products/{productId} | Only if quantity is zero |
| POST | /sales | `{ "productId":"UUID", "quantity":2, "transactionId":"unique-UUID" }` |
| POST | /restock | Same body as /sales |
| GET | /transactions | List transactions |
| GET | /summary | Totals and revenue |

Money is stored in **integer paise** (`priceCents`) to avoid floating-point currency errors. The UI displays INR. For example, `4500` means ₹45.00.

## 6. Testing

```bash
python -m pip install boto3
python -m unittest discover -s tests -v
```

Manual acceptance checklist:
1. Unauthenticated request to `/products` returns 401.
2. Valid Cognito user signs in.
3. Add `Notebook` at ₹45 with stock 10, threshold 5.
4. Sell 3; stock becomes 7, revenue increases ₹135.
5. Sell 3 more; stock becomes 4 and low-stock warning appears.
6. Attempt to sell 5; API returns 409, stock remains 4.
7. Retry a sale with an already used `transactionId`; API returns 409, stock unchanged.
8. Restock 10; stock becomes 14.
9. Edit product name and price; changes appear in product table.
10. Download CSV and verify data.
11. Sign out and verify dashboard is no longer accessible.

## 7. Evidence to collect for report
- AWS CloudFormation stack and outputs
- DynamoDB tables
- Lambda function and API Gateway routes
- Cognito user pool
- S3 bucket and CloudFront distribution
- Login screen, dashboard, add product, sale, low-stock warning, CSV export
- Unit test output and browser demonstration

## 8. Troubleshooting
- **401 Unauthorized:** Cognito token absent, expired, wrong app client, or wrong pool; sign out and sign in again.
- **CORS issue:** Verify the deployed API URL, browser Network tab, and API Gateway CORS configuration. Redeploy after edits.
- **403 CloudFront:** Wait for distribution deployment; verify S3 files exist and OAC bucket policy was deployed.
- **New password required:** Enter a valid permanent password when prompted.
- **409 Conflict:** Insufficient stock, duplicate transaction ID, or invalid product update/delete condition.
- **500 Error:** Check Lambda logs in CloudWatch; verify IAM policy and table environment variables.

## 9. Cleanup (avoid ongoing charges)
Delete CloudFront-hosted frontend objects first:

```bash
aws s3 rm s3://YOUR_WEBSITE_BUCKET --recursive
sam delete --stack-name inventory-mini --region ap-south-1
```

CloudFormation may fail to delete a nonempty S3 bucket; empty it first. Confirm deletion of all resources and inspect Billing afterward. CloudFront distributions may take time to disable and delete.

## Security and scope notes
- Cognito verifies identity, but this educational build does not separate admin and staff permissions.
- The frontend never contains AWS access keys.
- S3 objects are private, served through CloudFront OAC.
- HTTP API uses JWT authorization for all Lambda routes.
- Do not expose Cognito user passwords or AWS credentials in your report.
- For production: add SKU uniqueness, input limits at API Gateway, role-based authorization, pagination, rate limiting, idempotent retries, monitoring and alarms, backups, and integration tests.
