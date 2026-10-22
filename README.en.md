# Resume Assistant

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md)

A local resume layout and export tool by SQHOME. It renders compatible resume JSON in the browser; no backend is required. A fictional, localized sample resume loads by default.

## Features

- Professional two-column and classic one-column layouts, plus standard and centered-avatar header styles.
- Six interface languages: Simplified Chinese, English, Japanese, Korean, Spanish, and French.
- Edit the built-in sample directly, or import your own JSON. Changes are previewed live and remain in page memory.
- Export HTML, download edited JSON, or export a single-page or browser-paginated PDF.
- Section visibility, theme colors, photo toggle, and preview zoom.

### Screenshots

**Resume workspace**

![Resume workspace with settings and live preview](docs/images/app-overview.png)

**Resume editor**

![Resume content editor](docs/images/editor.png)

## Run locally

Requires Node.js 18 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Run `npm test` and `npm run build` to test and build the app.

## Edit the sample

The localized sample is ready to edit when the app opens. Select **Edit content**, make changes, and save. Use **Download JSON** to keep your own copy. Switching languages while using the built-in sample loads that language's original sample; switching languages after importing your own JSON does not replace your resume.

## Get your Resume.io JSON

Resume.io's logged-in resume API can return the JSON for your own resume:

1. Sign in to your [Resume.io](https://resume.io/) account.
2. In the same browser session, open [`https://resume.io/api/app/resumes`](https://resume.io/api/app/resumes) and find the `id` of the resume you want.
3. Open `https://resume.io/api/app/resumes/{id}`, replacing `{id}` with that value. The response contains the resume JSON.
4. Save the response as `resume.json`, then choose **Import JSON** in this app.

The endpoint uses your existing sign-in session. Do not share response files containing personal information or account metadata. A `renderingToken` alone is not enough to reconstruct a resume; Resume.io's image endpoint only serves the first page.

The importer supports fields such as `firstName`, `lastName`, `position`, `profile`, `workExperiences`, `educations`, `skills`, `languages`, `customSections`, and `sectionsOrder`. See [`examples/resume.sample.json`](examples/resume.sample.json) for a complete structure.

## PDF notes

Single-page PDF scales the full resume to one A4 page, so long resumes will have smaller text. Paginated PDF uses the browser's native print flow. PDF filenames use the person's name, role, `Resume`, and the current date. Single-page PDFs are rasterized images, so their text is not selectable.

All processing happens locally in your browser. Remote avatar URLs require an internet connection. Review imported JSON before sharing; edited JSON downloads preserve unknown source fields.

## License

[MIT License](LICENSE). Third-party dependencies and fonts remain under their respective licenses. The license does not grant rights to the SQHOME name or brand.
