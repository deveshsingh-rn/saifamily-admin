# Admin API Implementation and Test TODO

Source: `postman-api-collection.json`

Last audit: June 25, 2026

## Test configuration

- Backend: `http://localhost:4000`
- Admin login: `POST /api/auth/mobile/verify-otp`
- Development mobile: `+910000000000`
- Development OTP: `7664`
- Expected role: `super_admin`
- Expected user ID: `cmovc8tcp0000l5hu2dw7umps`
- Frontend API URL: `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api`

> The collection currently defines `adminMobileNumber` as `+919999999999`.
> Use `+910000000000` for the verified local admin until the collection variable is corrected.

## Status legend

- [ ] Not implemented or not tested
- [x] Verified
- [~] Existing frontend code found; integration still needs verification
- [!] Blocked

## Current test result

- [x] Backend connectivity: `localhost:4000` is reachable.
- [x] CORS preflight from `http://localhost:3000` returns HTTP `204`.
- [x] CORS permits the `authorization` and `content-type` headers with credentials.
- [x] Admin OTP login returns HTTP `200` and provides `tokens.accessToken`.
- [x] Authenticated user ID is `cmovc8tcp0000l5hu2dw7umps`.
- [x] Authenticated role is `super_admin`.
- [x] All 14 safe admin GET endpoints return HTTP `200`.
- [x] A protected admin request without a token returns HTTP `401`.
- [x] Refresh-token rotation returns HTTP `200`.
- [x] A rotated access token authorizes protected admin requests.
- [x] Logout revokes the refresh token.
- [x] Reusing a revoked refresh token returns HTTP `401`.
- [ ] Run mutation tests only with disposable fixtures.

## Phase 1 — Authentication and authorization

- [x] `POST /api/auth/mobile/verify-otp`
  - Submit `{ "mobileNumber": "+910000000000", "otp": "7664" }`.
  - Store `tokens.accessToken` and `tokens.refreshToken`.
  - Store `user.id` and `user.role`.
  - Reject non-admin roles in the admin frontend.
- [x] Add `Authorization: Bearer <accessToken>` to protected API requests.
- [x] Clear access token, refresh token, user ID, and role on logout.
- [~] Restore an authenticated session after a browser refresh.
  - Redux hydration is implemented; browser navigation still needs UI verification.
- [x] Implement refresh-token handling and one-time retry for expired access tokens.
  - Concurrent `401` responses share one refresh request.
  - Failed refresh clears local authentication and emits a session-expired event.
- [x] Revoke the refresh token through `POST /api/auth/logout`.
- [x] Verify the backend returns `401` when the access token is missing.
- [ ] Verify the frontend redirects to `/login` after a `401`.
- [ ] Verify `403` handling displays an authorization error without retry loops.

## Phase 2 — Safe read-only API tests

These requests should be tested first because they do not intentionally modify backend data.

### Users

- [x] `GET /api/admin/users?limit=20&offset=0` — HTTP `200`, 20 users.
  - Verify pagination metadata and user list shape.
  - Verify search/filter query parameters used by the frontend.
  - Verify the known admin user appears when applicable.

### Content

- [x] `GET /api/admin/content?limit=20&offset=0` — HTTP `200`, 20 experiences.
  - Verify content list, author data, pagination, and filters.

### Experience categories

- [x] `GET /api/admin/categories` — HTTP `200`, 6 categories.
  - Verify category identifiers, labels, and active state.

### Directory moderation

- [x] `GET /api/admin/directory/reviews?limit=20&offset=0` — HTTP `200`, 9 reviews.
  - Test `status`, `rating`, `listingId`, and `q` filters.
- [x] `GET /api/admin/directory/analytics?days=30` — HTTP `200`.
  - Verify dashboard metric names and numeric values.
- [x] `GET /api/admin/directory/audit-logs?limit=50&offset=0` — HTTP `200`, 48 logs.
  - Test `actorId`, `entity`, `entityId`, and `action` filters.
- [x] `GET /api/admin/directory/reports?status=pending&limit=20&offset=0` — HTTP `200`, 1 pending report.
  - Test pending, resolved, and dismissed statuses.
- [x] `GET /api/admin/directory/listings?status=pending_review&limit=20&offset=0` — HTTP `200`, 1 pending listing.
  - Test `status`, `verificationStatus`, `categoryId`, `q`, and `city`.

### Sangha

- [x] `GET /api/admin/sangha/groups?limit=20&offset=0` — HTTP `200`, 9 groups.
  - Verify pagination and group summary shape.
- [x] `GET /api/admin/sangha/groups/:id` — HTTP `200`.
  - Test script obtains a valid group ID from the group list without logging it.
- [x] `GET /api/admin/sangha/reports?limit=20&offset=0` — HTTP `200`, 2 reports.
  - Verify report status and target data.
- [x] `GET /api/admin/sangha/live-streams?limit=20&offset=0` — HTTP `200`, 2 streams.
  - Verify active and ended stream data.
- [x] `GET /api/admin/sangha/analytics?days=30` — HTTP `200`.
  - Verify dashboard metric names and numeric values.
- [x] `GET /api/admin/sangha/audit-logs?limit=50&offset=0` — HTTP `200`, 4 logs.
  - Verify audit actor, action, entity, and timestamps.

## Phase 3 — Mutation API tests

Use dedicated test records. Do not mutate real users, content, listings, reviews, reports, groups, or live streams.

### User management

- [~] `PATCH /api/admin/users/:id/status`
  - Create/select a disposable test user.
  - Test ban and allow transitions.
  - Verify invalid user ID and repeated-state behavior.

### Content management

- [~] `DELETE /api/admin/content/:id`
  - Create disposable content first.
  - Verify deletion and missing-content behavior.

### Experience category management

- [~] `POST /api/admin/categories`
  - Create a uniquely named test category.
- [~] `PATCH /api/admin/categories/:category`
  - Update the test category.
  - Verify duplicate and unknown category handling.

### Directory category management

- [~] `POST /api/admin/directory/categories`
  - Test required `name`.
  - Test optional `slug`, `description`, `icon`, `iconFamily`, `color`, `sortOrder`, and `isActive`.
- [~] `PATCH /api/admin/directory/categories/:id`
  - Update the disposable category created above.
- [~] `DELETE /api/admin/directory/categories/:id`
  - Verify soft deletion sets `isActive` to `false`.

### Directory review moderation

- [~] `POST /api/admin/directory/reviews/:id/approve`
- [~] `POST /api/admin/directory/reviews/:id/reject`
- [~] `POST /api/admin/directory/reviews/:id/hide`
- [~] `POST /api/admin/directory/reviews/:id/restore`
  - Create or select disposable reviews for each transition.
  - Verify invalid status transitions and missing review IDs.

### Directory report moderation

- [~] `POST /api/admin/directory/reports/:id/resolve`
  - Test `resolved` and `dismissed`.
  - Verify invalid status validation.

### Directory listing moderation

- [~] `POST /api/admin/directory/listings/:id/approve`
- [~] `POST /api/admin/directory/listings/:id/reject`
- [~] `POST /api/admin/directory/listings/:id/suspend`
- [~] `POST /api/admin/directory/listings/:id/restore`
- [~] `POST /api/admin/directory/listings/:id/verify`
- [~] `POST /api/admin/directory/listings/:id/unverify`
  - Use separate disposable listings or reset fixtures between transitions.
  - Verify returned listing status and verification status after every action.

### Sangha group management

- [~] `POST /api/admin/sangha/groups`
  - Create a uniquely named disposable group.
- [~] `PATCH /api/admin/sangha/groups/:id`
  - Update the disposable group.
- [~] `DELETE /api/admin/sangha/groups/:id`
  - Verify archive/soft-delete behavior.
- [~] `POST /api/admin/sangha/groups/:id/verify`
- [~] `POST /api/admin/sangha/groups/:id/unverify`
  - Verify official status transitions.
- [~] `PATCH /api/admin/sangha/groups/:id/members/:memberId`
  - Test supported member-role changes.
- [~] `DELETE /api/admin/sangha/groups/:id/members/:memberId`
  - Use a disposable group member.

### Sangha moderation and communication

- [~] `POST /api/admin/sangha/reports/:id/resolve`
  - Verify resolution status and optional moderation note.
- [~] `POST /api/admin/sangha/announcements`
  - Send only to a disposable test group.
  - Verify required fields and authorization.

### Sangha live-stream management

- [~] `POST /api/admin/sangha/live-streams/:id/end`
- [~] `DELETE /api/admin/sangha/live-streams/:id/recording`
- [ ] `DELETE /api/admin/sangha/live-streams/:id/chat/:messageId`
  - Create disposable stream fixtures before testing.
  - Confirm destructive actions require explicit UI confirmation.

## Phase 4 — Frontend completion

- [x] Add a reusable, non-destructive admin API smoke-test script:
  - Run `node scripts/test-admin-read-api.mjs`.
  - Override local defaults with `API_BASE_URL`, `ADMIN_MOBILE_NUMBER`, `ADMIN_OTP`, and `ADMIN_ORIGIN`.
- [x] Add an authentication lifecycle test:
  - Run `node scripts/test-admin-auth-lifecycle.mjs`.
  - Covers login, token rotation, protected access, logout, and revoked-token rejection.
- [ ] Create shared typed API contracts for:
  - Paginated responses.
  - API errors.
  - Admin user, content, category, directory, and Sangha resources.
- [ ] Consolidate duplicate root-level and `app/store/features/*` API/slice/saga files.
- [ ] Fix current TypeScript errors in the Sangha feature and missing imports.
- [ ] Make the shared `Table` component generic instead of using `any`.
- [ ] Add server-side pagination, debounced search, filters, empty states, and retry states.
- [ ] Add confirmation dialogs for destructive and moderation actions.
- [ ] Add role-based navigation and route authorization.
- [ ] Add toast feedback and normalized backend error messages.
- [ ] Add Redux Saga tests for success, validation failure, `401`, `403`, and server errors.
- [ ] Add component tests for tables, filters, pagination, and confirmation dialogs.
- [ ] Add Playwright admin flows:
  - OTP login.
  - User status update.
  - Content deletion.
  - Category CRUD.
  - Directory moderation.
  - Sangha moderation.

## Completion criteria

- [x] All 14 safe GET endpoints return expected success responses.
- [ ] All 30 mutation endpoints are tested with disposable fixtures.
- [x] Unauthorized requests return `401`.
- [ ] Authenticated non-admin requests return `403`.
- [ ] Admin pages work after browser refresh and token renewal.
- [ ] No TypeScript or ESLint errors remain in admin-related files.
- [ ] Destructive actions cannot run without confirmation.
