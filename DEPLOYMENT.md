# Deployment Notes

## Frontend on Vercel

Create a Vercel project from `frontend/`.

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:
  - `VITE_API_BASE_URL=https://your-render-service.onrender.com`

The frontend is fully static and keeps sample mode available when the backend is unavailable.

## Backend on Render

Create a Render Web Service from `backend/`.

- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Environment variables:
  - `DATABASE_URL`
  - `AI_PROVIDER=gemini`
  - `AI_API_KEY`
  - `AI_MODEL=gemini-3.5-flash`
  - `AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/`
  - `FRONTEND_ORIGIN=https://your-vercel-app.vercel.app`
  - `PORT` is provided by Render

Use a Render PostgreSQL database or another managed PostgreSQL provider. Run Prisma migrations before production traffic:

```bash
npm run prisma:migrate --workspace backend
```

## Security

- daily.dev API tokens are accepted only in request bodies for preview/analyze calls.
- Tokens are never written to Prisma.
- The only persisted data is generated plan content for public share pages.
