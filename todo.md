# Hemera Journal App - Development TODO Checklist

> **Instructions:** Check off each item as you complete it. Each task corresponds to a prompt in the blueprint. Do not skip ahead - each step builds on the previous ones.

---

## Pre-Development Setup

- [x] Create Supabase project and note credentials
- [x] Set up development environment (Node.js 20+, pnpm)
- [x] Create GitHub repository
- [x] Set up CI/CD pipeline (GitHub Actions recommended)
- [x] Create `.env.local` with Supabase credentials for development
- [x] Create `.env.test` with test database credentials

---

## Phase 1: Foundation & Database Setup

### Step 1.1: Project Initialization & Tooling
- [x] Initialize pnpm workspace with `pnpm init`
- [x] Create `pnpm-workspace.yaml` with packages config
- [x] Create root `package.json` with workspace scripts
- [x] Create root `tsconfig.json` with strict mode and project references
- [x] Set up Vitest configuration (`vitest.config.ts`)
- [x] Set up ESLint configuration (`.eslintrc.js`)
- [x] Set up Prettier configuration (`.prettierrc`)
- [x] Create `.env.example` with all required variables
- [x] Create `packages/api/` directory structure
- [x] Create `packages/api/package.json`
- [x] Create `packages/api/tsconfig.json`
- [x] Create `packages/api/src/index.ts` placeholder
- [x] Create `packages/shared/` directory structure
- [x] Create `packages/shared/package.json`
- [x] Create `packages/shared/tsconfig.json`
- [x] Create `packages/shared/src/index.ts` placeholder
- [x] Create `packages/web/` directory structure (placeholder)
- [x] Verify `pnpm install` succeeds
- [x] Verify `pnpm -r build` succeeds
- [x] Verify `pnpm test` runs (no tests yet)

### Step 1.2: Shared Types & Constants
- [x] Create `packages/shared/src/types/user.ts`
  - [x] Define `UserSettings` interface
  - [x] Define `SubscriptionStatus` type
- [x] Create `packages/shared/src/types/documents.ts`
  - [x] Define `DocType` enum
  - [x] Define `DocStatus` enum
  - [x] Define base `Document` interface
  - [x] Define `DayStartContent` interface
  - [x] Define `PlanningContent` interface (EEN + DRIE)
  - [x] Define `LifePillarsContent` interface
  - [x] Define `DayCloseContent` interface
  - [x] Define `ReflectionContent` interface
  - [x] Define `DayContent` interface (combines all day sections)
  - [x] Define `WeekStartContent` interface
  - [x] Define `MonthStartContent` interface
  - [x] Define `QuarterStartContent` interface (Start Strong)
  - [x] Define `LifeWheelScores` interface (8 dimensions)
  - [x] Define `QuarterGoal` interface
- [x] Create `packages/shared/src/types/accountability.ts`
  - [x] Define `AccountabilityPair` interface
  - [x] Define `DailyCheckin` interface
  - [x] Define `DailyStatusSummary` interface
- [x] Create `packages/shared/src/types/api.ts`
  - [x] Define `ApiResponse<T>` generic type
  - [x] Define `ApiError` type
  - [x] Define `ErrorCode` enum (all 9 codes)
- [x] Create `packages/shared/src/constants.ts`
  - [x] Define `POMODORO_DURATION_MINUTES`
  - [x] Define `BREAK_DURATION_MINUTES`
  - [x] Define `MAX_POMODOROS_PER_TASK`
  - [x] Define `DAY_AVAILABLE_HOURS_BEFORE`
  - [x] Define `DAY_LOCK_HOURS_AFTER`
  - [x] Define `CLOCK_SKEW_MAX_MINUTES`
  - [x] Define `CHECKIN_MAX_LENGTH`
- [x] Create `packages/shared/src/index.ts` with all exports
- [x] Create `packages/shared/src/__tests__/types.test.ts`
- [x] Run tests and verify all pass

### Step 1.3: Database Schema Design
- [x] Create `packages/api/src/db/migrations/` directory
- [x] Create `001_initial_schema.sql`
  - [x] Create `user_settings` table
  - [x] Create `journal_documents` table
  - [x] Create `accountability_pairs` table
  - [x] Create `accountability_daily_checkins` table
  - [x] Create `daily_status_summary` table
  - [x] Create `notification_log` table
  - [x] Create `admin_user_actions` table
- [x] Create `002_indexes.sql`
  - [x] Index on `journal_documents(user_id, doc_type)`
  - [x] Index on `journal_documents(server_received_at)`
  - [x] Index on `accountability_pairs` for both user columns
  - [x] Index on `daily_status_summary(user_id, date)`
- [x] Create `003_rls_policies.sql`
  - [x] Enable RLS on `user_settings`
  - [x] Enable RLS on `journal_documents`
  - [x] Enable RLS on `accountability_pairs`
  - [x] Enable RLS on `accountability_daily_checkins`
  - [x] Enable RLS on `daily_status_summary`
  - [x] Create policy: users CRUD own documents
  - [x] Create policy: users CRUD own settings
  - [x] Create policy: partners read summary
  - [x] Create policy: partners create/read checkins
- [x] Create `packages/api/src/db/__tests__/schema.test.ts`
- [x] Run migrations against test database
- [x] Verify all tables created correctly
- [x] Verify RLS policies enabled

### Step 1.4: Database Connection & Client Setup
- [x] Create `packages/api/src/config/index.ts`
  - [x] Load environment variables
  - [x] Validate required variables present
  - [x] Export typed config object
- [x] Create `packages/api/src/db/client.ts`
  - [x] Create Supabase client (anon key)
  - [x] Create Supabase admin client (service role)
  - [x] Create health check function
- [x] Create `packages/api/src/db/migrate.ts`
  - [x] Migration runner script
  - [x] Track applied migrations
- [x] Create `packages/api/src/db/seed.ts`
  - [x] Create test users (2)
  - [x] Create sample quarter document
  - [x] Create sample month document
  - [x] Create sample week document
  - [x] Create sample day documents (various states)
  - [x] Create accountability pair
  - [x] Create sample checkins
- [x] Create `packages/api/src/db/__tests__/client.test.ts`
- [x] Run tests and verify connection works
- [x] Verify RLS prevents cross-user access

### Step 1.5: Error Handling Infrastructure
- [x] Create `packages/api/src/errors/AppError.ts`
  - [x] Define `AppError` class
  - [x] Implement `AppError.unauthorized()`
  - [x] Implement `AppError.forbidden()`
  - [x] Implement `AppError.validationError()`
  - [x] Implement `AppError.docLocked()`
  - [x] Implement `AppError.docNotYetAvailable()`
  - [x] Implement `AppError.clockSkewRejected()`
  - [x] Implement `AppError.rateLimited()`
  - [x] Implement `AppError.internal()`
- [x] Create `packages/api/src/errors/errorHandler.ts`
  - [x] Create Express error middleware
  - [x] Transform AppError to API response
  - [x] Handle unexpected errors
  - [x] Add error logging
- [x] Create `packages/api/src/errors/index.ts`
- [x] Create `packages/api/src/errors/__tests__/errors.test.ts`
- [x] Run tests and verify error handling works

### Step 1.6: API Server Foundation
- [x] Install Express and dependencies
- [x] Create `packages/api/src/server.ts`
  - [x] Configure JSON body parsing
  - [x] Configure CORS
  - [x] Add request logging middleware
  - [x] Add error handling middleware
  - [x] Add health check endpoint (`GET /health`)
  - [x] Export app for testing
- [x] Create `packages/api/src/index.ts`
  - [x] Start server
  - [x] Add graceful shutdown
- [x] Create `packages/api/src/middleware/auth.ts`
  - [x] Verify Supabase JWT
  - [x] Extract user ID
  - [x] Return 401 for invalid tokens
- [x] Create `packages/api/src/middleware/validateRequest.ts`
  - [x] Generic Zod validation middleware
  - [x] Validate body, params, query
- [x] Create `packages/api/src/__tests__/server.test.ts`
- [x] Run tests and verify server works
- [x] Manual test with curl/Postman

---

## Phase 2: Authentication & User Management

### Step 2.1: User Registration & Login
- [x] Create `packages/api/src/schemas/auth.ts`
  - [x] Define `registerSchema`
  - [x] Define `loginSchema`
  - [x] Define `refreshSchema`
- [x] Create `packages/api/src/services/userService.ts`
  - [x] Implement `createUserSettings()`
  - [x] Implement `getUserSettings()`
  - [x] Implement `updateUserSettings()`
- [x] Create `packages/api/src/routes/auth.ts`
  - [x] Implement `POST /auth/register`
  - [x] Implement `POST /auth/login`
  - [x] Implement `POST /auth/logout`
  - [x] Implement `POST /auth/refresh`
- [x] Create `packages/api/src/routes/__tests__/auth.test.ts`
- [x] Run tests and verify auth works

### Step 2.2: User Settings Management
- [x] Create `packages/api/src/schemas/settings.ts`
  - [x] Define `userSettingsUpdateSchema`
  - [x] Add time format validation (HH:MM)
  - [x] Add timezone validation
- [x] Update `packages/api/src/services/userService.ts`
  - [x] Add timezone validation helper
- [x] Create `packages/api/src/routes/settings.ts`
  - [x] Implement `GET /settings`
  - [x] Implement `PATCH /settings`
- [x] Create `packages/api/src/routes/__tests__/settings.test.ts`
- [x] Run tests and verify settings work

### Step 2.3: Admin User Management
- [x] Create `packages/api/src/middleware/adminAuth.ts`
  - [x] Verify admin claim/email
  - [x] Return 403 for non-admin
- [x] Create `packages/api/src/services/adminService.ts`
  - [x] Implement `createUser()`
  - [x] Implement `blockUser()`
  - [x] Implement `unblockUser()`
  - [x] Implement `deleteUser()`
  - [x] Implement `logAdminAction()`
- [x] Create `packages/api/src/routes/admin.ts`
  - [x] Implement `POST /admin/users`
  - [x] Implement `POST /admin/users/:id/block`
  - [x] Implement `POST /admin/users/:id/unblock`
  - [x] Implement `DELETE /admin/users/:id`
- [x] Verify NO endpoint to read user documents
- [x] Create `packages/api/src/routes/__tests__/admin.test.ts`
- [x] Run tests and verify admin functions work

### Step 2.4: Session & Token Management
- [x] Update `packages/api/src/middleware/auth.ts`
  - [x] Check token expiration
  - [x] Return specific error for expired tokens
  - [x] Add rate limiting for failed attempts
- [x] Create `packages/api/src/services/sessionService.ts`
  - [x] Implement `validateSession()`
  - [x] Implement `getUserFromSession()`
  - [x] Implement `trackDeviceSession()`
- [x] Create `packages/api/src/routes/devices.ts`
  - [x] Implement `GET /devices`
  - [x] Implement `DELETE /devices/:deviceId`
- [x] Create `packages/api/src/routes/__tests__/session.test.ts`
- [x] Run tests and verify session management works

### Step 2.5: Wire Up Auth Routes & Integration Test
- [x] Update `packages/api/src/server.ts`
  - [x] Mount `/auth` routes
  - [x] Mount `/settings` routes (protected)
  - [x] Mount `/admin` routes (admin protected)
  - [x] Mount `/devices` routes (protected)
- [x] Create `packages/api/src/routes/index.ts`
- [x] Create `packages/api/src/__tests__/auth.integration.test.ts`
  - [x] Test complete user lifecycle (11 steps)
- [x] Run all tests
- [ ] Manual testing verification (optional: run through flows in Postman/curl)

---

## Phase 3: Document System Core

### Step 3.1: Document Repository Layer
- [x] Create `packages/api/src/types/repository.ts`
  - [x] Define repository interfaces
  - [x] Define query options
- [x] Create `packages/api/src/repositories/documentRepository.ts`
  - [x] Implement `findById()`
  - [x] Implement `findByKey()`
  - [x] Implement `findByUser()`
  - [x] Implement `create()`
  - [x] Implement `update()`
  - [x] Implement `upsert()`
- [x] Create `packages/api/src/repositories/__tests__/documentRepository.test.ts`
- [x] Run tests and verify repository works

### Step 3.2: Document Validation Service
- [x] Create `packages/api/src/schemas/documents.ts`
  - [x] Define `DayStartSchema`
  - [x] Define `OneThingSchema`
  - [x] Define `TopThreeItemSchema`
  - [x] Define `PlanningSchema`
  - [x] Define `LifePillarsSchema`
  - [x] Define `ReflectionSchema`
  - [x] Define `DayCloseSchema`
  - [x] Define `DayContentSchema`
  - [x] Define `WeekContentSchema`
  - [x] Define `MonthContentSchema`
  - [x] Define `LifeWheelSchema`
  - [x] Define `QuarterGoalSchema`
  - [x] Define `QuarterContentSchema`
- [x] Create `packages/api/src/services/documentValidation.ts`
  - [x] Implement `validateDocument(docType, content)`
  - [x] Implement `validateDayContent()`
  - [x] Implement `validateWeekContent()`
  - [x] Implement `validateMonthContent()`
  - [x] Implement `validateQuarterContent()`
- [x] Create `packages/api/src/services/__tests__/documentValidation.test.ts`
- [x] Run tests and verify validation works

### Step 3.3: Day Availability & Locking Rules
- [x] Create `packages/api/src/utils/dateUtils.ts`
  - [x] Implement `getDayStart()`
  - [x] Implement `getDayEnd()`
  - [x] Implement `formatDateKey()`
  - [x] Implement `parseDateKey()`
- [x] Create `packages/api/src/services/dayAvailability.ts`
  - [x] Implement `isDayAvailable()`
  - [x] Implement `isDayEditable()`
  - [x] Implement `isDayLocked()`
  - [x] Implement `getDayStatus()`
  - [x] Implement `shouldAutoClose()`
- [x] Create `packages/api/src/services/__tests__/dayAvailability.test.ts`
- [x] Run tests and verify availability rules work

### Step 3.4: Document Service Layer
- [x] Create `packages/api/src/services/documentService.ts`
  - [x] Implement `getDocument()`
  - [x] Implement `saveDocument()`
  - [x] Implement `closeDay()`
  - [x] Implement `autoClosePendingDays()`
- [x] Create `packages/api/src/services/statusSummaryService.ts`
  - [x] Implement `updateSummary()`
- [x] Create `packages/api/src/services/__tests__/documentService.test.ts`
- [x] Run tests and verify document service works

### Step 3.5: Last-Write-Wins Conflict Resolution
- [x] Create `packages/api/src/services/conflictResolution.ts`
  - [x] Implement `resolveConflict()`
  - [x] Implement `validateClockSkew()`
- [x] Update `packages/api/src/services/documentService.ts`
  - [x] Integrate conflict resolution in `saveDocument()`
- [x] Create `packages/api/src/services/__tests__/conflictResolution.test.ts`
- [x] Run tests and verify LWW works

### Step 3.6: Document API Endpoints
- [x] Update `packages/api/src/schemas/documents.ts`
  - [x] Add document params schema
  - [x] Add document update schema
  - [x] Add close day schema
  - [x] Add list query schema
- [x] Create `packages/api/src/routes/documents.ts`
  - [x] Implement `GET /documents/:docType/:docKey`
  - [x] Implement `PUT /documents/:docType/:docKey`
  - [x] Implement `POST /documents/:docType/:docKey/close`
  - [x] Implement `GET /documents`
- [x] Wire up routes in `server.ts`
- [x] Create `packages/api/src/routes/__tests__/documents.test.ts`
- [x] Run tests and verify endpoints work

### Step 3.7: Document System Integration Test
- [x] Create `packages/api/src/__tests__/documents.integration.test.ts`
  - [x] Test complete day lifecycle
  - [x] Test day locking
  - [x] Test conflict resolution
  - [x] Test auto-close
  - [x] Test quarter Start Strong
- [x] Run all tests
- [x] Verify document system complete

---

## Phase 4: Period Planning System

### Step 4.1: Quarter Document (Start Strong)
- [x] Create `packages/api/src/services/periodService.ts`
  - [x] Implement `createQuarterStart()`
  - [x] Implement `updateLifeWheel()`
  - [x] Implement `setQuarterGoals()`
  - [x] Implement `updateGoalProgress()`
- [x] Create `packages/api/src/routes/periods.ts`
  - [x] Implement `POST /periods/quarter/start`
  - [x] Implement `GET /periods/quarter/current`
  - [x] Implement `PATCH /periods/quarter/:key/life-wheel`
  - [x] Implement `PUT /periods/quarter/:key/goals`
  - [x] Implement `PATCH /periods/quarter/:key/goals/:index/progress`
- [x] Create `packages/api/src/services/__tests__/periodService.quarter.test.ts`
- [x] Run tests and verify quarter planning works

### Step 4.2: Month Start Document
- [x] Update `packages/api/src/services/periodService.ts`
  - [x] Implement `createMonthStart()`
  - [x] Implement `setMonthlyGoals()`
  - [x] Implement `updateMonthGoalProgress()`
  - [x] Implement `getCurrentQuarter()`
- [x] Update `packages/api/src/routes/periods.ts`
  - [x] Implement `POST /periods/month/start`
  - [x] Implement `GET /periods/month/current`
  - [x] Implement `PUT /periods/month/:key/goals`
  - [x] Implement `PATCH /periods/month/:key/goals/:index/progress`
- [x] Create `packages/api/src/services/__tests__/periodService.month.test.ts`
- [x] Run tests and verify month planning works

### Step 4.3: Week Start Document
- [x] Update `packages/api/src/services/periodService.ts`
  - [x] Implement `createWeekStart()`
  - [x] Implement `setWeeklyGoals()`
  - [x] Implement `updateWeekGoalProgress()`
  - [x] Implement `getCurrentMonth()`
  - [x] Implement `getWeekKey()`
- [x] Update `packages/api/src/routes/periods.ts`
  - [x] Implement `POST /periods/week/start`
  - [x] Implement `GET /periods/week/current`
  - [x] Implement `PUT /periods/week/:key/goals`
  - [x] Implement `PATCH /periods/week/:key/goals/:index/progress`
- [x] Create `packages/api/src/services/__tests__/periodService.week.test.ts`
- [x] Run tests and verify week planning works

### Step 4.4: Period Hierarchy Validation
- [x] Create `packages/api/src/services/periodHierarchy.ts`
  - [x] Implement `validateMonthBelongsToQuarter()`
  - [x] Implement `validateWeekBelongsToMonth()`
  - [x] Implement `getGoalHierarchy()`
  - [x] Implement `getPeriodProgress()`
- [x] Update `packages/api/src/routes/periods.ts`
  - [x] Implement `GET /periods/hierarchy`
  - [x] Implement `GET /periods/progress`
  - [x] Implement `GET /periods/goals/:type/:index/related`
- [x] Create `packages/api/src/services/__tests__/periodHierarchy.test.ts`
- [x] Run tests and verify hierarchy works

### Step 4.5: Period System Integration Test
- [x] Create `packages/api/src/__tests__/periods.integration.test.ts`
  - [x] Test complete period setup flow
  - [x] Test progress flow
  - [x] Test invalid linking
  - [x] Test period navigation
- [x] Wire up period routes in `server.ts`
- [x] Run all tests
- [x] Verify period system complete

---

## Phase 5: Daily System & Pomodoro

### Step 5.1: Day Start Workflow
- [x] Create `packages/api/src/services/dayWorkflowService.ts`
  - [x] Implement `getDayStartStatus()`
  - [x] Implement `completeDayStart()`
  - [x] Implement `isDayStartComplete()`
- [x] Create `packages/api/src/routes/days.ts`
  - [x] Implement `GET /days/:dateKey/start/status`
  - [x] Implement `POST /days/:dateKey/start`
- [x] Create `packages/api/src/services/__tests__/dayWorkflow.dayStart.test.ts`
- [x] Run tests and verify day start works

### Step 5.2: Planning Workflow (EEN + DRIE)
- [x] Update `packages/api/src/services/dayWorkflowService.ts`
  - [x] Implement `getPlanningStatus()`
  - [x] Implement `setOneThing()`
  - [x] Implement `setTopThree()`
  - [x] Implement `addOtherTask()`
  - [x] Implement `isPlanningComplete()`
- [x] Update `packages/api/src/routes/days.ts`
  - [x] Implement `GET /days/:dateKey/planning/status`
  - [x] Implement `PUT /days/:dateKey/planning/one-thing`
  - [x] Implement `PUT /days/:dateKey/planning/top-three`
  - [x] Implement `POST /days/:dateKey/planning/other-tasks`
- [x] Create `packages/api/src/services/__tests__/dayWorkflow.planning.test.ts`
- [x] Run tests and verify planning works

### Step 5.3: Life Pillars Tracking
- [x] Update `packages/api/src/services/dayWorkflowService.ts`
  - [x] Implement `getLifePillarsStatus()`
  - [x] Implement `updateLifePillars()`
  - [x] Implement `getLifePillarStreak()`
- [x] Update `packages/api/src/routes/days.ts`
  - [x] Implement `GET /days/:dateKey/pillars`
  - [x] Implement `PATCH /days/:dateKey/pillars`
- [x] Create `packages/api/src/services/__tests__/dayWorkflow.pillars.test.ts`
- [x] Run tests and verify pillars work

### Step 5.4: Pomodoro Timer System
- [x] Create `packages/api/src/types/pomodoro.ts`
  - [x] Define `PomodoroSession` interface
  - [x] Define `TaskReference` type
- [x] Create `packages/api/src/services/pomodoroService.ts`
  - [x] Implement `startPomodoro()`
  - [x] Implement `completePomodoro()`
  - [x] Implement `startBreak()`
  - [x] Implement `getPomodoroProgress()`
- [x] Update `packages/api/src/routes/days.ts`
  - [x] Implement `POST /days/:dateKey/pomodoro/start`
  - [x] Implement `POST /days/:dateKey/pomodoro/:sessionId/complete`
  - [x] Implement `POST /days/:dateKey/pomodoro/:sessionId/break`
  - [x] Implement `GET /days/:dateKey/pomodoro/progress`
- [x] Create `packages/api/src/services/__tests__/pomodoroService.test.ts`
- [x] Run tests and verify pomodoro works

### Step 5.5: Day Close Workflow
- [x] Update `packages/api/src/services/dayWorkflowService.ts`
  - [x] Implement `getDayCloseStatus()`
  - [x] Implement `updateDayCloseChecklist()`
  - [x] Implement `submitReflection()`
  - [x] Implement `closeDay()` (in workflow service)
- [x] Update `packages/api/src/routes/days.ts`
  - [x] Implement `GET /days/:dateKey/close/status`
  - [x] Implement `PATCH /days/:dateKey/close/checklist`
  - [x] Implement `PUT /days/:dateKey/close/reflection`
  - [x] Implement `POST /days/:dateKey/close`
- [x] Create `packages/api/src/services/__tests__/dayWorkflow.close.test.ts`
- [x] Run tests and verify day close works

### Step 5.6: Daily System Integration Test
- [x] Create `packages/api/src/__tests__/daily.integration.test.ts`
  - [x] Test complete day flow (15 steps)
  - [x] Test workflow order enforcement
  - [x] Test auto-close simulation
  - [x] Test pomodoro limits
- [x] Wire up day routes in `server.ts`
- [x] Run all tests
- [x] Verify daily system complete

---

## Phase 6: Sync & Offline Support

### Step 6.1: Sync Data Model
- [x] Create `packages/shared/src/types/sync.ts`
  - [x] Define `SyncMutation` type
  - [x] Define `SyncPushRequest` type
  - [x] Define `SyncPushResponse` type
  - [x] Define `SyncMutationResult` type
  - [x] Define `SyncPullRequest` type
  - [x] Define `SyncPullResponse` type
- [x] Create `packages/api/src/services/syncService.ts`
  - [x] Implement `processPushMutations()`
  - [x] Implement `getChangedDocuments()`
- [x] Verify index on `server_received_at` exists
- [x] Create `packages/api/src/services/__tests__/syncService.test.ts`
- [x] Run tests and verify sync service works

### Step 6.2: Sync API Endpoints
- [x] Create `packages/api/src/schemas/sync.ts`
  - [x] Define `SyncPushSchema`
  - [x] Define `SyncPullQuerySchema`
- [x] Create `packages/api/src/routes/sync.ts`
  - [x] Implement `POST /sync/push`
  - [x] Implement `GET /sync/pull`
  - [x] Implement `POST /sync/full`
  - [x] Add rate limiting (100 mutations, 1000 documents)
- [x] Wire up routes in `server.ts`
- [x] Create `packages/api/src/routes/__tests__/sync.test.ts`
- [x] Run tests and verify sync endpoints work

### Step 6.3: Client Sync Implementation (Shared)
- [x] Create `packages/shared/src/sync/outbox.ts`
  - [x] Implement `OutboxManager` class
  - [x] Implement `add()`
  - [x] Implement `getAll()`
  - [x] Implement `remove()`
  - [x] Implement `clear()`
  - [x] Implement `getPendingCount()`
- [x] Create `packages/shared/src/sync/syncClient.ts`
  - [x] Implement `SyncClient` class
  - [x] Implement `push()`
  - [x] Implement `pull()`
  - [x] Implement `fullSync()`
- [x] Create `packages/shared/src/sync/syncManager.ts`
  - [x] Implement `SyncManager` class
  - [x] Implement `queueMutation()`
  - [x] Implement `sync()`
  - [x] Implement `startAutoSync()`
  - [x] Implement `stopAutoSync()`
  - [x] Implement `getLastSyncTime()`
  - [x] Implement `getSyncStatus()`
- [x] Create `packages/shared/src/sync/conflictHandler.ts`
- [x] Create `packages/shared/src/sync/__tests__/syncManager.test.ts`
- [x] Run tests and verify client sync works

### Step 6.4: Offline Queue & Retry Logic
- [x] Update `packages/shared/src/sync/outbox.ts`
  - [x] Add retry count tracking
  - [x] Add last attempt time tracking
  - [x] Implement `getNextBatch()`
  - [x] Implement `markFailed()`
  - [x] Implement `shouldRetry()`
- [x] Create `packages/shared/src/sync/retryStrategy.ts`
  - [x] Implement `getNextRetryDelay()`
  - [x] Define `MAX_RETRIES`
- [x] Update `packages/shared/src/sync/syncManager.ts`
  - [x] Handle network errors
  - [x] Use retry strategy
  - [x] Track online/offline status
  - [x] Emit sync events
- [x] Create `packages/shared/src/sync/networkStatus.ts`
- [x] Create `packages/shared/src/sync/__tests__/retryStrategy.test.ts`
- [x] Run tests and verify retry logic works

### Step 6.5: Sync System Integration Test
- [x] Create `packages/api/src/__tests__/sync.integration.test.ts`
  - [x] Test basic sync flow
  - [x] Test offline sync
  - [x] Test conflict resolution
  - [x] Test clock skew rejection
  - [x] Test partial batch success
- [x] Run all tests
- [x] Verify sync system complete

---

## Phase 7: Accountability System

### Step 7.1: Accountability Pairing
- [x] Create `packages/api/src/db/migrations/004_pair_requests.sql`
  - [x] Create `accountability_pair_requests` table
- [x] Run migration
- [x] Create `packages/api/src/services/accountabilityService.ts`
  - [x] Implement `createPairRequest()`
  - [x] Implement `acceptPairRequest()`
  - [x] Implement `rejectPairRequest()`
  - [x] Implement `removePair()`
  - [x] Implement `getPartner()`
  - [x] Implement `hasPendingRequest()`
- [x] Create `packages/api/src/routes/accountability.ts`
  - [x] Implement `POST /accountability/request`
  - [x] Implement `GET /accountability/requests`
  - [x] Implement `POST /accountability/requests/:id/accept`
  - [x] Implement `POST /accountability/requests/:id/reject`
  - [x] Implement `DELETE /accountability/pair`
  - [x] Implement `GET /accountability/partner`
- [x] Create `packages/api/src/services/__tests__/accountabilityService.test.ts`
- [x] Run tests and verify pairing works

### Step 7.2: Partner Summary View
- [x] Update `packages/api/src/services/accountabilityService.ts`
  - [x] Implement `getPartnerSummary()`
  - [x] Implement `updateDailyStatusSummary()`
- [x] Create `packages/api/src/jobs/updateSummaries.ts`
- [x] Update `packages/api/src/routes/accountability.ts`
  - [x] Implement `GET /accountability/partner/summary`
- [x] Verify RLS policies for summary access
- [x] Create `packages/api/src/services/__tests__/accountabilityService.summary.test.ts`
- [x] Run tests and verify summary works
- [x] Verify privacy is enforced

### Step 7.3: Daily Check-ins
- [x] Create `packages/api/src/schemas/accountability.ts`
  - [x] Define `CheckinSchema` (max 500 chars)
- [x] Update `packages/api/src/services/accountabilityService.ts`
  - [x] Implement `createCheckin()`
  - [x] Implement `getCheckins()`
  - [x] Implement `getTodayCheckin()`
- [x] Update `packages/api/src/routes/accountability.ts`
  - [x] Implement `POST /accountability/checkin`
  - [x] Implement `GET /accountability/checkins`
- [x] Create `packages/api/src/services/__tests__/accountabilityService.checkin.test.ts`
- [x] Run tests and verify check-ins work

### Step 7.4: Accountability Integration Test
- [x] Create `packages/api/src/__tests__/accountability.integration.test.ts`
  - [x] Test full pairing flow (10 steps)
  - [x] Test privacy enforcement
  - [x] Test one partner limit
  - [x] Test check-in limits
- [x] Wire up accountability routes in `server.ts`
- [x] Run all tests
- [x] Verify accountability system complete

---

## Phase 8: Notifications & Analytics

### Step 8.1: Push Notification Infrastructure
- [x] Create `packages/api/src/db/migrations/005_device_tokens.sql`
  - [x] Create `push_device_tokens` table
- [x] Run migration
- [x] Create `packages/api/src/services/notificationService.ts`
  - [x] Implement `registerDevice()`
  - [x] Implement `unregisterDevice()`
  - [x] Implement `sendPushNotification()`
  - [x] Implement `sendEmail()`
- [x] Create `packages/api/src/routes/notifications.ts`
  - [x] Implement `POST /notifications/register-device`
  - [x] Implement `DELETE /notifications/devices/:deviceId`
- [x] Wire up routes in `server.ts`
- [x] Create `packages/api/src/services/__tests__/notificationService.test.ts`
- [x] Run tests and verify notification infrastructure works

### Step 8.2: Scheduled Notifications
- [x] Create `packages/api/src/jobs/notificationJobs.ts`
  - [x] Implement day start reminder job
  - [x] Implement day close reminder job
  - [x] Implement partner closed notification
- [x] Create `packages/api/src/jobs/scheduler.ts`
  - [x] Set up job scheduler
  - [x] Register notification jobs
- [x] Update day close flow to trigger partner notification
- [x] Create `packages/api/src/jobs/__tests__/notificationJobs.test.ts`
- [x] Run tests and verify scheduled notifications work

### Step 8.3: Missed Days Escalation
- [x] Create `packages/api/src/services/missedDaysService.ts`
  - [x] Implement `getMissedDays()`
  - [x] Implement `getConsecutiveMissedCount()`
  - [x] Implement `isMissedDay()`
- [x] Create `packages/api/src/jobs/missedDaysJob.ts`
  - [x] Implement missed day detection
  - [x] Send push notification for 2+ missed
  - [x] Send email notification for 2+ missed
- [x] Add to scheduler
- [x] Create `packages/api/src/jobs/__tests__/missedDaysJob.test.ts`
- [x] Run tests and verify missed days escalation works

### Step 8.4: Analytics Service
- [x] Create `packages/api/src/services/analyticsService.ts`
  - [x] Implement `getDayClosedRate()`
  - [x] Implement `getDayStartAdherence()`
  - [x] Implement `getDayCloseAdherence()`
  - [x] Implement `getLifePillarAdherence()`
  - [x] Implement `getPomodoroUtilization()`
  - [x] Implement `getCurrentStreaks()`
  - [x] Implement `getCorrelations()`
- [x] Create `packages/api/src/routes/analytics.ts`
  - [x] Implement `GET /analytics/completion-rates`
  - [x] Implement `GET /analytics/pomodoro-stats`
  - [x] Implement `GET /analytics/streaks`
  - [x] Implement `GET /analytics/correlations`
  - [x] Implement `GET /analytics/calendar-heatmap`
- [x] Wire up routes in `server.ts`
- [x] Create `packages/api/src/services/__tests__/analyticsService.test.ts`
- [x] Run tests and verify analytics work

### Step 8.5: Final Integration & MVP Verification
- [x] Create `packages/api/src/__tests__/mvp.integration.test.ts`
  - [x] Test complete user journey (13 steps)
  - [x] Test offline sync journey
  - [x] Test accountability journey
  - [x] Test admin journey
- [x] MVP Checklist Verification:
  - [x] User onboarding works
  - [x] Quarter Start Strong works
  - [x] Today screen end-to-end works
  - [x] Days open 24h early (`dayAvailability`: `DAY_AVAILABLE_HOURS_BEFORE`)
  - [x] Days lock after 48h (`dayAvailability`: `DAY_LOCK_HOURS_AFTER`)
  - [x] Manual close requires reflection (`hasCompleteReflection` in document/dayWorkflow)
  - [x] Auto-close works (`autoClosePendingDays`, tests in document/daily integration)
  - [x] Pomodoro timer triggers notifications (sendPushNotification on start + break in pomodoroService)
  - [x] Offline edits persist and sync
  - [x] Accountability pairing works
  - [x] Partner can leave check-in
  - [x] Analytics shows charts and correlations (API: completion-rates, streaks, correlations, calendar-heatmap)
  - [x] Admin can create/block/delete users
  - [x] Admin cannot read journal content (no `/admin/documents`; test expects 404)
  - [x] Error handling conforms to contract (`AppError` → `ErrorCode`, errorHandler)
- [x] Remove all TODO comments from code
- [x] Document known limitations
- [x] Run full test suite: `pnpm test`
- [x] All tests pass

---

## Post-MVP: Web Client (Optional)

### Web Setup
- [ ] Initialize Astro project in `packages/web`
- [ ] Configure React integration
- [ ] Set up Tailwind CSS
- [ ] Configure routing

### Web Auth
- [ ] Create login page
- [ ] Create register page
- [ ] Create password reset page
- [ ] Set up auth context/provider

### Web Layout
- [ ] Create app shell/layout
- [ ] Create navigation component
- [ ] Create settings page

### Web Today Screen
- [ ] Create day start component
- [ ] Create planning component (EEN + DRIE)
- [ ] Create pomodoro timer component
- [ ] Create life pillars component
- [ ] Create day close component

### Web Period Screens
- [ ] Create quarter view (Start Strong)
- [ ] Create month view
- [ ] Create week view

### Web Calendar
- [ ] Create calendar/history view
- [ ] Create day detail view (read-only for locked days)

### Web Accountability
- [ ] Create partner view
- [ ] Create check-in component

### Web Analytics
- [ ] Create charts components
- [ ] Create streaks display
- [ ] Create correlations view

### Web Offline
- [ ] Set up service worker
- [ ] Implement local storage
- [ ] Create sync status UI

### Web Polish
- [ ] Add loading states
- [ ] Add error handling UI
- [ ] Make responsive
- [ ] Accessibility audit

---

## Deployment Checklist

- [ ] Set up production Supabase project
- [ ] Configure production environment variables
- [ ] Set up production database with migrations
- [ ] Deploy API to hosting (Render, Railway, etc.)
- [ ] Configure CORS for production domains
- [ ] Set up monitoring/logging (Sentry, etc.)
- [ ] Configure push notification services
- [ ] Configure email service (SendGrid, SES)
- [ ] Deploy web client (Vercel, Netlify, etc.)
- [ ] Set up SSL certificates
- [ ] Configure backup strategy
- [ ] Document deployment process
- [ ] Create runbook for common issues

---

## Notes & Decisions Log

Use this section to document important decisions and notes as you build:

| Date | Decision/Note |
|------|---------------|
| | |
| | |
| | |

---

## Known Limitations (Document as you go)

- **Email:** In development and test, transactional emails (e.g. account blocked, missed days escalation) are only logged to console. Production requires wiring `emailService.ts` to a provider (SendGrid, Resend, SES).
- **Push notifications:** Delivered via Expo Push API. For production native apps, configure Expo credentials; no direct FCM/APNs integration in this API.
- **Pomodoro sessions:** Stored in-memory (`Map` in `pomodoroService`). Server restart clears active sessions; clients may need to handle “session not found” and restart the timer locally.
- **Migrations:** Migration `005_device_tokens.sql` has no `.down.sql`; rollback of that migration is not supported.
- **Web client:** `packages/web` is a placeholder; no UI yet. All flows are covered by the API and integration tests.
- **Scheduled jobs:** Day-start/day-close reminders, missed-days escalation, and partner-closed notifications run from in-process jobs. A scheduler (e.g. node-cron) must be started with the API, or a separate cron process must call the job entrypoints.
- **Admin:** No endpoint to read user journal/documents by design; admin can only manage users (create, block, unblock, delete). 

---

## Questions/Blockers (Track as needed)

- [ ] 
- [ ] 
- [ ] 
