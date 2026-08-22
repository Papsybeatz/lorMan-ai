# lorMan

A full-stack scaffold for a jurisdiction-aware lawyers workspace. It includes a Next.js frontend, Express API, Prisma PostgreSQL schema, and an adapter point for an external AI provider.

## Structure

- `frontend/` Next.js Pages Router app with TailwindCSS
- `backend/` Express REST API and Prisma client
- `shared/` prompts and shared types
- `docker/` local PostgreSQL setup

## Run

1. Copy `.env.example` to `.env` and provide `DATABASE_URL`.
2. Install dependencies with `npm install`.
3. Generate Prisma client with `npm run db:generate`.
4. Start both apps with `npm run dev`.

The UI runs at `http://localhost:3000`; the API runs at `http://localhost:4000`.

No AI model is bundled locally. Set `OPENAI_API_KEY` to enable the external provider adapter used by the route controllers.
