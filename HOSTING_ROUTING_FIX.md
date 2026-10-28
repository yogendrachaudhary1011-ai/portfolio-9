# Hosting routing repair — portfolio-8

## Root cause (confirmed from the uploaded ZIP)

- The original project has `index.html` at the project root.
- The uploaded `dist` directory had **only `404.html`** (a redirect to `/`) and had **no `index.html`**.
- A static host publishing that incomplete `dist/` will not find the homepage. It may show the 404 page or redirect in a loop.
- Existing `vercel.json` specified `outputDirectory: "."`, while the build produces `dist/`. This discrepancy was corrected.

## Changes made

1. Regenerated `dist/` with the original `index.html`, genuine 404 page, all project/case-study pages, and original images and assets.
2. Set Vercel `buildCommand: "npm run build"`, `outputDirectory: "dist"`, and explicitly mapped existing friendly URLs.
3. Added Firebase Hosting `firebase.json` with `public: "dist"` and matching routes.
4. Added Netlify `netlify.toml` and publishable `dist/_redirects` for the existing URLs.
5. Improved build validation and added `npm run test:deployment`.

**The original HTML, CSS, Framer JavaScript, images, animation, and interactions have NOT been edited.** Their existing SHA-256 hashes are unchanged. Source Framer CDN dependencies remain necessary.

## Deploying

### Vercel

Import the project repository, set framework preset **Other**, build command `npm run build`, output directory `dist` (also supplied in `vercel.json`), and deploy. If dashboard settings override repo config, set both manually. Redeploy without using the old cached output.

### Firebase Hosting (classic)

Run `npm run build` and `firebase deploy --only hosting` with this repository's `firebase.json`. **Do not run `firebase init hosting` and overwrite this config or publish an empty `public/` folder.** Note: this static configuration does not add a backend for `/api/content`; admin saving may need a separately configured API/server.

### Netlify / Cloudflare Pages

Build command `npm run build`, publish directory `dist`; for manual static deployment upload only the contents of `dist/` (or use the separate static-only ZIP).

### GitHub Pages / generic static hosting

Use the **contents of `dist/`** as the website document root, so that `index.html` appears at the top level, alongside `404.html`. If hosting under `/repo-name/` rather than a domain root, URL paths beginning with `/` may need a base-path strategy; the source uses root-relative paths. This package preserves those source paths by design.

### Google AI Studio preview (Node server)

Run `npm run dev` from the repository root, which serves `/` via `index.html` and supports the original route aliases. Do not select `dist/404.html` as the app entry file.

## Verification

```bash
npm run verify
npm test
npm run test:deployment
```

For a manually uploaded static site, `/` must return HTTP 200 with original `index.html`. An actual nonexistent path can still return the real 404 page. No universal rewrite of all paths to index is used, because the original portfolio has distinct project pages.

**Important:** Static hosting alone cannot run the Node API `/api/content` used by the admin functionality. Vercel API support depends on deployment settings; Firebase/Netlify generic static deployment needs a backend to support content writes. This fix targets homepage and page routing only.
