# Read2Ship

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=111)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=fff)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4-000?logo=express&logoColor=fff)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=fff)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-ready-4169E1?logo=postgresql&logoColor=fff)](https://www.postgresql.org/)
[![daily.dev](https://img.shields.io/badge/daily.dev-Public_API-CE3DF3)](https://docs.daily.dev/)

Read2Ship is a responsive developer tool that turns a developer's daily.dev reading activity into practical mini-projects, implementation tasks, and shareable build plans.

It analyzes the posts a developer reads or saves, detects themes and technology signals, then uses AI to generate a focused project idea that can actually be shipped.

## Contents

- [Why Read2Ship](#why-read2ship)
- [Features](#features)
- [Screens](#screens)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Routes](#routes)
- [API Reference](#api-reference)
- [Data And Privacy](#data-and-privacy)
- [Deployment](#deployment)
- [Validation](#validation)

## Why Read2Ship

Developers read a lot: tutorials, release notes, architecture posts, security writeups, AI workflows, framework updates. The hard part is turning that reading into something useful.

Read2Ship closes that gap by converting reading signals into:

- Clean reading themes with explanations.
- Detected technology stack signals with post evidence.
- A developer direction summary.
- A generated build plan with tasks, difficulty, estimated time, stack, and inspired articles.
- A public share card that matches the user's daily.dev profile and generated plan.

The app also includes sample mode, so it can be demoed without daily.dev, database, or AI credentials.

## Features

- Landing page based on the Stitch design handoff.
- daily.dev token entry flow.
- Sample/demo mode for instant local testing.
- Overview dashboard with:
  - profile avatar and username
  - top 5 reading themes
  - detected tech stack
  - clickable post evidence
  - paginated recent posts
  - developer direction insight
- AI-generated build plan page with:
  - generated project title and summary
  - difficulty, estimated time, and track
  - implementation tasks
  - recommended stack
  - inspired daily.dev reads
  - Copy Plan action
  - Create Share Card action
  - Regenerate action with difficulty selection
- Public `/plan/:slug` share page.
- Copy Link and Download Card actions.
- Honest fallback behavior:
  - no silent fake AI plan
  - local fallback is explicit
  - AI-generated plans can still display locally if database persistence fails
- Backend API with daily.dev analysis, AI plan generation, and PostgreSQL plan storage.

## Screens

Design references live in [`docs/stitch-screens`](docs/stitch-screens).

| Screen | Reference |
| --- | --- |
| Landing | [`landing_page.png`](docs/stitch-screens/landing_page.png) |
| Connect | [`connect_page.png`](docs/stitch-screens/connect_page.png) |
| Analysis Dashboard | [`analysis_dashboard.png`](docs/stitch-screens/analysis_dashboard.png) |
| Generated Build Plan | [`generated_build_plan.png`](docs/stitch-screens/generated_build_plan.png) |
| Public Shareable Plan | [`public_shareable_plan.png`](docs/stitch-screens/public_shareable_plan.png) |

The implementation follows the Stitch handoff in [`docs/DESIGN.md`](docs/DESIGN.md) and [`docs/STITCH_HANDOFF.md`](docs/STITCH_HANDOFF.md).

## Tech Stack

Frontend:

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Lucide React
- Space Grotesk
- html-to-image

Backend:

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- daily.dev Public API
- OpenAI-compatible AI generation
- Gemini-compatible configuration through `AI_PROVIDER=gemini`

## Project Structure

```text
Read2Ship/
  frontend/     Vite React app, screens, reusable components, sample mode
  backend/      Express API, daily.dev integration, Prisma, AI generation
  docs/         Stitch handoff, design notes, screen references
```

Key frontend areas:

```text
frontend/src/app/          App routing
frontend/src/components/   Shared UI components
frontend/src/features/     Landing, Connect, Dashboard, Build Plan, Public Plan
frontend/src/lib/          API, session, sharing, fallback, display utilities
frontend/src/data/         Sample analysis and plan data
frontend/src/types/        Shared TypeScript shapes
```

Key backend areas:

```text
backend/src/routes/        API route handlers
backend/src/services/      daily.dev analysis, AI plan generation, persistence
backend/src/lib/           Prisma and error helpers
backend/prisma/            Schema and migrations
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure frontend environment

Create `frontend/.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

The frontend can run without backend credentials in sample mode.

### 3. Configure backend environment

Create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Then fill in the values in `backend/.env`.

### 4. Start PostgreSQL locally

Use any local PostgreSQL setup you prefer. The default example expects:

```text
postgresql://read2ship:read2ship@localhost:5432/read2ship?schema=public
```

If your local database uses a different user, password, host, or database name, update `DATABASE_URL` in `backend/.env`.

### 5. Generate Prisma client and run migrations

```bash
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
```

### 6. Run the backend

```bash
npm run dev:backend
```

Backend default:

```text
http://localhost:4000
```

### 7. Run the frontend

In another terminal:

```bash
npm run dev:frontend
```

Frontend default:

```text
http://localhost:5173
```

## Environment Variables

### Frontend

| Variable | Example | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:4000` | Backend API base URL used by the Vite app. |

### Backend

| Variable | Example | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://read2ship:read2ship@localhost:5432/read2ship?schema=public` | PostgreSQL connection string used by Prisma. |
| `AI_PROVIDER` | `gemini` | AI provider mode. Supports OpenAI-compatible clients. |
| `AI_API_KEY` | `your_gemini_api_key_here` | AI provider API key. |
| `AI_MODEL` | `gemini-3.5-flash` | Model used for build plan generation. |
| `AI_BASE_URL` | `https://generativelanguage.googleapis.com/v1beta/openai/` | OpenAI-compatible API base URL for Gemini. |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | Allowed frontend origin for CORS. |
| `PORT` | `4000` | Backend server port. |

The daily.dev token is entered by the user at runtime and is never stored.

## Routes

Frontend routes:

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/connect` | daily.dev token entry and sample plan entry |
| `/dashboard` | Reading analysis overview |
| `/build-plan` | Generated build plan |
| `/plan/:slug` | Public shareable plan |

## API Reference

### `GET /api/health`

Returns backend health.

```json
{
  "ok": true,
  "service": "read2ship-backend"
}
```

### `POST /api/dailydev/preview`

Accepts a daily.dev token for a one-time preview request.

```json
{
  "token": "daily_dev_token"
}
```

The token is used only for the request and is not persisted.

### `POST /api/dailydev/analyze`

Fetches and normalizes daily.dev reading activity into themes, stack signals, recent posts, developer direction, and recommendations.

```json
{
  "token": "daily_dev_token"
}
```

### `POST /api/plans/generate`

Generates a build plan from reading analysis.

```json
{
  "analysis": {},
  "difficulty": "Intermediate"
}
```

`difficulty` is optional and must be one of:

- `Beginner`
- `Intermediate`
- `Advanced`

If AI generation succeeds but database storage fails, the API returns the generated plan with `persistenceStatus: "not_stored"` so the frontend can still show it locally.

### `GET /api/plans/:slug`

Returns a stored public plan by slug.

## Data And Privacy

Read2Ship is intentionally conservative with user data.

- daily.dev API tokens are accepted only in request bodies.
- daily.dev API tokens are never stored in PostgreSQL.
- Tokens are never echoed back to the frontend.
- Generated plans are the only persisted records.
- Public share pages are based on generated plan content, not saved daily.dev credentials.

## Deployment

The intended deployment split is:

- Frontend on Vercel.
- Backend on Render.
- PostgreSQL on Render or another managed PostgreSQL provider.

Frontend build settings:

```text
Root directory: frontend
Build command: npm run build
Output directory: dist
```

Backend build settings:

```text
Root directory: backend
Build command: npm install && npm run build
Start command: npm run start
```

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for the deployment checklist and environment variable notes.

## Validation

Useful local checks:

```bash
npm run typecheck --workspace frontend
npm run typecheck --workspace backend
npm run build --workspace frontend
npm run build --workspace backend
```

Known Windows note: if the backend build fails during `prisma generate` with a locked Prisma query engine DLL, stop the running backend dev server and rerun the command.

## Sample Mode

Sample mode is available from the Connect page. It lets judges or reviewers see the complete product flow without configuring daily.dev, PostgreSQL, or an AI provider.

Sample flow:

```text
Landing -> Connect -> Try Sample Plan -> Dashboard -> Build Plan -> Share Card
```

API mode flow:

```text
Landing -> Connect -> Paste daily.dev token -> Analyze -> Generate Plan -> Share Card
```
