# Oracle of Freedom

Marketing and portfolio site for photographer and filmmaker Agota Urbikaite. English is the default. Spanish and European Portuguese are first-class.

## Run locally

Node.js 22.

```bash
npm install
npm run dev
```

The dev server listens on port **4327**: http://127.0.0.1:4327

```bash
npm run build
npm start
```

The site builds with no secrets set. Copy `.env.example` to `.env.local` only when you need one of these names:

- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `INQUIRY_TO_EMAIL`
- `KEYSTATIC_STORAGE`
- `KEYSTATIC_GITHUB_REPO`
- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`
- `KEYSTATIC_SECRET`
- `ADMIN_PASSWORD`
- `BLOB_READ_WRITE_TOKEN`

Photographs in `public/images/portfolio/` and `src/app/favicon.ico` are solid-colour stand-ins. Testimonials in `content/testimonials.json` stay marked `placeholder: true` until the quotes are real.
