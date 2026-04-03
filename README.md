# MultiUploads — Frontend

> A React + TypeScript dashboard for uploading videos to multiple platforms (YouTube, TikTok, Instagram, Facebook) simultaneously in a single click.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Pages & Features](#pages--features)
  - [User Area](#user-area)
  - [Admin Area](#admin-area)
- [Layouts & UI Components](#layouts--ui-components)
- [Internationalization (I18n)](#internationalization-i18n)
- [Theme & Design](#theme--design)
- [Routing](#routing)
- [Configuration](#configuration)
- [Roadmap](#roadmap)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.3 | Core UI library |
| **TypeScript** | 5.2 | Type safety |
| **Vite** | 5.3 | Build tool & dev server |
| **Material UI (MUI)** | 5.16 | UI component library |
| **React Router DOM** | 6.26 | Client-side routing |
| **Iconify** | 5.0 | Vector icon set |
| **Bun** | latest | Package manager & script runner |

---

## Getting Started

### Prerequisites

- **Bun** ≥ 1.0 or **Node.js** ≥ 18
- MultiUploads backend running at `http://localhost:4000`

### Install & Run

```bash
# Install dependencies
bun install

# Start dev server (port 3000)
bun run dev

# Production build
bun run build

# Preview production build (port 5000)
bun run preview

# Lint
bun run lint

# Lint & auto-fix
bun run lint:fix
```

---

## Project Structure

```
frontend/
├── public/
└── src/
    ├── App.tsx                  # Root component (theme + providers)
    ├── main.tsx                 # Entry point — React root render
    │
    ├── assets/                  # Static images (logo, backgrounds)
    │
    ├── components/
    │   ├── base/                # Atomic components: IconifyIcon, Image
    │   ├── common/              # Shared components used across pages
    │   ├── loading/             # PageLoader, Progress (Suspense fallbacks)
    │   └── sections/
    │       └── dashboard/       # Widget sections for the Dashboard page
    │           ├── platform-status/   # Per-platform connection status
    │           ├── quick-upload/      # Upload shortcut from dashboard
    │           ├── recent-uploads/    # Recent uploads table
    │           └── upload-stats/      # Stat cards (uploads today, quota, etc.)
    │
    ├── i18n/
    │   └── I18nContext.tsx      # Context + translation dictionaries (EN / ZH)
    │
    ├── layouts/
    │   ├── main-layout/         # Main layout (Sidebar + Topbar + Footer)
    │   │   ├── index.tsx        # Layout wrapper
    │   │   ├── sidebar/         # Collapsible navigation sidebar
    │   │   │   ├── index.tsx
    │   │   │   ├── DrawerItems.tsx
    │   │   │   ├── SidebarCard.tsx  # Dynamic plan card tracking daily quotas
    │   │   │   └── list-items/
    │   │   ├── topbar/          # Top header (notifications, language, profile)
    │   │   │   ├── index.tsx
    │   │   │   ├── Notifications.tsx
    │   │   │   ├── LanguageSelect.tsx
    │   │   │   └── ProfileMenu.tsx
    │   │   └── footer/          # Simple copyright footer
    │   ├── auth-layout/         # Two-column authentication layout
    │   ├── admin-layout/        # Admin panel layout
    │   └── admin-auth-layout/   # Admin sign-in layout
    │
    ├── pages/
    │   ├── dashboard/           # User Dashboard
    │   ├── upload/              # Video Upload page
    │   │   ├── Upload.tsx
    │   │   └── UploadSuccessModal.tsx
    │   ├── my-videos/           # Video list & status
    │   ├── billing/             # Pricing & Subscription page (standalone)
    │   │   └── Billing.tsx
    │   ├── profile/             # User profile
    │   ├── settings/            # Account settings
    │   ├── authentication/      # Sign In & Sign Up
    │   ├── errors/              # 404 page
    │   └── admin/               # All admin pages (9 pages)
    │
    ├── providers/
    │   ├── BreakpointsProvider.tsx  # Breakpoint helper context
    │   └── PlanContext.tsx          # Subscription plan syncer + quota configs
    │
    ├── routes/
    │   ├── paths.ts             # All URL path constants
    │   └── router.tsx           # React Router config (createBrowserRouter)
    │
    └── theme/
        ├── theme.ts             # Main MUI theme configuration
        ├── palette.ts           # Light/dark color palette
        ├── typography.ts        # Font & text sizing
        ├── shadows.ts           # Custom shadows
        ├── colors.ts            # Raw color tokens
        ├── components/          # MUI component style overrides
        └── styles/              # Global CSS / keyframe animations
```

---

## Pages & Features

### User Area

#### 🏠 Dashboard (`/`)
- **Upload Stats Cards** — uploads today, remaining daily quota, connected platforms count, total videos
- **Platform Status** — YouTube, TikTok, Instagram, Facebook connection status (inferred from upload history)
- **Recent Uploads** — table of the last 10 uploads with real-time status
- **Quick Upload** — shortcut button to the Upload page

#### 📤 Upload (`/upload`)
- **Drag & Drop Zone** — drag a file or click to browse; displays filename with line-clamping for long names
- **Multi-platform selection** — choose one or more target platforms simultaneously (YouTube Shorts, TikTok, Instagram Reels, Facebook Reels)
- **Metadata form** — title (required), description, tags
- **Custom thumbnail** — optional thumbnail image upload
- **Scheduled upload** — pick a date & time to schedule publishing
- **Global plan awareness** — pulls user `PlanId` directly from `PlanContext` to sync permissions natively with the backend rate limiter
- **Real-time progress bar** — powered by `XMLHttpRequest.upload.onprogress`; shows live upload percentage and speed (MB/s) based on actual bytes transferred
- **Upload success modal** — responsive confirmation dialog after a successful upload

#### 🎬 My Videos (`/my-videos`)
- Full list of all uploaded videos
- Filter by status: pending, processing, published, failed

#### 💳 Billing (`/billing`)
- **Standalone page** — no sidebar; uses only the Topbar header
- **Back to Dashboard** button
- **3 pricing tiers**: Basic ($4.55/mo), Premium ($9.09/mo), Enterprise ($21.21/mo)
- "Best Value" ribbon + orange border on the Premium plan card
- Hover animation on cards (lift effect)
- **Trust badges** — Secure Payments, 30-Day Money Back, 24/7 Support, Cancel Anytime
- **Enterprise CTA banner** — gradient banner with a "Contact Us" button for custom plans
- Fully integrated with `I18nContext` (EN / ZH)
- Ready to connect to a payment gateway (e.g. Midtrans)

#### 👤 Profile (`/profile`) & Settings (`/settings`)
- Account information and preference management

---

### Admin Area

> Access via `/admin/auth/sign-in`. Completely separate from the user area.

| Page | Path | Description |
|---|---|---|
| **Admin Dashboard** | `/admin` | Global platform statistics overview |
| **User Management** | `/admin/users` | CRUD users, suspend accounts, view details |
| **Upload History** | `/admin/uploads` | All uploads across all users |
| **Transaction History** | `/admin/transactions` | Payment transaction records |
| **Subscription Detail** | `/admin/subscriptions` | Per-user subscription status |
| **Announcements** | `/admin/announcements` | Broadcast announcements to users |
| **Error Logs** | `/admin/errors` | System error monitoring |
| **System Settings** | `/admin/settings` | Platform configuration |

---

## Layouts & UI Components

### MainLayout

Used by all user pages except `/billing` and `/authentication` routes.

```
┌─────────────┬──────────────────────────────────────┐
│             │  Topbar (Notifications | Lang | Profile)│
│   Sidebar   ├──────────────────────────────────────┤
│  (collapsed │                                       │
│  on mobile) │          <Page Content>               │
│             │                                       │
│  ┌─────────────────────┐                           │
│  │ Upgrade to Premium  │         Footer             │
│  └─────────────────────┘                           │
└──────────────────────────────────────────────────────┘
```

### Topbar
- **Logo** — visible on mobile/tablet only
- **Hamburger button** — toggles sidebar on mobile
- **Notifications** — dropdown with real-time notifications from backend
- **Language Select** — toggle EN ↔ ZH, persisted in `localStorage`
- **Profile Menu** — links to profile, settings, and logout

### SidebarCard
Displays the **active subscription plan**, today's **dynamic upload progress bar**, and remaining quota mapped intelligently via `PlanContext`. Features a smart promotional CTA (e.g., "Upgrade Plan" or "View Plans").

---

## Internationalization (I18n)

**File:** `src/i18n/I18nContext.tsx`

Custom i18n system built with React Context — no external library.

**Supported languages:**
- 🇬🇧 **English** (`en`) — default
- 🇨🇳 **Chinese / 中文** (`zh`)

**Usage:**

```tsx
import { useI18n } from 'i18n/I18nContext';

const MyComponent = () => {
  const { t, locale, setLocale } = useI18n();
  return <Typography>{t('dashboard.uploadsToday')}</Typography>;
};
```

**Adding new keys** — always add to **both** `en` and `zh` blocks:

```ts
// src/i18n/I18nContext.tsx
en: {
  'billing.newKey': 'English text here',
  ...
},
zh: {
  'billing.newKey': '中文文本',
  ...
},
```

Language preference is stored in `localStorage` under the key `"locale"`.

---

## Theme & Design

**Main file:** `src/theme/theme.ts`

- **Color mode**: Light (dark mode palette is pre-configured and ready to toggle)
- **Primary color**: Blue (`primary.main`)
- **Accent color**: Orange `#FF9800` used for premium/best-value highlights
- **Border radius**: Consistent scale using MUI's `borderRadius` multiplier (×4 px)
- **Component overrides**: Stored in `src/theme/components/`

---

## Routing

**File:** `src/routes/router.tsx`

Uses **React Router v6** with `createBrowserRouter`. All pages are lazy-loaded via `React.lazy` + `Suspense` for optimal bundle splitting.

```
/                         → Dashboard           (MainLayout)
/upload                   → Upload              (MainLayout)
/my-videos                → My Videos           (MainLayout)
/profile                  → Profile             (MainLayout)
/settings                 → Settings            (MainLayout)
/billing                  → Billing             (Standalone — no sidebar)
/authentication/sign-in   → Sign In             (AuthLayout)
/authentication/sign-up   → Sign Up             (AuthLayout)
/admin                    → Admin Dashboard     (AdminLayout)
/admin/users              → User Management     (AdminLayout)
/admin/uploads            → Upload History      (AdminLayout)
/admin/transactions       → Transaction History (AdminLayout)
/admin/subscriptions      → Subscription Detail (AdminLayout)
/admin/announcements      → Announcements       (AdminLayout)
/admin/errors             → Error Logs          (AdminLayout)
/admin/settings           → System Settings     (AdminLayout)
/admin/auth/sign-in       → Admin Sign In       (AdminAuthLayout)
*                         → 404 Not Found
```

> **Note:** `/billing` is intentionally placed **outside** of `MainLayout` so it renders without the sidebar — it functions as a standalone pricing page with only the Topbar.

---

## Configuration

### Vite (`vite.config.ts`)

| Setting | Value |
|---|---|
| Dev server port | `3000` |
| Preview port | `5000` |
| Host | `0.0.0.0` (accessible from other devices on the network) |
| TypeScript checker | Enabled during dev |
| ESLint checker | Enabled during dev |
| Path aliases | Via `vite-tsconfig-paths` |

### Path Aliases (`tsconfig.json`)

Import using paths relative to `src/` without `../../`:

```ts
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';
import Topbar from 'layouts/main-layout/topbar';
import paths from 'routes/paths';
```

### Backend API

Currently hardcoded to `http://localhost:4000`.

> For production, move to an environment variable: `VITE_API_URL`.

---

## Roadmap

- [ ] **Payment Integration** — Connect "Select Plan" buttons on `/billing` to Midtrans API
- [ ] **OAuth Connect Flow** — Formal flow for connecting/disconnecting YouTube, TikTok, Instagram, Facebook accounts
- [ ] **Environment Variables** — Move backend URL to `VITE_API_URL`
- [ ] **Dark Mode** — Light/dark theme toggle
- [ ] **Real-time Notifications** — WebSocket / SSE for live backend notifications

---

*Built with ❤️ for the MultiUploads Platform*