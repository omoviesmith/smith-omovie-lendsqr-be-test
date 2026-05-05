# Project Plan: Lendsqr Backend Engineer Assessment

**Project:** Demo Credit Wallet API
**Goal:** Build a production-minded backend API for a lending wallet system using **Node.js LTS, TypeScript, KnexJS, and MySQL**, while satisfying every assessment criterion with strong code quality, documentation, tests, commit history, and deployment.

---

## 1. Project Objective

The objective is to build a backend API for **Demo Credit**, a mobile lending application. The API should allow users to create an account, authenticate, own a wallet, fund the wallet, transfer funds to another user, withdraw funds, and prevent blacklisted users from being onboarded using the **Lendsqr Adjutor Karma blacklist API**.

Although the assessment allows faux token authentication, this project will implement a lightweight **JWT-based authentication system** as a production-minded improvement while keeping the implementation simple and aligned with the acceptance criteria.

The final submission must include a working deployed API, GitHub repository, strong README documentation with an ER diagram, unit tests, API documentation, clear commit history, and a short Loom demo.

---

# Stage 1: Requirements Review and Acceptance Criteria Checklist

## Objective

Before writing any code, convert the assessment instructions into a checklist. This protects against missing small details, which Lendsqr has clearly emphasized.

## Tasks

Create a file named:

```text
ASSESSMENT_CHECKLIST.md
```

Inside it, track every required item:

```text
Core Requirements
[ ] Node.js LTS used
[ ] TypeScript used
[ ] KnexJS used
[ ] MySQL used
[ ] User account creation implemented
[ ] Wallet funding implemented
[ ] Wallet transfer implemented
[ ] Wallet withdrawal implemented
[ ] Adjutor Karma blacklist check implemented
[ ] Authentication implemented
[ ] Unit tests written
[ ] Positive test cases included
[ ] Negative test cases included

Assessment Quality Areas
[ ] Code follows DRY principles
[ ] WET/repetitive logic avoided
[ ] Clean folder structure used
[ ] Clear variable and function naming used
[ ] Semantic API paths used
[ ] OOP/service-layer concepts used
[ ] Proper database design used
[ ] Proper transaction scoping used
[ ] README includes ER diagram
[ ] README includes setup instructions
[ ] README includes API documentation
[ ] GitHub commits are clean and meaningful
[ ] API deployed successfully
[ ] Loom video recorded
[ ] Submission form completed
[ ] Email sent after submission
```

## Success Criteria

You should not proceed until you can clearly explain:

```text
What the API does
What the required stack is
What the exact deliverables are
How each assessment criterion will be satisfied
```

---

# Stage 2: Project Setup and Git Discipline

## Objective

Set up the project in a clean, professional way from the beginning. Since commit history is assessed, avoid dumping everything into one final commit.

## Recommended Repository Name

```text
smith-lendsqr-be-test
```

## Initial Setup

Create a Node.js TypeScript backend project.

Recommended dependencies:

```text
express
typescript
tsx
knex
mysql2
dotenv
jsonwebtoken
bcryptjs or argon2
zod
helmet
cors
morgan or pino
swagger-ui-express
jest
supertest
ts-jest
eslint
prettier
```

## Suggested Folder Structure

```text
src/
  app.ts
  server.ts

  config/
    env.ts
    database.ts
    swagger.ts

  database/
    migrations/
    seeds/

  modules/
    auth/
      auth.controller.ts
      auth.service.ts
      auth.routes.ts
      auth.validation.ts
      auth.types.ts

    users/
      user.repository.ts
      user.service.ts
      user.types.ts

    wallets/
      wallet.controller.ts
      wallet.service.ts
      wallet.repository.ts
      wallet.routes.ts
      wallet.validation.ts
      wallet.types.ts

    transactions/
      transaction.repository.ts
      transaction.service.ts
      transaction.types.ts

    adjutor/
      adjutor.service.ts
      adjutor.types.ts

  shared/
    errors/
      AppError.ts
      error.middleware.ts

    middlewares/
      auth.middleware.ts
      validate.middleware.ts

    utils/
      encryption.ts
      money.ts
      response.ts
      reference.ts

tests/
  auth.test.ts
  wallet.test.ts
  transfer.test.ts
  withdrawal.test.ts
```

## Recommended Commit Plan

Use small meaningful commits:

```text
chore: initialize TypeScript Express project
chore: configure Knex and MySQL connection
feat: add user and wallet database migrations
feat: implement JWT authentication
feat: integrate Adjutor Karma blacklist check
feat: implement wallet funding
feat: implement wallet transfer with transaction scope
feat: implement wallet withdrawal
test: add auth and onboarding test cases
test: add wallet transaction test cases
docs: add README with ER diagram and API guide
chore: prepare Render deployment
```

## Success Criteria

By the end of this stage, the project should run locally with:

```bash
npm run dev
npm run build
npm test
```

---

# Stage 3: Database Design and ER Diagram

## Objective

Design the database like a fintech wallet system, not a basic CRUD app. Lendsqr will assess your database design approach and transaction scoping, so this stage is critical.

## Core Tables

Use these main tables:

```text
users
wallets
transactions
```

Optional but useful:

```text
revoked_tokens
```

Only add optional tables if they do not distract from the main assessment.

## Suggested Database Design

### `users`

```text
id
first_name
last_name
email
phone
password_hash
identity_hash
encrypted_identity
created_at
updated_at
```

### `wallets`

```text
id
user_id
balance
currency
created_at
updated_at
```

### `transactions`

```text
id
reference
wallet_id
source_wallet_id
destination_wallet_id
type
amount
balance_before
balance_after
status
narration
metadata
created_at
updated_at
```

## Important Design Decisions

Use `DECIMAL(19, 4)` for money values.

Do not use JavaScript floating-point calculations carelessly for financial amounts. In the README, explain that the system uses decimal-safe storage for money.

Recommended transaction types:

```text
FUNDING
WITHDRAWAL
TRANSFER_DEBIT
TRANSFER_CREDIT
```

Recommended transaction statuses:

```text
PENDING
SUCCESSFUL
FAILED
```

## ER Diagram

Use dbdesigner.net to create the ER diagram. Include the diagram image directly inside the README.

The relationship should be:

```text
users 1 ─── 1 wallets
wallets 1 ─── many transactions
wallets 1 ─── many source transactions
wallets 1 ─── many destination transactions
```

## Success Criteria

This stage is complete when:

```text
[ ] Knex migrations exist
[ ] Database tables are normalized
[ ] Wallet belongs to a user
[ ] Transactions are linked to wallets
[ ] Money fields use DECIMAL
[ ] ER diagram is exported
[ ] ER diagram is added to README
```

---

# Stage 4: Authentication and Onboarding

## Objective

Implement account creation and authentication without making authentication bigger than the wallet assessment.

## Endpoints

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

## Registration Flow

When a user registers:

```text
1. Validate request body
2. Check if email already exists
3. Check if phone already exists
4. Call Adjutor Karma blacklist API
5. If user is blacklisted, reject onboarding
6. Hash password
7. Encrypt sensitive identity field if used
8. Create user
9. Create wallet
10. Return user profile and JWT
```

## Login Flow

```text
1. Validate email and password
2. Find user by email
3. Compare password with password_hash
4. Generate JWT
5. Return token and user summary
```

## Security Rules

```text
Never return password_hash
Never log passwords
Never log JWT secrets
Never commit .env
Keep JWT payload minimal
Use environment variables for secrets
```

## README Explanation

Explain it this way:

```text
The assessment permits faux token authentication. I implemented lightweight JWT authentication as a production-minded extension. The authentication layer is intentionally simple and only exists to identify the user performing wallet operations.
```

## Success Criteria

```text
[ ] User can register
[ ] Blacklisted user cannot register
[ ] Duplicate email is rejected
[ ] Password is hashed
[ ] JWT is returned after login
[ ] Protected routes require JWT
```

---

# Stage 5: Wallet Operations

## Objective

Build the core wallet features with correct validation, semantic API paths, and safe transaction handling.

## Endpoints

```text
GET  /api/v1/wallets/me
POST /api/v1/wallets/fund
POST /api/v1/wallets/transfer
POST /api/v1/wallets/withdraw
GET  /api/v1/transactions
```

## Funding Flow

```text
1. Authenticate user
2. Validate amount
3. Start database transaction
4. Fetch user wallet
5. Increase balance
6. Create transaction record
7. Commit transaction
8. Return updated wallet and transaction reference
```

## Withdrawal Flow

```text
1. Authenticate user
2. Validate amount
3. Start database transaction
4. Fetch wallet
5. Confirm sufficient balance
6. Decrease balance
7. Create withdrawal transaction record
8. Commit transaction
9. Return updated wallet and transaction reference
```

## Transfer Flow

```text
1. Authenticate sender
2. Validate recipient and amount
3. Prevent transfer to self
4. Start database transaction
5. Fetch sender wallet
6. Fetch recipient wallet
7. Confirm sender has sufficient balance
8. Debit sender wallet
9. Credit recipient wallet
10. Create debit transaction for sender
11. Create credit transaction for recipient
12. Commit transaction
13. Return transfer reference
```

## Transaction Scoping Requirement

All balance-changing operations must use Knex transactions:

```text
fund wallet
withdraw wallet
transfer wallet
```

The most important one is transfer, because two wallets are updated. If any part fails, the whole operation must roll back.

## Success Criteria

```text
[ ] Funding works
[ ] Withdrawal works
[ ] Transfer works
[ ] Invalid amount is rejected
[ ] Insufficient balance is rejected
[ ] Self-transfer is rejected
[ ] Missing recipient is rejected
[ ] Failed operations do not corrupt wallet balance
[ ] Every successful wallet operation creates transaction records
```

---

# Stage 6: Code Quality, DRY Design, and OOP Concepts

## Objective

Make the code easy to read, review, test, and extend.

## Design Pattern

Use a simple layered architecture:

```text
Route → Controller → Service → Repository → Database
```

## Responsibilities

| Layer      | Responsibility                   |
| ---------- | -------------------------------- |
| Route      | Defines endpoint paths           |
| Controller | Handles request and response     |
| Service    | Contains business logic          |
| Repository | Handles database queries         |
| Middleware | Handles auth, validation, errors |
| Utils      | Shared helpers                   |

## DRY Principles

Avoid repeating:

```text
response formatting
amount validation
auth checks
try/catch blocks
transaction reference generation
database query logic
```

Use reusable helpers like:

```text
validateAmount()
generateTransactionReference()
sendSuccessResponse()
sendErrorResponse()
encryptValue()
hashPassword()
comparePassword()
```

## Naming Conventions

Use clear names:

```text
createUser()
loginUser()
fundWallet()
withdrawFromWallet()
transferFunds()
getWalletByUserId()
createTransaction()
checkKarmaBlacklist()
```

Avoid vague names:

```text
doStuff()
handleData()
processUser()
walletFunc()
trxThing()
```

## OOP Concept Usage

You do not need heavy OOP. Use classes where they improve organization:

```text
AuthService
WalletService
UserRepository
WalletRepository
TransactionRepository
AdjutorService
AppError
```

This demonstrates encapsulation and separation of responsibility without overengineering.

## Success Criteria

```text
[ ] Controllers are thin
[ ] Business logic lives in services
[ ] Database logic lives in repositories
[ ] Reusable helpers are extracted
[ ] Function names are meaningful
[ ] Files are organized consistently
[ ] No unnecessary repetition
```

---

# Stage 7: Unit and API Testing

## Objective

Prove the API works in both successful and failure scenarios.

## Test Tools

Use:

```text
Jest
Supertest
Test database
Knex migrations
```

## Positive Test Scenarios

```text
Register user successfully
Login user successfully
Get authenticated wallet
Fund wallet successfully
Withdraw successfully
Transfer successfully
List transactions successfully
```

## Negative Test Scenarios

```text
Reject duplicate email
Reject blacklisted user
Reject login with wrong password
Reject unauthenticated wallet access
Reject invalid funding amount
Reject withdrawal with insufficient balance
Reject transfer to self
Reject transfer to missing recipient
Reject transfer with insufficient balance
Ensure failed transfer does not change balances
```

## Test-First Policy

For each feature:

```text
1. Write the failing test
2. Implement the feature
3. Run the test
4. Refactor the code
5. Commit the change
```

## Success Criteria

```text
[ ] Tests cover all core flows
[ ] Tests include positive scenarios
[ ] Tests include negative scenarios
[ ] Tests can run locally with npm test
[ ] Test setup is documented in README
```

---

# Stage 8: API Documentation and README

## Objective

Make the project easy for Lendsqr reviewers to understand, run, and test.

## README Structure

Use this structure:

```text
# Lendsqr Backend Engineer Assessment

## Overview
## Business Context
## Features Implemented
## Tech Stack
## Architecture
## Folder Structure
## Database Design
## ER Diagram
## Authentication Approach
## Adjutor Karma Integration
## Wallet Transaction Scoping
## API Endpoints
## Environment Variables
## Local Setup
## Running Migrations
## Running Tests
## Deployment
## Assumptions
## Future Improvements
```

## API Documentation

Add Swagger at:

```text
GET /api/v1/docs
```

Also include sample requests in README.

Example:

```text
POST /api/v1/wallets/transfer
Authorization: Bearer <token>

{
  "recipientEmail": "user@example.com",
  "amount": 5000,
  "narration": "Wallet transfer"
}
```

## Assumptions Section

Include assumptions like:

```text
The wallet currently supports NGN by default.
JWT authentication was implemented as an upgrade over the permitted faux token authentication.
Adjutor Karma failure blocks onboarding for safety.
Funding is simulated because no real payment gateway is required.
Withdrawal is simulated because no bank payout integration is required.
```

## Success Criteria

```text
[ ] README is complete
[ ] ER diagram is included
[ ] Setup instructions are clear
[ ] API endpoints are documented
[ ] Test instructions are documented
[ ] Deployment URL is included
[ ] Assumptions are clearly stated
```

---

# Stage 9: Deployment on Render

## Objective

Deploy the API and make sure it works publicly.

## Deployment Plan

Use:

```text
Render for API hosting
Cloud MySQL provider for database
Render environment variables for secrets
```

Do not switch from MySQL to PostgreSQL. The assessment requires MySQL.

## Recommended Render Service Name

```text
smith-lendsqr-be-test
```

Expected URL format:

```text
https://smith-lendsqr-be-test.onrender.com
```

## Render Commands

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm start
```

Your server should use:

```text
process.env.PORT
```

## Environment Variables

```text
NODE_ENV
PORT
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
JWT_SECRET
JWT_EXPIRES_IN
ADJUTOR_API_KEY
ADJUTOR_BASE_URL
ENCRYPTION_KEY
```

## Success Criteria

```text
[ ] API is live
[ ] Health endpoint works
[ ] Swagger docs work
[ ] Auth endpoints work
[ ] Wallet endpoints work
[ ] Render environment variables are configured
[ ] Production database is migrated
```

---

# Stage 10: Final Review, Loom Video, and Submission

## Objective

Submit only after confirming that every acceptance criterion is satisfied.

## Final Manual Test

Use Postman or Insomnia to test:

```text
1. Register user
2. Login user
3. Fund wallet
4. Register second user
5. Transfer to second user
6. Withdraw from wallet
7. View transaction history
8. Try invalid withdrawal
9. Try transfer with insufficient balance
10. Try unauthenticated access
```

## Loom Video Structure

Keep it under 3 minutes.

```text
0:00–0:20
Introduce yourself and the project.

0:20–0:50
Mention the stack: Node.js, TypeScript, KnexJS, MySQL, JWT, Render.

0:50–1:30
Explain folder structure, database design, and ER diagram.

1:30–2:10
Show API docs and demonstrate one or two wallet endpoints.

2:10–2:40
Explain transaction scoping and tests.

2:40–3:00
Mention deployed URL, GitHub repo, and README instructions.
```

## Final Submission Checklist

```text
[ ] GitHub repo is public or accessible
[ ] README is complete
[ ] ER diagram is visible in README
[ ] API is deployed
[ ] API docs are accessible
[ ] Tests pass
[ ] Commit history is clean
[ ] Loom video is recorded
[ ] Google Form is submitted
[ ] Email is sent to careers@lendsqr.com
```

---

# Final Success Strategy

To exceptionally satisfy the acceptance criteria, focus on these priorities:

```text
1. Complete every required feature before adding extras.
2. Keep JWT simple and clearly documented.
3. Use MySQL transactions for all wallet balance changes.
4. Write strong positive and negative tests.
5. Make the README detailed enough that a reviewer can run the project easily.
6. Use clear semantic routes and clean naming.
7. Commit progressively with meaningful messages.
8. Do not build a frontend.
9. Do not switch from KnexJS or MySQL.
10. Submit exactly according to their instructions.
```

Your strongest positioning should be:

> I built the wallet API as a production-minded fintech backend while staying within the assessment scope. The API uses TypeScript, KnexJS, MySQL, JWT authentication, secure password handling, Adjutor Karma blacklist validation, database transaction scoping for money movement, unit tests for positive and negative scenarios, and clear documentation with an ER diagram.



