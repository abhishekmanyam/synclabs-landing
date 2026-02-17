# Product Requirements Document (PRD)
# SyncLabs On-Demand Lip-Sync SaaS (Web App)

**Version:** 2.0
**Date:** 2026-02-12
**Owner:** SyncLabs

---

## 1. Summary

SyncLabs will launch a **public SaaS web app** for on-demand lip-sync generation. Users upload a source video and an audio track, the system runs GPU inference on RunPod, and returns a lip-synced output video. The MVP is **UI-only** with a free credit limit, no API keys, and no webhooks.

The web app lives at **app.synclabs.studio** (subdomain). The marketing landing page is already deployed at **synclabs.studio** and is a separate Astro static site.

---

## 2. Architecture: Landing Page vs. App

| Concern | Landing Page (synclabs.studio) | Web App (app.synclabs.studio) |
|---|---|---|
| Purpose | Marketing, SEO, conversion | Product — upload, process, download |
| Stack | Astro static site, Vercel | Next.js + shadcn/ui, Vercel |
| Auth | None (links to app) | Supabase Auth (email + Google OAuth) |
| Database | None | Supabase Postgres |
| Storage | None | S3 (inputs + outputs) |
| GPU | None | RunPod Serverless |

**Cross-domain concerns:**
- Landing page "Get Started Free", "Start Free", "Log In" buttons link to `https://app.synclabs.studio/signup` and `https://app.synclabs.studio/login`.
- Shared branding: both sites use the same design system (Section 3).
- Cookie domain should be scoped to `.synclabs.studio` if shared auth is needed in the future.
- CORS: the app API must allow requests from `app.synclabs.studio` only. The landing page makes no API calls.

---

## 3. Branding & Design System

The web app uses **shadcn/ui** as its only UI framework. **No custom CSS.** All styling is done through shadcn/ui components, Tailwind utility classes, and CSS variables configured in the shadcn theme. The landing page (Astro) has its own styles, but the web app must not carry any of those over.

### 3.1 Logo

- **File:** `synclabs.png` (teal wordmark on transparent/dark background).
- **Usage:** Always display as an `<img>`, never recreate in CSS/SVG.
- **Minimum height:** 48px (`h-12` in Tailwind) on desktop, 36px on mobile.
- **Clear space:** At least the height of the "S" glyph on all sides.
- **Favicon:** Use `synclabs.png` as the favicon (all sizes).

### 3.2 Color Palette (shadcn CSS Variables)

Map these brand colors into the shadcn/ui CSS variable system in `globals.css`. No additional custom CSS properties.

| shadcn Variable | Hex Value | Mapped From |
|---|---|---|
| `--background` | `#0D1E30` | Page background |
| `--foreground` | `#d0e8f2` | Body text |
| `--card` | `#122a40` | Card backgrounds |
| `--card-foreground` | `#d0e8f2` | Card text |
| `--popover` | `#122a40` | Popover/dropdown backgrounds |
| `--popover-foreground` | `#d0e8f2` | Popover text |
| `--primary` | `#2bf8d4` | Primary actions, accents, links |
| `--primary-foreground` | `#0D1E30` | Text on primary buttons (dark on teal) |
| `--secondary` | `#163350` | Secondary surfaces |
| `--secondary-foreground` | `#d0e8f2` | Text on secondary surfaces |
| `--muted` | `#163350` | Muted/disabled backgrounds |
| `--muted-foreground` | `#7a9bb5` | Muted/placeholder text |
| `--accent` | `#1cc4a8` | Hover/active accents |
| `--accent-foreground` | `#0D1E30` | Text on accent |
| `--destructive` | `#f87171` | Error/destructive actions |
| `--destructive-foreground` | `#ffffff` | Text on destructive |
| `--border` | `#1e3d5c` | Borders, dividers |
| `--input` | `#1e3d5c` | Input borders |
| `--ring` | `#2bf8d4` | Focus rings |
| `--radius` | `0.75rem` | Default border radius |

**Additional semantic colors (as Tailwind utilities, not custom CSS):**

- Warning: `text-yellow-400` / `bg-yellow-400`
- Success: `text-emerald-400` / `bg-emerald-400`

**Rules:**
- Dark mode only — there is no light theme. Configure only the `.dark` (or root) theme in shadcn.
- Never use primary teal as a large background fill. It is an accent color.
- All components come from `shadcn/ui`. Do not write custom CSS files, `@apply` blocks, or `<style>` tags.

### 3.3 Typography

- **Font family:** `Inter` (Google Fonts), set via Tailwind `fontFamily` config, fallback: `system-ui, -apple-system, sans-serif`.
- **Headings:** `font-bold` or `font-extrabold`, `tracking-tight`.
- **Body:** Default Tailwind, `leading-relaxed` where needed.
- **Monospace (job IDs, file names):** Tailwind `font-mono` (system monospace).

### 3.4 shadcn/ui Components Used

All UI is built from these shadcn/ui primitives. No custom component CSS.

| Component | Usage |
|---|---|
| `Button` | All CTAs, form submissions, actions |
| `Card` | Dashboard job cards, pricing cards, settings sections |
| `Input` | Text fields (email, password) |
| `Label` | Form field labels |
| `Badge` | Job status indicators, credit count |
| `Progress` | Upload progress bar |
| `Table` | Job history list |
| `Dialog` | Confirmation modals (e.g., "Are you sure?") |
| `Alert` | Error messages, warnings, info banners |
| `Skeleton` | Loading states for dashboard, job detail |
| `Separator` | Section dividers |
| `DropdownMenu` | User menu (settings, logout) |
| `Tabs` | Future: switching between upload modes |
| `Tooltip` | Help text on icons/labels |
| `Sonner` (toast) | Success/error notifications |

**Customization approach:** Only override via shadcn CSS variables (Section 3.2) and Tailwind `className` props. Never add `.css` files or `<style>` blocks.

---

## 4. Problem Statement

Creators need a simple, reliable way to generate lip-synced videos without installing ML tooling or managing GPU infrastructure. The current pipeline works via RunPod + S3 but lacks **user management, session/job tracking, and a web UI**.

---

## 5. Goals

1. Launch a **public web app** at `app.synclabs.studio` that allows users to upload video + audio and get lip-synced output.
2. Provide **email + Google OAuth** login with per-user quotas and credit limits.
3. Enforce **MVP limits**: 3 free jobs (lifetime), 30-second max duration, 200 MB max upload size.
4. Store inputs/outputs in S3 and retain outputs for **7 days**.
5. Support a **job lifecycle** with clear status and error messaging.
6. Keep the pipeline extensible for future pre-steps (Nano Banana image generation, TTS).

---

## 6. Non-Goals (MVP)

- API keys or programmatic usage.
- Webhooks or callbacks.
- Real-time inference or streaming avatars.
- Team/org accounts or multi-role permissions.
- Advanced editing tools (timeline, trimming, cropping).
- Paid plans or Stripe billing (MVP is free-tier only).
- Nano Banana image generation integration (future).
- TTS audio generation (future).

---

## 7. Target Users

- Solo creators and small teams who want quick, one-off lip-sync outputs.
- Product teams evaluating SyncLabs for potential integration.

---

## 8. MVP Scope

### 8.1 Pages (Web App)

| Route | Description | Auth Required |
|---|---|---|
| `/login` | Email/password + Google OAuth login | No |
| `/signup` | Registration form + Google OAuth | No |
| `/verify-email` | Email verification prompt | No |
| `/dashboard` | Credits remaining, job history, "New Job" CTA | Yes |
| `/jobs/new` | Upload video + audio, validate, submit | Yes |
| `/jobs/:id` | Job status, preview, download, error details | Yes |
| `/settings` | Email display, logout, delete account (future) | Yes |

### 8.2 Backend Features

- Auth + user profiles (Supabase Auth).
- Presigned S3 upload URLs (short-lived, scoped to user).
- Job creation + RunPod trigger.
- Job status polling (or Supabase Realtime for push updates).
- Credit reservation on job creation, refund on failure.
- Output retention cleanup (S3 lifecycle rule: 7 days).
- Input cleanup (S3 lifecycle rule: 24 hours after job completes or fails).

---

## 9. User Experience Flow

```
1. User lands on synclabs.studio (landing page)
2. Clicks "Get Started Free" → redirected to app.synclabs.studio/signup
3. Signs up via email or Google OAuth
4. (If email) Receives verification email → clicks link → verified
5. Redirected to /dashboard — sees "3 credits remaining"
6. Clicks "New Job" → /jobs/new
7. Uploads video file (drag & drop or file picker)
8. Uploads audio file (drag & drop or file picker)
9. Client-side validation runs (format, size)
10. Clicks "Generate" → job created, credit reserved
11. Redirected to /jobs/:id — sees status: QUEUED
12. Status updates: QUEUED → VALIDATING → RUNNING → SUCCEEDED
13. On success: video preview player + "Download" button
14. Output available for 7 days, then auto-deleted
```

---

## 10. Functional Requirements

### 10.1 Authentication

- **Providers:** Email/password and Google OAuth.
- **Email verification:** Required before job creation. Unverified users can log in but see a banner prompting verification.
- **OAuth account linking:** If a user signs up with email, then later logs in with Google using the same email, the accounts should be linked (Supabase handles this).
- **Session duration:** 7 days, refreshable. After 30 days of inactivity, require re-login.
- **Password requirements:** Minimum 8 characters. No other complexity rules.

### 10.2 Uploads

- **Method:** Client requests a presigned S3 PUT URL from the backend, then uploads directly to S3.
- **Presigned URL expiry:** 15 minutes.
- **Max file size:** 200 MB per file (enforced both client-side and via S3 presigned URL policy).
- **Upload progress:** Show a progress bar in the UI using `XMLHttpRequest` or `fetch` with `ReadableStream`.
- **Resumability:** Not required for MVP. If upload fails, user must retry from scratch.
- **S3 key structure:** `uploads/{user_id}/{job_id}/video.{ext}` and `uploads/{user_id}/{job_id}/audio.{ext}`.

### 10.3 File Validation

**Client-side (immediate feedback):**
- Check file extension against allowed list.
- Check file size <= 200 MB.
- Show error inline if invalid.

**Server-side (after upload, before RunPod):**
- Validate file by reading magic bytes (not just extension) to prevent spoofed files.
- Run `ffprobe` to extract:
  - Duration (reject if > 30 seconds).
  - Codec info (reject if not decodable by ffmpeg).
  - For video: confirm at least one video stream with a face-containing resolution (minimum 64x64).
  - For audio: confirm at least one audio stream.
- Duration rule: `max(video_duration, audio_duration) <= 30 seconds`.
- Audio duration may exceed video duration (the lip-sync model handles this).
- If validation fails, refund the reserved credit and set job status to `FAILED` with a clear `error_code` and `error_message`.

**Supported formats:**

| Type | Allowed Extensions | Notes |
|---|---|---|
| Video | `.mp4`, `.mov`, `.avi`, `.mkv`, `.webm` | Must contain at least one video stream |
| Audio | `.mp3`, `.wav`, `.m4a`, `.aac`, `.ogg`, `.flac` | Normalized to 16 kHz mono WAV before inference |

### 10.4 Jobs

- Each job consumes **1 credit**.
- Credit is **reserved** (deducted) at job creation time.
- Credit is **refunded** if the job fails at any stage (validation, inference, output encoding).
- Credit is **not refunded** if the user cancels a running job (MVP: cancellation is not supported).
- A user cannot create a new job if they have 0 credits remaining.
- A user can have at most **1 concurrent running job** (MVP simplicity). If they submit while one is running, show an error: "You already have a job in progress."

**Job status transitions:**

```
CREATED → VALIDATING → QUEUED → RUNNING → SUCCEEDED
                ↓          ↓        ↓
              FAILED     FAILED   FAILED
```

- `CREATED`: Job record created, credit reserved, files uploaded.
- `VALIDATING`: Server-side file validation in progress (`ffprobe` checks).
- `QUEUED`: Validation passed, request sent to RunPod, waiting for GPU worker.
- `RUNNING`: RunPod worker picked up the job, inference in progress.
- `SUCCEEDED`: Output video generated, uploaded to S3, ready for download.
- `FAILED`: Something went wrong. See `error_code` + `error_message`.

### 10.5 Output

- Format: `.mp4` (H.264 video, AAC audio).
- Downloadable via presigned S3 GET URL (valid for 1 hour, re-generatable while output exists).
- In-browser preview: HTML5 `<video>` player on the job detail page.
- Outputs retained for **7 days** from job completion, then deleted by S3 lifecycle rule.
- After expiry, the job detail page shows "Output expired" instead of the player/download button.

### 10.6 Dashboard

- Show **credits remaining** prominently (e.g., "2 of 3 credits remaining").
- Show **job history** as a list/table with columns: Job ID (short hash), Status, Created, Duration, Actions (View).
- Sort by most recent first.
- Empty state: "No jobs yet. Create your first lip-sync video."
- If 0 credits remaining: Show a message "You've used all your free credits. Paid plans coming soon." with a disabled "New Job" button.

---

## 11. Edge Cases & Error Handling

### 11.1 Upload Edge Cases

| Scenario | Handling |
|---|---|
| User closes browser tab during upload | Upload is lost. No job is created. No credit deducted. User can retry. |
| Presigned URL expires before upload completes | Upload will fail (S3 returns 403). UI shows "Upload expired, please try again." |
| File is 0 bytes | Client-side: reject immediately. Server-side: `ffprobe` will fail, job moves to FAILED. |
| File extension is renamed (e.g., `.txt` → `.mp4`) | Server-side magic byte check catches this. Job fails with "Invalid file format." |
| User uploads same file for both video and audio | Allowed — the system treats them independently. |
| Network interruption mid-upload | `XMLHttpRequest` fires `onerror`. UI shows "Upload failed. Please check your connection and try again." |

### 11.2 Validation Edge Cases

| Scenario | Handling |
|---|---|
| Video has no face | Not validated at MVP. The lip-sync model will produce garbage output. Future: add face detection pre-check. |
| Video has multiple faces | The model picks the dominant/largest face. Not documented to user in MVP. |
| Video is < 1 second | Allowed if the model can process it. No minimum duration enforced. |
| Audio has no speech (e.g., music only) | Allowed. The model will attempt to sync — result may look odd. Not a validation error. |
| Video duration is exactly 30.0 seconds | Allowed (limit is `<=`). |
| Video is 30.5 seconds | Rejected: "Video exceeds the 30-second limit (30.5s)." |
| Audio is 45s but video is 10s | Rejected: `max(10, 45) = 45 > 30`. Error: "Combined duration exceeds 30-second limit." |
| Corrupted file that ffprobe can't read | Job fails with "Could not read file. The file may be corrupted." |
| Video codec not supported by ffmpeg | Extremely rare. Job fails with "Unsupported video codec." |

### 11.3 Job Processing Edge Cases

| Scenario | Handling |
|---|---|
| RunPod is down or unreachable | Job stays in `QUEUED` status. Backend retries RunPod trigger 3 times with exponential backoff (5s, 15s, 45s). If all retries fail, job moves to FAILED with "Service temporarily unavailable. Your credit has been refunded. Please try again later." |
| RunPod worker crashes mid-inference | RunPod reports failure via webhook/polling. Job moves to FAILED. Credit refunded. |
| RunPod cold start takes > 5 minutes | Job stays in QUEUED. UI shows estimated wait. No timeout at MVP (RunPod has its own timeout). |
| Output file fails to upload to S3 | Job moves to FAILED. Credit refunded. "Output could not be saved. Please try again." |
| User refreshes page while job is running | Job continues server-side. Page reload re-fetches current status. No data lost. |
| User logs out while job is running | Job continues. User can log back in and see the result on their dashboard. |

### 11.4 Credit Edge Cases

| Scenario | Handling |
|---|---|
| User has 0 credits and tries to create a job | UI disables "Generate" button. API returns 403: "No credits remaining." |
| Race condition: two simultaneous job creation requests | Use database transaction: `UPDATE profiles SET credits_balance = credits_balance - 1 WHERE credits_balance > 0 AND id = :user_id RETURNING credits_balance`. If the update affects 0 rows, reject. |
| Job fails after credit was reserved | Credit is refunded via `credits_ledger` entry with `reason: 'refund_failed_job'`. |
| User deletes account while job is running | MVP: block account deletion if any job is in `CREATED`, `VALIDATING`, `QUEUED`, or `RUNNING` state. |

### 11.5 Auth Edge Cases

| Scenario | Handling |
|---|---|
| User signs up with email, then tries Google OAuth with same email | Supabase links the accounts. User can log in with either method. |
| Email verification link expires | Links expire after 24 hours. User can request a new verification email from the `/verify-email` page. |
| User never verifies email | They can log in and see the dashboard, but the "New Job" button is disabled with a banner: "Please verify your email to start creating jobs." |
| User tries to sign up with a disposable email | Allowed at MVP. Future: block disposable email domains. |

---

## 12. Error Code Taxonomy

All job failures include an `error_code` (machine-readable) and `error_message` (human-readable).

| Error Code | Message | Credit Refunded? |
|---|---|---|
| `INVALID_VIDEO_FORMAT` | "The video file format is not supported." | Yes |
| `INVALID_AUDIO_FORMAT` | "The audio file format is not supported." | Yes |
| `FILE_TOO_LARGE` | "File exceeds the 200 MB size limit." | Yes |
| `DURATION_EXCEEDED` | "Content exceeds the 30-second duration limit." | Yes |
| `FILE_CORRUPTED` | "Could not read file. It may be corrupted." | Yes |
| `UNSUPPORTED_CODEC` | "The file uses an unsupported codec." | Yes |
| `INFERENCE_FAILED` | "Lip-sync processing failed. Please try again." | Yes |
| `OUTPUT_SAVE_FAILED` | "Could not save the output video." | Yes |
| `SERVICE_UNAVAILABLE` | "Service is temporarily unavailable. Please try again later." | Yes |
| `UNKNOWN_ERROR` | "An unexpected error occurred." | Yes |

---

## 13. Constraints and Limits

| Constraint | Value | Enforced At |
|---|---|---|
| Max free credits | 3 jobs (lifetime, not monthly) | API + DB |
| Max duration | 30 seconds (`max(video, audio)`) | Server-side (`ffprobe`) |
| Max upload size | 200 MB per file | Client-side + S3 presigned URL policy |
| Max concurrent jobs | 1 per user | API |
| Output retention | 7 days | S3 lifecycle rule |
| Input retention | 24 hours after job completion/failure | S3 lifecycle rule |
| Presigned URL expiry (upload) | 15 minutes | API |
| Presigned URL expiry (download) | 1 hour (re-generatable) | API |
| Supported video formats | `.mp4`, `.mov`, `.avi`, `.mkv`, `.webm` | Client + Server |
| Supported audio formats | `.mp3`, `.wav`, `.m4a`, `.aac`, `.ogg`, `.flac` | Client + Server |
| Output format | `.mp4` (H.264 + AAC) | Fixed |
| Min video resolution | 64x64 | Server-side |

---

## 14. Data Model

### profiles
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` (PK) | Matches Supabase Auth user ID |
| `email` | `text` | From auth provider |
| `display_name` | `text` | Optional |
| `credits_balance` | `integer` | Default: 3 |
| `plan` | `text` | Default: `'free'` |
| `email_verified` | `boolean` | Synced from Supabase Auth |
| `created_at` | `timestamptz` | Auto |
| `updated_at` | `timestamptz` | Auto |

### jobs
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` (PK) | |
| `user_id` | `uuid` (FK → profiles) | |
| `status` | `text` | One of: `CREATED`, `VALIDATING`, `QUEUED`, `RUNNING`, `SUCCEEDED`, `FAILED` |
| `video_s3_key` | `text` | S3 key for uploaded video |
| `audio_s3_key` | `text` | S3 key for uploaded audio |
| `output_s3_key` | `text` | S3 key for output (null until SUCCEEDED) |
| `video_duration_sec` | `float` | From `ffprobe` |
| `audio_duration_sec` | `float` | From `ffprobe` |
| `error_code` | `text` | Null unless FAILED |
| `error_message` | `text` | Null unless FAILED |
| `runpod_job_id` | `text` | RunPod's job identifier for tracking |
| `output_expires_at` | `timestamptz` | `completed_at + 7 days` |
| `created_at` | `timestamptz` | |
| `completed_at` | `timestamptz` | When status became SUCCEEDED or FAILED |

### credits_ledger
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` (PK) | |
| `user_id` | `uuid` (FK → profiles) | |
| `job_id` | `uuid` (FK → jobs) | Nullable (for future manual adjustments) |
| `amount` | `integer` | `-1` for reservation, `+1` for refund |
| `reason` | `text` | `'job_created'`, `'refund_failed_job'`, `'manual_adjustment'` |
| `created_at` | `timestamptz` | |

**RLS policies:**
- Users can only read their own `profiles`, `jobs`, and `credits_ledger` rows.
- Users cannot directly update `credits_balance` — only the backend (via service role) can.
- Users cannot delete job records.

---

## 15. API Surface (Internal, UI-Only)

All endpoints require a valid Supabase session token (except auth routes). Base URL: `https://app.synclabs.studio/api`

| Method | Path | Description | Auth |
|---|---|---|---|
| `POST` | `/uploads/presign` | Returns a presigned S3 PUT URL + key | Yes |
| `POST` | `/jobs` | Create job, reserve credit, start validation + RunPod | Yes |
| `GET` | `/jobs` | List user's jobs (paginated, 20 per page) | Yes |
| `GET` | `/jobs/:id` | Job detail + presigned download URL if SUCCEEDED | Yes |
| `GET` | `/jobs/:id/download` | Redirect to fresh presigned download URL | Yes |
| `GET` | `/me` | Current user profile + credits balance | Yes |

**Rate limiting:**
- `/uploads/presign`: 10 requests per minute per user.
- `/jobs` (POST): 5 requests per minute per user.
- All other endpoints: 60 requests per minute per user.

---

## 16. Observability

- Log every job status transition with timestamp and user_id.
- Track: average job runtime, p95 job runtime, failure rate by error_code.
- Alert if failure rate exceeds 20% in a 1-hour window.
- Alert if average queue time exceeds 5 minutes.
- Capture RunPod job IDs for cross-referencing with RunPod dashboard.
- Log all validation failures (helps identify common user mistakes to improve UX messaging).

---

## 17. Security & Privacy

- **RLS:** All database queries go through Supabase RLS. Users can only access their own data.
- **Presigned URLs:** Short-lived (15 min upload, 1 hour download). Scoped to specific S3 keys.
- **Input/output deletion:** Inputs deleted 24 hours after job completes. Outputs deleted after 7 days. Users can request earlier deletion via support (future: self-serve).
- **Face data:** User-uploaded content may contain biometric data (faces). Privacy policy must disclose: (1) data is processed for lip-sync only, (2) data is not used for training, (3) data is deleted per retention policy.
- **No content moderation at MVP.** Future: add NSFW detection before processing.
- **HTTPS only.** Redirect HTTP to HTTPS. HSTS header enabled.
- **CORS:** Allow only `https://app.synclabs.studio`. No wildcard origins.
- **CSP:** Strict Content Security Policy. Allow scripts only from self and Supabase.
- **Account deletion:** Not available in MVP. Display "Contact support" link. Implement self-serve in v1.1.

---

## 18. Performance & UX

- **Upload feedback:** Progress bar showing percentage + upload speed.
- **Job status polling:** Poll `/jobs/:id` every 3 seconds while status is `QUEUED` or `RUNNING`. Stop polling when `SUCCEEDED` or `FAILED`. Future: switch to Supabase Realtime for push updates.
- **Optimistic UI:** After clicking "Generate", immediately redirect to job detail page with `CREATED` status. Don't wait for server response.
- **Mobile responsive:** All pages must work on mobile (min width: 320px). Upload via file picker (no drag & drop on mobile).
- **Loading states:** Skeleton loaders for dashboard and job detail. Spinner on buttons during async operations.
- **Accessibility:** All interactive elements must be keyboard-navigable. Color contrast must meet WCAG AA. Form inputs must have labels. Status updates must be announced to screen readers via `aria-live`.

---

## 19. State Management

No external state library (no Redux, no Zustand). The app has three categories of state, each handled differently:

### 19.1 Server State (jobs, credits, profile)

Managed entirely by **TanStack Query** (`@tanstack/react-query`).

| Query Key | Source | Stale Time | Refetch Strategy |
|---|---|---|---|
| `['me']` | `GET /me` | 5 min | On window focus |
| `['jobs']` | `GET /jobs` | 30 sec | On window focus, after mutation |
| `['jobs', id]` | `GET /jobs/:id` | 0 (always fresh) | Poll every 3s while `QUEUED` or `RUNNING`, stop on `SUCCEEDED`/`FAILED` |

**Mutations:**
- `POST /jobs` → on success: invalidate `['me']` (credits changed) + invalidate `['jobs']` + redirect to `/jobs/:id`.
- Job failure refund → server-side only, next `['me']` refetch picks up the restored credit.

**Why TanStack Query:**
- Automatic caching, deduplication, background refetching.
- Built-in polling interval support (for job status).
- Handles loading/error/success states without manual `useState`.
- No boilerplate — each query is a single `useQuery` hook.

### 19.2 Auth State

Managed by **Supabase Auth client** (`@supabase/ssr`).

- `supabase.auth.getSession()` on initial load → provides session token.
- `supabase.auth.onAuthStateChange()` listener updates auth context.
- Wrap the app in a lightweight `AuthProvider` (React Context) that exposes `user`, `session`, `isLoading`.
- This is the **only React Context** in the app. Do not add others.
- Protected routes check `session` — if null, redirect to `/login`.

### 19.3 Local/UI State

Managed by **React `useState`/`useReducer`** in the component that owns it. Never lifted to global state.

| State | Where | Type |
|---|---|---|
| Upload progress (%) | `/jobs/new` page | `useState<number>` |
| Selected files | `/jobs/new` page | `useState<File \| null>` |
| Mobile menu open | Layout nav | `useState<boolean>` |
| Dialog open/closed | Inline in component | shadcn `Dialog` controlled state |
| Form field values | Form component | `useState` or `react-hook-form` if validation gets complex |

**Rules:**
- No global state store. If a value is needed in two unrelated components, it should come from TanStack Query (server state) or the auth context.
- Upload progress is local to the upload page. If the user navigates away, the upload continues but progress display is lost (acceptable for MVP).
- No `localStorage` or `sessionStorage` for app state. Session persistence is handled by Supabase Auth cookies.

---

## 20. Success Metrics

| Metric | Target |
|---|---|
| Signup → first job completion rate | 60%+ |
| Job success rate (SUCCEEDED / total) | 90%+ |
| Median job completion time | Under 3x video duration |
| Median time from signup to first job submission | Under 5 minutes |
| Upload failure rate (network/timeout) | Under 5% |

---

## 20. Dependencies

| Dependency | Purpose | Notes |
|---|---|---|
| Next.js | Web app framework | App Router, server actions |
| shadcn/ui | UI component library | Only UI framework — no custom CSS |
| Tailwind CSS | Utility styling | Used via shadcn/ui + className props only |
| TanStack Query | Server state management | Caching, polling, mutations |
| Supabase | Auth, Postgres, RLS, (future: Realtime) | Managed service |
| Supabase MCP | AI-assisted DB management during development | See Section 20.1 |
| RunPod Serverless | GPU inference for lip-sync model | Must configure timeout and retries |
| AWS S3 | Input/output file storage | With lifecycle rules for auto-deletion |
| ffmpeg + ffprobe | Server-side file validation | Available in backend runtime environment |
| Vercel | Hosting for landing page + web app | Separate projects, same team |

### 20.1 Supabase MCP (Development Tooling)

Use the **Supabase MCP server** (`@supabase/mcp-server-supabase`) during development for AI-assisted database operations. This allows Claude Code (or any MCP-compatible AI tool) to directly interact with the Supabase project.

**Setup:**
- Install the Supabase MCP server and configure it with the project's Supabase access token and project ID.
- Add to `.claude/mcp.json` or the IDE's MCP config.

**Use during development for:**

| Operation | MCP Tool | Notes |
|---|---|---|
| Create/alter tables | `execute_sql` | Run DDL for `profiles`, `jobs`, `credits_ledger` |
| Set up RLS policies | `execute_sql` | Define row-level security per Section 14 |
| Create database functions | `execute_sql` | e.g., credit reservation with atomic update |
| Seed test data | `execute_sql` | Insert test users, jobs for local dev |
| Inspect schema | `list_tables`, `list_extensions` | Verify table structure matches PRD |
| Manage migrations | `apply_migration` | Track schema changes as named migrations |
| Check logs | `get_logs` | Debug auth, postgrest, or function errors |
| Manage storage buckets | `list_storage_buckets` | If using Supabase Storage instead of S3 |
| Query project config | `get_project` | Verify project settings |

**Rules:**
- MCP is a **development-time** tool only. It is not part of the production runtime.
- All schema changes made via MCP should be captured as Supabase migrations (`apply_migration`) so they are reproducible.
- Never store the Supabase access token in the repo. Use environment variables or the MCP config file (which should be gitignored).
- The MCP server provides read-only access by default. Destructive operations (table drops, data deletion) require explicit confirmation.

---

## 21. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| RunPod cold-start latency | Users wait 2-5 min for first job | Keep 1 warm worker during peak hours. Show estimated wait time in UI. |
| Invalid/garbage inputs | Wasted GPU time, poor UX | Strict server-side validation with `ffprobe` before sending to RunPod. |
| Cost leakage from abuse | Free-tier abuse runs up GPU costs | 3-credit lifetime limit. 1 concurrent job limit. Rate limiting on job creation. Future: CAPTCHA on signup. |
| Face data privacy complaints | Legal/reputation risk | Clear privacy policy. Auto-delete inputs (24h) and outputs (7d). No training on user data. |
| S3 costs from large files | Storage costs accumulate | Aggressive lifecycle rules. 200 MB limit per file. |
| Corrupted output from model | Bad user experience | Show clear error message. Refund credit. Log for debugging. |

---

## 22. Future Extensions (Post-MVP)

- **Nano Banana integration:** Add image generation as a pre-step (generate a face from text, then lip-sync it).
- **TTS integration:** Add text-to-speech option so users can type text instead of uploading audio.
- **Paid plans:** Credit packs and monthly subscriptions via Stripe. Align with landing page pricing (Starter free, Pro $29/mo, Enterprise custom).
- **API keys + webhooks:** For programmatic usage by developers and product teams.
- **Job cancellation:** Allow users to cancel a `QUEUED` or `RUNNING` job and get their credit back.
- **Batch jobs:** Upload multiple video+audio pairs and process them sequentially.
- **Account deletion:** Self-serve account and data deletion.
- **Content moderation:** NSFW detection on uploaded content before processing.
- **Face detection pre-check:** Validate that the uploaded video contains a detectable face before sending to inference.
- **Output quality options:** Let users choose resolution (720p, 1080p, 4K) with different credit costs.
- **Download history:** Track when outputs were downloaded (for analytics).

---

## 23. Landing Page Alignment Notes

The landing page at `synclabs.studio` currently shows pricing tiers (Starter, Pro, Enterprise) that are **aspirational/future** and do not reflect the MVP free-tier-only model. This is intentional — the landing page establishes the product vision. The web app MVP only implements the free tier (3 lifetime credits). When paid plans launch:

- Landing page pricing section links should point to `app.synclabs.studio/pricing` or `app.synclabs.studio/signup?plan=pro`.
- The web app should show an upgrade prompt when credits run out.
- Stripe Checkout or Stripe Billing integration will handle payments.

**CTA button targets (landing page → app):**
- "Get Started Free" → `https://app.synclabs.studio/signup`
- "Start Free" → `https://app.synclabs.studio/signup`
- "Start Pro Trial" → `https://app.synclabs.studio/signup?plan=pro` (post-MVP, shows upgrade flow)
- "Contact Sales" → `mailto:sales@synclabs.studio` or a Calendly link
- "Log In" → `https://app.synclabs.studio/login`
- "See How It Works" → `/#how-it-works` (same-page scroll)
