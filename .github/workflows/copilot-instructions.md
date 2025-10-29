# Copilot Instructions

## Project Snapshot
- **Stack**: Next.js 14 App Router with TypeScript, Tailwind CSS, React Context hooks, and shadcn/ui components.
- **Backend**: Express.js with Prisma ORM targeting PostgreSQL, JWT auth, Cloudinary uploads, and rate limiting middleware.
- **Hosting**: Frontend on Vercel, backend API on Railway, PostgreSQL on Railway with SSL.

## Coding Conventions
1. Use TypeScript everywhere, matching existing types under `types/` and `typings.d.ts`.
2. Keep Next.js App Router folder structure intact (`app/`, route groups, server actions) and follow existing naming patterns.
3. Style with Tailwind utility classes already in use; avoid introducing new styling systems.
4. Reuse shared components from `components/` before creating new ones; if unavoidable, match current patterns.
5. Do not add inline comments; mirror the project's comment-free style.

## Frontend Guidelines
- **State & Data**: Prefer existing context providers and utilities in `app/_zustand`, `lib/api.ts`, and `lib/utils.ts`.
- **Auth**: Integrate with NextAuth via helpers in `lib/auth-options.ts` and middleware defaults.
- **Validation**: Rely on sanitizers in `lib/form-sanitize.ts` and `lib/sanitize.ts` for user input.
- **Performance**: Respect responsive tweaks documented in `README.md` (e.g., product card spacing, rating gaps).

## Backend Guidelines
1. Keep controller logic inside `server/controllers/` and route wiring in `server/routes/`.
2. When extending Prisma, edit `server/prisma/schema.prisma` and add migrations under `server/prisma/migrations/`.
3. Use PostgreSQL syntax; replace any MySQL remnants (backticks, varchar(191), datetime(3)) when touching migrations.
4. Never run `prisma db push` against production data. Instead:
   - `cd server`
   - `npx prisma migrate dev --name descriptive_change`
   - Update `migrate-railway.js` or related scripts if production needs raw SQL safeguards.
5. Keep rate limiters (`server/middleware/rateLimiter.js`, `advancedRateLimiter.js`) active on new endpoints.

## Database & Analytics
- **Page Views**: Align with planned `PageView` model and analytics endpoints described in `next-step.md` and `IMPROVEMENTS-v2.3.0.md`.
- **Data Integrity**: Ensure migrations handle existing production rows using `IF NOT EXISTS` guards like in `migrate-railway.js`.
- **Reset Awareness**: Be cautious—recent sessions reset dev databases during migration cycles (see `session-summary-2024-12-07.md`).

## Security Practices
1. Secrets in `.env`, `.env.local`, and `server/.env` are real; never log them and do not commit new secrets.
2. Maintain input sanitization and validation on both frontend and backend to uphold XSS protection.
3. Respect rate limits and avoid introducing endpoints without authentication/authorization checks where applicable.
4. Follow findings in `securety.md`: remove secrets from code when possible and recommend secret rotation if touched.

## Testing & Quality Gates
- **Frontend**: Run `npm run lint` and `npm run build` before shipping changes; resolve TypeScript errors, warnings acceptable only if existing.
- **Backend**: From `server/`, run `npm run dev` for smoke tests and ensure Prisma Client regeneration succeeds.
- **Post-Deployment Checklist**: Confirm successful migrations, API availability, and Vercel/Railway logs as outlined in `README.md`.

## Git Workflow
1. Branch off `dev` for features or fixes; use `feature/*` naming when applicable.
2. Follow commit prefixes such as `feat:`, `fix:`, `refactor:`, `docs:` per `README.md` guidance.
3. Keep commits scoped; include migration files and supporting scripts together.
4. Verify critical files (`migrate-railway.js`, schema changes) are staged to prevent deployment drift.

## Deployment Reminders
- **Before Deploying**: Check environment variables, ensure migrations are applied, and confirm no console errors.
- **After Deploying**: Validate frontend rendering, backend endpoints, authentication flow, and rate limiting; monitor logs for Prisma issues.
- **Rollback Plan**: Stable reference is tag `v2.3.0-stable`; use `git checkout v2.3.0-stable` for emergency recovery.

## Copilot / Model Preference
- Prefer `gpt-5-mini` for assistant-generated code and suggestions when available. This repository's Copilot guidance requests that organization or repository administrators enable "GPT-5 mini for all clients" in the Copilot / AI model settings if they control those settings. If you cannot change organization settings, include the model preference in PR descriptions or onboarding docs so reviewers and integrators can opt-in.

Note: This file documents the preference only; it does not change external account settings. To actually enable the model for an organization you must be an admin and update the Copilot/OpenAI settings in your org's management console.
