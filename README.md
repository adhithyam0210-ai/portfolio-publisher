# PortfolioCraft – Portfolio Builder & Publishing Platform

A modern, responsive, production-grade full-stack web application designed for developers, designers, and professionals to build, customize, preview, and publish stunning online portfolios with zero coding required.

---

## 🌟 Key Features

### 1. User Portal
- **Secure Authentication & Onboarding**: Form validation, password encryption via `bcryptjs`, and session state managed through JSON Web Tokens (`jsonwebtoken`).
- **Dynamic Completion Gauge**: Real-time profile completion percentage dynamically calculated across personal info, projects, skills, education, experience, resume, and socials.
- **Publication Lifecycle**: Toggle between `DRAFT`, `PUBLISHED`, and `UNPUBLISHED` with 1 click.
- **Portfolio Sharing & Dynamic QR Code**: Dynamic QR code rendered via canvas with PNG download option, copyable clean link with instant tooltip feedback, and 1-click direct share buttons for WhatsApp, LinkedIn, X (Twitter), and Email.
- **Rich Multi-Step Builder**:
  - **Personal Info**: Avatar photo upload with instant preview, title, bio, location, contact, and social profiles.
  - **Education**: Add, edit, and delete academic degrees, grades, years, and coursework.
  - **Skills**: Skill chip tags with 4 proficiency levels (Beginner, Intermediate, Advanced, Expert) and quick-add suggestions.
  - **Projects**: Project showcase cards with live demo links, GitHub repositories, tech stacks, and cover images.
  - **Experience**: Timeline work history with "Currently working here" toggle, descriptions, and measurable impact points.
  - **Certifications & Achievements**: Industry credentials, verification URLs, hackathon awards, and recognitions.
  - **Resume Document Manager**: File upload with size validation (< 10MB PDF/DOC/DOCX), download link, and replace/delete support.
  - **Template & Style Customization**: Select across 4 distinct design archetypes, color themes (dark/light), typography pairings, custom accent highlight swatches, and individual section visibility toggles.
- **Live Synchronized Preview**: Isolated split-view preview pane with responsive device switcher (Desktop 100%, Tablet 768px, Mobile 375px) reflecting all input changes in real time.
- **Account & Privacy Settings**: Custom public slug management (e.g. `/portfolio/:slug`), password update, and privacy controls (toggle email visibility, phone visibility, and resume downloads).

### 2. The 4 Showcase Templates
1. **Modern Glass** (`modern`): Contemporary tech portfolio featuring glassmorphism cards, glowing gradient badges, hover lift animations, and neon accent highlights.
2. **Executive Timeline** (`professional`): Sophisticated corporate layout, structured career timeline, clean metadata hierarchy, and deep navy/slate accents.
3. **Swiss Minimalist** (`minimal`): High-contrast typographic aesthetic, thin line borders, abundant whitespace, and sleek line-separated project lists.
4. **Creative Flair** (`creative`): Expressive developer/designer layout with morphing profile avatar, warm coral and violet highlights, and asymmetrical project showcases.

### 3. Admin Portal (`/admin`)
- Accessible strictly by users with role `ADMIN`.
- **Platform Telemetry**:
  - Total registered users and 7-day registration trends.
  - Active vs. Inactive account counts.
  - Published vs. Draft/Unpublished portfolio distribution.
  - Total projects and resumes uploaded platform-wide.
- **User Management & Moderation**:
  - Real-time search across username, email, and full name.
  - Filter by Role (`USER` / `ADMIN`) and Status (`ACTIVE` / `INACTIVE`).
  - User detail modal inspecting portfolio counts.
  - Account activation / deactivation (deactivated users blocked from authentication).
  - Administrative password resets.
  - Cascading account deletion with confirmation modal.
  - Read-only published portfolio auditing (strictly enforcing content integrity: admins cannot tamper with user portfolio contents).

### 4. Public Portfolio Engine (`/portfolio/:slug`)
- Publicly viewable without authentication.
- Automatically renders chosen template, typography font, theme, and custom accent color.
- Filtered by user privacy settings (respecting hidden emails, phones, or disabled resume downloads).
- If the portfolio is in draft or unpublished state, visitors receive a clean, friendly "Portfolio Not Published" screen.

---

## 🔑 Demo Accounts & Credentials

The database is pre-seeded with ready-to-test accounts:

| Role | Username | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin@platform.com` | `AdminPassword@123` | Executive access to `/admin` telemetry and user management |
| **Published User** | `john-doe` | `john@example.com` | `UserPassword@123` | Published portfolio at `/portfolio/john-doe` with full data (90% completion) |
| **Draft User** | `sarah-tech` | `sarah@example.com` | `UserPassword@123` | Draft portfolio at `/portfolio/sarah-tech` (demonstrates unpublished privacy state) |

> 💡 *Quick Login Tip:* On the login screen, click any of the **Quick 1-Click Demo Accounts** buttons for instant sign-in without typing credentials.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18 + Vite, custom Vanilla CSS Design System with CSS variables and glassmorphism, Lucide SVG icons, `qrcode` dynamic canvas generation.
- **Backend API**: Node.js + Express.js REST API with JWT authentication and Multer file upload storage.
- **Database**: Relational SQLite database (`server/data/portfolio.sqlite`) with ACID transactions, foreign keys with `ON DELETE CASCADE`, and automated schema migration & seeder.
- **Static Assets**: Stored under `/uploads/avatars` and `/uploads/resumes`.

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)
- npm

### 1. Start the Backend API Server
```powershell
cd server
npm install
npm start
```
*Backend runs on `http://localhost:5000` with health check at `http://localhost:5000/api/health`.*

### 2. Start the Frontend Client
```powershell
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🧪 Verification & Testing Summary

1. **Backend Endpoints Verified**:
   - `GET /api/health` (HTTP 200 `online`)
   - `POST /api/auth/login` (Admin & standard user tokens generated)
   - `GET /api/portfolio/me` (Full portfolio payload with completion score)
   - `GET /api/public/portfolio/john-doe` (HTTP 200 with complete public data)
   - `GET /api/public/portfolio/sarah-tech` (HTTP 404 with `UNPUBLISHED` code)
   - `GET /api/admin/stats` (HTTP 200 with platform telemetry)
   - Role guard verification: normal users receive HTTP 403 when requesting `/api/admin/*`.
2. **Frontend Build Verified**:
   - `npm run build` completed in 3.27s with zero errors or bundle warnings.
