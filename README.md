# Read2Ship

Read2Ship turns a developer's daily.dev reading activity into practical mini-projects, implementation tasks, and shareable build plans.

## Project Structure

- `frontend/` - Vite, React, TypeScript, Tailwind CSS, sample-mode UI.
- `backend/` - Express, TypeScript, Prisma, PostgreSQL, daily.dev Public API integration, AI plan generation.
- `docs/` - Mirrored Stitch design handoff and reference screens.

## Local Development

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev:frontend
```

Run the backend:

```bash
cp backend/.env.example backend/.env
npm run prisma:generate --workspace backend
npm run dev:backend
```

The app works in sample mode without backend credentials. API mode requires:

- `DATABASE_URL`
- `AI_PROVIDER=gemini`
- `AI_API_KEY`
- `AI_MODEL=gemini-3.5-flash`
- `FRONTEND_ORIGIN`
- daily.dev Plus personal access token entered by the user at runtime

Read2Ship never stores the daily.dev API token. It stores generated plans only.

## Key Routes

- `/` - Landing page
- `/connect` - daily.dev token entry and sample plan entry
- `/dashboard` - reading analysis dashboard
- `/build-plan` - generated build plan
- `/plan/:slug` - public shareable plan page

## API Routes

- `GET /api/health`
- `POST /api/dailydev/preview`
- `POST /api/dailydev/analyze`
- `POST /api/plans/generate`
- `GET /api/plans/:slug`
