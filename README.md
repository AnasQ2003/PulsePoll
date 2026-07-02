<div align="center">

<img src="screenshots/Screenshot 2026-07-02 105750.png" width="220" alt="PulsePoll Splash Screen" />

# 🗳️ PulsePoll

### *Polls, beautifully done.*

**A full-stack, mobile-first poll application built with React, Node.js, and Microsoft SQL Server.**  
Premium glassmorphism UI · Live voting · PDF analytics reports · Dark mode · XP achievements

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![SQL Server](https://img.shields.io/badge/SQL_Server-MSSQL-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)](https://microsoft.com/sql-server)
[![TanStack Router](https://img.shields.io/badge/TanStack-Router_v1-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/router)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://framer.com/motion)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Database Setup](#database-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#-api-reference)
- [App Screens Guide](#-app-screens-guide)
- [Design System](#-design-system)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**PulsePoll** is a premium, full-stack polling platform designed with a mobile-first philosophy. It lets users create polls, vote in real time, discover trending community polls, track personal XP and achievements, and export detailed PDF analytics reports — all wrapped in a stunning glassmorphism UI that feels like a native iOS application.

The app is rendered as a **phone mockup on desktop** and transitions to a **full-screen native experience on mobile**, making it universally accessible.

---

## ✨ Features

### 🔐 Authentication
- **Email & Password Login / Sign Up** with JWT token-based sessions
- **Persistent sessions** — stay logged in across browser restarts
- **Auto-redirect** — always shows the login screen on app start; skips login if session is valid
- Terms of Service and Privacy Policy acceptance on registration

### 🏠 Home Dashboard
- **Personalized greeting** (Good morning / afternoon / evening)
- **Live poll stats hero** card — shows active polls waiting for your vote
- **Quick action buttons** — Create, Discover, Results, Alerts
- **Feed filtering** — For You / Trending / Tech / Culture tabs
- **Daily Challenge** — gamified voting streak with XP progress
- **Trending polls** section with real-time engagement data
- **Leaderboard** — top poll creators ranked by votes received
- **Live activity feed** — recent votes in real time
- Interactive poll cards with **Like, Comment, Bookmark, Share** actions

### 🔍 Discover
- **Search** polls by title, topic, or creator
- **Topic filters** — All, Trending, Fresh, Tech, Culture, Food, Sports, Music, Gaming
- **Trending hashtags** for quick exploration
- **Spotlight banners** — Community vote, Weekly digest, Creator spotlight
- **Grid and List view** toggle for personalized browsing

### ➕ Create Poll
- **Guided creation flow** with live preview
- Choose from **pre-built templates** (movie nights, naming, food debates)
- **Custom cover emoji** selector (10 options)
- **Question & description** with character counter
- **Category tags** — General, Technology, Culture, Food & Drinks, Sports
- **Dynamic options** — add up to 10 answer choices
- **Audience selector** — Everyone or Specific Users
  - Real-time user search with checkbox selection for private polls
- **Live preview card** updates as you type

### 🗳️ Poll Voting Screen
- Beautiful animated poll options with progress bars
- Real-time vote count and percentage breakdown
- **Vote confirmation** with smooth animations
- Poll metadata — creator, date, category, vote count
- Share and bookmark individual polls

### 📊 Results & Analytics
- View all your created polls with vote breakdowns
- **Export to PDF** — full detailed report including:
  - Cover page with aggregate metrics (total polls, total votes, average votes)
  - Per-poll breakdown with **bar charts** and **donut distribution charts**
  - **Automated AI-style insights** (e.g. "Option A leads with 42% — a clear favourite")
  - **Comparative all-polls page** with horizontal bar chart
- Filter polls by active/closed status
- Quick stats — Total Polls, Total Votes, Avg Votes/Poll

### 🔔 Notifications
- **Unread / Read** distinction with visual highlighting
- Real-time activity updates — new votes, poll milestones, follower activity
- **Mark as read** on tap
- Notification categories with icons

### 👤 Profile
- **Personalized profile card** with initials avatar
- **XP & Levelling system** — earn XP by voting (10 XP) and creating polls (50 XP)
- **Animated level progress bar**
- **Achievements** — Streak 7d, Top voter, Curator, Sharpshooter, Early bird, Beloved
- **Statistics** — Polls created, Votes cast, Total XP
- **Tabs** — Overview, My Polls, Voting History
- **Share profile** via Web Share API or clipboard copy
- Copy username handle button
- Quick links to Notifications, Settings, Results

### ✏️ Edit Profile
- Update display name, username, bio, phone number
- Changes persist to the database in real time
- Back navigation with confirmation

### ⚙️ Settings
- **Account** — Edit profile, Privacy & security
- **Notifications** — Push notifications toggle, Email digest toggle, Inbox shortcut
- **Appearance** — Dark mode toggle (instant theme switch), Accent color, Language
- **Experience** — Sounds toggle, Haptic feedback toggle, Export my data (JSON download)
- **About** — Terms of Service, Privacy Policy, Help & Support (creates ticket), Rate PulsePoll
- **Sign Out** with confirmation

### 🌙 Dark Mode
- Fully implemented dark theme with custom CSS variables
- Switches instantly without page reload
- Dark glassmorphism cards, dark body gradients, dark form fields

### 📄 Legal Pages
- Full **Terms of Service** page with detailed clauses
- Full **Privacy Policy** page covering data handling, cookies, and user rights

---

## 📱 Screenshots

> All screens captured from the live application

### Onboarding

| Splash Screen | Login | Sign Up |
|:---:|:---:|:---:|
| ![Splash](screenshots/Screenshot%202026-07-02%20105750.png) | ![Login](screenshots/Screenshot%202026-07-02%20105853.png) | ![Signup](screenshots/Screenshot%202026-07-02%20105901.png) |

| Terms & Privacy | Sign Up Form | Home Screen |
|:---:|:---:|:---:|
| ![Terms](screenshots/Screenshot%202026-07-02%20105910.png) | ![Signup Form](screenshots/Screenshot%202026-07-02%20105923.png) | ![Home](screenshots/Screenshot%202026-07-02%20110609.png) |

### Home & Navigation

| Home Feed | Side Drawer | Home Trending |
|:---:|:---:|:---:|
| ![Home Feed](screenshots/Screenshot%202026-07-02%20110615.png) | ![Drawer](screenshots/Screenshot%202026-07-02%20110630.png) | ![Trending](screenshots/Screenshot%202026-07-02%20110636.png) |

### Discover & Create

| Discover | Discover Grid | Create Poll |
|:---:|:---:|:---:|
| ![Discover](screenshots/Screenshot%202026-07-02%20110642.png) | ![Discover Grid](screenshots/Screenshot%202026-07-02%20110648.png) | ![Create](screenshots/Screenshot%202026-07-02%20110658.png) |

| Create Options | Audience Picker | Poll Preview |
|:---:|:---:|:---:|
| ![Create Options](screenshots/Screenshot%202026-07-02%20110710.png) | ![Audience](screenshots/Screenshot%202026-07-02%20110715.png) | ![Preview](screenshots/Screenshot%202026-07-02%20110721.png) |

### Voting & Results

| Poll Voting | Vote Confirmation | Results Overview |
|:---:|:---:|:---:|
| ![Poll](screenshots/Screenshot%202026-07-02%20110726.png) | ![Vote](screenshots/Screenshot%202026-07-02%20110733.png) | ![Results](screenshots/Screenshot%202026-07-02%20110740.png) |

| Results Detail | PDF Export | Analytics Charts |
|:---:|:---:|:---:|
| ![Results Detail](screenshots/Screenshot%202026-07-02%20110745.png) | ![PDF](screenshots/Screenshot%202026-07-02%20110751.png) | ![Charts](screenshots/Screenshot%202026-07-02%20110757.png) |

### Notifications & Profile

| Notifications | Profile | Profile Tabs |
|:---:|:---:|:---:|
| ![Notifications](screenshots/Screenshot%202026-07-02%20110803.png) | ![Profile](screenshots/Screenshot%202026-07-02%20110809.png) | ![Profile Tabs](screenshots/Screenshot%202026-07-02%20110816.png) |

| My Polls Tab | Edit Profile | Edit Profile Form |
|:---:|:---:|:---:|
| ![My Polls](screenshots/Screenshot%202026-07-02%20110822.png) | ![Edit Profile](screenshots/Screenshot%202026-07-02%20110833.png) | ![Edit Form](screenshots/Screenshot%202026-07-02%20110841.png) |

### Settings & Appearance

| Settings Main | Settings Notifications | Settings Appearance |
|:---:|:---:|:---:|
| ![Settings](screenshots/Screenshot%202026-07-02%20110850.png) | ![Notif Settings](screenshots/Screenshot%202026-07-02%20110855.png) | ![Appearance](screenshots/Screenshot%202026-07-02%20110902.png) |

| Dark Mode | Settings About | Terms of Service |
|:---:|:---:|:---:|
| ![Dark Mode](screenshots/Screenshot%202026-07-02%20110918.png) | ![About](screenshots/Screenshot%202026-07-02%20110928.png) | ![Terms](screenshots/Screenshot%202026-07-02%20110951.png) |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI framework |
| **TypeScript** | 5.8 | Type safety |
| **Vite** | 8.x | Build tool & dev server |
| **TanStack Router** | 1.x | File-system based routing |
| **TanStack Query** | 5.x | Server state management & caching |
| **Framer Motion** | 12.x | Animations & transitions |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Lucide React** | 0.575 | Icon library |
| **Sonner** | 2.x | Toast notifications |
| **jsPDF** | 4.x | PDF report generation |
| **Radix UI** | Latest | Accessible headless components |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | Runtime |
| **Express.js** | 4.x | REST API framework |
| **MSSQL** | 10.x | Microsoft SQL Server driver |
| **bcryptjs** | 2.x | Password hashing |
| **jsonwebtoken** | 9.x | JWT authentication |
| **dotenv** | 16.x | Environment configuration |
| **nodemon** | 3.x | Development auto-reload |

### Database
| Technology | Purpose |
|---|---|
| **Microsoft SQL Server** | Primary data store |
| **T-SQL** | Stored queries for polls, votes, users |

---

## 📁 Project Structure

```
PulsePoll/
├── 📁 backend/                    # Node.js REST API
│   ├── 📁 config/
│   │   └── db.js                  # SQL Server connection pool
│   ├── 📁 database/
│   │   └── schema.sql             # Database schema & seed scripts
│   ├── 📁 middleware/
│   │   └── auth.js                # JWT authentication middleware
│   ├── 📁 routes/
│   │   ├── auth.js                # POST /register, POST /login
│   │   ├── polls.js               # CRUD for polls
│   │   ├── votes.js               # Vote submission & retrieval
│   │   ├── profiles.js            # User profile management
│   │   ├── notifications.js       # Notification feed
│   │   └── stats.js               # Leaderboard & activity feed
│   ├── server.js                  # Express app entry point
│   ├── .env.example               # Environment variable template
│   └── package.json
│
├── 📁 frontend/                   # React + Vite application
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   └── 📁 mobile/
│   │   │       ├── AppShell.tsx   # Screen wrapper with header & nav bar
│   │   │       ├── Drawer.tsx     # Side navigation drawer
│   │   │       ├── NavBar.tsx     # Bottom tab navigation
│   │   │       └── PhoneShell.tsx # Desktop phone mockup wrapper
│   │   ├── 📁 hooks/              # Custom React hooks
│   │   ├── 📁 lib/
│   │   │   ├── api.ts             # Centralized API request helper
│   │   │   └── auth.tsx           # Auth context & session management
│   │   ├── 📁 routes/
│   │   │   ├── __root.tsx         # Root layout with Sonner toaster
│   │   │   ├── index.tsx          # Splash screen with animated loader
│   │   │   ├── auth.tsx           # Login & Sign Up forms
│   │   │   ├── privacy.tsx        # Privacy Policy page
│   │   │   ├── terms.tsx          # Terms of Service page
│   │   │   └── 📁 _authenticated/ # Protected routes (require login)
│   │   │       ├── route.tsx      # Auth guard layout
│   │   │       ├── home.tsx       # Home dashboard & feed
│   │   │       ├── discover.tsx   # Poll discovery & search
│   │   │       ├── create.tsx     # Poll creation wizard
│   │   │       ├── poll.$id.tsx   # Individual poll voting screen
│   │   │       ├── results.tsx    # Analytics & PDF export
│   │   │       ├── notifications.tsx  # Notification feed
│   │   │       ├── profile.index.tsx  # User profile page
│   │   │       ├── profile.edit.tsx   # Edit profile form
│   │   │       └── settings.tsx   # App settings
│   │   ├── routeTree.gen.ts       # Auto-generated by TanStack Router
│   │   ├── router.tsx             # Router configuration
│   │   └── styles.css             # Global CSS + design tokens
│   └── package.json
│
├── 📁 screenshots/                # App screenshots for README
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher → [Download](https://nodejs.org)
- **npm** v9+ (comes with Node.js)
- **Microsoft SQL Server** (2019 or higher recommended) → [Download Developer Edition](https://www.microsoft.com/sql-server/sql-server-downloads)
- **SQL Server Management Studio (SSMS)** → [Download](https://learn.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) *(optional but recommended)*
- **Git** → [Download](https://git-scm.com)

---

### Database Setup

1. **Open SQL Server Management Studio** and connect to your SQL Server instance.

2. **Create the database:**
   ```sql
   CREATE DATABASE PulsePollDB;
   USE PulsePollDB;
   ```

3. **Run the schema** (found in `backend/database/schema.sql`):
   ```sql
   -- Creates: Users, Polls, PollOptions, Votes, Notifications tables
   -- Run the entire schema.sql file in SSMS
   ```

4. **Create a SQL Server login** for the application:
   ```sql
   CREATE LOGIN pulsepoll_user WITH PASSWORD = 'YourSecurePassword123!';
   USE PulsePollDB;
   CREATE USER pulsepoll_user FOR LOGIN pulsepoll_user;
   ALTER ROLE db_owner ADD MEMBER pulsepoll_user;
   ```

---

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/PulsePoll.git
   cd PulsePoll
   ```

2. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   ```

   Edit `.env` with your actual values:
   ```env
   # SQL Server connection
   DB_SERVER=localhost
   DB_PORT=1433
   DB_NAME=PulsePollDB
   DB_USER=pulsepoll_user
   DB_PASSWORD=YourSecurePassword123!

   # JWT Secret (use a long random string — minimum 32 characters)
   JWT_SECRET=my_super_secret_jwt_key_change_this_in_production

   # Server port
   PORT=5000
   ```

5. **Start the backend server:**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

   You should see:
   ```
   🟢 PulsePoll API running on http://localhost:5000
   ```

6. **Verify it's working:**
   ```
   GET http://localhost:5000/api/health
   ```
   Expected response:
   ```json
   { "status": "ok", "app": "PulsePoll API", "timestamp": "..." }
   ```

---

### Frontend Setup

1. **Open a new terminal** and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # The frontend .env is already present and pre-configured:
   # VITE_API_URL=http://localhost:5000/api
   ```

   If needed, edit `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE ready in Xms

   ➜  Local:   http://localhost:8080/
   ```

5. **Open your browser** and go to [http://localhost:8080](http://localhost:8080)

6. **Create your first account:**
   - Click **Sign Up** on the login screen
   - Enter your name, email, and password
   - Accept the Terms & Privacy Policy
   - Click **Sign Up** — you'll be taken to the home screen

---

## 📡 API Reference

All API routes are prefixed with `/api`. Authentication required routes need a `Bearer` JWT token in the `Authorization` header.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT token |

**Register body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "johndoe",
  "display_name": "John Doe"
}
```

**Login body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (both):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "email": "user@example.com", "username": "johndoe" }
}
```

---

### Polls

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/polls` | ✅ | Get all polls (with vote counts) |
| `GET` | `/api/polls/mine` | ✅ | Get polls created by current user |
| `GET` | `/api/polls/:id` | ✅ | Get single poll with options & votes |
| `POST` | `/api/polls` | ✅ | Create a new poll |
| `DELETE` | `/api/polls/:id` | ✅ | Delete a poll (owner only) |

**Create poll body:**
```json
{
  "title": "Best programming language?",
  "description": "Vote for your favourite",
  "category": "Technology",
  "cover_emoji": "💻",
  "options": ["Python", "TypeScript", "Rust", "Go"]
}
```

---

### Votes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/votes` | ✅ | Submit a vote on a poll option |
| `GET` | `/api/votes/poll/:pollId` | ✅ | Get all votes for a poll |

**Vote body:**
```json
{
  "poll_id": 1,
  "option_id": 3
}
```

---

### Profiles

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/profiles/me` | ✅ | Get current user's profile |
| `PATCH` | `/api/profiles/me` | ✅ | Update profile fields |
| `GET` | `/api/profiles/stats` | ✅ | Get voted count & created polls count |
| `GET` | `/api/profiles/search?q=` | ✅ | Search users by name or username |

---

### Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/notifications` | ✅ | Get notification feed for current user |

---

### Stats

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/stats/leaderboard` | ✅ | Top poll creators by vote count |
| `GET` | `/api/stats/activity` | ✅ | Recent activity feed |

---

## 📖 App Screens Guide

| Screen | Route | Description |
|--------|-------|-------------|
| **Splash** | `/` | Animated loading screen, always navigates to Login |
| **Login / Sign Up** | `/auth` | Authentication forms with JWT session management |
| **Terms of Service** | `/terms` | Full terms page |
| **Privacy Policy** | `/privacy` | Full privacy page |
| **Home** | `/home` | Dashboard with feed, leaderboard, daily challenge |
| **Discover** | `/discover` | Browse and search all polls |
| **Create Poll** | `/create` | Multi-step poll creation wizard |
| **Poll** | `/poll/:id` | Vote on a specific poll |
| **Results** | `/results` | Analytics dashboard + PDF export |
| **Notifications** | `/notifications` | Activity notifications feed |
| **Profile** | `/profile` | User profile with achievements & stats |
| **Edit Profile** | `/profile/edit` | Update name, bio, username, phone |
| **Settings** | `/settings` | App preferences, dark mode, data export |

---

## 🎨 Design System

PulsePoll uses a custom design system built on top of Tailwind CSS 4 with OKLCH color space for perceptually uniform colors.

### Color Palette
| Token | Light Value | Usage |
|-------|-------------|-------|
| `--ember` | `oklch(0.68 0.21 36)` | Primary accent — orange-red brand color |
| `--ember-soft` | `oklch(0.96 0.04 50)` | Soft tinted backgrounds |
| `--background` | `oklch(1 0 0)` | App background (pure white in light mode) |
| `--foreground` | `oklch(0.13 0 0)` | Primary text |
| `--muted-foreground` | `oklch(0.45 0 0)` | Secondary / placeholder text |

### Glass Morphism
```css
.glass {
  background: oklch(1 0 0 / 0.55);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid oklch(1 0 0 / 0.7);
}
```

### Dark Mode
Dark mode is toggled by adding the `.dark` class to `<html>`. All CSS variables automatically switch to dark variants, including glass cards, body ambient gradients, and form fields.

### Typography
- **Display font** — Inter (headings with `-0.02em` letter-spacing)
- **Body font** — Inter (system font stack fallback)
- Font smoothing — `-webkit-font-smoothing: antialiased`

### Motion
All animations use **Framer Motion** with:
- Spring physics for card entrances
- `AnimatePresence` for route transitions
- `whileTap` micro-interactions on all interactive elements
- Layout animations for toggle switches

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. Open a **Pull Request**

### Commit Convention
We use [Conventional Commits](https://conventionalcommits.org):
- `feat:` — New feature
- `fix:` — Bug fix
- `style:` — UI/CSS changes
- `refactor:` — Code refactoring
- `docs:` — Documentation changes
- `chore:` — Build/tooling changes

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 PulsePoll

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👨‍💻 Author

**Anas Ahmed Qureshi.** — [@AnasQ2003](https://github.com/AnasQ2003)

---

<div align="center">

**Built with ❤️ using React, Node.js, and a passion for beautiful UX**

⭐ **Star this repo** if you found it useful!

</div>
