# Symphorien Pyana Portfolio

An Express and EJS portfolio with Supabase-backed project, collaboration, upcoming-project, and achievement content. It works immediately with curated fallback content; configuring Supabase enables live content and database-change updates.

## Run locally

```powershell
npm install
npm run dev
```

Open http://localhost:3000. No Supabase credentials are needed to view the portfolio.

## Enable live Supabase content

1. Copy `.env.example` to `.env` and set `SUPABASE_URL` and `SUPABASE_ANON_KEY` from your Supabase project's API settings.
2. Open the Supabase SQL Editor, paste and run `supabase/setup.sql`. It creates the portfolio tables, read-only policies, Realtime publication entries, and initial project/profile content. It is safe to run again.
3. Restart the server. Database changes to those tables will refresh the page with updated content.

Only the Supabase anon key belongs in this app's configuration. Never put a service-role key in the browser or commit credentials.

Project previews open inside the portfolio. Some project hosts may block embedded previews; the project dialog also includes a direct link to open the live site.