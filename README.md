# Rishta — Hindu Biodata Studio Pro (PDF + Dynamic Fields)

Frontend-only React/Vite app for creating a Hindu marriage biodata.

## Features
- 20 selectable templates and responsive layout
- Shree Ganesh heading and image
- No prefilled personal data; name preview uses neutral "Your Name"
- Optional form fields; blank fields do not print
- Dynamic family details: add custom field label/value rows and delete rows
- Optional JPG/PNG/WebP profile photo (5 MB limit)
- Browser-local autosave
- A4 PDF export from a separate unscaled off-screen document clone (prevents the preview transform from producing a blank PDF)
- No backend, database, account, or paid API

## Run
Requires Node.js 18+.

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Deploy `dist/` to a static host such as Vercel or Netlify.

## Security and privacy notes
- React escapes text values rendered into the page; user-entered values are not inserted with `dangerouslySetInnerHTML`.
- Uploaded photo types are restricted to JPEG, PNG, and WebP and limited to 5 MB.
- No remote font imports, analytics, or external API calls are included.
- Form values are stored in browser localStorage. Anyone using the same browser profile can potentially access them; clear the form on shared devices.
- This is a frontend-only project. Do not describe it as security-audited or vulnerability-free; review dependencies with `npm audit` after installing and keep Node packages updated.
