# Nebula Scripts — Roblox Script Showcase

A single-creator Roblox script hub: a public, read-only showcase site paired with a
private admin dashboard. No visitor accounts, no comments, no public submissions —
only you can publish content, through `/admin`.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, PostgreSQL and
Prisma.

## 1. What's included

- **Public site** — home, `/scripts` (search + filters + sort + pagination), `/scripts/[slug]`
  (script detail with a read-only code viewer and copy button), `/games`, `/games/[slug]`,
  `/tutorials`.
- **Admin dashboard** (`/admin`) — add/edit/delete scripts and games, publish/unpublish,
  feature/unfeature, manage tutorial videos, edit site settings (name, hero copy, YouTube
  channel, Discord), upload thumbnails.
- **Auth** — a single hard-coded admin account (username + bcrypt-hashed password),
  session cookie signed with HS256 (JWT), enforced by middleware *and* on every
  server action/page (defense in depth).
- **Database** — PostgreSQL via Prisma, with the schema in `prisma/schema.prisma` and an
  initial migration in `prisma/migrations/`.
- **Sample data** — `prisma/seed.ts` seeds 5 games and several scripts so the site is
  immediately browsable.

## 2. Project structure

```
app/
  page.tsx                 Homepage (hero, featured script, popular games, latest scripts)
  scripts/                 /scripts and /scripts/[slug]
  games/                   /games and /games/[slug]
  tutorials/                /tutorials
  admin/
    login/                  /admin/login (public)
    (dashboard)/            Everything else under /admin — protected
      scripts/ games/ videos/ settings/
  uploads/[name]/route.ts  Serves uploaded thumbnails from UPLOAD_DIR
  sitemap.ts, robots.ts    SEO
components/
  site/                    Navbar, Footer, ScriptCard, GameCard, CodeViewer, YouTubeEmbed, ...
  admin/                   AdminSidebar, ScriptForm, GameForm, ImageUpload, ...
  ui/                      Button, Toast, Modal, Badge
lib/
  actions.ts               All server actions (create/update/delete/toggle/login/upload)
  auth.ts, session.ts       Auth + signed session cookie
  data.ts                   Read-only data access for the public site
  validation.ts             Zod schemas for every form
  prisma.ts                 Prisma client (pg driver adapter)
prisma/
  schema.prisma
  migrations/
  seed.ts
middleware.ts               Redirects unauthenticated /admin/* requests to /admin/login
```

## 3. Requirements

- Node.js 20.9+ (Node 22 recommended)
- PostgreSQL 14+ (local install, Docker, or a hosted provider like Neon/Supabase/RDS)

## 4. Local setup

```bash
npm install
cp .env.example .env
```

Open `.env` and fill in:

- `DATABASE_URL` — your Postgres connection string.
- `SITE_URL` — `http://localhost:3000` for local dev.
- `ADMIN_USERNAME` — whatever you want to log in with.
- `ADMIN_PASSWORD_HASH_B64` — generate this, don't type a plain password:
  ```bash
  npm run hash-password
  ```
  It'll prompt for a password and print a line to paste into `.env`.
- `SESSION_SECRET` — a random 32+ character string:
  ```bash
  npm run gen-secret
  ```

Then create the schema and load sample data:

```bash
npm run db:migrate   # applies prisma/migrations, creates tables
npm run db:seed      # loads 5 games + sample scripts
```

Start the dev server:

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin/login (sign in with the username/password you set above)

## 5. Editing content

Everything is managed from `/admin` — you never need to touch code to add a script:

1. **Add a game first** (`/admin/games/new`) if it doesn't already exist.
2. **Add a script** (`/admin/scripts/new`) — title, game, description, features (one per
   line), script code, optional external script URL, optional YouTube URL, thumbnail,
   version, category, tags, and the Published/Featured checkboxes.
3. Toggle **Published** to make it live on the public site immediately (homepage, latest
   scripts, `/scripts`, search, and its game page all update right away).
4. Toggle **Featured** on at most one script at a time to control the homepage's featured
   slot.
5. **Settings** (`/admin/settings`) controls the site name, hero headline/subtext, and your
   YouTube/Discord links — used across the whole site including the navbar and footer.

The script code box on the public script page is rendered as **plain, escaped text**
(`<pre><code>`) — it is never executed, `eval`'d, or interpreted by the website in any way.

## 6. Security notes (what's already handled)

- Public pages are 100% read-only — no mutation is reachable without a valid admin session.
- `middleware.ts` blocks unauthenticated requests to `/admin/*` at the edge; every server
  action and admin page **also** calls `requireAdmin()` itself, so there's no route that
  relies on the middleware alone.
- Passwords are hashed with bcrypt (cost 12) and never stored in plain text; the login
  check runs in constant time and always executes bcrypt (even on a bad username) so
  response timing doesn't leak which part was wrong.
- Sessions are signed JWTs (HS256) in an `httpOnly`, `Secure` (in production),
  `SameSite=Strict` cookie using the `__Host-` prefix.
- All form input is validated server-side with Zod — nothing trusts client-side checks.
- File uploads are capped at 3 MB, and the real file type is verified from the file's
  magic bytes (not the filename or browser-supplied MIME type); only PNG/JPG/WebP/GIF are
  accepted. SVG is intentionally rejected (SVGs can carry scripts).
- Login and upload endpoints are rate-limited per IP.
- Strict `Content-Security-Policy` and standard security headers (`X-Frame-Options`,
  `X-Content-Type-Options`, HSTS in production, etc.) are set in `next.config.mjs`.
  `/admin/*` is also sent `X-Robots-Tag: noindex` and `Cache-Control: no-store`.
- Prisma parameterizes every query — no raw SQL string concatenation anywhere.
- Next.js Server Actions include built-in CSRF protection (same-origin check) out of the box.
- **Nothing** secret (DB URL, password hash, session secret) is ever sent to the browser —
  everything in `lib/actions.ts`, `lib/auth.ts`, `lib/data.ts` is server-only code.

Before going to production, also:

- Set real values for every variable in `.env` (never commit `.env`).
- Make sure `SITE_URL` matches your real domain (used for canonical URLs and the sitemap).
- Point `UPLOAD_DIR` (optional, defaults to `./uploads`) at a **persistent** volume/disk —
  it's outside `/public` on purpose so it can be a separate mounted volume in Docker or a
  cloud disk, independent of your build output.

## 7. Database commands

```bash
npm run db:migrate    # create/apply a migration in development
npm run db:deploy     # apply existing migrations in production (no prompts)
npm run db:seed       # (re)load sample data — safe to run multiple times
npm run db:studio     # open Prisma Studio, a GUI for your data
npm run db:reset      # drop, recreate, migrate and reseed (development only!)
```

## 8. Production deployment

### Option A — any Node host (VPS, Docker, Railway, Render, Fly.io, etc.)

```bash
npm install
npm run build          # runs `prisma generate` then `next build`
npm run db:deploy      # applies migrations against your production database
npm run db:seed        # optional — only if you want the sample data
npm start               # starts on port 3000 (set PORT to change it)
```

Make sure every variable in `.env.example` is set in your host's environment (or a
production `.env` file it can read). `NODE_ENV=production` is set automatically by
`next build`/`next start`.

A minimal `Dockerfile` (adjust as needed):

```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Mount a volume at whatever `UPLOAD_DIR` points to so uploaded thumbnails survive
redeploys.

### Option B — Vercel (or another serverless platform)

Serverless platforms have an ephemeral filesystem, so the built-in file-upload code
(`lib/uploads.ts`, `app/uploads/[name]/route.ts`) **won't** persist between requests. To
deploy there:

1. Set all the same environment variables in the platform's dashboard.
2. Point `DATABASE_URL` at a serverless-friendly Postgres (e.g. Neon, Supabase, or
   Vercel Postgres).
3. Swap the local-disk upload code for an object storage provider (S3, Cloudflare R2,
   Vercel Blob, etc.) — update `uploadThumbnail` in `lib/actions.ts` and the URL it
   returns; the rest of the app (forms, validation, image display) doesn't need to change.
4. Also swap `lib/rate-limit.ts`'s in-memory store for a shared store (e.g. Upstash
   Redis), since each serverless instance has its own memory.
5. Run `npm run db:deploy` (and optionally `db:seed`) against the production database
   from your local machine or a CI step before/after the first deploy.

## 9. Notes on the engine setup

This project uses Prisma's `client` engine type with the `@prisma/adapter-pg` driver
adapter (Prisma 6), which talks to Postgres directly through the `pg` package instead of a
separate native query-engine binary. Run `npx prisma generate` (or just `npm install`,
which does it via `postinstall`) after any change to `prisma/schema.prisma`.
