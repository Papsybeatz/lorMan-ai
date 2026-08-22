# lorMan

A full-stack scaffold for a jurisdiction-aware lawyers workspace. It includes a Next.js frontend, Express API, Prisma PostgreSQL schema, and an adapter point for an external AI provider.

## Structure

- `frontend/` Next.js Pages Router app with TailwindCSS
- `frontend/pages/` `/onboarding`, `/dashboard`, `/case/[id]`, `/intake`, `/civil`, and `/criminal`
- `frontend/components/` `CaseCard`, `IntakeForm`, `WorkflowSection`, `DocumentViewer`, and `DocketTimeline`
- `backend/` Express REST API and Prisma client
- `shared/` prompts and shared types
- `docker/` local PostgreSQL setup

## Run

1. Copy `.env.example` to `.env` and provide `DATABASE_URL`.
2. Start PostgreSQL with `docker compose -f docker/docker-compose.yml up -d`.
3. Install dependencies with `npm install`.
4. Generate Prisma client with `npm run db:generate`.
5. Create the tables with `npm run db:push`.
6. Start both apps with `npm run dev`.

The UI runs at `http://localhost:3000`; the API runs at `http://localhost:4000`.

No AI model is bundled locally. Groq is supported through its OpenAI-compatible API. Set `GROQ_API_KEY` and leave `AI_PROVIDER=groq` to use Groq, or set `AI_PROVIDER=openai` with `OPENAI_API_KEY` to use OpenAI instead. The default Groq model is `llama-3.3-70b-versatile`.

## Case creation flow

The intake form sends matter name, facts, practice area, urgency, jurisdiction, and lawyer identity to `POST /api/intake`. The API upserts the lawyer, creates a case and its initial intake document, then returns the new case id. The frontend redirects to `/case/[id]`, which reads the persisted case from `GET /api/case/:id`.
