# **Hemera-Based Journal App — Development Blueprint & Implementation Prompts**

## **Executive Summary**

This document provides a complete blueprint for building the Hemera-inspired journal application. The project is broken down into 8 major phases, each containing multiple small, testable steps. Each step includes a code-generation prompt designed for test-driven development with real data and API calls.

---

## **Architecture Overview**

┌─────────────────────────────────────────────────────────────────┐

│                         CLIENTS                                  │

│  ┌──────────────────┐        ┌──────────────────────────┐       │

│  │   Web (Astro \+   │        │   Mobile (React Native   │       │

│  │     React)       │        │       \+ Expo)            │       │

│  └────────┬─────────┘        └───────────┬──────────────┘       │

└───────────┼──────────────────────────────┼──────────────────────┘

            │                              │

            ▼                              ▼

┌─────────────────────────────────────────────────────────────────┐

│                      NODE.JS API                                 │

│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐│

│  │   Sync      │ │  Business   │ │Notifications│ │   Admin    ││

│  │  Endpoints  │ │   Rules     │ │Orchestration│ │ Operations ││

│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘│

└────────────────────────────┬────────────────────────────────────┘

                             │

                             ▼

┌─────────────────────────────────────────────────────────────────┐

│                      SUPABASE                                    │

│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │

│  │  PostgreSQL │ │    Auth     │ │     RLS     │               │

│  │  (Database) │ │  (Identity) │ │  (Security) │               │

│  └─────────────┘ └─────────────┘ └─────────────┘               │

└─────────────────────────────────────────────────────────────────┘

---

## **Phase Breakdown**

| Phase | Focus | Steps | Estimated Complexity |
| ----- | ----- | ----- | ----- |
| 1 | Foundation & Database | 6 | Low |
| 2 | Authentication & User Management | 5 | Low-Medium |
| 3 | Document System Core | 7 | Medium |
| 4 | Period Planning System | 5 | Medium |
| 5 | Daily System & Pomodoro | 6 | Medium-High |
| 6 | Sync & Offline | 5 | High |
| 7 | Accountability System | 4 | Medium |
| 8 | Notifications & Analytics | 5 | Medium-High |

---

## **Phase 1: Foundation & Database Setup**

### **Step 1.1: Project Initialization & Tooling**

**Goal:** Initialize the monorepo structure with TypeScript configuration, testing framework, and basic tooling.

You are building a Hemera-inspired journal application. Start by initializing the project foundation.

\*\*Task:\*\* Create a monorepo structure for the Hemera Journal App using pnpm workspaces.

\*\*Requirements:\*\*

1\. Create a root package.json with pnpm workspaces configuration

2\. Create the following workspace packages:

   \- \`packages/api\` \- Node.js API server

   \- \`packages/shared\` \- Shared types and utilities

   \- \`packages/web\` \- Astro \+ React web client (placeholder for now)

3\. Configure TypeScript with strict mode in a root tsconfig.json with project references

4\. Set up Vitest for testing with a configuration that supports TypeScript

5\. Add ESLint and Prettier with consistent configuration

6\. Create a .env.example file with placeholder environment variables:

   \- SUPABASE\_URL

   \- SUPABASE\_ANON\_KEY

   \- SUPABASE\_SERVICE\_ROLE\_KEY

   \- DATABASE\_URL

   \- NODE\_ENV

\*\*File structure to create:\*\*

hemera-journal/ ├── package.json ├── pnpm-workspace.yaml ├── tsconfig.json ├── .env.example ├── .eslintrc.js ├── .prettierrc ├── vitest.config.ts ├── packages/ │ ├── api/ │ │ ├── package.json │ │ ├── tsconfig.json │ │ └── src/ │ │ └── index.ts (placeholder export) │ ├── shared/ │ │ ├── package.json │ │ ├── tsconfig.json │ │ └── src/ │ │ └── index.ts (placeholder export) │ └── web/ │ ├── package.json │ └── tsconfig.json

\*\*Test to verify:\*\*

\- Run \`pnpm install\` successfully

\- Run \`pnpm \-r build\` without errors

\- Run \`pnpm test\` with Vitest (should pass with no tests yet)

Do not use mock data. Create real configuration files that will work in production.

---

### **Step 1.2: Shared Types & Constants**

**Goal:** Define all TypeScript types and constants that will be shared across the application.

Continue building the Hemera Journal App. Now define the shared types and constants.

\*\*Context:\*\* You have a monorepo with packages/shared already created.

\*\*Task:\*\* Create comprehensive TypeScript types for the entire application in packages/shared.

\*\*Requirements:\*\*

1\. Create \`packages/shared/src/types/user.ts\`:

   \- UserSettings type with notification preferences, timezone

   \- SubscriptionStatus enum: 'free' | 'pro' | 'trial' | 'canceled'

2\. Create \`packages/shared/src/types/documents.ts\`:

   \- DocType enum: 'day' | 'week' | 'month' | 'quarter'

   \- DocStatus enum for days: 'open' | 'closed' | 'auto\_closed'

   \- Base Document interface with: id, userId, docType, docKey, schemaVersion, status, content, clientUpdatedAt, serverReceivedAt, deviceId

   \- DayContent interface matching spec:

     \- dayStart: { slept8Hours, water3Glasses, meditation5Min, mobility5Min, gratefulFor, intentionForDay }

     \- planning: { oneThing: { title, description, pomodorosPlanned, pomodorosDone }, topThree: array of 3 items, otherTasks: optional array }

     \- lifePillars: { training, deepRelaxation, healthyNutrition, realConnection }

     \- dayClose: { noScreens2Hours, noCarbs3Hours, tomorrowPlanned, goalsReviewed, reflection: { wentWell, whyWentWell, repeatInFuture, wentWrong, whyWentWrong, doDifferently } }

   \- WeekStartContent, MonthStartContent, QuarterStartContent (Start Strong) interfaces

3\. Create \`packages/shared/src/types/accountability.ts\`:

   \- AccountabilityPair interface

   \- DailyCheckin interface

   \- DailyStatusSummary interface (what partner can see)

4\. Create \`packages/shared/src/types/api.ts\`:

   \- ApiResponse\<T\> generic type with success, data, error fields

   \- ApiError type with code, message, details

   \- ErrorCode enum matching spec: UNAUTHORIZED, FORBIDDEN, VALIDATION\_ERROR, DOC\_LOCKED, DOC\_NOT\_YET\_AVAILABLE, CLOCK\_SKEW\_REJECTED, SYNC\_CONFLICT\_RESOLVED\_LWW, RATE\_LIMITED, INTERNAL\_ERROR

5\. Create \`packages/shared/src/constants.ts\`:

   \- POMODORO\_DURATION\_MINUTES \= 25

   \- BREAK\_DURATION\_MINUTES \= 5

   \- MAX\_POMODOROS\_PER\_TASK \= 6

   \- DAY\_AVAILABLE\_HOURS\_BEFORE \= 24

   \- DAY\_LOCK\_HOURS\_AFTER \= 48

   \- CLOCK\_SKEW\_MAX\_MINUTES \= 10

   \- CHECKIN\_MAX\_LENGTH \= 500

6\. Export everything from \`packages/shared/src/index.ts\`

\*\*Test file to create:\*\* \`packages/shared/src/\_\_tests\_\_/types.test.ts\`

\- Test that all types compile correctly by creating valid objects

\- Test that invalid objects fail TypeScript compilation (use ts-expect-error comments)

Run \`pnpm test\` in packages/shared to verify types work correctly.

---

### **Step 1.3: Database Schema Design**

**Goal:** Create the complete PostgreSQL schema with proper constraints and indexes.

Continue building the Hemera Journal App. Now create the database schema.

\*\*Context:\*\* You have shared types defined. Now create the PostgreSQL schema.

\*\*Task:\*\* Create SQL migration files for the complete database schema.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/db/migrations/001\_initial\_schema.sql\`:

   \*\*users table\*\* (managed by Supabase Auth, but we extend it):

   \- References auth.users(id)

   

   \*\*user\_settings table:\*\*

   \- user\_id (UUID, PK, FK to auth.users)

   \- day\_start\_reminder\_time (TIME)

   \- day\_close\_reminder\_time (TIME)

   \- push\_enabled (BOOLEAN DEFAULT true)

   \- email\_for\_escalations\_enabled (BOOLEAN DEFAULT true)

   \- timezone (TEXT DEFAULT 'UTC')

   \- subscription\_status (TEXT DEFAULT 'free')

   \- created\_at, updated\_at timestamps

   \*\*journal\_documents table:\*\*

   \- id (UUID, PK, DEFAULT gen\_random\_uuid())

   \- user\_id (UUID, FK, NOT NULL)

   \- doc\_type (TEXT, NOT NULL, CHECK in ('day', 'week', 'month', 'quarter'))

   \- doc\_key (TEXT, NOT NULL) \-- YYYY-MM-DD for days

   \- schema\_version (INTEGER DEFAULT 1\)

   \- status (TEXT DEFAULT 'open', CHECK in ('open', 'closed', 'auto\_closed', 'active', 'archived'))

   \- content (JSONB NOT NULL DEFAULT '{}')

   \- client\_updated\_at (TIMESTAMPTZ NOT NULL)

   \- server\_received\_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

   \- device\_id (TEXT)

   \- UNIQUE(user\_id, doc\_type, doc\_key)

   \*\*accountability\_pairs table:\*\*

   \- id (UUID, PK)

   \- user\_a\_id (UUID, FK)

   \- user\_b\_id (UUID, FK)

   \- created\_at (TIMESTAMPTZ)

   \- UNIQUE constraint ensuring unordered pair uniqueness

   \- CHECK constraint: user\_a\_id \< user\_b\_id (canonical ordering)

   \*\*accountability\_daily\_checkins table:\*\*

   \- id (UUID, PK)

   \- pair\_id (UUID, FK)

   \- author\_user\_id (UUID, FK)

   \- target\_date (DATE)

   \- message (TEXT, max 500 chars via CHECK)

   \- created\_at (TIMESTAMPTZ)

   \- UNIQUE(author\_user\_id, target\_date)

   \*\*daily\_status\_summary table\*\* (computed view for partner access):

   \- user\_id (UUID, FK)

   \- date (DATE)

   \- day\_closed (BOOLEAN)

   \- one\_thing\_done (BOOLEAN)

   \- reflection\_present (BOOLEAN)

   \- updated\_at (TIMESTAMPTZ)

   \- PRIMARY KEY(user\_id, date)

   \*\*notification\_log table:\*\*

   \- id (UUID, PK)

   \- user\_id (UUID, FK)

   \- type (TEXT) \-- day\_start, day\_close, pomodoro\_start, pomodoro\_break, partner\_closed, missed\_2\_days\_email, missed\_2\_days\_push

   \- target\_date (DATE)

   \- sent\_at (TIMESTAMPTZ)

   \- provider\_message\_id (TEXT)

   \- status (TEXT) \-- sent, failed

   \*\*admin\_user\_actions table:\*\*

   \- id (UUID, PK)

   \- admin\_id (UUID)

   \- action\_type (TEXT) \-- create, block, delete

   \- target\_user\_id (UUID)

   \- created\_at (TIMESTAMPTZ)

   \- metadata (JSONB)

2\. Create \`packages/api/src/db/migrations/002\_indexes.sql\`:

   \- Index on journal\_documents(user\_id, doc\_type)

   \- Index on journal\_documents(server\_received\_at) for sync queries

   \- Index on accountability\_pairs for both user columns

   \- Index on daily\_status\_summary(user\_id, date)

3\. Create \`packages/api/src/db/migrations/003\_rls\_policies.sql\`:

   \- Enable RLS on all tables

   \- journal\_documents: users can only CRUD their own documents

   \- user\_settings: users can only CRUD their own settings

   \- daily\_status\_summary: users can read their partner's summaries (requires join to accountability\_pairs)

   \- accountability\_daily\_checkins: users can create checkins for their partner, read checkins from their partner

\*\*Test:\*\* Create a test file that validates the SQL syntax by running it against a test database.

Create \`packages/api/src/db/\_\_tests\_\_/schema.test.ts\` that:

\- Connects to a test Supabase instance (use env vars)

\- Runs all migrations

\- Verifies tables exist with correct columns

\- Verifies RLS policies are enabled

Use real Supabase connection, not mocks.

---

### **Step 1.4: Database Connection & Client Setup**

**Goal:** Set up the database client with proper connection handling.

Continue building the Hemera Journal App. Now set up database connectivity.

\*\*Context:\*\* You have migrations created. Now create the database client layer.

\*\*Task:\*\* Create the database client and connection utilities.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/db/client.ts\`:

   \- Export a Supabase client for general operations (anon key)

   \- Export a Supabase admin client for service role operations

   \- Handle connection pooling properly

   \- Add connection health check function

2\. Create \`packages/api/src/db/migrate.ts\`:

   \- Script to run migrations in order

   \- Track which migrations have been applied

   \- Support rollback (bonus)

3\. Create \`packages/api/src/db/seed.ts\`:

   \- Create test data seeder for development

   \- Should create:

     \- 2 test users

     \- Sample quarter start (Start Strong) document

     \- Sample month and week documents

     \- Several day documents in various states (open, closed, auto\_closed)

     \- An accountability pair between the 2 users

     \- Sample checkins

4\. Create \`packages/api/src/config/index.ts\`:

   \- Centralized configuration loading from environment

   \- Validation that required env vars are present

   \- Type-safe config object

\*\*Test file:\*\* \`packages/api/src/db/\_\_tests\_\_/client.test.ts\`

\- Test that clients can connect to Supabase

\- Test health check function returns true when connected

\- Test that anon client cannot access other users' data (RLS working)

\- Test that service role client can access all data

Use real Supabase credentials from environment variables. Create a .env.test file with test database credentials.

---

### **Step 1.5: Error Handling Infrastructure**

**Goal:** Create consistent error handling that matches the API contract.

Continue building the Hemera Journal App. Now create error handling infrastructure.

\*\*Context:\*\* You have database connectivity. Now standardize error handling.

\*\*Task:\*\* Create the error handling system that implements the API error contract.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/errors/AppError.ts\`:

   \- Custom AppError class extending Error

   \- Properties: code (ErrorCode), message, details, httpStatus

   \- Factory methods for each error type:

     \- AppError.unauthorized(message?)

     \- AppError.forbidden(message?)

     \- AppError.validationError(message, details)

     \- AppError.docLocked(docKey)

     \- AppError.docNotYetAvailable(docKey)

     \- AppError.clockSkewRejected(clientTime, serverTime)

     \- AppError.rateLimited()

     \- AppError.internal(message?)

2\. Create \`packages/api/src/errors/errorHandler.ts\`:

   \- Express/Fastify middleware for catching and formatting errors

   \- Transform AppError to API response format:

     \`\`\`json

     {

       "success": false,

       "code": "VALIDATION\_ERROR",

       "message": "Readable message",

       "details": { "field": "reason" }

     }

     \`\`\`

   \- Log errors appropriately (don't leak internal details to client)

   \- Handle unexpected errors gracefully

3\. Create \`packages/api/src/errors/index.ts\`:

   \- Export all error utilities

\*\*Test file:\*\* \`packages/api/src/errors/\_\_tests\_\_/errors.test.ts\`

\- Test each factory method creates correct error

\- Test error handler middleware transforms errors correctly

\- Test that unexpected errors return INTERNAL\_ERROR without leaking details

\- Test that AppError.validationError includes details object

No mocks \- test the actual error classes and middleware.

---

### **Step 1.6: API Server Foundation**

**Goal:** Create the Express/Fastify server with basic middleware.

Continue building the Hemera Journal App. Now create the API server foundation.

\*\*Context:\*\* You have database client and error handling. Now create the server.

\*\*Task:\*\* Set up the Node.js API server with essential middleware.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/server.ts\`:

   \- Use Express (or Fastify if you prefer, but be consistent)

   \- Configure JSON body parsing

   \- Configure CORS for web client

   \- Add request logging middleware

   \- Add error handling middleware (from previous step)

   \- Health check endpoint: GET /health

   \- Export app for testing without starting server

2\. Create \`packages/api/src/index.ts\`:

   \- Import server and start listening

   \- Graceful shutdown handling

   \- Log startup info

3\. Create \`packages/api/src/middleware/auth.ts\`:

   \- Middleware to verify Supabase JWT from Authorization header

   \- Extract user ID and attach to request

   \- Return 401 for missing/invalid tokens

4\. Create \`packages/api/src/middleware/validateRequest.ts\`:

   \- Generic request validation middleware using Zod

   \- Validate body, params, query separately

   \- Return proper validation errors

5\. Update \`packages/api/package.json\`:

   \- Add scripts: dev, build, start, test

   \- Add dependencies: express, cors, helmet, zod, @supabase/supabase-js

\*\*Test file:\*\* \`packages/api/src/\_\_tests\_\_/server.test.ts\`

\- Test health check endpoint returns 200

\- Test unknown routes return 404

\- Test malformed JSON returns 400

\- Test missing auth returns 401 on protected routes

Use supertest for real HTTP request testing, not mocks.

---

## **Phase 2: Authentication & User Management**

### **Step 2.1: User Registration & Login**

**Goal:** Implement user authentication endpoints using Supabase Auth.

Continue building the Hemera Journal App. Now implement authentication.

\*\*Context:\*\* You have the API server foundation. Now add auth endpoints.

\*\*Task:\*\* Create authentication endpoints that wrap Supabase Auth.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/routes/auth.ts\`:

   \- POST /auth/register

     \- Body: { email, password }

     \- Validate email format, password strength (min 8 chars)

     \- Call Supabase auth.signUp

     \- Create default user\_settings row

     \- Return { success: true, data: { user, session } }

   

   \- POST /auth/login

     \- Body: { email, password }

     \- Call Supabase auth.signInWithPassword

     \- Return session tokens

   

   \- POST /auth/logout

     \- Requires auth middleware

     \- Call Supabase auth.signOut

   

   \- POST /auth/refresh

     \- Body: { refreshToken }

     \- Return new access token

2\. Create \`packages/api/src/services/userService.ts\`:

   \- createUserSettings(userId): Create default settings

   \- getUserSettings(userId): Get user's settings

   \- updateUserSettings(userId, updates): Update settings

3\. Create Zod schemas in \`packages/api/src/schemas/auth.ts\`:

   \- registerSchema

   \- loginSchema

   \- refreshSchema

\*\*Test file:\*\* \`packages/api/src/routes/\_\_tests\_\_/auth.test.ts\`

\- Test successful registration creates user and settings

\- Test registration with invalid email returns validation error

\- Test registration with weak password returns validation error

\- Test login with correct credentials returns session

\- Test login with wrong password returns unauthorized

\- Test logout invalidates session

\- Test refresh returns new token

Use real Supabase Auth \- create test users and clean them up after tests.

---

### **Step 2.2: User Settings Management**

**Goal:** Implement user settings CRUD operations.

Continue building the Hemera Journal App. Now implement user settings management.

\*\*Context:\*\* You have authentication working. Now add settings endpoints.

\*\*Task:\*\* Create endpoints for managing user settings.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/routes/settings.ts\`:

   \- GET /settings

     \- Requires auth

     \- Return current user's settings

   

   \- PATCH /settings

     \- Requires auth

     \- Body: partial UserSettings

     \- Validate:

       \- day\_start\_reminder\_time is valid HH:MM format

       \- day\_close\_reminder\_time is valid HH:MM format

       \- timezone is valid IANA timezone

     \- Return updated settings

2\. Create Zod schemas in \`packages/api/src/schemas/settings.ts\`:

   \- userSettingsUpdateSchema with all optional fields

   \- Custom refinements for time format and timezone

3\. Update \`packages/api/src/services/userService.ts\`:

   \- Add validation for timezone (use Intl.supportedValuesOf('timeZone'))

\*\*Test file:\*\* \`packages/api/src/routes/\_\_tests\_\_/settings.test.ts\`

\- Test GET returns user's settings

\- Test GET returns 401 without auth

\- Test PATCH updates only specified fields

\- Test PATCH with invalid time format returns validation error

\- Test PATCH with invalid timezone returns validation error

\- Test user A cannot access user B's settings (RLS)

Use real authenticated requests with test users.

---

### **Step 2.3: Admin User Management**

**Goal:** Implement admin-only user management endpoints.

Continue building the Hemera Journal App. Now implement admin user management.

\*\*Context:\*\* You have user settings working. Now add admin capabilities.

\*\*Task:\*\* Create admin endpoints for user lifecycle management.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/middleware/adminAuth.ts\`:

   \- Verify request has admin claim in JWT

   \- For v1, use a simple approach: check if user email matches ADMIN\_EMAILS env var list

   \- Return 403 for non-admin users

2\. Create \`packages/api/src/routes/admin.ts\`:

   \- POST /admin/users

     \- Create a new user account

     \- Body: { email, password, sendWelcomeEmail? }

     \- Log action to admin\_user\_actions table

   

   \- POST /admin/users/:id/block

     \- Block a user (prevent login)

     \- Use Supabase admin API to update user metadata

     \- Log action

   

   \- POST /admin/users/:id/unblock

     \- Unblock a user

     \- Log action

   

   \- DELETE /admin/users/:id

     \- Delete user and all their data

     \- Cascade delete: documents, settings, accountability pairs, checkins

     \- Log action

3\. Create \`packages/api/src/services/adminService.ts\`:

   \- createUser(email, password): Use service role to create

   \- blockUser(userId): Update user metadata

   \- unblockUser(userId)

   \- deleteUser(userId): Delete all user data

   \- logAdminAction(adminId, actionType, targetUserId, metadata)

4\. \*\*CRITICAL:\*\* Admin endpoints must NOT provide any way to read journal content.

\*\*Test file:\*\* \`packages/api/src/routes/\_\_tests\_\_/admin.test.ts\`

\- Test non-admin user gets 403

\- Test admin can create user

\- Test admin can block/unblock user

\- Test blocked user cannot login

\- Test delete removes all user data

\- Test admin actions are logged

\- Test there is no endpoint to read user documents

Use real admin credentials and test users. Clean up after tests.

---

### **Step 2.4: Session & Token Management**

**Goal:** Implement proper session handling and token refresh.

Continue building the Hemera Journal App. Now improve session management.

\*\*Context:\*\* You have basic auth. Now add robust session handling.

\*\*Task:\*\* Improve session and token management.

\*\*Requirements:\*\*

1\. Update \`packages/api/src/middleware/auth.ts\`:

   \- Check if token is expired before verifying

   \- Return specific error for expired tokens (client can refresh)

   \- Add rate limiting for failed auth attempts

2\. Create \`packages/api/src/services/sessionService.ts\`:

   \- validateSession(token): Check if session is valid and not revoked

   \- getUserFromSession(token): Extract and return user info

   \- trackDeviceSession(userId, deviceId, token): Track which devices are logged in

3\. Create \`packages/api/src/routes/devices.ts\`:

   \- GET /devices

     \- List user's active sessions/devices

   \- DELETE /devices/:deviceId

     \- Revoke a specific device session

4\. Add deviceId tracking:

   \- Client sends deviceId header

   \- Track which device made which changes (for sync)

\*\*Test file:\*\* \`packages/api/src/routes/\_\_tests\_\_/session.test.ts\`

\- Test expired token returns specific error code

\- Test rate limiting kicks in after N failed attempts

\- Test device listing works

\- Test device revocation works

\- Test revoked device cannot make requests

Real session management with actual tokens.

---

### **Step 2.5: Wire Up Auth Routes & Integration Test**

**Goal:** Integrate all auth functionality and verify end-to-end.

Continue building the Hemera Journal App. Now wire up all auth routes.

\*\*Context:\*\* You have all auth components. Now integrate them.

\*\*Task:\*\* Wire up auth routes and create comprehensive integration tests.

\*\*Requirements:\*\*

1\. Update \`packages/api/src/server.ts\`:

   \- Mount auth routes at /auth

   \- Mount settings routes at /settings (protected)

   \- Mount admin routes at /admin (admin protected)

   \- Mount devices routes at /devices (protected)

2\. Create \`packages/api/src/routes/index.ts\`:

   \- Central router that mounts all route modules

   \- Apply appropriate middleware to each

3\. Create comprehensive integration test:

   \`packages/api/src/\_\_tests\_\_/auth.integration.test.ts\`

   \- Test complete user lifecycle:

     1\. Admin creates user

     2\. User logs in

     3\. User updates settings

     4\. User adds another device

     5\. User lists devices

     6\. User revokes device

     7\. Admin blocks user

     8\. User cannot login

     9\. Admin unblocks user

     10\. User can login again

     11\. Admin deletes user

     12\. User cannot login

\*\*Verification:\*\*

\- All auth tests pass

\- Server starts without errors

\- Manual testing with curl/Postman works

This completes Phase 2\. Run all tests to verify.

---

## **Phase 3: Document System Core**

### **Step 3.1: Document Repository Layer**

**Goal:** Create the data access layer for journal documents.

Continue building the Hemera Journal App. Now create the document repository.

\*\*Context:\*\* You have auth complete. Now build the document system.

\*\*Task:\*\* Create the repository layer for CRUD operations on documents.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/repositories/documentRepository.ts\`:

   \- findById(id): Get document by ID

   \- findByKey(userId, docType, docKey): Get document by composite key

   \- findByUser(userId, docType?, since?): Get user's documents, optionally filtered

   \- create(document): Insert new document

   \- update(id, updates): Update existing document

   \- upsert(document): Insert or update based on composite key

2\. Create \`packages/api/src/types/repository.ts\`:

   \- Define repository interfaces

   \- Define query options (pagination, filtering)

3\. The repository should:

   \- Use the Supabase client (not service role for user operations)

   \- Pass the user's JWT for RLS enforcement

   \- Handle database errors and convert to AppError

   \- Add server\_received\_at timestamp on all writes

\*\*Test file:\*\* \`packages/api/src/repositories/\_\_tests\_\_/documentRepository.test.ts\`

\- Test create inserts document

\- Test findByKey returns correct document

\- Test findByUser returns only that user's documents

\- Test update modifies existing document

\- Test upsert creates if not exists

\- Test upsert updates if exists

\- Test user A cannot access user B's documents (RLS)

Use real database operations with test users.

---

### **Step 3.2: Document Validation Service**

**Goal:** Implement business rule validation for documents.

Continue building the Hemera Journal App. Now add document validation.

\*\*Context:\*\* You have the document repository. Now add validation.

\*\*Task:\*\* Create validation service that enforces all business rules.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/services/documentValidation.ts\`:

   

   \*\*Day Document Validation:\*\*

   \- Day Start: all booleans required, gratefulFor and intentionForDay required as strings

   \- Planning:

     \- oneThing: title and description required

     \- topThree: exactly 3 items, each with title and description required

     \- pomodorosPlanned: 0-6 integer

   \- Life Pillars: training, deepRelaxation, healthyNutrition, realConnection (booleans)

   \- Day Close: all booleans required

   \- Reflection (if manual close): all 6 fields must be non-empty strings

   

   \*\*Week Document Validation:\*\*

   \- weeklyGoals: array of goals

   \- Each goal must link to a monthlyGoal ID

   

   \*\*Month Document Validation:\*\*

   \- monthlyGoals: array of goals

   \- Each goal must link to a quarterGoal ID

   

   \*\*Quarter Document Validation (Start Strong):\*\*

   \- lifeWheel: 8 scores (1-10) for work, fun, social, giving, money, growth, health, love

   \- quarterGoals: exactly 3 goals

   \- Each goal: title, smartDefinition, whatIsDifferent, consequencesIfNot, rewardIfAchieved, progress (0-100)

2\. Create Zod schemas for each document type in \`packages/api/src/schemas/documents.ts\`

3\. Export validateDocument(docType, content) function

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/documentValidation.test.ts\`

\- Test valid day document passes

\- Test missing oneThing title fails

\- Test topThree with 2 items fails

\- Test topThree with 4 items fails

\- Test pomodorosPlanned \> 6 fails

\- Test valid quarter document passes

\- Test quarter with 2 goals fails

\- Test quarter with lifeWheel score \> 10 fails

\- Test manual close without reflection fails

Comprehensive validation testing with real schemas.

---

### **Step 3.3: Day Availability & Locking Rules**

**Goal:** Implement the time-based availability and locking logic.

Continue building the Hemera Journal App. Now add day availability rules.

\*\*Context:\*\* You have document validation. Now add time-based rules.

\*\*Task:\*\* Implement day document availability and locking logic.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/services/dayAvailability.ts\`:

   

   \*\*Core Functions:\*\*

   \- isDayAvailable(dateKey, userTimezone): 

     \- Day is available 24 hours before it begins

     \- Returns boolean

   

   \- isDayEditable(dateKey, userTimezone):

     \- Day is editable from T-24h through T+48h (where T is day end)

     \- Returns boolean

   

   \- isDayLocked(dateKey, userTimezone):

     \- Day is locked 48 hours after it ends

     \- Returns boolean

   

   \- getDayStatus(document, dateKey, userTimezone):

     \- Returns 'open' | 'closed' | 'auto\_closed' | 'pending\_auto\_close'

   

   \- shouldAutoClose(document, dateKey, userTimezone):

     \- Returns true if day should be auto-closed

2\. Create \`packages/api/src/utils/dateUtils.ts\`:

   \- Helper functions for timezone-aware date operations

   \- getDayStart(dateKey, timezone): Get start of day in user's timezone

   \- getDayEnd(dateKey, timezone): Get end of day in user's timezone

   \- formatDateKey(date): Format as YYYY-MM-DD

   \- parseDateKey(dateKey): Parse YYYY-MM-DD to Date

3\. Use constants from shared package

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/dayAvailability.test.ts\`

\- Test day 24h from now is available

\- Test day 25h from now is not available

\- Test today is editable

\- Test yesterday is editable

\- Test day 3 days ago is locked

\- Test day in future (2 days) is not available

\- Test timezone edge cases (day boundaries)

\- Test auto-close detection after 48h

Use real date calculations with various timezone scenarios.

---

### **Step 3.4: Document Service Layer**

**Goal:** Create the service layer that orchestrates document operations.

Continue building the Hemera Journal App. Now create the document service.

\*\*Context:\*\* You have repository, validation, and availability. Now orchestrate them.

\*\*Task:\*\* Create the document service that handles all document operations.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/services/documentService.ts\`:

   

   \*\*Get Document:\*\*

   \- getDocument(userId, docType, docKey):

     \- Check if day is available (for day docs)

     \- Return existing document or create new empty one

     \- Throw DOC\_NOT\_YET\_AVAILABLE if too early

   

   \*\*Save Document:\*\*

   \- saveDocument(userId, docType, docKey, content, clientUpdatedAt, deviceId):

     \- Check if document is editable (not locked)

     \- Validate content against schema

     \- Apply LWW conflict resolution

     \- Return saved document

     \- Throw DOC\_LOCKED if past edit window

     \- Throw VALIDATION\_ERROR if content invalid

   

   \*\*Close Day:\*\*

   \- closeDay(userId, dateKey, reflection):

     \- Validate reflection is complete

     \- Update document status to 'closed'

     \- Update daily\_status\_summary

   

   \*\*Auto-Close Days:\*\*

   \- autoClosePendingDays(userId):

     \- Find all open days past 48h

     \- Update status to 'auto\_closed'

     \- Update daily\_status\_summary

2\. Create \`packages/api/src/services/statusSummaryService.ts\`:

   \- updateSummary(userId, dateKey, document):

     \- Calculate day\_closed, one\_thing\_done, reflection\_present

     \- Upsert to daily\_status\_summary table

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/documentService.test.ts\`

\- Test getDocument creates new if not exists

\- Test getDocument returns existing

\- Test getDocument throws for unavailable day

\- Test saveDocument validates content

\- Test saveDocument throws for locked day

\- Test closeDay requires reflection

\- Test autoClosePendingDays closes old days

\- Test status summary is updated on close

Integration tests with real database.

---

### **Step 3.5: Last-Write-Wins Conflict Resolution**

**Goal:** Implement the LWW conflict resolution strategy.

Continue building the Hemera Journal App. Now implement LWW conflict resolution.

\*\*Context:\*\* You have basic document operations. Now add conflict handling.

\*\*Task:\*\* Implement Last-Write-Wins conflict resolution with clock skew protection.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/services/conflictResolution.ts\`:

   

   \*\*resolveConflict(existing, incoming):\*\*

   \- Compare clientUpdatedAt timestamps

   \- If incoming is newer, incoming wins

   \- If existing is newer, existing wins (reject update)

   \- If timestamps equal, use deviceId as tiebreaker (lexicographic)

   

   \*\*validateClockSkew(clientUpdatedAt, serverReceivedAt):\*\*

   \- If clientUpdatedAt \> serverReceivedAt \+ 10 minutes:

     \- Throw CLOCK\_SKEW\_REJECTED error

     \- Include both timestamps in error details

   \- Otherwise, accept the timestamp

2\. Update \`packages/api/src/services/documentService.ts\`:

   \- Integrate conflict resolution in saveDocument

   \- Return informational response when conflict resolved

   \- Include which version won in response

3\. Update error types to include conflict info

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/conflictResolution.test.ts\`

\- Test newer timestamp wins

\- Test older timestamp is rejected

\- Test equal timestamps use deviceId tiebreaker

\- Test deviceId 'aaa' beats 'bbb' (or vice versa, be consistent)

\- Test clock skew exactly at 10 minutes passes

\- Test clock skew at 11 minutes fails

\- Test clock skew error includes timestamps

Test with various timestamp scenarios.

---

### **Step 3.6: Document API Endpoints**

**Goal:** Create the REST API endpoints for documents.

Continue building the Hemera Journal App. Now create document endpoints.

\*\*Context:\*\* You have the document service. Now expose it via API.

\*\*Task:\*\* Create REST endpoints for document operations.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/routes/documents.ts\`:

   

   \*\*GET /documents/:docType/:docKey\*\*

   \- Requires auth

   \- Returns document (creates if doesn't exist and available)

   \- Response: { success: true, data: { document } }

   

   \*\*PUT /documents/:docType/:docKey\*\*

   \- Requires auth

   \- Body: { content, clientUpdatedAt, deviceId }

   \- Validates and saves document

   \- Response includes conflict resolution info if applicable

   

   \*\*POST /documents/:docType/:docKey/close\*\*

   \- Requires auth (only for day documents)

   \- Body: { reflection }

   \- Closes day with reflection

   

   \*\*GET /documents\*\*

   \- Requires auth

   \- Query params: docType?, since? (ISO timestamp)

   \- Returns list of user's documents

2\. Create Zod schemas in \`packages/api/src/schemas/documents.ts\`:

   \- Document params schema

   \- Document update schema

   \- Close day schema

   \- List query schema

3\. Wire up routes in server.ts

\*\*Test file:\*\* \`packages/api/src/routes/\_\_tests\_\_/documents.test.ts\`

\- Test GET creates new day document

\- Test GET returns existing document

\- Test GET for unavailable day returns DOC\_NOT\_YET\_AVAILABLE

\- Test PUT saves valid document

\- Test PUT rejects invalid content

\- Test PUT for locked day returns DOC\_LOCKED

\- Test PUT with clock skew returns CLOCK\_SKEW\_REJECTED

\- Test POST close requires reflection

\- Test GET list returns user's documents

\- Test user A cannot access user B's documents

End-to-end API tests with real requests.

---

### **Step 3.7: Document System Integration Test**

**Goal:** Verify the complete document system works end-to-end.

Continue building the Hemera Journal App. Now integration test the document system.

\*\*Context:\*\* You have all document components. Now verify integration.

\*\*Task:\*\* Create comprehensive integration tests for the document system.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/\_\_tests\_\_/documents.integration.test.ts\`:

   

   \*\*Test: Complete Day Lifecycle\*\*

   1\. User gets tomorrow's day document (available)

   2\. User fills in day start

   3\. User adds planning (EEN \+ DRIE)

   4\. User updates life pillars

   5\. User starts pomodoro (update pomodorosDone)

   6\. User fills in day close

   7\. User closes day with reflection

   8\. Verify document is closed

   9\. Verify status summary is updated

   

   \*\*Test: Day Locking\*\*

   1\. Create a day document dated 3 days ago

   2\. Try to update it

   3\. Verify DOC\_LOCKED error

   

   \*\*Test: Conflict Resolution\*\*

   1\. Create document from device A

   2\. Update from device B with newer timestamp

   3\. Verify device B's version won

   4\. Update from device A with older timestamp

   5\. Verify update rejected

   

   \*\*Test: Auto-Close\*\*

   1\. Create day document dated 3 days ago (status: open)

   2\. Run auto-close job

   3\. Verify status is auto\_closed

   

   \*\*Test: Quarter Start Strong\*\*

   1\. Create quarter document

   2\. Fill life wheel scores

   3\. Add 3 goals with all required fields

   4\. Verify saves successfully

2\. Update any issues found during integration testing

\*\*Verification:\*\*

\- All document tests pass

\- Manual testing confirms behavior

This completes Phase 3\. Run all tests to verify.

---

## **Phase 4: Period Planning System**

### **Step 4.1: Quarter Document (Start Strong)**

**Goal:** Implement the quarter planning system with Start Strong.

Continue building the Hemera Journal App. Now implement quarter planning.

\*\*Context:\*\* You have the document system. Now add period-specific logic.

\*\*Task:\*\* Implement the Quarter "Start Strong" document with full validation.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/services/periodService.ts\`:

   

   \*\*Quarter Operations:\*\*

   \- createQuarterStart(userId, startDate):

     \- Create new quarter document

     \- Initialize empty life wheel and goals

   

   \- updateLifeWheel(userId, quarterKey, scores):

     \- Validate all 8 dimensions present

     \- Each score 1-10

     \- Save to quarter document

   

   \- setQuarterGoals(userId, quarterKey, goals):

     \- Validate exactly 3 goals

     \- Each goal has: title, smartDefinition, whatIsDifferent, consequencesIfNot, rewardIfAchieved

     \- Initialize progress to 0

   

   \- updateGoalProgress(userId, quarterKey, goalIndex, progress):

     \- Validate progress 0-100

     \- Update specific goal's progress

2\. Update validation schemas:

   \- LifeWheelSchema with all 8 dimensions

   \- QuarterGoalSchema with all required fields

   \- QuarterContentSchema combining them

3\. Create \`packages/api/src/routes/periods.ts\`:

   \- POST /periods/quarter/start \- Create new quarter

   \- GET /periods/quarter/current \- Get current quarter

   \- PATCH /periods/quarter/:key/life-wheel \- Update life wheel

   \- PUT /periods/quarter/:key/goals \- Set quarter goals

   \- PATCH /periods/quarter/:key/goals/:index/progress \- Update goal progress

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/periodService.quarter.test.ts\`

\- Test quarter creation

\- Test life wheel requires all 8 dimensions

\- Test life wheel rejects scores outside 1-10

\- Test goals must be exactly 3

\- Test each goal requires all fields

\- Test progress update validates 0-100

\- Test cannot set 2 or 4 goals

Real database tests with quarter documents.

---

### **Step 4.2: Month Start Document**

**Goal:** Implement month start planning linked to quarter goals.

Continue building the Hemera Journal App. Now implement month planning.

\*\*Context:\*\* You have quarter planning. Now add month planning.

\*\*Task:\*\* Implement Month Start document with quarter goal linking.

\*\*Requirements:\*\*

1\. Update \`packages/api/src/services/periodService.ts\`:

   

   \*\*Month Operations:\*\*

   \- createMonthStart(userId, monthKey):

     \- Create new month document

     \- Fetch current quarter to get available goals for linking

   

   \- setMonthlyGoals(userId, monthKey, goals):

     \- Each goal must link to at least one quarter goal ID

     \- Validate linked goals exist in current quarter

     \- Initialize progress to 0

   

   \- updateMonthGoalProgress(userId, monthKey, goalIndex, progress):

     \- Validate progress 0-100

2\. Add validation:

   \- MonthlyGoalSchema: title, description, linkedQuarterGoals (array of indices), progress

   \- MonthContentSchema

3\. Add routes:

   \- POST /periods/month/start \- Create new month

   \- GET /periods/month/current \- Get current month

   \- PUT /periods/month/:key/goals \- Set monthly goals

   \- PATCH /periods/month/:key/goals/:index/progress \- Update progress

4\. Add helper function:

   \- getCurrentQuarter(userId): Find the active quarter document

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/periodService.month.test.ts\`

\- Test month creation

\- Test monthly goal must link to quarter goal

\- Test linking to non-existent quarter goal fails

\- Test progress update works

\- Test get current month returns correct document

Tests with real quarter and month documents.

---

### **Step 4.3: Week Start Document**

**Goal:** Implement week start planning linked to month goals.

Continue building the Hemera Journal App. Now implement week planning.

\*\*Context:\*\* You have month planning. Now add week planning.

\*\*Task:\*\* Implement Week Start document with month goal linking.

\*\*Requirements:\*\*

1\. Update \`packages/api/src/services/periodService.ts\`:

   

   \*\*Week Operations:\*\*

   \- createWeekStart(userId, weekKey):

     \- Create new week document

     \- Fetch current month to get available goals for linking

   

   \- setWeeklyGoals(userId, weekKey, goals):

     \- Each goal must link to at least one month goal ID

     \- Validate linked goals exist in current month

     \- Initialize progress to 0

   

   \- updateWeekGoalProgress(userId, weekKey, goalIndex, progress):

     \- Validate progress 0-100

2\. Add validation:

   \- WeeklyGoalSchema: title, description, linkedMonthGoals (array of indices), progress

   \- WeekContentSchema

3\. Add routes:

   \- POST /periods/week/start \- Create new week

   \- GET /periods/week/current \- Get current week

   \- PUT /periods/week/:key/goals \- Set weekly goals

   \- PATCH /periods/week/:key/goals/:index/progress \- Update progress

4\. Add helper functions:

   \- getCurrentMonth(userId)

   \- getWeekKey(date): Generate week key (e.g., 2024-W15)

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/periodService.week.test.ts\`

\- Test week creation

\- Test weekly goal must link to month goal

\- Test linking to non-existent month goal fails

\- Test progress update works

\- Test get current week returns correct document

Tests with full hierarchy: quarter → month → week.

---

### **Step 4.4: Period Hierarchy Validation**

**Goal:** Ensure proper linking across the period hierarchy.

Continue building the Hemera Journal App. Now validate period hierarchy.

\*\*Context:\*\* You have all period types. Now ensure proper linking.

\*\*Task:\*\* Add validation and helpers for the period hierarchy.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/services/periodHierarchy.ts\`:

   

   \*\*Hierarchy Validation:\*\*

   \- validateMonthBelongsToQuarter(monthKey, quarterKey):

     \- Check if month falls within quarter date range

   

   \- validateWeekBelongsToMonth(weekKey, monthKey):

     \- Check if week falls within month date range

   

   \- getGoalHierarchy(userId, weekGoalIndex):

     \- Trace a weekly goal up through month to quarter

     \- Return: { weekGoal, monthGoal, quarterGoal }

   

   \- getPeriodProgress(userId):

     \- Calculate aggregate progress for current quarter

     \- Based on: quarter goals, month goals, week goals

2\. Update period routes:

   \- GET /periods/hierarchy \- Get current quarter/month/week with goals

   \- GET /periods/progress \- Get aggregated progress view

3\. Add endpoint for goal navigation:

   \- GET /periods/goals/:type/:index/related

     \- Returns related goals up and down hierarchy

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/periodHierarchy.test.ts\`

\- Test month-to-quarter validation

\- Test week-to-month validation

\- Test goal hierarchy tracing

\- Test progress aggregation calculation

\- Test hierarchy endpoint returns full tree

Integration tests with complete period hierarchy.

---

### **Step 4.5: Period System Integration Test**

**Goal:** Verify the complete period system works end-to-end.

Continue building the Hemera Journal App. Now integration test periods.

\*\*Context:\*\* You have all period components. Now verify integration.

\*\*Task:\*\* Create comprehensive integration tests for the period system.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/\_\_tests\_\_/periods.integration.test.ts\`:

   

   \*\*Test: Complete Period Setup Flow\*\*

   1\. User creates quarter with Start Strong

   2\. User fills life wheel (all 8 scores)

   3\. User sets 3 quarter goals with all fields

   4\. User creates month start

   5\. User sets monthly goals linked to quarter goals

   6\. User creates week start

   7\. User sets weekly goals linked to month goals

   8\. Verify complete hierarchy exists

   

   \*\*Test: Progress Flow\*\*

   1\. Setup complete hierarchy

   2\. Update weekly goal progress to 50

   3\. Update monthly goal progress to 30

   4\. Update quarter goal progress to 20

   5\. Get hierarchy progress view

   6\. Verify all progress values returned correctly

   

   \*\*Test: Invalid Linking\*\*

   1\. Create quarter with goals

   2\. Try to create monthly goal linking to index 99

   3\. Verify validation error

   

   \*\*Test: Period Navigation\*\*

   1\. Setup hierarchy

   2\. Get related goals for a weekly goal

   3\. Verify returns linked month and quarter goals

2\. Wire up period routes to server

\*\*Verification:\*\*

\- All period tests pass

\- Routes are accessible and working

This completes Phase 4\. Run all tests to verify.

---

## **Phase 5: Daily System & Pomodoro**

### **Step 5.1: Day Start Workflow**

**Goal:** Implement the Day Start checklist and workflow.

Continue building the Hemera Journal App. Now implement Day Start.

\*\*Context:\*\* You have documents and periods. Now add daily workflows.

\*\*Task:\*\* Implement the Day Start workflow.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/services/dayWorkflowService.ts\`:

   

   \*\*Day Start:\*\*

   \- getDayStartStatus(userId, dateKey):

     \- Check if day start is complete

     \- Return completion status and missing fields

   

   \- completeDayStart(userId, dateKey, data):

     \- Validate all required fields:

       \- slept8Hours (boolean)

       \- water3Glasses (boolean)

       \- meditation5Min (boolean)

       \- mobility5Min (boolean)

       \- gratefulFor (non-empty string)

       \- intentionForDay (non-empty string)

     \- Update day document

     \- Return completed status

   

   \- isDayStartComplete(document):

     \- Helper to check if day start section is filled

2\. Add validation:

   \- DayStartSchema with all fields required

3\. Add route:

   \- GET /days/:dateKey/start/status \- Get day start status

   \- POST /days/:dateKey/start \- Complete day start

4\. Business rule: Day start is required before planning can be done

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/dayWorkflow.dayStart.test.ts\`

\- Test incomplete day start returns missing fields

\- Test completing day start with all fields succeeds

\- Test missing gratefulFor fails validation

\- Test empty intentionForDay fails validation

\- Test status reflects completion

Real workflow tests with day documents.

---

### **Step 5.2: Planning Workflow (EEN \+ DRIE)**

**Goal:** Implement the planning workflow with One Thing and Top 3\.

Continue building the Hemera Journal App. Now implement planning workflow.

\*\*Context:\*\* You have Day Start. Now add planning.

\*\*Task:\*\* Implement the Planning workflow (EEN \+ DRIE).

\*\*Requirements:\*\*

1\. Update \`packages/api/src/services/dayWorkflowService.ts\`:

   

   \*\*Planning:\*\*

   \- getPlanningStatus(userId, dateKey):

     \- Check if planning is complete (EEN \+ DRIE filled)

     \- Return status and missing items

   

   \- setOneThing(userId, dateKey, oneThing):

     \- Validate: title required, description required

     \- pomodorosPlanned: 0-6

     \- Initialize pomodorosDone to 0

   

   \- setTopThree(userId, dateKey, topThree):

     \- Validate exactly 3 items

     \- Each: title required, description required

     \- pomodorosPlanned: 0-6 each

     \- Initialize pomodorosDone to 0 each

   

   \- addOtherTask(userId, dateKey, task):

     \- Optional tasks

     \- Title required, description optional

   

   \- isPlanningComplete(document):

     \- EEN has title \+ description

     \- Top 3 has exactly 3 items, each with title \+ description

2\. Business rule: Day Start must be complete before planning

3\. Add routes:

   \- GET /days/:dateKey/planning/status

   \- PUT /days/:dateKey/planning/one-thing

   \- PUT /days/:dateKey/planning/top-three

   \- POST /days/:dateKey/planning/other-tasks

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/dayWorkflow.planning.test.ts\`

\- Test planning requires day start complete

\- Test setting one thing with valid data succeeds

\- Test one thing without title fails

\- Test top three with 2 items fails

\- Test top three with 4 items fails

\- Test other tasks are optional

\- Test planning status reflects completion

Planning workflow with validation.

---

### **Step 5.3: Life Pillars Tracking**

**Goal:** Implement daily life pillars (Life Saws) tracking.

Continue building the Hemera Journal App. Now implement life pillars.

\*\*Context:\*\* You have planning. Now add life pillars tracking.

\*\*Task:\*\* Implement Life Pillars (daily Life Saws) tracking.

\*\*Requirements:\*\*

1\. Update \`packages/api/src/services/dayWorkflowService.ts\`:

   

   \*\*Life Pillars:\*\*

   \- getLifePillarsStatus(userId, dateKey):

     \- Return current status of all 4 pillars

   

   \- updateLifePillars(userId, dateKey, pillars):

     \- Update any/all of the 4 booleans:

       \- training

       \- deepRelaxation

       \- healthyNutrition

       \- realConnection

   

   \- getLifePillarStreak(userId, pillar):

     \- Calculate consecutive days streak for a pillar

2\. Add validation:

   \- LifePillarsSchema with all 4 booleans

3\. Add routes:

   \- GET /days/:dateKey/pillars \- Get current pillar status

   \- PATCH /days/:dateKey/pillars \- Update pillars

4\. No prerequisite workflow required \- pillars can be updated anytime

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/dayWorkflow.pillars.test.ts\`

\- Test get returns all 4 pillars with defaults

\- Test update single pillar works

\- Test update multiple pillars works

\- Test streak calculation across multiple days

Life pillars with real data.

---

### **Step 5.4: Pomodoro Timer System**

**Goal:** Implement the Pomodoro timer tracking and updates.

Continue building the Hemera Journal App. Now implement Pomodoro system.

\*\*Context:\*\* You have planning with pomodoro counts. Now add timer logic.

\*\*Task:\*\* Implement Pomodoro timer system.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/services/pomodoroService.ts\`:

   

   \*\*Pomodoro Operations:\*\*

   \- startPomodoro(userId, dateKey, taskType, taskIndex):

     \- taskType: 'oneThing' | 'topThree' | 'other'

     \- taskIndex: for topThree and other tasks

     \- Record start time

     \- Return pomodoro session info

   

   \- completePomodoro(userId, dateKey, sessionId):

     \- Verify 25 minutes elapsed (or allow early completion)

     \- Increment pomodorosDone for the task

     \- Return updated task

   

   \- startBreak(userId, dateKey, sessionId):

     \- Record break start

     \- Return break session info

   

   \- getPomodoroProgress(userId, dateKey):

     \- Return all tasks with planned vs done pomodoros

   

   \*\*Validation:\*\*

   \- Cannot exceed pomodorosPlanned

   \- Task must exist

2\. Create \`packages/api/src/types/pomodoro.ts\`:

   \- PomodoroSession interface

   \- TaskReference type

3\. Add routes:

   \- POST /days/:dateKey/pomodoro/start \- Start pomodoro

   \- POST /days/:dateKey/pomodoro/:sessionId/complete \- Complete pomodoro

   \- POST /days/:dateKey/pomodoro/:sessionId/break \- Start break

   \- GET /days/:dateKey/pomodoro/progress \- Get progress

4\. Note: Actual timer is client-side; server tracks state

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/pomodoroService.test.ts\`

\- Test start pomodoro creates session

\- Test complete increments pomodorosDone

\- Test cannot exceed pomodorosPlanned

\- Test invalid task reference fails

\- Test progress returns all tasks with counts

Pomodoro tracking with real sessions.

---

### **Step 5.5: Day Close Workflow**

**Goal:** Implement the Day Close checklist and reflection.

Continue building the Hemera Journal App. Now implement Day Close.

\*\*Context:\*\* You have all daily activities. Now add day close.

\*\*Task:\*\* Implement Day Close workflow with reflection.

\*\*Requirements:\*\*

1\. Update \`packages/api/src/services/dayWorkflowService.ts\`:

   

   \*\*Day Close:\*\*

   \- getDayCloseStatus(userId, dateKey):

     \- Return checklist status and reflection status

   

   \- updateDayCloseChecklist(userId, dateKey, checklist):

     \- Update booleans:

       \- noScreens2Hours

       \- noCarbs3Hours

       \- tomorrowPlanned

       \- goalsReviewed

   

   \- submitReflection(userId, dateKey, reflection):

     \- All 6 fields required for manual close:

       \- wentWell (non-empty)

       \- whyWentWell (non-empty)

       \- repeatInFuture (non-empty)

       \- wentWrong (non-empty)

       \- whyWentWrong (non-empty)

       \- doDifferently (non-empty)

     \- Return validation result

   

   \- closeDay(userId, dateKey):

     \- Verify reflection is complete

     \- Set status to 'closed'

     \- Update daily\_status\_summary

     \- Return closed document

2\. Business rules:

   \- Manual close REQUIRES reflection complete

   \- Auto-close does NOT require reflection

3\. Add routes:

   \- GET /days/:dateKey/close/status

   \- PATCH /days/:dateKey/close/checklist

   \- PUT /days/:dateKey/close/reflection

   \- POST /days/:dateKey/close

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/dayWorkflow.close.test.ts\`

\- Test close without reflection fails

\- Test close with complete reflection succeeds

\- Test empty reflection field fails

\- Test status updates to 'closed'

\- Test daily\_status\_summary is updated

Day close with mandatory reflection.

---

### **Step 5.6: Daily System Integration Test**

**Goal:** Verify the complete daily system works end-to-end.

Continue building the Hemera Journal App. Now integration test daily system.

\*\*Context:\*\* You have all daily components. Now verify integration.

\*\*Task:\*\* Create comprehensive integration tests for the daily system.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/\_\_tests\_\_/daily.integration.test.ts\`:

   

   \*\*Test: Complete Day Flow\*\*

   1\. Get today's day document

   2\. Complete day start (all fields)

   3\. Set one thing with 2 planned pomodoros

   4\. Set top three with pomodoros

   5\. Update life pillars

   6\. Start pomodoro on one thing

   7\. Complete pomodoro

   8\. Start break

   9\. Start second pomodoro

   10\. Complete second pomodoro

   11\. Update day close checklist

   12\. Submit reflection

   13\. Close day

   14\. Verify day is closed

   15\. Verify status summary updated

   

   \*\*Test: Workflow Order Enforcement\*\*

   1\. Try to set planning before day start

   2\. Verify error

   3\. Complete day start

   4\. Set planning successfully

   

   \*\*Test: Auto-Close Simulation\*\*

   1\. Create incomplete day 3 days ago

   2\. Run auto-close job

   3\. Verify status is 'auto\_closed'

   4\. Verify no reflection required

   

   \*\*Test: Pomodoro Limits\*\*

   1\. Set one thing with 2 planned pomodoros

   2\. Complete 2 pomodoros

   3\. Try to start third

   4\. Verify cannot exceed planned

2\. Wire up all day routes to server

\*\*Verification:\*\*

\- All daily tests pass

\- Complete workflow is functional

This completes Phase 5\. Run all tests to verify.

---

## **Phase 6: Sync & Offline Support**

### **Step 6.1: Sync Data Model**

**Goal:** Set up the data structures for sync operations.

Continue building the Hemera Journal App. Now implement sync support.

\*\*Context:\*\* You have complete document system. Now add offline sync.

\*\*Task:\*\* Create the sync data model and types.

\*\*Requirements:\*\*

1\. Create \`packages/shared/src/types/sync.ts\`:

   

   \*\*Sync Types:\*\*

   \- SyncMutation: { id, docType, docKey, content, clientUpdatedAt, deviceId, operation: 'upsert' | 'delete' }

   \- SyncPushRequest: { mutations: SyncMutation\[\] }

   \- SyncPushResponse: { results: SyncMutationResult\[\] }

   \- SyncMutationResult: { id, success, error?, conflictResolution? }

   \- SyncPullRequest: { since: ISO timestamp, docTypes?: DocType\[\] }

   \- SyncPullResponse: { documents: Document\[\], serverTime: ISO timestamp }

2\. Create \`packages/api/src/services/syncService.ts\`:

   

   \*\*Core Functions:\*\*

   \- processPushMutations(userId, mutations):

     \- Process batch of mutations

     \- Apply validation and LWW for each

     \- Return results for each mutation

     \- Transaction: all-or-nothing or individual results?

       (Choose individual for better offline experience)

   

   \- getChangedDocuments(userId, since, docTypes?):

     \- Query documents modified after 'since'

     \- Use server\_received\_at for reliable ordering

     \- Return documents and current server time

3\. Add index on server\_received\_at if not exists

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/syncService.test.ts\`

\- Test push single mutation succeeds

\- Test push batch mutations succeeds

\- Test push with validation error returns partial results

\- Test push with LWW conflict returns resolution info

\- Test pull returns documents since timestamp

\- Test pull respects docType filter

\- Test pull returns correct server time

Sync logic with real database operations.

---

### **Step 6.2: Sync API Endpoints**

**Goal:** Create the sync API endpoints.

Continue building the Hemera Journal App. Now create sync endpoints.

\*\*Context:\*\* You have sync service. Now expose via API.

\*\*Task:\*\* Create sync API endpoints.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/routes/sync.ts\`:

   

   \*\*POST /sync/push\*\*

   \- Requires auth

   \- Body: SyncPushRequest

   \- Process all mutations

   \- Return: SyncPushResponse with results for each

   

   \*\*GET /sync/pull\*\*

   \- Requires auth

   \- Query params: since (required), docTypes (optional, comma-separated)

   \- Return: SyncPullResponse with documents and serverTime

   

   \*\*POST /sync/full\*\*

   \- Requires auth

   \- Combined push and pull in single request

   \- Body: { push: SyncPushRequest, pullSince: timestamp }

   \- More efficient for mobile (single round trip)

2\. Add validation schemas:

   \- SyncPushSchema

   \- SyncPullQuerySchema

3\. Add rate limiting:

   \- Max 100 mutations per push request

   \- Max 1000 documents per pull response

4\. Wire up routes

\*\*Test file:\*\* \`packages/api/src/routes/\_\_tests\_\_/sync.test.ts\`

\- Test push endpoint processes mutations

\- Test pull endpoint returns changed docs

\- Test pull with since=0 returns all docs

\- Test full sync works

\- Test rate limiting enforced

\- Test auth required

API tests with real sync operations.

---

### **Step 6.3: Client Sync Implementation (Shared)**

**Goal:** Create shared sync utilities for clients.

Continue building the Hemera Journal App. Now create client sync utilities.

\*\*Context:\*\* You have sync API. Now create client-side utilities.

\*\*Task:\*\* Create shared sync utilities for web and mobile clients.

\*\*Requirements:\*\*

1\. Create \`packages/shared/src/sync/outbox.ts\`:

   

   \*\*OutboxManager:\*\*

   \- add(mutation): Add mutation to outbox queue

   \- getAll(): Get all pending mutations

   \- remove(ids): Remove processed mutations

   \- clear(): Clear all mutations

   \- getPendingCount(): Get count of pending

2\. Create \`packages/shared/src/sync/syncClient.ts\`:

   

   \*\*SyncClient:\*\*

   \- constructor(apiUrl, getAuthToken)

   \- push(mutations): POST to /sync/push

   \- pull(since, docTypes?): GET /sync/pull

   \- fullSync(mutations, pullSince): POST /sync/full

3\. Create \`packages/shared/src/sync/syncManager.ts\`:

   

   \*\*SyncManager:\*\*

   \- constructor(syncClient, outbox, storage)

   \- queueMutation(mutation): Add to outbox

   \- sync(): Execute sync (push pending, then pull)

   \- startAutoSync(intervalMs): Start periodic sync

   \- stopAutoSync(): Stop periodic sync

   \- getLastSyncTime(): Get last successful sync time

   \- getSyncStatus(): Return 'synced' | 'pending' | 'syncing' | 'error'

4\. Create \`packages/shared/src/sync/conflictHandler.ts\`:

   \- Handle conflict resolution responses

   \- Notify UI of conflicts

Note: Storage implementation is platform-specific (localStorage for web, AsyncStorage for mobile)

\*\*Test file:\*\* \`packages/shared/src/sync/\_\_tests\_\_/syncManager.test.ts\`

\- Test queueMutation adds to outbox

\- Test sync pushes pending mutations

\- Test sync pulls after push

\- Test sync handles push errors gracefully

\- Test auto-sync triggers periodically

\- Test conflict handling

Unit tests with mocked HTTP (this is client code, API already tested).

---

### **Step 6.4: Offline Queue & Retry Logic**

**Goal:** Implement robust offline queue with retry logic.

Continue building the Hemera Journal App. Now add offline resilience.

\*\*Context:\*\* You have basic sync. Now add robust offline handling.

\*\*Task:\*\* Implement offline queue with exponential backoff retry.

\*\*Requirements:\*\*

1\. Update \`packages/shared/src/sync/outbox.ts\`:

   

   \*\*Enhanced OutboxManager:\*\*

   \- Track retry count per mutation

   \- Track last attempt time per mutation

   \- getNextBatch(): Get mutations ready for retry

   \- markFailed(id): Increment retry count

   \- shouldRetry(mutation): Check if within max retries

2\. Create \`packages/shared/src/sync/retryStrategy.ts\`:

   

   \*\*RetryStrategy:\*\*

   \- getNextRetryDelay(retryCount): Exponential backoff

     \- Base delay: 1 second

     \- Max delay: 5 minutes

     \- Formula: min(baseDelay \* 2^retryCount, maxDelay)

   \- MAX\_RETRIES: 10

3\. Update \`packages/shared/src/sync/syncManager.ts\`:

   

   \*\*Enhanced SyncManager:\*\*

   \- Handle network errors gracefully

   \- Use retry strategy for failed syncs

   \- Track online/offline status

   \- Emit events: 'syncStart', 'syncComplete', 'syncError', 'offlineChange'

4\. Create \`packages/shared/src/sync/networkStatus.ts\`:

   \- Abstract network status detection

   \- Platform-specific implementations will extend

\*\*Test file:\*\* \`packages/shared/src/sync/\_\_tests\_\_/retryStrategy.test.ts\`

\- Test exponential backoff calculation

\- Test max delay cap

\- Test retry count tracking

\- Test max retries limit

\- Test offline detection triggers queue hold

Retry logic unit tests.

---

### **Step 6.5: Sync System Integration Test**

**Goal:** Verify sync works across multiple devices/sessions.

Continue building the Hemera Journal App. Now integration test sync.

\*\*Context:\*\* You have complete sync system. Now verify it works.

\*\*Task:\*\* Create comprehensive sync integration tests.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/\_\_tests\_\_/sync.integration.test.ts\`:

   

   \*\*Test: Basic Sync Flow\*\*

   1\. Device A creates document

   2\. Device B pulls, gets document

   3\. Device B modifies document

   4\. Device A pulls, gets updated document

   

   \*\*Test: Offline Sync\*\*

   1\. Device A creates 3 documents while "offline" (queue locally)

   2\. Device A syncs (push all 3\)

   3\. Verify all 3 created on server

   4\. Device B pulls, gets all 3

   

   \*\*Test: Conflict Resolution\*\*

   1\. Device A and B both have document

   2\. Device A modifies at T1

   3\. Device B modifies at T2 (T2 \> T1)

   4\. Device A pushes (succeeds)

   5\. Device B pushes (wins due to later timestamp)

   6\. Device A pulls, gets B's version

   

   \*\*Test: Clock Skew Rejection\*\*

   1\. Device pushes with clientUpdatedAt \= now \+ 15 minutes

   2\. Verify CLOCK\_SKEW\_REJECTED error

   3\. Verify mutation not applied

   

   \*\*Test: Partial Batch Success\*\*

   1\. Push batch of 3 mutations

   2\. \#1 valid, \#2 validation error, \#3 valid

   3\. Verify \#1 and \#3 succeeded

   4\. Verify \#2 returned error

2\. Create end-to-end sync scenario test simulating real usage

\*\*Verification:\*\*

\- All sync tests pass

\- Multi-device scenario works correctly

This completes Phase 6\. Run all tests to verify.

---

## **Phase 7: Accountability System**

### **Step 7.1: Accountability Pairing**

**Goal:** Implement accountability partner pairing.

Continue building the Hemera Journal App. Now implement accountability.

\*\*Context:\*\* You have complete document and sync system. Now add accountability.

\*\*Task:\*\* Implement accountability partner pairing.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/services/accountabilityService.ts\`:

   

   \*\*Pairing Operations:\*\*

   \- createPairRequest(fromUserId, toUserEmail):

     \- Lookup user by email

     \- Check neither user already has partner

     \- Create pending pair request

   

   \- acceptPairRequest(userId, requestId):

     \- Verify request exists and is for this user

     \- Create accountability\_pairs entry

     \- Delete request

   

   \- rejectPairRequest(userId, requestId):

     \- Delete request

   

   \- removePair(userId):

     \- Delete pair where user is member

     \- Both users become un-paired

   

   \- getPartner(userId):

     \- Return partner's basic info (id, email) or null

   

   \- hasPendingRequest(userId):

     \- Check if user has pending incoming/outgoing request

2\. Create \`packages/api/src/db/migrations/004\_pair\_requests.sql\`:

   \- accountability\_pair\_requests table:

     \- id, from\_user\_id, to\_user\_id, created\_at, status

3\. Add routes \`packages/api/src/routes/accountability.ts\`:

   \- POST /accountability/request \- Send pair request

   \- GET /accountability/requests \- Get pending requests

   \- POST /accountability/requests/:id/accept

   \- POST /accountability/requests/:id/reject

   \- DELETE /accountability/pair \- Remove current pairing

   \- GET /accountability/partner \- Get partner info

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/accountabilityService.test.ts\`

\- Test create pair request

\- Test cannot request if already paired

\- Test accept creates pair

\- Test reject removes request

\- Test remove pair un-pairs both users

\- Test get partner returns correct info

Real pairing with test users.

---

### **Step 7.2: Partner Summary View**

**Goal:** Implement the limited data partner can see.

Continue building the Hemera Journal App. Now implement partner summary.

\*\*Context:\*\* You have pairing. Now add partner visibility.

\*\*Task:\*\* Implement partner summary view with strict data isolation.

\*\*Requirements:\*\*

1\. Update \`packages/api/src/services/accountabilityService.ts\`:

   

   \*\*Summary Operations:\*\*

   \- getPartnerSummary(userId, dateRange):

     \- Get partner's daily\_status\_summary for date range

     \- Return ONLY: date, dayClosed, oneThingDone, reflectionPresent

     \- NO task titles, descriptions, or any content

   

   \- updateDailyStatusSummary(userId, dateKey):

     \- Calculate from day document:

       \- dayClosed: status \== 'closed'

       \- oneThingDone: oneThing.pomodorosDone \>= oneThing.pomodorosPlanned AND pomodorosPlanned \> 0

         (or simpler: just check if user marked complete)

       \- reflectionPresent: all 6 reflection fields non-empty

     \- Upsert to daily\_status\_summary

2\. Create background job \`packages/api/src/jobs/updateSummaries.ts\`:

   \- Run periodically to ensure summaries are up-to-date

   \- Called when day is closed

3\. Verify RLS policies:

   \- User can only read partner's summary, not full documents

   \- Summary table has RLS allowing partner read

4\. Add route:

   \- GET /accountability/partner/summary?startDate\&endDate

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/accountabilityService.summary.test.ts\`

\- Test summary only contains allowed fields

\- Test user cannot see partner's document content

\- Test summary updates when day closes

\- Test RLS prevents direct document access

Strict data isolation testing.

---

### **Step 7.3: Daily Check-ins**

**Goal:** Implement partner check-in messages.

Continue building the Hemera Journal App. Now implement check-ins.

\*\*Context:\*\* You have partner summary. Now add check-ins.

\*\*Task:\*\* Implement daily check-in messages between partners.

\*\*Requirements:\*\*

1\. Update \`packages/api/src/services/accountabilityService.ts\`:

   

   \*\*Check-in Operations:\*\*

   \- createCheckin(userId, message):

     \- Verify user has partner

     \- Validate message length (max 500 chars)

     \- One check-in per day per user

     \- Create accountability\_daily\_checkins entry

   

   \- getCheckins(userId, dateRange):

     \- Get check-ins for user (both sent and received)

     \- Include author info

   

   \- getTodayCheckin(userId):

     \- Get today's check-in status (sent/received)

2\. Add validation:

   \- CheckinSchema: message max 500 chars

3\. Add routes:

   \- POST /accountability/checkin \- Send today's check-in

   \- GET /accountability/checkins?startDate\&endDate \- Get check-in history

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/accountabilityService.checkin.test.ts\`

\- Test create check-in succeeds

\- Test message over 500 chars fails

\- Test only one check-in per day

\- Test get check-ins returns both sent and received

\- Test cannot check-in without partner

Check-in functionality tests.

---

### **Step 7.4: Accountability Integration Test**

**Goal:** Verify complete accountability system works.

Continue building the Hemera Journal App. Now integration test accountability.

\*\*Context:\*\* You have all accountability components. Now verify integration.

\*\*Task:\*\* Create comprehensive accountability integration tests.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/\_\_tests\_\_/accountability.integration.test.ts\`:

   

   \*\*Test: Full Pairing Flow\*\*

   1\. User A sends pair request to User B

   2\. User B sees pending request

   3\. User B accepts

   4\. Both users see each other as partner

   5\. User A completes and closes day

   6\. User B can see A's summary (closed: true)

   7\. User B sends check-in to A

   8\. User A can see check-in

   9\. User A removes pair

   10\. Both users no longer have partner

   

   \*\*Test: Privacy Enforcement\*\*

   1\. Pair two users

   2\. User A creates day with detailed tasks

   3\. User B fetches partner summary

   4\. Verify summary contains ONLY: dayClosed, oneThingDone, reflectionPresent

   5\. Verify User B CANNOT access User A's documents directly

   

   \*\*Test: One Partner Limit\*\*

   1\. User A paired with User B

   2\. User C tries to request User A

   3\. Verify error (A already paired)

   

   \*\*Test: Check-in Limits\*\*

   1\. User A sends check-in

   2\. User A tries to send another

   3\. Verify error (one per day)

2\. Wire up all accountability routes

\*\*Verification:\*\*

\- All accountability tests pass

\- Privacy is strictly enforced

This completes Phase 7\. Run all tests to verify.

---

## **Phase 8: Notifications & Analytics**

### **Step 8.1: Push Notification Infrastructure**

**Goal:** Set up push notification infrastructure.

Continue building the Hemera Journal App. Now implement notifications.

\*\*Context:\*\* You have complete core functionality. Now add notifications.

\*\*Task:\*\* Set up push notification infrastructure.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/services/notificationService.ts\`:

   

   \*\*Core Functions:\*\*

   \- registerDevice(userId, pushToken, deviceId, platform):

     \- Store device info for push notifications

     \- Platform: 'ios' | 'android' | 'web'

   

   \- unregisterDevice(userId, deviceId):

     \- Remove device registration

   

   \- sendPushNotification(userId, notification):

     \- notification: { title, body, data }

     \- Look up user's devices

     \- Send via Expo Push API (or FCM/APNs)

     \- Log to notification\_log

   

   \- sendEmail(userId, subject, body):

     \- For escalation notifications

     \- Use simple email service (SendGrid, SES, etc.)

     \- Log to notification\_log

2\. Create \`packages/api/src/db/migrations/005\_device\_tokens.sql\`:

   \- push\_device\_tokens table:

     \- id, user\_id, device\_id, push\_token, platform, created\_at, updated\_at

3\. Add routes:

   \- POST /notifications/register-device

   \- DELETE /notifications/devices/:deviceId

4\. Create notification types enum:

   \- day\_start, day\_close, pomodoro\_start, pomodoro\_break, partner\_closed, missed\_2\_days\_push, missed\_2\_days\_email

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/notificationService.test.ts\`

\- Test device registration

\- Test device unregistration

\- Test send push (mock external API, but test our logic)

\- Test notification logged

Notification infrastructure tests.

---

### **Step 8.2: Scheduled Notifications**

**Goal:** Implement scheduled notification jobs.

Continue building the Hemera Journal App. Now implement scheduled notifications.

\*\*Context:\*\* You have notification infrastructure. Now add scheduling.

\*\*Task:\*\* Implement scheduled notification jobs.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/jobs/notificationJobs.ts\`:

   

   \*\*Day Start Reminder:\*\*

   \- Run every minute (or use cron)

   \- Find users where:

     \- Current time in their timezone matches day\_start\_reminder\_time

     \- Push enabled

   \- Send "Time to start your day\!" notification

   

   \*\*Day Close Reminder:\*\*

   \- Run every minute

   \- Find users where:

     \- Current time matches day\_close\_reminder\_time

     \- Today's day not manually closed

     \- Push enabled

   \- Send "Don't forget to close your day\!" notification

   

   \*\*Partner Closed Notification:\*\*

   \- Triggered when partner closes their day

   \- Send "Your partner closed their day\!" notification

2\. Create \`packages/api/src/jobs/scheduler.ts\`:

   \- Job scheduler setup (node-cron or similar)

   \- Register all notification jobs

   \- Handle job failures gracefully

3\. Update day close flow:

   \- After closing day, trigger partner notification

\*\*Test file:\*\* \`packages/api/src/jobs/\_\_tests\_\_/notificationJobs.test.ts\`

\- Test day start job finds correct users

\- Test day close job skips already closed days

\- Test partner notification triggered on close

\- Test timezone handling correct

Job tests with real time calculations.

---

### **Step 8.3: Missed Days Escalation**

**Goal:** Implement missed days detection and escalation.

Continue building the Hemera Journal App. Now implement missed days escalation.

\*\*Context:\*\* You have scheduled notifications. Now add escalation.

\*\*Task:\*\* Implement missed days detection and escalation notifications.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/jobs/missedDaysJob.ts\`:

   

   \*\*Missed Day Detection:\*\*

   \- Definition: Day that is locked (\>48h old) AND not manually closed AND no reflection

   \- Run daily (or more frequently)

   \- For each user:

     \- Count consecutive missed days

     \- If \>= 2 missed days:

       \- Send push notification

       \- Send email notification (if email\_for\_escalations\_enabled)

       \- Log both notifications

2\. Create \`packages/api/src/services/missedDaysService.ts\`:

   

   \*\*Functions:\*\*

   \- getMissedDays(userId, limit):

     \- Return list of missed days for user

   

   \- getConsecutiveMissedCount(userId):

     \- Count consecutive missed days ending today

   

   \- isMissedDay(document):

     \- Check if day meets missed criteria

3\. Add to scheduler

\*\*Test file:\*\* \`packages/api/src/jobs/\_\_tests\_\_/missedDaysJob.test.ts\`

\- Test day with auto\_closed and no reflection is missed

\- Test day with closed status is not missed

\- Test consecutive count calculation

\- Test 2 missed days triggers notifications

\- Test 1 missed day does not trigger

\- Test email only sent if enabled

Missed days logic with real scenarios.

---

### **Step 8.4: Analytics Service**

**Goal:** Implement analytics calculations and endpoints.

Continue building the Hemera Journal App. Now implement analytics.

\*\*Context:\*\* You have notifications. Now add analytics.

\*\*Task:\*\* Implement analytics service with calculations and charts.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/services/analyticsService.ts\`:

   

   \*\*Completion Rates:\*\*

   \- getDayClosedRate(userId, dateRange):

     \- % of days manually closed

   

   \- getDayStartAdherence(userId, dateRange):

     \- % of days with complete day start checklist

   

   \- getDayCloseAdherence(userId, dateRange):

     \- % of days with complete day close checklist

   

   \- getLifePillarAdherence(userId, dateRange):

     \- % adherence for each pillar

   

   \*\*Pomodoro Stats:\*\*

   \- getPomodoroUtilization(userId, dateRange):

     \- Planned vs completed pomodoros per day/week/month

   

   \*\*Streaks:\*\*

   \- getCurrentStreaks(userId):

     \- Consecutive days closed

     \- Consecutive days with all pillars

     \- Per-pillar streaks

   

   \*\*Correlations:\*\*

   \- getCorrelations(userId, dateRange):

     \- "Day Start complete → Day Closed" correlation

     \- "No screens → Reflection quality" (future)

2\. Create \`packages/api/src/routes/analytics.ts\`:

   \- GET /analytics/completion-rates?startDate\&endDate

   \- GET /analytics/pomodoro-stats?startDate\&endDate

   \- GET /analytics/streaks

   \- GET /analytics/correlations?startDate\&endDate

   \- GET /analytics/calendar-heatmap?year

3\. Add calendar heatmap data endpoint:

   \- Returns array of { date, completionScore } for year

\*\*Test file:\*\* \`packages/api/src/services/\_\_tests\_\_/analyticsService.test.ts\`

\- Test completion rate calculation

\- Test pillar adherence calculation

\- Test pomodoro utilization calculation

\- Test streak calculation

\- Test correlation calculation

Analytics with real data calculations.

---

### **Step 8.5: Final Integration & MVP Verification**

**Goal:** Complete integration testing and verify MVP acceptance criteria.

Continue building the Hemera Journal App. Final integration and verification.

\*\*Context:\*\* You have all features implemented. Now verify MVP.

\*\*Task:\*\* Complete final integration tests and verify all acceptance criteria.

\*\*Requirements:\*\*

1\. Create \`packages/api/src/\_\_tests\_\_/mvp.integration.test.ts\`:

   

   \*\*Test: Complete User Journey\*\*

   1\. User registers

   2\. User creates Quarter Start Strong with life wheel and 3 goals

   3\. User creates Month Start with linked goals

   4\. User creates Week Start with linked goals

   5\. User completes today's Day Start

   6\. User sets EEN and DRIE

   7\. User runs pomodoros with notifications

   8\. User updates life pillars

   9\. User completes day close checklist

   10\. User submits reflection

   11\. User closes day

   12\. Day appears in calendar

   13\. Analytics show completion

   

   \*\*Test: Offline Sync Journey\*\*

   1\. User creates documents offline

   2\. User comes online

   3\. Sync completes successfully

   4\. Data available on another device

   

   \*\*Test: Accountability Journey\*\*

   1\. User A and B pair

   2\. User A completes day

   3\. User B sees summary

   4\. User B sends check-in

   5\. User A misses 2 days

   6\. Notifications sent

   

   \*\*Test: Admin Journey\*\*

   1\. Admin creates user

   2\. User uses app

   3\. Admin blocks user

   4\. User cannot login

   5\. Admin deletes user

   6\. All data removed

2\. Create MVP checklist verification:

   \- \[ \] User onboarding works

   \- \[ \] Quarter Start Strong works

   \- \[ \] Today screen end-to-end works

   \- \[ \] Days open 24h early

   \- \[ \] Days lock after 48h

   \- \[ \] Manual close requires reflection

   \- \[ \] Auto-close works

   \- \[ \] Pomodoro timer triggers notifications

   \- \[ \] Offline edits persist and sync

   \- \[ \] Accountability pairing works

   \- \[ \] Partner sees only summary

   \- \[ \] Partner can leave check-in

   \- \[ \] Analytics shows charts and correlations

   \- \[ \] Admin can create/block/delete users

   \- \[ \] Admin cannot read journal content

   \- \[ \] Error handling conforms to contract

3\. Final cleanup:

   \- Remove any TODO comments

   \- Ensure all tests pass

   \- Document any known limitations

\*\*Verification:\*\*

Run all tests: \`pnpm test\`

All tests should pass.

This completes the Hemera Journal App MVP backend.

---

## **Web Client Phase (Bonus \- After Backend Complete)**

The web client would follow similar incremental steps:

1. **Project Setup**: Astro \+ React, routing, auth context  
2. **Auth Pages**: Login, register, password reset  
3. **Layout & Navigation**: App shell, navigation, settings  
4. **Today Screen**: Day start, planning, pomodoro, day close  
5. **Period Screens**: Quarter, month, week views  
6. **Calendar**: History view, day detail  
7. **Accountability**: Partner view, check-ins  
8. **Analytics**: Charts, streaks, correlations  
9. **Offline**: Service worker, local storage, sync UI  
10. **Final Polish**: Loading states, error handling, responsive design  
    ---

    ## **Summary**

This blueprint breaks down the Hemera Journal App into 43 discrete implementation steps across 8 phases. Each step:

* Has a clear, focused goal  
* Builds on previous steps  
* Includes comprehensive test requirements  
* Uses real data and API calls (no mocks except for external services)  
* Produces working, integrated code

The prompts are designed for test-driven development where tests are written alongside implementation, ensuring quality at each step.

