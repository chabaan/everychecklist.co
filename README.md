# EveryChecklist.co

Astro static site. Content is synced from a Google Sheet (two published-to-web
CSV tabs: Articles and Items) and built into static HTML, deployed to GitHub
Pages via `.github/workflows/deploy.yml`.

## Local development

```bash
npm install

export ARTICLES_CSV_URL="<your published Articles CSV link>"
export ITEMS_CSV_URL="<your published Items CSV link>"

npm run sync     # pulls the sheet into src/content/articles/*.md
npm run dev      # http://localhost:4321
```

## Build for production

```bash
npm run build    # runs sync + astro build -> ./dist
npm run preview  # preview the production build locally
```

## Deploying

Push to `main`. GitHub Actions (`.github/workflows/deploy.yml`) syncs the
sheet, builds, and publishes to GitHub Pages automatically. It also re-runs
every 6 hours on a schedule, so edits to the Google Sheet show up without a
manual push.

Required repo settings (Settings > Secrets and variables > Actions > Variables):

- `ARTICLES_CSV_URL`
- `ITEMS_CSV_URL`

Required repo settings (Settings > Pages):

- Source: **GitHub Actions**

## Adding a new checklist

1. Add one row to the **Articles** tab with a unique `slug`.
2. Add rows to the **Items** tab with that same `slug`, grouped by `section_title`.
3. Wait for the next scheduled run, or trigger it manually from the Actions tab.
