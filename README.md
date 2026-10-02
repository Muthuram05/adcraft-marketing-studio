# AdCraft AI

A complete, local marketing-platform demo based on the supplied meeting document and purple/white UI direction. Built with React, Vite, Lucide icons, native Canvas, and IndexedDB. No API keys or backend are needed.

## Run

Use Node.js 22 or newer.

```sh
npm install
npm run dev
```

Open **http://127.0.0.1:5173/**. Use the explicit address: a different application may already use `localhost` on IPv6.

```sh
npm test
npm run build
npm run preview
```

The production site is generated in `dist/`. It can be served by any static host. Routes use URL hashes, so deep links do not require server rewrites. HTTPS or localhost is needed for browser media functionality.

## Netlify deployment

`netlify.toml` configures Node.js 22, the `npm run build` command, and the `dist` publish directory. No environment variables or API keys are needed for this mock demo.

Import the GitHub repository into Netlify and deploy its `main` branch. Netlify reads the build configuration from the repository. For a manual deployment, build locally and upload the contents of `dist/` through the Netlify dashboard. Browser data belongs to each site's origin: local demo edits do not transfer to the deployed website.

## Walkthrough

1. Open **Brand kit** to save a business name, logo, brand colour, description, and tone.
2. Choose **Create campaign** and enter business details, audience, advertising channels, and budget.
3. Describe an idea and generate three video or image variations. Product keywords select relevant bundled samples; this is simulated generation.
4. Open the editor. Change headlines, supporting text, brand name, CTA, fonts, colours, crop, aspect ratio, brightness, contrast, and saturation. Undo and redo are supported.
5. For video, adjust scene lengths, add/reorder/remove scenes, trim the timeline, preview playback, and choose an original synthesized soundtrack.
6. Export the edited media, or continue to campaign review. Select Meta, Google, or TikTok, adjust audience and budget, approve, and complete mock card/UPI checkout.
7. Open the campaign and use **Simulate activity** to populate sample performance and a fictional lead. Pause/resume the campaign, inspect analytics, update lead statuses and notes, and export CSVs.

Other screens include a landing page (`#/welcome`), overview dashboard, template gallery, media library with uploads/favourites/duplicate/archive/restore, account settings, mock ad-account connections, payment history, workspace JSON backup, and a demo reset.

## Real interactions and mock services

**Functional locally:** media uploads, photo editing, video compositing, scene sequencing, trimming, soundtrack generation, PNG/video downloads, CSV exports, filtering, campaign state changes, lead notes/status, and saved browser state.

**Simulated:** AI generation, ad-account connections, ad publishing, checkout, ad spend, analytics, notifications, and incoming leads. No money is charged, no real ads run, and no messages or leads are sent to customers. There is no real login or multi-user backend.

Video export uses browser MediaRecorder and normally downloads WebM (or MP4 where that is the supported format). Rendering takes approximately the clip duration; keep the export tab open. The output reflects canvas edits and the selected synthesized soundtrack. The bundled video samples are silent animated product photos, not outputs from an AI model. Uploaded product photos are used by the image generator; the video generator selects bundled clips.

State is saved in this browser's IndexedDB. It persists on refresh but is not shared between devices or browser profiles. Uploads are stored locally, with a 30 MB file limit; browser storage quotas still apply. Use a single editing tab. Settings offers a JSON backup download; import/restore from that file is not included. Notification switches save demo preferences only.

## Project structure

- `src/pages/` — individual screens and flows
- `src/components/` — shared UI, navigation, previews
- `src/data.js` — fictional data, generation, validation, CSV utilities
- `src/store.jsx` — browser persistence and application state
- `src/media.js` — image/video rendering and export
- `src/styles.css` — responsive styling
- `public/media/` — local fonts, sample images and videos
- `tests/data.test.js` — generation, validation, exports, data and bundled media checks

## Media credits

Sample product photography was sourced from Unsplash. The six local video files were made by applying a slow pan/zoom to these photos; there is no external video service at runtime.

- Skincare: https://images.unsplash.com/photo-1608571423902-eed4a5ad8108
- Coffee: https://images.unsplash.com/photo-1447933601403-0c6688de566e
- Shoes: https://images.unsplash.com/photo-1542291026-7eec264c27ff
- Food: https://images.unsplash.com/photo-1565557623262-b51c2513a641
- Perfume: https://images.unsplash.com/photo-1541643600914-78b084683601
- Watch: https://images.unsplash.com/photo-1523275335684-37898b6baf30

DM Sans fonts are bundled from Google Fonts. Lucide provides the UI icons. Product names, leads, payments and results are demo content; visible brands in the sample photography are illustrative.
