# Hemera Journal App - Development TODO Checklist

> **Instructions:** Check off each item as you complete it. Each task corresponds to a prompt in the blueprint. Do not skip ahead - each step builds on the previous ones.

---

## Pre-Development Setup

- [ ] Create Supabase project and note credentials
- [ ] Set up development environment (Node.js 20+, pnpm)
- [ ] Create GitHub repository
- [ ] Set up CI/CD pipeline (GitHub Actions recommended)
- [ ] Create `.env.local` with Supabase credentials for development
- [x] Create `.env.test` with test database credentials

---

## Phase 1: Foundation & Database Setup

### Step 1.1: Project Initialization & Tooling
- [ ] Initialize pnpm workspace with `pnpm init`
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
- [ ] Verify `pnpm install` succeeds
- [ ] Verify `pnpm -r build` succeeds
- [ ] Verify `pnpm test` runs (no tests yet)

### Step 1.2: Shared Types & Constants
- [x] Create `packages/shared/src/types/user.ts`
  - [x] Define `UserSettings` interface
  - [x] Define `SubscriptionStatus` type
- [x] Create `packages/shared/src/types/documents.ts`
  - [x] Define `DocType` enum
  - [x] Define `DocStatus` enum
  - [x] Define base `Document` interface
  - [ ] Define `DayStartContent` interface
  - [ ] Define `PlanningContent` interface (EEN + DRIE)
  - [ ] Define `LifePillarsContent` interface
  - [ ] Define `DayCloseContent` interface
  - [ ] Define `ReflectionContent` interface
  - [x] Define `DayContent` interface (combines all day sections)
  - [x] Define `WeekStartContent` interface
  - [x] Define `MonthStartContent` interface
  - [x] Define `QuarterStartContent` interface (Start Strong)
  - [ ] Define `LifeWheelScores` interface (8 dimensions)
  - [ ] Define `QuarterGoal` interface
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
- [ ] Run tests and verify all pass

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
- [ ] Run migrations against test database
- [ ] Verify all tables created correctly
- [ ] Verify RLS policies enabled

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
- [ ] Run tests and verify connection works
- [ ] Verify RLS prevents cross-user access

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
- [ ] Run tests and verify error handling works

### Step 1.6: API Server Foundation
- [ ] Install Express and dependencies
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
- [ ] Run tests and verify server works
- [ ] Manual test with curl/Postman

---

## Phase 2: Authentication & User Management

### Step 2.1: User Registration & Login
- [ ] Create `packages/api/src/schemas/auth.ts`
  - [ ] Define `registerSchema`
  - [ ] Define `loginSchema`
  - [ ] Define `refreshSchema`
- [ ] Create `packages/api/src/services/userService.ts`
  - [ ] Implement `createUserSettings()`
  - [ ] Implement `getUserSettings()`
  - [ ] Implement `updateUserSettings()`
- [ ] Create `packages/api/src/routes/auth.ts`
  - [ ] Implement `POST /auth/register`
  - [ ] Implement `POST /auth/login`
  - [ ] Implement `POST /auth/logout`
  - [ ] Implement `POST /auth/refresh`
- [ ] Create `packages/api/src/routes/__tests__/auth.test.ts`
- [ ] Run tests and verify auth works

### Step 2.2: User Settings Management
- [ ] Create `packages/api/src/schemas/settings.ts`
  - [ ] Define `userSettingsUpdateSchema`
  - [ ] Add time format validation (HH:MM)
  - [ ] Add timezone validation
- [ ] Update `packages/api/src/services/userService.ts`
  - [ ] Add timezone validation helper
- [ ] Create `packages/api/src/routes/settings.ts`
  - [ ] Implement `GET /settings`
  - [ ] Implement `PATCH /settings`
- [ ] Create `packages/api/src/routes/__tests__/settings.test.ts`
- [ ] Run tests and verify settings work

### Step 2.3: Admin User Management
- [ ] Create `packages/api/src/middleware/adminAuth.ts`
  - [ ] Verify admin claim/email
  - [ ] Return 403 for non-admin
- [ ] Create `packages/api/src/services/adminService.ts`
  - [ ] Implement `createUser()`
  - [ ] Implement `blockUser()`
  - [ ] Implement `unblockUser()`
  - [ ] Implement `deleteUser()`
  - [ ] Implement `logAdminAction()`
- [ ] Create `packages/api/src/routes/admin.ts`
  - [ ] Implement `POST /admin/users`
  - [ ] Implement `POST /admin/users/:id/block`
  - [ ] Implement `POST /admin/users/:id/unblock`
  - [ ] Implement `DELETE /admin/users/:id`
- [ ] Verify NO endpoint to read user documents
- [ ] Create `packages/api/src/routes/__tests__/admin.test.ts`
- [ ] Run tests and verify admin functions work

### Step 2.4: Session & Token Management
- [ ] Update `packages/api/src/middleware/auth.ts`
  - [ ] Check token expiration
  - [ ] Return specific error for expired tokens
  - [ ] Add rate limiting for failed attempts
- [ ] Create `packages/api/src/services/sessionService.ts`
  - [ ] Implement `validateSession()`
  - [ ] Implement `getUserFromSession()`
  - [ ] Implement `trackDeviceSession()`
- [ ] Create `packages/api/src/routes/devices.ts`
  - [ ] Implement `GET /devices`
  - [ ] Implement `DELETE /devices/:deviceId`
- [ ] Create `packages/api/src/routes/__tests__/session.test.ts`
- [ ] Run tests and verify session management works

### Step 2.5: Wire Up Auth Routes & Integration Test
- [ ] Update `packages/api/src/server.ts`
  - [ ] Mount `/auth` routes
  - [ ] Mount `/settings` routes (protected)
  - [ ] Mount `/admin` routes (admin protected)
  - [ ] Mount `/devices` routes (protected)
- [ ] Create `packages/api/src/routes/index.ts`
- [ ] Create `packages/api/src/__tests__/auth.integration.test.ts`
  - [ ] Test complete user lifecycle (11 steps)
- [ ] Run all tests
- [ ] Manual testing verification

---

## Phase 3: Document System Core

### Step 3.1: Document Repository Layer
- [ ] Create `packages/api/src/types/repository.ts`
  - [ ] Define repository interfaces
  - [ ] Define query options
- [ ] Create `packages/api/src/repositories/documentRepository.ts`
  - [ ] Implement `findById()`
  - [ ] Implement `findByKey()`
  - [ ] Implement `findByUser()`
  - [ ] Implement `create()`
  - [ ] Implement `update()`
  - [ ] Implement `upsert()`
- [ ] Create `packages/api/src/repositories/__tests__/documentRepository.test.ts`
- [ ] Run tests and verify repository works

### Step 3.2: Document Validation Service
- [ ] Create `packages/api/src/schemas/documents.ts`
  - [ ] Define `DayStartSchema`
  - [ ] Define `OneThingSchema`
  - [ ] Define `TopThreeItemSchema`
  - [ ] Define `PlanningSchema`
  - [ ] Define `LifePillarsSchema`
  - [ ] Define `ReflectionSchema`
  - [ ] Define `DayCloseSchema`
  - [ ] Define `DayContentSchema`
  - [ ] Define `WeekContentSchema`
  - [ ] Define `MonthContentSchema`
  - [ ] Define `LifeWheelSchema`
  - [ ] Define `QuarterGoalSchema`
  - [ ] Define `QuarterContentSchema`
- [ ] Create `packages/api/src/services/documentValidation.ts`
  - [ ] Implement `validateDocument(docType, content)`
  - [ ] Implement `validateDayContent()`
  - [ ] Implement `validateWeekContent()`
  - [ ] Implement `validateMonthContent()`
  - [ ] Implement `validateQuarterContent()`
- [ ] Create `packages/api/src/services/__tests__/documentValidation.test.ts`
- [ ] Run tests and verify validation works

### Step 3.3: Day Availability & Locking Rules
- [ ] Create `packages/api/src/utils/dateUtils.ts`
  - [ ] Implement `getDayStart()`
  - [ ] Implement `getDayEnd()`
  - [ ] Implement `formatDateKey()`
  - [ ] Implement `parseDateKey()`
- [ ] Create `packages/api/src/services/dayAvailability.ts`
  - [ ] Implement `isDayAvailable()`
  - [ ] Implement `isDayEditable()`
  - [ ] Implement `isDayLocked()`
  - [ ] Implement `getDayStatus()`
  - [ ] Implement `shouldAutoClose()`
- [ ] Create `packages/api/src/services/__tests__/dayAvailability.test.ts`
- [ ] Run tests and verify availability rules work

### Step 3.4: Document Service Layer
- [ ] Create `packages/api/src/services/documentService.ts`
  - [ ] Implement `getDocument()`
  - [ ] Implement `saveDocument()`
  - [ ] Implement `closeDay()`
  - [ ] Implement `autoClosePendingDays()`
- [ ] Create `packages/api/src/services/statusSummaryService.ts`
  - [ ] Implement `updateSummary()`
- [ ] Create `packages/api/src/services/__tests__/documentService.test.ts`
- [ ] Run tests and verify document service works

### Step 3.5: Last-Write-Wins Conflict Resolution
- [ ] Create `packages/api/src/services/conflictResolution.ts`
  - [ ] Implement `resolveConflict()`
  - [ ] Implement `validateClockSkew()`
- [ ] Update `packages/api/src/services/documentService.ts`
  - [ ] Integrate conflict resolution in `saveDocument()`
- [ ] Create `packages/api/src/services/__tests__/conflictResolution.test.ts`
- [ ] Run tests and verify LWW works

### Step 3.6: Document API Endpoints
- [ ] Update `packages/api/src/schemas/documents.ts`
  - [ ] Add document params schema
  - [ ] Add document update schema
  - [ ] Add close day schema
  - [ ] Add list query schema
- [ ] Create `packages/api/src/routes/documents.ts`
  - [ ] Implement `GET /documents/:docType/:docKey`
  - [ ] Implement `PUT /documents/:docType/:docKey`
  - [ ] Implement `POST /documents/:docType/:docKey/close`
  - [ ] Implement `GET /documents`
- [ ] Wire up routes in `server.ts`
- [ ] Create `packages/api/src/routes/__tests__/documents.test.ts`
- [ ] Run tests and verify endpoints work

### Step 3.7: Document System Integration Test
- [ ] Create `packages/api/src/__tests__/documents.integration.test.ts`
  - [ ] Test complete day lifecycle
  - [ ] Test day locking
  - [ ] Test conflict resolution
  - [ ] Test auto-close
  - [ ] Test quarter Start Strong
- [ ] Run all tests
- [ ] Verify document system complete

---

## Phase 4: Period Planning System

### Step 4.1: Quarter Document (Start Strong)
- [ ] Create `packages/api/src/services/periodService.ts`
  - [ ] Implement `createQuarterStart()`
  - [ ] Implement `updateLifeWheel()`
  - [ ] Implement `setQuarterGoals()`
  - [ ] Implement `updateGoalProgress()`
- [ ] Create `packages/api/src/routes/periods.ts`
  - [ ] Implement `POST /periods/quarter/start`
  - [ ] Implement `GET /periods/quarter/current`
  - [ ] Implement `PATCH /periods/quarter/:key/life-wheel`
  - [ ] Implement `PUT /periods/quarter/:key/goals`
  - [ ] Implement `PATCH /periods/quarter/:key/goals/:index/progress`
- [ ] Create `packages/api/src/services/__tests__/periodService.quarter.test.ts`
- [ ] Run tests and verify quarter planning works

### Step 4.2: Month Start Document
- [ ] Update `packages/api/src/services/periodService.ts`
  - [ ] Implement `createMonthStart()`
  - [ ] Implement `setMonthlyGoals()`
  - [ ] Implement `updateMonthGoalProgress()`
  - [ ] Implement `getCurrentQuarter()`
- [ ] Update `packages/api/src/routes/periods.ts`
  - [ ] Implement `POST /periods/month/start`
  - [ ] Implement `GET /periods/month/current`
  - [ ] Implement `PUT /periods/month/:key/goals`
  - [ ] Implement `PATCH /periods/month/:key/goals/:index/progress`
- [ ] Create `packages/api/src/services/__tests__/periodService.month.test.ts`
- [ ] Run tests and verify month planning works

### Step 4.3: Week Start Document
- [ ] Update `packages/api/src/services/periodService.ts`
  - [ ] Implement `createWeekStart()`
  - [ ] Implement `setWeeklyGoals()`
  - [ ] Implement `updateWeekGoalProgress()`
  - [ ] Implement `getCurrentMonth()`
  - [ ] Implement `getWeekKey()`
- [ ] Update `packages/api/src/routes/periods.ts`
  - [ ] Implement `POST /periods/week/start`
  - [ ] Implement `GET /periods/week/current`
  - [ ] Implement `PUT /periods/week/:key/goals`
  - [ ] Implement `PATCH /periods/week/:key/goals/:index/progress`
- [ ] Create `packages/api/src/services/__tests__/periodService.week.test.ts`
- [ ] Run tests and verify week planning works

### Step 4.4: Period Hierarchy Validation
- [ ] Create `packages/api/src/services/periodHierarchy.ts`
  - [ ] Implement `validateMonthBelongsToQuarter()`
  - [ ] Implement `validateWeekBelongsToMonth()`
  - [ ] Implement `getGoalHierarchy()`
  - [ ] Implement `getPeriodProgress()`
- [ ] Update `packages/api/src/routes/periods.ts`
  - [ ] Implement `GET /periods/hierarchy`
  - [ ] Implement `GET /periods/progress`
  - [ ] Implement `GET /periods/goals/:type/:index/related`
- [ ] Create `packages/api/src/services/__tests__/periodHierarchy.test.ts`
- [ ] Run tests and verify hierarchy works

### Step 4.5: Period System Integration Test
- [ ] Create `packages/api/src/__tests__/periods.integration.test.ts`
  - [ ] Test complete period setup flow
  - [ ] Test progress flow
  - [ ] Test invalid linking
  - [ ] Test period navigation
- [ ] Wire up period routes in `server.ts`
- [ ] Run all tests
- [ ] Verify period system complete

---

## Phase 5: Daily System & Pomodoro

### Step 5.1: Day Start Workflow
- [ ] Create `packages/api/src/services/dayWorkflowService.ts`
  - [ ] Implement `getDayStartStatus()`
  - [ ] Implement `completeDayStart()`
  - [ ] Implement `isDayStartComplete()`
- [ ] Create `packages/api/src/routes/days.ts`
  - [ ] Implement `GET /days/:dateKey/start/status`
  - [ ] Implement `POST /days/:dateKey/start`
- [ ] Create `packages/api/src/services/__tests__/dayWorkflow.dayStart.test.ts`
- [ ] Run tests and verify day start works

### Step 5.2: Planning Workflow (EEN + DRIE)
- [ ] Update `packages/api/src/services/dayWorkflowService.ts`
  - [ ] Implement `getPlanningStatus()`
  - [ ] Implement `setOneThing()`
  - [ ] Implement `setTopThree()`
  - [ ] Implement `addOtherTask()`
  - [ ] Implement `isPlanningComplete()`
- [ ] Update `packages/api/src/routes/days.ts`
  - [ ] Implement `GET /days/:dateKey/planning/status`
  - [ ] Implement `PUT /days/:dateKey/planning/one-thing`
  - [ ] Implement `PUT /days/:dateKey/planning/top-three`
  - [ ] Implement `POST /days/:dateKey/planning/other-tasks`
- [ ] Create `packages/api/src/services/__tests__/dayWorkflow.planning.test.ts`
- [ ] Run tests and verify planning works

### Step 5.3: Life Pillars Tracking
- [ ] Update `packages/api/src/services/dayWorkflowService.ts`
  - [ ] Implement `getLifePillarsStatus()`
  - [ ] Implement `updateLifePillars()`
  - [ ] Implement `getLifePillarStreak()`
- [ ] Update `packages/api/src/routes/days.ts`
  - [ ] Implement `GET /days/:dateKey/pillars`
  - [ ] Implement `PATCH /days/:dateKey/pillars`
- [ ] Create `packages/api/src/services/__tests__/dayWorkflow.pillars.test.ts`
- [ ] Run tests and verify pillars work

### Step 5.4: Pomodoro Timer System
- [ ] Create `packages/api/src/types/pomodoro.ts`
  - [ ] Define `PomodoroSession` interface
  - [ ] Define `TaskReference` type
- [ ] Create `packages/api/src/services/pomodoroService.ts`
  - [ ] Implement `startPomodoro()`
  - [ ] Implement `completePomodoro()`
  - [ ] Implement `startBreak()`
  - [ ] Implement `getPomodoroProgress()`
- [ ] Update `packages/api/src/routes/days.ts`
  - [ ] Implement `POST /days/:dateKey/pomodoro/start`
  - [ ] Implement `POST /days/:dateKey/pomodoro/:sessionId/complete`
  - [ ] Implement `POST /days/:dateKey/pomodoro/:sessionId/break`
  - [ ] Implement `GET /days/:dateKey/pomodoro/progress`
- [ ] Create `packages/api/src/services/__tests__/pomodoroService.test.ts`
- [ ] Run tests and verify pomodoro works

### Step 5.5: Day Close Workflow
- [ ] Update `packages/api/src/services/dayWorkflowService.ts`
  - [ ] Implement `getDayCloseStatus()`
  - [ ] Implement `updateDayCloseChecklist()`
  - [ ] Implement `submitReflection()`
  - [ ] Implement `closeDay()` (in workflow service)
- [ ] Update `packages/api/src/routes/days.ts`
  - [ ] Implement `GET /days/:dateKey/close/status`
  - [ ] Implement `PATCH /days/:dateKey/close/checklist`
  - [ ] Implement `PUT /days/:dateKey/close/reflection`
  - [ ] Implement `POST /days/:dateKey/close`
- [ ] Create `packages/api/src/services/__tests__/dayWorkflow.close.test.ts`
- [ ] Run tests and verify day close works

### Step 5.6: Daily System Integration Test
- [ ] Create `packages/api/src/__tests__/daily.integration.test.ts`
  - [ ] Test complete day flow (15 steps)
  - [ ] Test workflow order enforcement
  - [ ] Test auto-close simulation
  - [ ] Test pomodoro limits
- [ ] Wire up day routes in `server.ts`
- [ ] Run all tests
- [ ] Verify daily system complete

---

## Phase 6: Sync & Offline Support

### Step 6.1: Sync Data Model
- [ ] Create `packages/shared/src/types/sync.ts`
  - [ ] Define `SyncMutation` type
  - [ ] Define `SyncPushRequest` type
  - [ ] Define `SyncPushResponse` type
  - [ ] Define `SyncMutationResult` type
  - [ ] Define `SyncPullRequest` type
  - [ ] Define `SyncPullResponse` type
- [ ] Create `packages/api/src/services/syncService.ts`
  - [ ] Implement `processPushMutations()`
  - [ ] Implement `getChangedDocuments()`
- [ ] Verify index on `server_received_at` exists
- [ ] Create `packages/api/src/services/__tests__/syncService.test.ts`
- [ ] Run tests and verify sync service works

### Step 6.2: Sync API Endpoints
- [ ] Create `packages/api/src/schemas/sync.ts`
  - [ ] Define `SyncPushSchema`
  - [ ] Define `SyncPullQuerySchema`
- [ ] Create `packages/api/src/routes/sync.ts`
  - [ ] Implement `POST /sync/push`
  - [ ] Implement `GET /sync/pull`
  - [ ] Implement `POST /sync/full`
  - [ ] Add rate limiting (100 mutations, 1000 documents)
- [ ] Wire up routes in `server.ts`
- [ ] Create `packages/api/src/routes/__tests__/sync.test.ts`
- [ ] Run tests and verify sync endpoints work

### Step 6.3: Client Sync Implementation (Shared)
- [ ] Create `packages/shared/src/sync/outbox.ts`
  - [ ] Implement `OutboxManager` class
  - [ ] Implement `add()`
  - [ ] Implement `getAll()`
  - [ ] Implement `remove()`
  - [ ] Implement `clear()`
  - [ ] Implement `getPendingCount()`
- [ ] Create `packages/shared/src/sync/syncClient.ts`
  - [ ] Implement `SyncClient` class
  - [ ] Implement `push()`
  - [ ] Implement `pull()`
  - [ ] Implement `fullSync()`
- [ ] Create `packages/shared/src/sync/syncManager.ts`
  - [ ] Implement `SyncManager` class
  - [ ] Implement `queueMutation()`
  - [ ] Implement `sync()`
  - [ ] Implement `startAutoSync()`
  - [ ] Implement `stopAutoSync()`
  - [ ] Implement `getLastSyncTime()`
  - [ ] Implement `getSyncStatus()`
- [ ] Create `packages/shared/src/sync/conflictHandler.ts`
- [ ] Create `packages/shared/src/sync/__tests__/syncManager.test.ts`
- [ ] Run tests and verify client sync works

### Step 6.4: Offline Queue & Retry Logic
- [ ] Update `packages/shared/src/sync/outbox.ts`
  - [ ] Add retry count tracking
  - [ ] Add last attempt time tracking
  - [ ] Implement `getNextBatch()`
  - [ ] Implement `markFailed()`
  - [ ] Implement `shouldRetry()`
- [ ] Create `packages/shared/src/sync/retryStrategy.ts`
  - [ ] Implement `getNextRetryDelay()`
  - [ ] Define `MAX_RETRIES`
- [ ] Update `packages/shared/src/sync/syncManager.ts`
  - [ ] Handle network errors
  - [ ] Use retry strategy
  - [ ] Track online/offline status
  - [ ] Emit sync events
- [ ] Create `packages/shared/src/sync/networkStatus.ts`
- [ ] Create `packages/shared/src/sync/__tests__/retryStrategy.test.ts`
- [ ] Run tests and verify retry logic works

### Step 6.5: Sync System Integration Test
- [ ] Create `packages/api/src/__tests__/sync.integration.test.ts`
  - [ ] Test basic sync flow
  - [ ] Test offline sync
  - [ ] Test conflict resolution
  - [ ] Test clock skew rejection
  - [ ] Test partial batch success
- [ ] Run all tests
- [ ] Verify sync system complete

---

## Phase 7: Accountability System

### Step 7.1: Accountability Pairing
- [ ] Create `packages/api/src/db/migrations/004_pair_requests.sql`
  - [ ] Create `accountability_pair_requests` table
- [ ] Run migration
- [ ] Create `packages/api/src/services/accountabilityService.ts`
  - [ ] Implement `createPairRequest()`
  - [ ] Implement `acceptPairRequest()`
  - [ ] Implement `rejectPairRequest()`
  - [ ] Implement `removePair()`
  - [ ] Implement `getPartner()`
  - [ ] Implement `hasPendingRequest()`
- [ ] Create `packages/api/src/routes/accountability.ts`
  - [ ] Implement `POST /accountability/request`
  - [ ] Implement `GET /accountability/requests`
  - [ ] Implement `POST /accountability/requests/:id/accept`
  - [ ] Implement `POST /accountability/requests/:id/reject`
  - [ ] Implement `DELETE /accountability/pair`
  - [ ] Implement `GET /accountability/partner`
- [ ] Create `packages/api/src/services/__tests__/accountabilityService.test.ts`
- [ ] Run tests and verify pairing works

### Step 7.2: Partner Summary View
- [ ] Update `packages/api/src/services/accountabilityService.ts`
  - [ ] Implement `getPartnerSummary()`
  - [ ] Implement `updateDailyStatusSummary()`
- [ ] Create `packages/api/src/jobs/updateSummaries.ts`
- [ ] Update `packages/api/src/routes/accountability.ts`
  - [ ] Implement `GET /accountability/partner/summary`
- [ ] Verify RLS policies for summary access
- [ ] Create `packages/api/src/services/__tests__/accountabilityService.summary.test.ts`
- [ ] Run tests and verify summary works
- [ ] Verify privacy is enforced

### Step 7.3: Daily Check-ins
- [ ] Create `packages/api/src/schemas/accountability.ts`
  - [ ] Define `CheckinSchema` (max 500 chars)
- [ ] Update `packages/api/src/services/accountabilityService.ts`
  - [ ] Implement `createCheckin()`
  - [ ] Implement `getCheckins()`
  - [ ] Implement `getTodayCheckin()`
- [ ] Update `packages/api/src/routes/accountability.ts`
  - [ ] Implement `POST /accountability/checkin`
  - [ ] Implement `GET /accountability/checkins`
- [ ] Create `packages/api/src/services/__tests__/accountabilityService.checkin.test.ts`
- [ ] Run tests and verify check-ins work

### Step 7.4: Accountability Integration Test
- [ ] Create `packages/api/src/__tests__/accountability.integration.test.ts`
  - [ ] Test full pairing flow (10 steps)
  - [ ] Test privacy enforcement
  - [ ] Test one partner limit
  - [ ] Test check-in limits
- [ ] Wire up accountability routes in `server.ts`
- [ ] Run all tests
- [ ] Verify accountability system complete

---

## Phase 8: Notifications & Analytics

### Step 8.1: Push Notification Infrastructure
- [ ] Create `packages/api/src/db/migrations/005_device_tokens.sql`
  - [ ] Create `push_device_tokens` table
- [ ] Run migration
- [ ] Create `packages/api/src/services/notificationService.ts`
  - [ ] Implement `registerDevice()`
  - [ ] Implement `unregisterDevice()`
  - [ ] Implement `sendPushNotification()`
  - [ ] Implement `sendEmail()`
- [ ] Create `packages/api/src/routes/notifications.ts`
  - [ ] Implement `POST /notifications/register-device`
  - [ ] Implement `DELETE /notifications/devices/:deviceId`
- [ ] Wire up routes in `server.ts`
- [ ] Create `packages/api/src/services/__tests__/notificationService.test.ts`
- [ ] Run tests and verify notification infrastructure works

### Step 8.2: Scheduled Notifications
- [ ] Create `packages/api/src/jobs/notificationJobs.ts`
  - [ ] Implement day start reminder job
  - [ ] Implement day close reminder job
  - [ ] Implement partner closed notification
- [ ] Create `packages/api/src/jobs/scheduler.ts`
  - [ ] Set up job scheduler
  - [ ] Register notification jobs
- [ ] Update day close flow to trigger partner notification
- [ ] Create `packages/api/src/jobs/__tests__/notificationJobs.test.ts`
- [ ] Run tests and verify scheduled notifications work

### Step 8.3: Missed Days Escalation
- [ ] Create `packages/api/src/services/missedDaysService.ts`
  - [ ] Implement `getMissedDays()`
  - [ ] Implement `getConsecutiveMissedCount()`
  - [ ] Implement `isMissedDay()`
- [ ] Create `packages/api/src/jobs/missedDaysJob.ts`
  - [ ] Implement missed day detection
  - [ ] Send push notification for 2+ missed
  - [ ] Send email notification for 2+ missed
- [ ] Add to scheduler
- [ ] Create `packages/api/src/jobs/__tests__/missedDaysJob.test.ts`
- [ ] Run tests and verify missed days escalation works

### Step 8.4: Analytics Service
- [ ] Create `packages/api/src/services/analyticsService.ts`
  - [ ] Implement `getDayClosedRate()`
  - [ ] Implement `getDayStartAdherence()`
  - [ ] Implement `getDayCloseAdherence()`
  - [ ] Implement `getLifePillarAdherence()`
  - [ ] Implement `getPomodoroUtilization()`
  - [ ] Implement `getCurrentStreaks()`
  - [ ] Implement `getCorrelations()`
- [ ] Create `packages/api/src/routes/analytics.ts`
  - [ ] Implement `GET /analytics/completion-rates`
  - [ ] Implement `GET /analytics/pomodoro-stats`
  - [ ] Implement `GET /analytics/streaks`
  - [ ] Implement `GET /analytics/correlations`
  - [ ] Implement `GET /analytics/calendar-heatmap`
- [ ] Wire up routes in `server.ts`
- [ ] Create `packages/api/src/services/__tests__/analyticsService.test.ts`
- [ ] Run tests and verify analytics work

### Step 8.5: Final Integration & MVP Verification
- [ ] Create `packages/api/src/__tests__/mvp.integration.test.ts`
  - [ ] Test complete user journey (13 steps)
  - [ ] Test offline sync journey
  - [ ] Test accountability journey
  - [ ] Test admin journey
- [ ] MVP Checklist Verification:
  - [ ] User onboarding works
  - [ ] Quarter Start Strong works
  - [ ] Today screen end-to-end works
  - [ ] Days open 24h early
  - [ ] Days lock after 48h
  - [ ] Manual close requires reflection
  - [ ] Auto-close works
  - [ ] Pomodoro timer triggers notifications
  - [ ] Offline edits persist and sync
  - [ ] Accountability pairing works
  - [ ] Partner sees only summary
  - [ ] Partner can leave check-in
  - [ ] Analytics shows charts and correlations
  - [ ] Admin can create/block/delete users
  - [ ] Admin cannot read journal content
  - [ ] Error handling conforms to contract
- [ ] Remove all TODO comments from code
- [ ] Document known limitations
- [ ] Run full test suite: `pnpm test`
- [ ] All tests pass

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

- 
- 
- 

---

## Questions/Blockers (Track as needed)

- [ ] 
- [ ] 
- [ ] 
