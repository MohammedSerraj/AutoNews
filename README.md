# AutoNews

AutoNews is a small full-stack project that scrapes news, stores articles in a Laravel backend, and presents them in a React frontend (TangierTimes UI).

This repository contains three main workspaces:

- `backend/` — Laravel API and public assets
- `frontend/` — React (Vite) app used to browse articles
- `scraper_service/` — Python scraper and AI-processing scripts that ingest content into the database

This README gives quick setup steps, where to look for the important files, and how to run the project locally.

---

## Quick URLs (local dev)

- API (list articles): `http://127.0.0.1:8000/api/articles`
- Sample article image URL pattern: `http://127.0.0.1:8000/static/articles_images/<filename>`

---

## What each part does

- Backend: stores articles and serves them via a minimal REST API. Images are served from `backend/public/static/articles_images/`.
- Frontend: fetches the API and renders a news website UI with search and bookmarks (bookmarks saved to browser localStorage).
- Scraper: crawls configured sources, extracts text and images, runs translation/categorization (AI), downloads images into the backend images folder, and inserts records into the database.

---

## Getting started (summary)

Prerequisites: PHP 8.x, Composer, MySQL, Node.js (16+), Python 3.10+.

1) Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
# edit .env to point to your DB and set APP_URL
php artisan key:generate
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

2) Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
```

3) Scraper (optional)

```bash
cd scraper_service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# copy .env.example -> .env and fill DB / AI keys
python src/main.py
```

Notes
- The scraper writes images into the backend public folder by default — ensure the path/permissions are correct.
- If the frontend or images appear broken, confirm the backend is running and that the image filenames stored in the DB match the files in `backend/public/static/articles_images/`.

---

## API

- `GET /api/articles` — returns an array of articles with fields such as `id`, `title_en`, `content_en`, `date`, `category`, `image_url`, `source_url`.
- `GET /api/articles/{id}` — returns a single article.

---

## Screenshots

Below are screenshots from the current frontend (committed in `docs/screenshots/`).

### Home
![Home page](docs/screenshots/Home.png)

### Article detail
![Article detail](docs/screenshots/article-detail.png)

These images are stored in `docs/screenshots/`. To add more screenshots, copy files into that folder and commit them.

---

## Troubleshooting

- Images not visible:
  - Confirm the backend is running (`php artisan serve`) and serving `public/`.
  - Check that the file names in the DB match `backend/public/static/articles_images/`.
  - Open an image URL directly in the browser to confirm it serves: `http://127.0.0.1:8000/static/articles_images/<file>`.

- `php artisan` errors:
  - Make sure PHP and required extensions are installed and `backend/.env` is configured correctly.

- Frontend dev errors:
  - Run `npm install` inside `frontend/` and retry `npm run dev`.

---

## Contributing and development notes

- Follow a branch-per-feature workflow: `feature/your-feature` → PR → merge to `main`.
- Avoid checking in `.env` files or large binaries (images should be stored outside of git for production).

If you want, I can:
- Add deployment instructions (NGINX + PHP-FPM + Node build)
- Add a small `Makefile` to orchestrate dev startup (backend + frontend)
- Add automated image optimization for `docs/screenshots/` on commit

---

Thank you — tell me if you'd like any of the follow-up items implemented.

---

## Screenshots

You can add screenshots of the running site to the repository so they're displayed here. Recommended location: `docs/screenshots/`.

Example filenames (suggested):

- `docs/screenshots/home.png` — homepage
- `docs/screenshots/article-detail.png` — article detail view
- `docs/screenshots/bookmarks.png` — bookmarks page

Add images using Git:

```bash
# create folder if it doesn't exist
mkdir -p docs/screenshots
# copy screenshots into the folder
# stage and commit
git add docs/screenshots/*
git commit -m "docs: add screenshots"
git push origin YOUR_BRANCH
```

Markdown examples (paste these into this README where you want the images to appear):

```markdown
### Home
![Home page](docs/screenshots/home.png)

### Article detail
![Article detail](docs/screenshots/article-detail.png)
```

Notes & tips

- Prefer PNG or JPG, keep file sizes reasonable (<= 300KB) for the README to render quickly.
- If images are large, consider hosting them externally (Imgur, GitHub Releases, or your CDN) and reference the public URL instead.
- If you want I can add the `docs/screenshots/` folder and a placeholder `.gitkeep` so Git tracks the directory — or you can upload screenshots and I'll add them to the repo for you.
