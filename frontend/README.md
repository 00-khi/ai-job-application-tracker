# Sunset - Frontend

Next.js frontend for the Sunset AI Job Application Tracker. See the [root README](../README.md) for full project context, architecture, and backend setup.

## Tech Stack

| Category        | Technology                              |
| --------------- | --------------------------------------- |
| Framework       | Next.js 16 (App Router)                 |
| UI              | React 19, shadcn/ui v4, Tailwind CSS v4 |
| Auth            | Supabase Auth (`@supabase/ssr`)         |
| Package Manager | pnpm 10.18.0                            |

## Prerequisites

- Node.js 18+
- pnpm 10.18.0 (`corepack enable && corepack prepare pnpm@10.18.0 --activate`)
- Backend API running on `http://localhost:8080`

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables (see below)
cp .env.example .env

# Start dev server
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable                        | Description                                             |
| ------------------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key                           |
| `BACKEND_URL`                   | Backend API base URL (default: `http://localhost:8080`) |

## Project Structure

```
frontend/
├── app/
│   ├── (authentication)/   # Login, signup
│   ├── (user)/             # Authenticated pages (sidebar + header)
│   ├── auth/               # Password reset
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── reusables/          # App-specific components
│   ├── interview/          # Interview CRUD dialogs
│   └── job-application/    # Application CRUD dialogs
├── contexts/               # Auth context
├── hooks/                  # Custom hooks
├── lib/                    # Utilities, API client, types
├── styles/                 # Global CSS, fonts
└── data/                   # Mock data
```

## Pages

| Route           | Status  | Description                             |
| --------------- | ------- | --------------------------------------- |
| `/`             | Live    | Marketing landing page                  |
| `/login`        | Live    | Email/password login                    |
| `/signup`       | Live    | Account creation                        |
| `/dashboard`    | Live    | Application overview, stats, data table |
| `/resume`       | Planned | AI resume builder                       |
| `/bullets`      | Planned | AI bullet point generator               |
| `/cover-letter` | Planned | AI cover letter generator               |
| `/job-fit`      | Planned | AI job fit analyzer                     |
| `/networking`   | Planned | Networking/connections manager          |
| `/privacy`      | Live    | Privacy policy                          |
| `/terms`        | Live    | Terms of service                        |

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```
