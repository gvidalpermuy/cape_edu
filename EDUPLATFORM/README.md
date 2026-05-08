# EduPlatform (static, deploy-now)

This is a **simple static website**:
- `index.html` shows buttons for each item in `content/manifest.json`
- Clicking a button opens `/viewer/?id=...` which embeds the item (PDF/HTML) in an iframe

## Add new material (creates a new button)

1. Put your file in `content/docs/` (recommended) or `content/pages/`.
   - PDFs: `content/docs/my-handout.pdf`
   - HTML pages: `content/pages/topic-1.html`
2. Edit `content/manifest.json` and add a new item:

```json
{
  "id": "topic-1",
  "label": "Topic",
  "title": "Topic 1 — Intro",
  "type": "pdf",
  "path": "/content/docs/my-handout.pdf"
}
```

Reload the site: the new button appears automatically.

## Deploy to Netlify (live immediately)

### Option A: Drag & drop (fastest)

1. Go to Netlify → **Add new site** → **Deploy manually**
2. **Drag the entire project folder** (the folder that contains `index.html`) into Netlify.

**What must be included** in the upload:
- `index.html`
- `viewer/`
- `content/`
- `app.js`
- `styles.css`

### Option B: GitHub + Netlify (recommended for ongoing uploads)

1. Create a GitHub repo and push **the entire project folder**.
2. In Netlify → **Add new site** → **Import from Git**
3. Build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `/` (repository root)

After that, every time you commit/push changes (new PDF + manifest update), Netlify redeploys automatically.

## Admin login (Netlify Identity)

The home page includes an **Admin login** button powered by **Netlify Identity**.

To enable it on Netlify:
1. In your Netlify site dashboard → **Integrations** (or **Identity**) → **Enable Identity**
2. Under **Identity → Registration**, set **Invite only** (recommended)
3. Under **Identity → Invite users**, invite your admin email(s)

Once enabled, the “Admin login” button will open the Netlify Identity widget and the **Admin** section will appear after login.

## Deploy to GitHub Pages (alternative)

If you use GitHub Pages:
1. Push the whole project to GitHub
2. Repo → **Settings** → **Pages**
3. Set **Branch** to `main` and **Folder** to `/ (root)`

## Notes

- This is a static site, so “uploading” means adding files into the repo (or the folder you drag to Netlify).
- If you later want true in-browser uploads (no git commits), you’ll need a backend or a Netlify integration (e.g. CMS + storage).

