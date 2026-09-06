# Sunset - AI Job Application Tracker

Stop losing track of where you applied. One place to track every application, interview, and follow-up.

## Tech Stack

| Layer    | Technology                                                   |
| -------- | ------------------------------------------------------------ |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend  | Spring Boot 4.1.1, Java 21, Spring Data JPA                  |
| Auth     | Supabase Auth (JWT-based)                                    |
| Database | Supabase PostgreSQL                                          |
| Build    | pnpm (frontend), Maven (backend)                             |

## Features

### Available Now

- **Application Dashboard** — Data table with search, filter by status, sortable columns, pagination
- **CRUD Operations** — Create, read, update, and delete job applications
- **Interview Management** — Track interviews per application with type, status, outcome, and notes
- **Status Pipeline** — 11-stage tracking: Saved → Applied → Phone Screen → Interviewing → Assessment → Final Round → Offer → Accepted/Rejected/Withdrawn/Declined
- **Auth** — Login, signup, password reset via Supabase
- **Theme** — Light/dark mode support

### Coming Soon

- Resume builder
- Cover letter generator
- Bullet point generator
- Job fit analyzer
- Networking manager

## Architecture

```
┌──────────────┐        ┌─────────────────┐        ┌──────────────┐
│   Frontend   │──JWT──▶│     Backend     │──Hibernate──▶│ PostgreSQL  │
│  (Next.js)   │        │  (Spring Boot)  │        │  (Supabase)  │
│   :3000      │        │    :8080        │        │              │
└──────┬───────┘        └─────────────────┘        └──────────────┘
       │
       │ SDK
       ▼
  ┌────────────┐
  │  Supabase  │
  │    Auth    │
  └────────────┘
```

The frontend authenticates users directly with Supabase Auth, obtains JWTs, and forwards them to the backend. The backend validates JWTs via Spring Security's OAuth2 Resource Server (JWKS) and connects to Supabase Database (PostgreSQL) via Hibernate.

## Quick Start

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
pnpm install
pnpm dev
```

See [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) for detailed setup instructions.

## Environment Variables

### Backend

| Variable                     | Description                                    |
| ---------------------------- | ---------------------------------------------- |
| `SUNSET_DB_URL`              | PostgreSQL connection string                   |
| `SUNSET_DB_USERNAME`         | Database username                              |
| `SUNSET_DB_PASSWORD`         | Database password                              |
| `SUNSET_SUPABASE_JWT_ISSUER` | Supabase JWT issuer URI                        |
| `JWT_SECRET`                 | JWT secret key                                 |
| `FRONTEND_URL`               | CORS origin (default: `http://localhost:3000`) |

### Frontend

| Variable                        | Description                                        |
| ------------------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                             |
| `BACKEND_URL`                   | Backend API URL (default: `http://localhost:8080`) |

## Database Schema

Managed by Hibernate auto-DDL (`ddl-auto: update`). Tables are created in the `app` schema.

**job_applications** — Core entity with fields: company, title, location, work_mode, job_type, salary range, status, date_applied, source, contact info, job_url, notes, tags.

**interviews** — Linked to job_applications via foreign key. Fields: type, date, time, interviewer, status, outcome, notes.

Indexed on `user_id`, `status`, and a composite `(user_id, status)` for query performance.
