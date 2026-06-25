# Frontend Development TODO List

This document outlines the development plan and detailed TODO list for the Sai Family Admin frontend application, based on the `postman-api-collection.json` and the existing codebase structure.

---

## High-Level Summary of Missing Features

*   **Admin Panel**: The admin pages (`/admin/categories`, `/admin/content`, `/admin/directory`, `/admin/sangha`, `/admin/users`) are currently placeholders. They need to be fully implemented to manage users, content, categories, and the extensive "Directory" and "Sangha" features.
*   **Public-Facing App**: There are currently no user-facing pages for interacting with the "Experiences" (social feed), "Events", "Directory" (business listings), or "Sangha" (community) features. These need to be built from the ground up, likely outside the `/admin` path.
*   **State Management & API Integration**: The existing Redux slices and sagas (for auth, categories, content, users, sangha) are mostly empty shells or incomplete. They need to be fully implemented to handle all API interactions, state updates, loading states, and error handling. New Redux slices and sagas for "Events" and "Directory" are required.

---

## Proposed Development Plan & Detailed TODO List

The work is broken down into four major phases to provide a structured approach.

### Phase 1: Core Authentication & User Account Flow [COMPLETED]

**Goal**: Ensure users can securely log in and manage their own accounts.

*   **1.1 Login/Register UI**: [COMPLETED]
    *   Build the user interface for both mobile (OTP) and email/password authentication on the `/login` page.
    *   Create forms for:
        *   Sending OTP (`POST /api/auth/mobile/send-otp`)
        *   Verifying OTP/email (`POST /api/auth/mobile/verify-otp`, `POST /api/auth/email/verify`)
        *   User registration (`POST /api/auth/email/register`)
        *   Email login (`POST /api/auth/email/login`)
        *   Resending email verification (`POST /api/auth/email/resend-verification`)
    *   Implement client-side validation for all forms.
*   **1.2 Auth Logic (Redux/Saga)**: [COMPLETED]
    *   Fully implement the Redux Saga workflows in `app/store/features/auth/authSaga.ts` for all authentication API calls (`sendOtp`, `verifyOtp`, `register`, `verifyEmail`, `login`, `logout`).
    *   Ensure the `app/store/features/auth/authSlice.ts` correctly handles authentication state (e.g., `isLoggedIn`, `user`, `tokens`), loading states, and errors.
*   **1.3 User Account Creation**: [COMPLETED]
    *   Create a "Create Account" page (e.g., `/account/create`) that new users are redirected to after initial registration/verification.
    *   This page will have a form to capture user details (name, complete address, pincode, occupation, city, state, country, language, profile image).
    *   Implement the API call to `POST /accounts` to create the user's detailed account.
*   **1.4 Route Protection (`withAuth.tsx`)**: [COMPLETED]
    *   Review and ensure the `app/store/withAuth.tsx` Higher-Order Component (HOC) correctly protects authenticated routes.
    *   Verify it handles redirection for unauthenticated users.
    *   **TODO**: Implement a robust token refreshing mechanism. This involves creating an Axios interceptor to catch 401 errors, dispatching a `refreshToken` action, and retrying the original request.

### Phase 2: Admin Dashboard Foundation [COMPLETED]

**Goal**: Build the basic structure and reusable components for the admin section.

*   **2.1 Admin Layout**: [COMPLETED]
    *   Design and build the main admin layout in `app/admin/layout.tsx`. This should include a sidebar or navigation menu that links to all administrative sections (Users, Content, Categories, Directory, Sangha).
    *   Implement basic header/footer for the admin panel.
*   **2.2 Reusable Components**: [COMPLETED]
    *   Create a generic `Table` component suitable for displaying paginated lists of data across various admin sections.
    *   Create a `Pagination` component that integrates with the table for server-side pagination.
*   **2.3 Basic Admin Pages**: [COMPLETED]
    *   Implement the basic functionality for the `Users` page to fetch and display a paginated list of users.
    *   **NOTE**: The pattern established for the `Users` page (slice, saga, page component with Table and Pagination) should be replicated for the other admin sections (`Content`, `Categories`, etc.) as we implement them.

### Phase 3: Complete Admin Functionality

**Goal**: Implement all specific administrative features as defined by the API.

*   **3.1 User Management (`app/admin/users`)**: [COMPLETED]
    *   Implement advanced search and filtering options for users (`GET /api/admin/users`). [COMPLETED]
    *   Implement functionality to ban/unban users, including a confirmation dialog (`PATCH /api/admin/users/:id/status`). [COMPLETED]
*   **3.2 Content Management (`app/admin/content`)**:
    *   Implement list, search, and filtering for "Experiences" (`GET /api/admin/content`).
    *   Implement functionality to delete content (`DELETE /api/admin/content/:id`).
*   **3.3 Category Management (`app/admin/categories`)**: [COMPLETED]
    *   Implement list, create (`POST /api/admin/categories`), and update (`PATCH /api/admin/categories/:category`) functionality for "Experience" categories. [COMPLETED]
    *   Build forms for creating and editing categories. [COMPLETED]
*   **3.4 Directory Management (New Feature - Admin Side)**:
    *   **Redux/Saga**: Create `app/store/features/directory/directorySlice.ts` and `app/store/features/directory/directorySaga.ts`. [COMPLETED]
    *   **Directory Categories**: Implement CRUD operations for Directory Categories (`POST /api/admin/directory/categories`, `PATCH /api/admin/directory/categories/:id`, `DELETE /api/admin/directory/categories/:id`). [COMPLETED]
    *   **Reviews Moderation**: Build UI for viewing and moderating Directory Reviews (`GET /api/admin/directory/reviews`). Implement actions to approve, reject, hide, and restore reviews. [COMPLETED]
    *   **Reports Moderation**: Build UI for viewing and resolving Directory Reports (`GET /api/admin/directory/reports`). Implement actions to resolve/dismiss reports. [COMPLETED]
    *   **Listing Moderation**: Build UI for viewing and managing Directory Listings (`GET /api/admin/directory/listings`). Implement actions to approve, reject, suspend, restore, verify, and unverify listings. [COMPLETED]
    *   **Analytics & Audit Logs**: Create pages to display Directory Analytics (`GET /api/admin/directory/analytics`) and Audit Logs (`GET /api/admin/directory/audit-logs`). [COMPLETED]
*   **3.5 Sangha Management (Expand Feature - Admin Side)**:
    *   Expand `app/store/features/sangha/sanghaSlice.ts` and `app/store/features/sangha/sanghaSaga.ts` to cover all admin endpoints.
    *   **Group Management**: Implement CRUD operations for Sangha Groups (`POST /api/admin/sangha/groups`, `PATCH /api/admin/sangha/groups/:id`, `DELETE /api/admin/sangha/groups/:id`).
    *   **Group Member Management**: Implement UI for updating member roles and removing members (`PATCH /api/admin/sangha/groups/:id/members/:memberId`, `DELETE /api/admin/sangha/groups/:id/members/:memberId`).
    *   **Group Verification**: Implement actions to verify/unverify groups (`POST /api/admin/sangha/groups/:id/verify`, `POST /api/admin/sangha/groups/:id/unverify`).
    *   **Reports Moderation**: Build UI for viewing and resolving Sangha Reports (`GET /api/admin/sangha/reports`).
    *   **Announcements**: Implement a form to send announcements to groups (`POST /api/admin/sangha/announcements`).
    *   **Live Stream Management**: Build UI for listing, ending, removing recordings, and deleting chat messages for live streams.
    *   **Analytics & Audit Logs**: Create pages to display Sangha Analytics (`GET /api/admin/sangha/analytics`) and Audit Logs (`GET /api/admin/sangha/audit-logs`).
*   **3.6 Notifications (Admin)**:
    *   Implement UI to send event reminders and directory listing status notifications (`POST /api/notifications/event-reminder`, `POST /api/notifications/directory-listing-status`).

### Phase 4: Public-Facing Application Features

**Goal**: Build the user-facing side of the application, likely creating new pages outside the `/admin` route.

*   **4.1 "Experiences" Feed**:
    *   Create a main feed page (e.g., `/experiences`) to display "leelas" (experiences).
    *   Implement infinite scrolling, search, and category filtering (`GET /api/experiences`).
    *   Build UI for creating new posts (`POST /api/experiences`, handling media uploads via `POST /api/media/upload`).
    *   Create a detail page for individual experiences (`GET /api/experiences/:id`).
    *   Implement user interactions: like, comment, repost, bookmark (`POST /api/experiences/:id/like`, `POST /api/experiences/:id/comments`, `POST /api/experiences/:id/repost`, `POST /api/experiences/:id/bookmark`).
    *   Implement "My Bookmarks" page (`GET /api/users/me/bookmarks`).
    *   Implement post updating and deletion (`PATCH /api/experiences/:id`, `DELETE /api/experiences/:id`).
*   **4.2 "Events" Feature (New Feature - Public Side)**:
    *   **Redux/Saga**: Create `app/store/features/events/eventsSlice.ts` and `app/store/features/events/eventsSaga.ts`.
    *   **Event Discovery**: Build event discovery pages (e.g., `/events`) including home sections (`GET /api/events/home`), nearby events (`GET /api/events/nearby`), and recommendations (`GET /api/events/recommendations`).
    *   **Event Creation**: Implement the full event creation flow (`POST /api/events/drafts`, `PATCH /api/events/drafts/:id`, `POST /api/events/drafts/:id/publish`, `POST /api/events`) including title suggestions (`POST /api/events/suggestions/title`) and venue search (`GET /api/places/search`).
    *   **Event Detail Page**: Create a detailed event view (`GET /api/events/:id`).
    *   **User Interactions**: Implement RSVP (`POST /api/events/:id/rsvp`, `DELETE /api/events/:id/rsvp`), bookmarking (`POST /api/events/:id/bookmark`, `DELETE /api/events/:id/bookmark`), submitting reviews (`POST /api/events/:id/reviews`), uploading photos (`POST /api/events/:id/photos`), and tracking shares.
    *   **Organizer Tools**: Implement attendee list (`GET /api/events/:id/attendees`) and analytics (`GET /api/events/:id/analytics`) for event organizers.
    *   **Calendar Integration**: Implement user calendar preferences (`GET /api/users/me/calendar/preferences`, `PATCH /api/users/me/calendar/preferences`) and ICS download (`GET /api/users/me/calendar.ics`).
    *   **Community Calendars**: Build UI for discovering and subscribing to community calendars.
    *   **My Events/RSVPs**: Create pages to view user's RSVPs (`GET /api/users/me/rsvps`), created events (`GET /api/users/me/events`), and bookmarked events (`GET /api/users/me/event-bookmarks`).
    *   **Cancel Event**: Implement event cancellation (`DELETE /api/events/:id`).
*   **4.3 "Directory" Feature (Public Side)**:
    *   Build the public-facing Directory pages (e.g., `/directory`).
    *   Implement search (`GET /api/directory/search`), search suggestions (`GET /api/directory/search/suggestions`), category browsing (`GET /api/directory/categories`), and a directory home page (`GET /api/directory/home`).
    *   Create a detailed listing page (`GET /api/directory/listings/:id`).
    *   Implement user interactions: writing reviews (`POST /api/directory/listings/:id/reviews`), bookmarking (`POST /api/directory/listings/:id/bookmark`), recommending (`POST /api/directory/listings/:id/recommend`), contacting (`POST /api/directory/listings/:id/contact`), and reporting a listing (`POST /api/directory/listings/:id/report`).
    *   Implement "My Listings" (`GET /api/users/me/directory/listings`), "My Bookmarks" (`GET /api/users/me/directory/bookmarks`), and "Recent Searches" (`GET /api/users/me/directory/recent-searches`) pages.
    *   Implement the creation and publishing of directory listing drafts (`POST /api/directory/listing-drafts`, `PATCH /api/directory/listing-drafts/:id`, `POST /api/directory/listing-drafts/:id/publish`).
    *   Implement updating and deleting own listings (`PATCH /api/directory/listings/:id`, `DELETE /api/directory/listings/:id`).
*   **4.4 "Sangha" Feature (Public Side)**:
    *   Build "Sangha" discovery pages (e.g., `/sangha`) for finding devotees and groups.
    *   Implement user profile updates for discovery settings (`PATCH /api/users/me/sangha-discovery`).
    *   Build devotee list and profile pages (`GET /api/sangha/devotees`, `GET /api/sangha/devotees/:id`).
    *   Implement the connection lifecycle (request, accept, decline, disconnect, block).
    *   Build group home page (`GET /api/sangha/groups/home`), group search (`GET /api/sangha/groups/search`), and group list pages (`GET /api/sangha/groups`).
    *   Implement group creation (`POST /api/sangha/groups`) and detail pages (`GET /api/sangha/groups/:id`).
    *   Implement group joining (`POST /api/sangha/groups/:id/join`) and leaving (`DELETE /api/sangha/groups/:id/membership`).
    *   Implement group posts (create, like, comment, pin, delete).
    *   Implement group events (list, create, RSVP).
    *   Implement "My Sangha Notifications" (`GET /api/users/me/sangha/notifications`) and marking them as read.
    *   Implement live stream scheduling, viewing, chat, and reactions.

---

This comprehensive plan will guide the development process. Let me know which phase or specific task you'd like to start with.
