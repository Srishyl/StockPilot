# LAB MINI-PROJECT REPORT

**Title:** Serverless Cloud-Based Inventory Management System  
**Subject:** Cloud Computing Laboratory  
**Team:** Member 1: __________ | Member 2: __________  
**Institution:** __________  
**Academic Year:** __________

## 1. Abstract
Small stationery shops often track inventory manually, making it difficult to maintain accurate stock counts and record sales. This project designs a web-based inventory system using serverless AWS cloud services. A static web frontend is delivered through Amazon CloudFront and S3, while API Gateway forwards authenticated requests to Python-based AWS Lambda. Amazon DynamoDB stores products and transactions. Amazon Cognito provides user authentication. The system supports product creation and editing, sales, restocking, low-stock warnings, transaction history, revenue summaries, and CSV export. Atomic DynamoDB transactions prevent overselling and duplicate transaction records. This project demonstrates cloud storage, serverless computation, authentication, managed databases, and scalable web deployment.

## 2. Problem Definition
Manual stock registers and spreadsheets are vulnerable to missed entries, calculation mistakes, and delayed detection of shortages. Shop owners need an accessible, centralized way to record inventory and sales without maintaining a physical server.

## 3. Objectives
1. Develop a simple web interface to manage stationery inventory.
2. Store products and transactions securely in a cloud database.
3. Automate stock changes, detect low stock, and prevent negative quantities.
4. Deploy a functional cloud-hosted application and validate its behavior through tests.

## 4. Methodology
The project follows a modular serverless architecture. The frontend is written in HTML, CSS, and JavaScript with Vite. Cognito authenticates staff. Authenticated browser requests go to an API Gateway HTTP API, which invokes Python Lambda functions. Lambda reads and writes DynamoDB records. Stock movement uses atomic database transactions. S3 stores compiled frontend assets; CloudFront serves them over HTTPS. Functional and unit tests verify critical workflows.

### Data flow
`User browser -> CloudFront/S3 -> Cognito login -> API Gateway (JWT) -> Lambda -> DynamoDB`

### Main algorithms
- **Product addition:** Validate fields; generate UUID; store product.
- **Sale:** Validate quantity and transaction ID; atomically decrement stock if enough units exist and insert a new unique transaction record.
- **Restock:** Atomically increase quantity and insert a new unique transaction record.
- **Low-stock detection:** Mark products where `quantity <= lowStockThreshold`.
- **Revenue:** Sum `sale quantity × recorded unit price` across sales transactions.

## 5. Cloud Services Used
| AWS service | Purpose |
|---|---|
| Amazon S3 | Private static frontend asset storage |
| Amazon CloudFront | HTTPS content delivery |
| Amazon Cognito | Email/password authentication |
| Amazon API Gateway | Protected HTTP API endpoints |
| AWS Lambda | Serverless Python business logic |
| Amazon DynamoDB | NoSQL product and transaction storage |
| AWS CloudFormation / SAM | Infrastructure deployment |
| Amazon CloudWatch | Lambda execution logs |

## 6. Implementation
The source repository includes the SAM infrastructure template, Lambda backend, Vite frontend, environment variable example, deployment script, and tests. AWS SAM creates the required resources. The frontend is configured with stack output values, built using Vite, and uploaded to the private S3 bucket. CloudFront distributes the website. A Cognito demo account is provisioned for evaluation.

### Data model
**Products:** `productId` (partition key), `name`, `sku`, `priceCents`, `quantity`, `lowStockThreshold`.

**Transactions:** `transactionId` (partition key), `productId`, `quantity`, `type`, `unitPriceCents`, `createdAt`.

## 7. Testing
| Test case | Expected result | Actual result |
|---|---|---|
| Valid sign-in | Dashboard loads | To be recorded |
| Add product | New product stored | To be recorded |
| Sell available stock | Quantity decreases | To be recorded |
| Sell more than stock | HTTP 409; no stock change | To be recorded |
| Duplicate transaction ID | HTTP 409; no duplicate sale | To be recorded |
| Restock | Quantity increases | To be recorded |
| Low-stock threshold | Warning displayed | To be recorded |
| CSV export | CSV file downloaded | To be recorded |
| Unauthenticated API request | HTTP 401 | To be recorded |

Unit tests cover input validation, product creation, health route, and the atomic transaction request structure. Cloud deployment and end-to-end outcomes must be recorded after performing tests in your own AWS account.

## 8. Results
**Expected demonstration results:** A functioning website displays current inventory, allows authorized users to add and update products, records stock changes, highlights low-stock items, shows revenue, and exports inventory data. The transaction mechanism rejects invalid sales and duplicate transaction IDs.

**Evidence to insert after deployment:**
1. Screenshot: Login page.
2. Screenshot: Inventory dashboard.
3. Screenshot: DynamoDB Products and Transactions tables.
4. Screenshot: API Gateway and Lambda configuration.
5. Screenshot: Low-stock warning and CSV file.
6. Screenshot: Test execution output.

*Do not claim these as observed results until your deployment and tests have succeeded.*

## 9. Conclusion
The project illustrates how a small inventory application can be implemented using managed cloud services without operating a dedicated backend server. AWS Lambda and DynamoDB support inventory workflows, while Cognito and API Gateway protect the API. S3 and CloudFront provide a hosted web interface. The application demonstrates core cloud computing concepts and can be extended with barcode scanning, supplier management, granular roles, notifications, and analytics.

## 10. Future Enhancements
Add barcode scanning, image uploads, supplier details, email alerts, pagination, SKU uniqueness, staff roles, audit logs, and more comprehensive automated integration testing.

## 11. References
- AWS Lambda Developer Guide: https://docs.aws.amazon.com/lambda/
- Amazon DynamoDB Developer Guide: https://docs.aws.amazon.com/amazondynamodb/
- Amazon API Gateway Documentation: https://docs.aws.amazon.com/apigateway/
- Amazon Cognito Documentation: https://docs.aws.amazon.com/cognito/
- AWS SAM Documentation: https://docs.aws.amazon.com/serverless-application-model/
