# 🏙️ Nagar Sheba — Frontend

> The web client for **Nagar Sheba**, a City Complaint & Service Request Platform. Citizens report civic issues and pay permit fees, department staff work a scoped queue, and administrators get oversight, analytics and an audit trail, all through one role-aware interface.

| | |
|---|---|
| 🌐 **Live frontend** | `https://<your-frontend>.vercel.app` |
| ⚙️ **Live backend API** | [`https://nagar-sheba-backend.onrender.com/api/v1`](https://nagar-sheba-backend.onrender.com/api/v1) |
| 📦 **Backend repo** | `https://github.com/<your-username>/nagar-sheba-backend` |
| 🎥 **Demo video** | `<your-video-link>` |

---

## 📖 Table of Contents

- [Highlights](#-highlights)
- [Tech Stack](#️-tech-stack)
- [Roles & Access](#-roles--access)
- [Pages & Routes](#-pages--routes)
- [Architecture](#-architecture)
- [Authentication Flow](#-authentication-flow)
- [Payment Flow](#-payment-flow)
- [URL State](#-url-state)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Deployment](#-deployment)
- [Accessibility & Performance](#-accessibility--performance)
- [Security Notes](#-security-notes)
- [Demo Accounts](#-demo-accounts)

---

## ✨ Highlights

- **3 fixed roles** (Citizen, Staff, Admin) enforced at the route level (`proxy.ts`), the layout level (`DashboardShell`) and the UI level (conditional actions).
- **One-click demo login** for every role on the login page.
- **Real payments**: SSLCommerz and bKash (sandbox), with success / fail / cancel redirect pages that poll until the gateway confirms.
- **4-step request wizard** with per-step validation, geolocation capture, map preview, photo previews and upload progress.
- **Admin analytics**: dashboard and reports built with Recharts (status bar, role donut, department bar, ratings, revenue by provider) plus **CSV export**.
- **URL-synced state**: every filter, search, sort and page lives in the query string, so any view can be bookmarked or shared.
- **Skeleton loaders** (`loading.tsx` + component skeletons), meaningful **empty states**, `error.tsx` boundaries and **toast** feedback on every API failure.
- **Dark mode** with no flash on load, **reduced-motion** support, skip-to-content link and ARIA labelling.
- **Notifications**: bell dropdown with 30 s polling, optimistic mark-as-read, and a full notifications page.
- **PDF receipts** downloadable for completed or refunded payments.
- **Google Sign-In** alongside email + OTP registration.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Styling & UI | Tailwind CSS v4, shadcn/ui (`base-mira` style on Base UI), `class-variance-authority`, `tw-animate-css` |
| Server state | TanStack Query v5 |
| Forms & validation | TanStack Form + Zod v4 (schemas mirror backend rules) |
| HTTP | `ofetch` with single-flight token refresh |
| Auth | httpOnly cookie JWT (access + refresh), Google Identity Services |
| Charts | Recharts |
| Motion | `motion` (Reveal, Stagger, CountUp, layout-animated nav) |
| Notifications | Sonner |
| Icons | Lucide React, React Icons |
| Code quality | Biome (lint + format + import organising) |

> ℹ️ This project uses Next.js 16, where `middleware.ts` is replaced by **`proxy.ts`**. See `AGENTS.md` and `node_modules/next/dist/docs/` before changing framework-level conventions.

---

## 👥 Roles & Access

| Role | Home | What they can do |
|---|---|---|
| **Citizen** | `/citizen` | File requests, upload evidence, pay fees, cancel, reopen within 3 days, rate resolved work, download receipts, manage profile |
| **Staff** | `/staff` | View their department's queue, start and resolve **only requests assigned to them**, upload resolution proof, see personal performance |
| **Admin** | `/admin` | Manage departments, categories, users and staff, reassign or override requests, refund payments, view feedback, reports and audit logs |

Access is enforced three ways:

1. **`src/proxy.ts`** validates the session against the backend (`/auth/me`, with one refresh attempt) and redirects by role.
2. **`DashboardShell`** is a second line of defence for expired or cleared sessions.
3. **Components** render role-specific actions (`CitizenActions`, `StaffActions`, `AdminActions`).

---

## 🗺️ Pages & Routes

**40+ pages** across public, auth, payment and three dashboards.

### Public (Server Components, full SEO metadata)
| Route | Purpose |
|---|---|
| `/` | Landing: hero, live stats, how it works, services, departments |
| `/services` | All services grouped by department, with department filter |
| `/services/[id]` | Service detail (ISR, `generateStaticParams` + `generateMetadata`) |
| `/about-us` · `/faq` · `/contact` | Marketing and support pages (contact form posts to the API) |
| `/privacy` · `/terms` | Legal pages |

### Authentication
`/login` (with demo panel and Google), `/register`, `/verify-email` (OTP + resend cooldown), `/forgot-password`, `/reset-password`

### Payment redirects
`/payments/success` · `/payments/fail` · `/payments/cancel`

### Citizen — `/citizen/*`
`/` overview · `/requests` · `/requests/new` (wizard) · `/requests/[id]` · `/payments` · `/notifications` · `/profile`

### Staff — `/staff/*`
`/` overview · `/requests` · `/requests/[id]` · `/performance` · `/notifications` · `/profile`

### Admin — `/admin/*`
`/` overview with charts · `/requests` · `/requests/[id]` · `/departments` · `/categories` · `/users` · `/payments` · `/feedbacks` · `/reports` · `/audit-logs` · `/notifications` · `/profile`

### Utility
`not-found.tsx` · `error.tsx` · `global-error.tsx` · `loading.tsx` per dashboard · `robots.ts` · `sitemap.ts`

---

## 🧱 Architecture

```text
Browser ──► Next.js (Vercel)
              │  rewrites  /api/v1/* ─────────────► Express API (Render)
              │  proxy.ts  role guard ──► GET /auth/me (+ refresh)
              └─ Server Components ──► fetch with ISR (public pages)
```

- **Server Components by default.** `"use client"` is added only for state, effects and handlers (forms, tables with filters, charts, dashboards).
- **Same-origin API via rewrites.** `next.config.ts` rewrites `/api/v1/:path*` to `BACKEND_URL`, so auth cookies stay first-party in the browser.
- **Data layer in three tiers:** `src/api/*` (typed request functions) → `src/hook/*` (TanStack Query hooks with centralised cache invalidation) → components.
- **Reusable building blocks:** `DataTable` pattern via `Table`, `StatCard`, `StatusBadge`, `SearchInput`, `FilterSelect`, `Pagination`, `EmptyState`, `ErrorState`, `ConfirmDialog`, `PageHeader`, `TextField`.
- **Custom hooks:** `useUrlState`, `useDebounce`, `useCountdown`, `useObjectUrls`, plus a hook per API domain.
- **Public data caching:** `lib/server-api.ts` uses `next: { revalidate }` for stats, categories and departments, and fails soft (returns `null` / `[]`).

---

## 🔐 Authentication Flow

1. Login calls `POST /auth/login`; the backend sets **httpOnly** `accessToken` and `refreshToken` cookies.
2. `useLogin` then loads `/auth/me`, seeds the `["user"]` query and redirects to the role home (or a safe `?redirect=` path, with open-redirect protection).
3. On a `401`, `apiClient` performs a **single-flight** refresh (parallel failures share one call) and retries once. Auth endpoints are excluded so wrong credentials do not trigger refresh loops.
4. `proxy.ts` forwards any rotated `Set-Cookie` headers to the browser.
5. Staff and admin accounts created by an admin carry `mustChangePassword`; a banner links to the profile page until the password is changed.

Registration is **email + OTP** (6 digits, 5 minutes, 60 s resend cooldown). Google accounts have no password section in the profile.

---

## 💳 Payment Flow

1. A citizen picks a **PAID** service in the wizard; the request is created as `PENDING_PAYMENT`.
2. The API returns a `paymentSession.checkoutUrl`; the app redirects the browser to SSLCommerz.
3. If no session was created, the request page offers **Pay with SSLCommerz** or **Pay with bKash**.
4. The gateway returns to the backend, which verifies the transaction and redirects to `/payments/success | fail | cancel`.
5. `PaymentResult` looks up the payment by `tran_id` / `paymentID`, **polls every 3 s while it is still `PENDING`**, and refreshes request and notification caches.
6. Cancelling a paid request triggers an automatic refund. Admins can retry failed refunds from `/admin/payments`.

---

## 🔗 URL State

`useUrlState` is the single source of truth for filters, search, sort and pagination (`?page=2&status=IN_PROGRESS&sort=slaDueAt:asc`). Changing any filter resets `page`. Components using it are rendered inside `<Suspense>`. Search is debounced (400 ms).

---

## 📁 Project Structure

```text
src/
├─ app/
│  ├─ (public)/
│  │  ├─ (marketing)/        # home, services, about, faq, contact, legal
│  │  ├─ (authentication)/   # login, register, verify, forgot/reset password
│  │  └─ payments/           # success, fail, cancel
│  ├─ (dashboard)/
│  │  ├─ admin/  staff/  citizen/   # each with layout, loading, error, template
│  ├─ error.tsx  global-error.tsx  not-found.tsx
│  ├─ layout.tsx  globals.css  robots.ts  sitemap.ts
├─ components/
│  ├─ ui/            # shadcn primitives (Base UI)
│  ├─ shared/        # StatCard, StatusBadge, Pagination, EmptyState, ...
│  ├─ form/          # Login, Register, Verify, Reset, Contact, Demo panel, Google
│  ├─ request/       # wizard, list, detail, actions, gallery, timeline
│  ├─ admin/  staff/  dashboard/  payment/  notification/  profile/
│  ├─ layout/        # homepage + dashboard shells
│  ├─ home/  motion/
├─ api/              # typed API functions per domain
├─ hook/             # TanStack Query hooks + utility hooks
├─ validation/       # Zod schemas (match backend rules)
├─ types/            # API and domain types
├─ lib/              # apiClient, upload, format, status, roles, server-api, utils
├─ config/           # navigation, demo accounts, site info
├─ providers/        # Query, Theme, Motion
└─ proxy.ts          # role-based route protection
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A running **Nagar Sheba backend** (local or the hosted API)

### Install and run

```bash
git clone https://github.com/<your-username>/nagar-sheba-frontend.git
cd nagar-sheba-frontend
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The backend's `FRONTEND_URL` must equal this app's origin (for CORS and payment redirects), and its `BACKEND_URL` must be publicly reachable by SSLCommerz / bKash for callbacks.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|:-:|---|
| `BACKEND_URL` | ✅ | Backend API base used by rewrites, `proxy.ts` and server fetches, e.g. `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public site origin for metadata, sitemap and robots |
| `NEXT_PUBLIC_API_URL` | ➖ | Override the browser API base. Defaults to `/api/v1` (rewritten to `BACKEND_URL`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | ➖ | Enables the Google button (hidden when empty) |
| `NEXT_PUBLIC_DEMO_ADMIN_EMAIL` / `_PASSWORD` | ➖ | Admin demo login |
| `NEXT_PUBLIC_DEMO_STAFF_EMAIL` / `_PASSWORD` | ➖ | Staff demo login |
| `NEXT_PUBLIC_DEMO_CITIZEN_EMAIL` / `_PASSWORD` | ➖ | Citizen demo login |

Example `.env.local`:

```dotenv
BACKEND_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>

NEXT_PUBLIC_DEMO_ADMIN_EMAIL=<demo-admin-email>
NEXT_PUBLIC_DEMO_ADMIN_PASSWORD=<demo-admin-password>
NEXT_PUBLIC_DEMO_STAFF_EMAIL=<demo-staff-email>
NEXT_PUBLIC_DEMO_STAFF_PASSWORD=<demo-staff-password>
NEXT_PUBLIC_DEMO_CITIZEN_EMAIL=<demo-citizen-email>
NEXT_PUBLIC_DEMO_CITIZEN_PASSWORD=<demo-citizen-password>
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Biome check |
| `npm run format` | Biome format (write) |
| `npm run format:fix` | Biome check with auto-fix |

---

## ☁️ Deployment

Deployed on **Vercel**.

1. Import the repository into Vercel.
2. Add the environment variables above. Set `BACKEND_URL` to the **production API** (`https://nagar-sheba-backend.onrender.com/api/v1`) and `NEXT_PUBLIC_SITE_URL` to your Vercel domain.
3. On the backend (Render), set `FRONTEND_URL` to the Vercel domain and redeploy, so CORS, cookies and payment redirects resolve correctly.
4. Deploy. Public pages use ISR, so the first requests warm the cache.

> ⚠️ Render free instances sleep. The first request after idle time can take a while; the UI shows skeletons and retry states while it wakes.

---

## ♿ Accessibility & Performance

- Skip-to-content link, `aria-current` on navigation, labelled icon buttons, `role="alert"` on field errors, and `aria-invalid` / `aria-describedby` wiring.
- Charts expose `role="img"` labels and visually hidden data tables for screen readers.
- Native `<select>` filters for built-in keyboard and screen-reader support.
- `prefers-reduced-motion` respected globally and through `MotionConfig`.
- `next/image` for remote Cloudinary images (`remotePatterns` configured), lazy-loaded map iframes, ISR on public pages, and `keepPreviousData` to avoid list flicker during pagination.
- Query keys are invalidated through one helper per domain to avoid over-fetching.

---

## 🔒 Security Notes

- Tokens live in **httpOnly cookies**; no token is stored in JavaScript-accessible storage.
- Redirect targets are validated to same-site relative paths only.
- Server data is trusted only after the backend re-validates the user (blocked and deleted accounts are rejected on every request).
- **Every `NEXT_PUBLIC_*` value is bundled into browser JavaScript**, including the demo passwords. Use dedicated demo accounts that hold no real data, rotate their passwords after evaluation, and never put real secrets in a `NEXT_PUBLIC_*` variable.
- Never commit `.env*` files (only `.env.example`).

---

## 🧪 Demo Accounts

The login page offers **one-click Demo Login** buttons for Admin, Staff and Citizen. Buttons are disabled with a tooltip if the matching `NEXT_PUBLIC_DEMO_*` variables are missing.

| Role | Email | Password |
|---|---|---|
| Admin | `<demo-admin-email>` | `<provided-in-submission>` |
| Staff | `<demo-staff-email>` | `<provided-in-submission>` |
| Citizen | `<demo-citizen-email>` | `<provided-in-submission>` |

---

## 📝 License

Built as a B7A7 Frontend (Fullstack) assignment — City Complaint & Service Platform.