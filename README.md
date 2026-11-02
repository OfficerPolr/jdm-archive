# JDM Archive

A lightweight, dark-mode, static brochure catalogue designed for GitHub Pages.

## What's included

- Responsive dark archive homepage
- Manufacturer and year filters
- Search across make, model, generation, year, market and language
- Brochure detail dialog
- PDF open/download links
- Lazy-loaded cover images
- Sample catalogue data and original placeholder cover artwork
- No build step and no runtime framework

> The included entries and covers are demonstration placeholders. They are not actual brochure scans and do not include PDFs.

## Run locally

Because the site loads its catalogue with `fetch()`, open it through a local web server rather than double-clicking `index.html`.

With Python installed, open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a new **public** GitHub repository, for example `jdm-archive`.
2. Upload the contents of this folder to the repository root. `index.html` must be at the root, not inside another nested folder.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. Wait for the Pages deployment to finish. Your address will usually be `https://YOUR-USERNAME.github.io/jdm-archive/`.

The site is static and does not require a database, server, API key or build process.

## Add a brochure

### 1. Upload the PDF to GitHub Releases

For a public archive, a public repository and public release assets are required.

1. Open the repository's **Releases** page.
2. Choose **Draft a new release**.
3. Use a tag such as `brochures-2026-01`.
4. Attach one or more PDF files.
5. Publish the release.
6. Copy the direct asset download URL for each PDF. A release asset URL commonly looks like:

`https://github.com/USERNAME/REPOSITORY/releases/download/TAG/FILENAME.pdf`

GitHub's release asset download URLs may redirect to the actual file. Test each URL in a private/incognito browser window to confirm it is publicly accessible.

### 2. Add a cover image

Put a small JPG, PNG or WebP cover image in `assets/covers/`. Keep thumbnails reasonably small (for example, 300–500 pixels wide and preferably under a few hundred KB).

You can also use one of the included SVG placeholders temporarily.

### 3. Add an entry to `data/brochures.json`

Copy this example object into the `brochures` array, adding a comma between entries:

```json
{
  "id": "nissan-skyline-r34-1999-jp",
  "brand": "Nissan",
  "model": "Skyline GT-R",
  "generation": "R34",
  "year": 1999,
  "market": "Japan",
  "language": "Japanese",
  "type": "Model catalogue",
  "cover": "assets/covers/nissan-skyline-r34-1999.webp",
  "pdfUrl": "https://github.com/USERNAME/REPOSITORY/releases/download/TAG/FILENAME.pdf",
  "description": "Japanese-market brochure."
}
```

Important:
- `id` must be unique.
- `cover` is a path relative to the website root.
- `pdfUrl` should be the public GitHub Release asset URL.
- Keep year numeric.
- Use an empty string for `pdfUrl` until the PDF is uploaded.
- JSON is strict: use double quotes and do not leave a trailing comma.

Commit the updated JSON and cover image to the `main` branch. GitHub Pages will publish the update automatically.

## GitHub storage notes

GitHub Pages is intended for the website itself, not large PDF archives. This project links to PDFs stored as GitHub Release assets, keeping them out of the Pages deployment.

GitHub Releases support large binary assets, but GitHub's policies and limits can change. Keep a separate local backup of all original PDFs and periodically test release links. Do not use Git LFS as a way to serve PDF files through GitHub Pages.

The public repository contains the website code and catalogue. Do not put passwords, personal access tokens, private files or other secrets in it.

## Current limitations / future improvements

- This first version has no custom admin login or upload dashboard.
- Updates are made by editing JSON and uploading assets through GitHub.
- Search is client-side and reads the catalogue JSON.
- The PDF is opened in a new browser tab; actual inline viewing depends on browser and GitHub's file response behavior.
- A later version can add generation landing pages, decade filters, more metadata, bulk catalogue import and an authenticated management workflow.

## Copyright

Only publish brochure scans where you have the necessary rights or permission. Owning a physical brochure or making a scan does not automatically grant public distribution rights.
