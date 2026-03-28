# MultiUploads

<p align="center">
  <img src="src/assets/images/LogoWithBG.png" alt="MultiUploads Logo" width="80" />
</p>

<p align="center">
  <strong>Multi-Platform Short Video Uploader</strong><br/>
  Upload your short-form videos to YouTube Shorts, Facebook Reels, Instagram Reels, and TikTok — all at once.
</p>

---

## ✨ Features

- **Multi-Platform Upload** — Distribute short videos to YouTube Shorts, Facebook Reels, Instagram Reels, and TikTok simultaneously
- **Dashboard** — Overview of upload stats, platform connection status, and recent uploads
- **My Videos** — Track all uploaded videos with status (published, processing, failed) and view counts
- **Upload Page** — Drag & drop video upload with platform selection, video details, thumbnail, and scheduling
- **Profile & Settings** — Manage account info, notification preferences, and security
- **i18n Support** — English and Chinese (中文) language support with easy switching
- **Coming Soon Modal** — Analytics feature placeholder
- **Responsive Design** — Fully responsive across desktop and mobile
- **Dark Sidebar** — Modern split-layout with dark sidebar navigation

## 🛠 Tech Stack

| Layer          | Technology                                                                     |
| -------------- | ------------------------------------------------------------------------------ |
| **Framework**  | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 5](https://vitejs.dev/)                                                  |
| **UI Library** | [MUI (Material UI) v5](https://mui.com/)                                       |
| **Routing**    | [React Router v6](https://reactrouter.com/)                                    |
| **Icons**      | [Iconify](https://iconify.design/) via `@iconify/react`                        |
| **Styling**    | MUI Theme + Emotion (`@emotion/react`, `@emotion/styled`)                      |
| **i18n**       | Custom lightweight context-based solution                                      |
| **Linting**    | ESLint + Prettier                                                              |

## 📁 Project Structure

```
multiuploads/
├── backend/                    # Backend (placeholder)
└── frontend/
    ├── public/                 # Static assets
    ├── src/
    │   ├── assets/images/      # Logos, avatars, auth backgrounds
    │   ├── components/
    │   │   ├── base/           # IconifyIcon, Image
    │   │   ├── common/         # Shared components
    │   │   ├── loading/        # PageLoader, Progress
    │   │   └── sections/
    │   │       └── dashboard/  # Dashboard widgets
    │   │           ├── upload-stats/
    │   │           ├── platform-status/
    │   │           ├── recent-uploads/
    │   │           └── quick-upload/
    │   ├── data/               # Static/mock data
    │   ├── hooks/              # Custom React hooks
    │   ├── i18n/               # Internationalization (EN/ZH)
    │   ├── layouts/
    │   │   ├── auth-layout/    # Auth pages layout
    │   │   └── main-layout/    # Dashboard layout (sidebar + topbar + footer)
    │   ├── pages/
    │   │   ├── authentication/ # SignIn, SignUp
    │   │   ├── dashboard/      # Main dashboard
    │   │   ├── upload/         # Video upload page
    │   │   ├── my-videos/      # Video library
    │   │   ├── profile/        # User profile
    │   │   ├── settings/       # Account settings
    │   │   └── errors/         # 404 page
    │   ├── providers/          # BreakpointsProvider
    │   ├── routes/             # Router, paths, sitemap
    │   └── theme/              # MUI theme customization
    │       ├── components/     # Component-level overrides
    │       ├── styles/         # Global styles
    │       ├── colors.ts
    │       ├── palette.ts
    │       ├── shadows.ts
    │       ├── typography.ts
    │       └── theme.ts
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** or **bun**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/multiuploads.git
cd multiuploads/frontend

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start the dev server (default: http://localhost:3000)
npm run dev
```

### Build

```bash
# Type-check and build for production
npm run build

# Preview production build (http://localhost:5000)
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint

# Run ESLint with auto-fix
npm run lint:fix
```

## 🌐 Supported Platforms

| Platform        | Format                   |
| --------------- | ------------------------ |
| YouTube Shorts  | Vertical (9:16), max 60s |
| Facebook Reels  | Vertical (9:16), max 60s |
| Instagram Reels | Vertical (9:16), max 60s |
| TikTok          | Vertical (9:16), max 60s |

## 🌍 Internationalization

The app supports **English** and **Chinese (中文)** out of the box. Language can be switched via the language selector in the top bar.

To add a new language:

1. Open `src/i18n/I18nContext.tsx`
2. Add a new locale key to the `Locale` type
3. Add the translation dictionary in the `translations` object
4. Update the language selector component in `layouts/main-layout/topbar/LanguageSelect.tsx`

## 📝 Available Routes

| Route                     | Page      | Description                                        |
| ------------------------- | --------- | -------------------------------------------------- |
| `/`                       | Dashboard | Upload stats, platform status, recent uploads      |
| `/upload`                 | Upload    | Drag-and-drop video upload with platform selection |
| `/my-videos`              | My Videos | Video library with status tracking                 |
| `/profile`                | Profile   | User profile overview                              |
| `/settings`               | Settings  | Account, notifications, password, danger zone      |
| `/authentication/sign-in` | Sign In   | Login page                                         |
| `/authentication/sign-up` | Sign Up   | Registration page                                  |
| `*`                       | 404       | Page not found                                     |

## 📄 License

This project is private and not licensed for public distribution.