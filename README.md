# AutoNews

AutoNews is a full-stack news scraping and publishing project. It includes:

- A Laravel backend API that stores and serves articles.
- A React (Vite) frontend (TangierTimes) that consumes the API and presents a NYT-like reading experience with bookmarks.
- A Python-based scraper service that fetches articles from source sites, translates and categorizes them using AI, downloads images, and inserts them into the database.

This repository is organized into three top-level folders:

- `backend/` — Laravel application and API.
- `frontend/` — React + Vite frontend (TangierTimes UI).
- `scraper_service/` — Python scripts that crawl, process, and insert articles.

---

## Quick links

- Backend API: `http://127.0.0.1:8000/api/articles`
- Article images served from: `http://127.0.0.1:8000/static/articles_images/<filename>`

> Note: Replace host/ports with production addresses when deploying.

---

## Architecture (overview)

- Scraper fetches raw articles and images from target websites.
- Scraper translates and categorizes text using an AI service, saves images under `backend/public/static/articles_images`, and inserts records into the MySQL database used by the Laravel backend.
- Laravel exposes a simple REST API (`/api/articles`) used by the frontend to list and show articles.
- Frontend fetches articles, displays them, enables searching, bookmarking (localStorage), and routes to article detail pages.

---

## Prerequisites

- Docker (optional) or native installs of:
  - PHP 8.x with required extensions (PDO, mbstring, tokenizer, etc.)
  - Composer
  - MySQL / MariaDB
  - Node.js (16+) and npm
  - Python 3.10+ and pip

---

## Backend (Laravel)

Location: `backend/`

What it provides:
- REST API for articles (`index` and `show`) implemented in `app/Http/Controllers/ArticleController.php`.
- Model: `app/Models/Article.php`.
- Public assets (images) are served from `backend/public/static/articles_images/`.

Environment:
- Copy and edit `.env.example` (or use `backend/.env`) and set the database credentials and app URL.

Install & run (local dev):

```bash
cd backend
composer install
cp .env.example .env
# update .env with DB credentials
php artisan key:generate
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

API endpoints
- GET /api/articles — list articles (returns JSON { success, data, message })
- GET /api/articles/{id} — fetch single article

Notes
- Images are stored under `backend/public/static/articles_images`. The scraper writes files into that folder (or into `public/static/articles_images/` depending on your environment). Ensure the webserver serves the `public/` directory.
- If `php artisan route:list` fails, ensure PHP and required extensions are installed and `.env` has correct settings.

---

## Frontend (React + Vite)

Location: `frontend/`

What it provides:
- A TangierTimes-style UI using React, Vite and Bootstrap.
- Pages/components: `Home`, `ArticleDetail`, `ArticleCard`, `BookmarkContext` (localStorage-based bookmarks).

Install & run:

```bash
cd frontend
npm install
npm run dev
```

Notes
- The frontend expects the backend API at `http://127.0.0.1:8000/api/articles` and images at `http://127.0.0.1:8000/static/articles_images/<filename>`.
- If images show as broken, verify that files exist under `backend/public/static/articles_images` and that the backend dev server or web server is accessible from the browser.
- When navigating directly to an article page, the frontend will fetch the article by ID from the API (so deep links work).

---

## Scraper Service (Python)

Location: `scraper_service/`

What it does:
- Scrapes news pages (sitemaps or seed URLs), extracts title/date/content/images.
- Uses AI (translator, categorizer modules) to translate/categorize content.
- Downloads/validates images and saves them into the backend public images folder.
- Inserts translated/categorized articles into the database.

Requirements & install

```bash
cd scraper_service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# create a .env (or use .env.example) with DB and AI keys
```

Run (example)

```bash
python src/main.py
```

Important:
- Configure database credentials in `scraper_service/.env` (or `scraper_service/.env.example`).
- The scraper will write images into `../backend/public/static/articles_images` by default (relative path) — confirm permissions.

---

## Environment variables

- Backend: `backend/.env` — database, APP_URL, etc.
- Scraper: `scraper_service/.env.example` — contains DB_HOST, DB_USER, DB_PASS, AI keys and other options. Copy to `.env` and edit.
- Frontend: `frontend/.env` — optional, used for overriding API base URL if needed.

Do NOT commit secrets. Use `.env.example` files as templates.

---

## Common troubleshooting

- Images not loading in frontend:
  - Confirm images exist: `ls backend/public/static/articles_images/`
  - Ensure backend is serving `public/` directory (if using `php artisan serve` it will).
  - Confirm image URL used by frontend matches the served URL (the project uses `http://127.0.0.1:8000/static/articles_images/<file>`).

- `php artisan route:list` or artisan commands failing:
  - Install PHP and required extensions; set correct permissions; ensure `.env` exists and `APP_KEY` set.

- Frontend dev server errors or missing packages:
  - Run `npm install` in `frontend/` and retry `npm run dev`.

- Scraper database inserts failing:
  - Check `scraper_service/.env` for correct DB credentials and that the database user has INSERT privileges.
  - Check file permissions for the images folder so the scraper can write files.

---

## Tests

- Backend: Laravel tests under `backend/tests/` — run with `php artisan test` or `vendor/bin/phpunit`.
- Frontend: No automated tests currently included; consider adding React Testing Library / Jest for components.

---

## Contributing

1. Create an issue describing the change or bug.
2. Create a feature branch named `feature/your-short-description`.
3. Make changes, run tests, and open a PR.

Please avoid committing secrets or large binaries. Keep large article images out of git; they belong in `backend/public/static/articles_images` and are ignored by `.gitignore`.

---

## License

This project is released under the MIT License. See `LICENSE` for details (if present) or add one to the repo.

---

If you'd like, I can:

- Add example deployment instructions (NGINX + PHP-FPM, Node build) for production.
- Create small CONTRIBUTING.md or developer scripts (makefile) to simplify local setup.

Let me know what you want me to add or clarify.

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
