# Backend Payload Validation Guide (Postman)

This guide lists the most common request validations that cause `400` errors.

## Collection Coverage Check
The Postman collection already includes all Pillar 2 core endpoints:
- `POST /api/events`
- `PATCH /api/events/:id`
- `DELETE /api/events/:id`
- `POST /api/events/:id/rsvp`
- `DELETE /api/events/:id/rsvp`
- `GET /api/users/me/rsvps`
- `GET /api/users/me/events`
- `GET /api/events/calendar?month=YYYY-MM`
- `GET /api/events/:id/comments`
- `POST /api/events/:id/comments`
- `POST /api/media/upload`
- `POST /api/notifications/event-reminder` (admin)

---

## 1) `POST /accounts` (form-data)
Required:
- `profileImage` file (jpg/png/webp)
- `name` min 2
- `email` valid email
- `mobileNumber` min 8 max 15
- `completeAddress` min 10
- `pincode` 4-10 digits
- `occupation` min 2

Optional:
- `city` min 2
- `state` min 2
- `country` min 2
- `language` min 2
- `expoPushToken` must match Expo token format

Common failures:
- `PROFILE_IMAGE_REQUIRED`
- invalid email
- invalid pincode regex

---

## 2) `POST /api/events` (JSON)
Required:
- `title` min 3
- `description` min 10
- `startAt` valid datetime
- `endAt` valid datetime
- `address` min 5
- `latitude` between `-90..90`
- `longitude` between `-180..180`

Optional:
- `type` enum: `bhajan|pooja|seva|medical|satsang|darshan|general`
- `bannerUrl` valid URL
- `timezone` min 3 (default `Asia/Kolkata`)
- `venueName` min 2
- `city/state/country` min 2

Business rule:
- `endAt >= startAt`

Auth:
- `x-user-id` required

---

## 3) `PATCH /api/events/:id` (JSON)
At least one field is required.

If provided:
- `title` min 3
- `description` min 10
- `bannerUrl` must be URL (or `null`)
- `venueName/city/state` allow `null` but if string then min 2
- `address` min 5
- `latitude/longitude` valid ranges
- `endAt >= startAt` (if both sent, or effective values after merge)

Auth/permission:
- `x-user-id` required
- only event owner or admin can update

---

## 4) `POST /api/events/:id/comments` (JSON)
Required:
- `content` min 1 max 1000

Auth:
- `x-user-id` required

Common failure:
- empty string comment

---

## 5) `POST /api/media/upload` (form-data)
Accepted keys:
- single: `file`
- multiple: `files` (up to 10)

Allowed MIME:
- images: jpeg/png/webp
- video: mp4/quicktime
- audio: mpeg/mp4/wav/webm

Limits:
- max 10 files
- max 150MB per file

Auth:
- `x-user-id` required

Common failures:
- `FILE_REQUIRED`
- `INVALID_MEDIA_FILE`

---

## 6) `POST /api/users/me/push-token` (JSON)
Required:
- `token` must match Expo token format

Optional:
- `platform` min 2 max 20

Auth:
- `x-user-id` required

---

## 7) `POST /api/notifications/event-reminder` (JSON)
Body options:
- `{ "eventId": "..." }` to schedule for one event
- `{ "daysAhead": 30 }` to schedule upcoming events
- `{}` allowed (defaults `daysAhead=30`)

Auth/permission:
- `x-user-id` required
- user must be admin (`mandir_admin` or `super_admin`)

---

## 8) Directory Listing APIs

### `POST /api/directory/listings` (JSON)
Required:
- `businessName` min 2 max 120
- `categoryId` must be an active Directory category
- `description` min 20 max 3000
- `phoneNumber` or `whatsappNumber` required
- `address` min 5
- `city` min 2

Optional:
- `tagline` max 160
- `yearsOfExperience` integer `0..100`
- `homeServiceAvailable` boolean
- `communityRecommendationEnabled` boolean
- `email` valid email
- `websiteUrl` valid URL
- `pincode` 4-10 digits
- `latitude` `-90..90`
- `longitude` `-180..180`
- `subcategories`, `specialties` max 12 items, each max 40 chars
- `tags` max 20 items, each max 40 chars
- `serviceAreas` max 20 items, each max 80 chars
- `logoUrl`, `bannerUrl`, `galleryUrls[]` must be URLs
- `galleryUrls` max 10

Auth:
- `x-user-id` required

Business rule:
- New listings default to `pending_review`; admin approval is required before public discovery.

### `PATCH /api/directory/listings/:id` (JSON)
At least one field is required.

Auth/permission:
- `x-user-id` required
- owner or admin only

### `POST /api/directory/listing-drafts` and `PATCH /api/directory/listing-drafts/:id` (JSON)
Partial listing payload is allowed.

Publish rule:
- `POST /api/directory/listing-drafts/:id/publish` validates the full create-listing payload.

### Directory media upload
Use:
- `POST /api/media/upload` with `multipart/form-data`
- set `context=directory`
- use file keys `file` or repeated `files`

Directory media rule:
- directory context accepts image files only
- max 10 files
- create/update listing APIs should send returned `logoUrl`, `bannerUrl`, or `galleryUrls`

---

## 10) Sangha APIs

### `PATCH /api/users/me/sangha-discovery` (JSON)
Optional:
- `nearMeEnabled` boolean
- `tradition` max 80
- `purposeTags` max 10 items, each max 40 chars
- `interests` max 20 items, each max 40 chars
- `bio` max 500
- `quote` max 200
- `profileVisibility` enum: `public|members_only|connections_only|private`
- `city/state/country` min 2 when provided
- `latitude` `-90..90`
- `longitude` `-180..180`

Auth:
- `x-user-id` required

### `POST /api/sangha/groups` (JSON)
Required:
- `name` min 3 max 80

Optional:
- `purpose` enum: `city_chapter|seva|bhajan|online_global|satsang|study|general`
- `privacy` enum: `public|private|invite_only`
- `description` max 1000
- `guidelines` max 2000
- `purposeText` max 500
- `city/state/country` min 2 when provided
- `bannerUrl`, `iconUrl` valid URL

Auth:
- `x-user-id` required

Media rule:
- upload images first with `POST /api/media/upload` using `context=sangha`
- pass returned URL as `bannerUrl`, `iconUrl`, `media[]`, or `mediaUrls[]`

### `POST /api/sangha/groups/:id/posts` (JSON)
Required:
- one of `content`, `eventId`, `media`, or `mediaUrls`

Optional:
- `type` enum: `text|photo|event_share|notice`
- `content` max 3000
- `media` max 10 items
- `mediaUrls` max 10 URLs

Auth/permission:
- active group member required

### `POST /api/sangha/groups/:id/events` (JSON)
Required:
- `title` min 3 max 120
- `startAt` valid datetime

Optional:
- `type` enum: `bhajan|seva|satsang|study|general`
- `endAt` must be after `startAt`
- `timezone` min 3 max 64
- `venueName` or `address` required for offline events
- `onlineUrl` required when `isOnline=true`

Auth/permission:
- group moderator/admin/owner required

### `POST /api/sangha/live-streams` (JSON)
Required:
- `title` min 3 max 120

Optional:
- `groupId`
- `eventId`
- `description` max 1000
- `type` enum: `bhajan|satsang|pravachan|seva_orientation|announcement|general`
- `visibility` enum: `public|group_members|invite_only`
- `scheduledAt` valid datetime
- `thumbnailUrl` valid URL
- `provider` min 2 max 40
- `chatEnabled` boolean
- `reactionsEnabled` boolean

Business rule:
- `groupId` is required when `visibility` is not `public`

Auth/permission:
- if `groupId` is provided, group moderator/admin/owner required

### Live stream chat/reactions
Chat:
- `POST /api/sangha/live-streams/:id/chat`
- `content` min 1 max 500

Reaction:
- `POST /api/sangha/live-streams/:id/reactions`
- `reaction` enum: `om|heart|namaste|clap|blessing`

Auth/permission:
- stream must be live
- user must be allowed to view stream

Rate limit:
- live heartbeat/chat/reaction: 120 requests per minute

### Admin Sangha APIs
Auth:
- `x-user-id` required
- user role must be `mandir_admin` or `super_admin`

Important payloads:
- `POST /api/admin/sangha/groups`: requires `ownerUserId` and `name`
- `PATCH /api/admin/sangha/groups/:id/members/:memberId`: `role=admin|moderator|seva_lead|member`
- `POST /api/admin/sangha/reports/:id/resolve`: `status=resolved|dismissed`
- `POST /api/admin/sangha/announcements`: `groupId`, `title` min 3 max 120, `body` min 1 max 500

Common failures:
- non-admin user receives `403`
- owner role cannot be changed or removed
- live stream chat delete returns `404` if message does not belong to stream

---

## 9) Directory Search, Reviews, Reports, And Admin

### `GET /api/directory/search`
Required:
- `q` min 1 max 100

Optional:
- `categoryId`
- `city`
- `lat` `-90..90`
- `lng` `-180..180`
- `radiusKm` max 100
- `limit` max 50
- `offset` min 0

Rate limit:
- 60 requests per minute per authenticated user or IP

### `POST /api/directory/listings/:id/contact`
Required:
- `channel` enum: `call|whatsapp|email|in_app`

Optional:
- `message` max 1000

Auth:
- `x-user-id` required

Rate limit:
- 20 requests per hour per authenticated user

### `POST /api/directory/listings/:id/reviews`
Required:
- `rating` integer `1..5`
- `content` min 10 max 2000

Rules:
- owner cannot review own listing
- one review per user per listing
- user must contact/enquire before reviewing

Rate limit:
- 10 review create attempts per hour per authenticated user

### `POST /api/directory/listings/:id/report`
Required:
- `reason` enum: `spam|inappropriate|scam|duplicate|wrong_info|other`

Optional:
- `details` min 5 max 1000

Rules:
- owner cannot report own listing
- one report per user per listing; repeat report refreshes the existing report to `pending`

Rate limit:
- 10 report attempts per hour per authenticated user

### Admin Directory endpoints
Auth:
- `x-user-id` required
- user must be admin (`mandir_admin` or `super_admin`)

Admin category management:
- `POST /api/admin/directory/categories`: `name` min 2 max 80
- `PATCH /api/admin/directory/categories/:id`: at least one field required
- `DELETE /api/admin/directory/categories/:id`: soft delete, sets `isActive=false`

Admin report resolve:
- `status` enum: `resolved|dismissed`
- `note` max 1000

Admin notification trigger:
- `POST /api/notifications/directory-listing-status`
- `status` enum: `submitted|approved|rejected|verified|suspended|report_resolved`
- `message` optional max 300

---

## Quick Debug Checklist for POST Failures
1. Confirm `x-user-id` is set where required.
2. Check `Content-Type` is correct:
   - JSON endpoints => `application/json`
   - upload endpoints => `form-data`
3. Validate min-length fields (`title`, `description`, `name`, etc.).
4. Validate enum values (`type`, category fields).
5. Validate date order (`endAt` not before `startAt`).
6. For uploads, confirm file key name and MIME type.
7. For admin endpoint, confirm `adminId` is a real admin user.
