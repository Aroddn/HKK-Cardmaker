# Copilot instructions for Unofficial HKK Card Maker

## Project context

This repository is a vanilla HTML/CSS/JavaScript web app. There is no framework, build system, or package manager setup. Keep changes small, direct, and compatible with browser-only execution.

## Coding conventions

- Prefer simple, readable JavaScript that works in modern browsers.
- Keep DOM queries and event handling straightforward and consistent with the existing style.
- Preserve the current static-file structure: `index.html`, `app.js`, `styles.css`, and `resources/`.
- Prefer relative asset paths such as `resources/...` so the app continues to work when opened from the repository root or served locally.
- Avoid introducing dependencies, bundlers, or transpilers unless the task explicitly requires them.

## UI and behavior expectations

- Maintain the current card designer workflow: form inputs update the live preview immediately.
- Preserve fallback behavior for optional resource images. If a PNG is missing, the app should still show the built-in symbol or fallback color.
- Keep the editor accessible: use labels, semantic inputs, and text alternatives where appropriate.
- The overall visual design should remain similar to an early 2000s fantasy web app, with a focus on functionality and clarity rather than modern UI trends.
- Keep visible UI text in Hungarian unless a task explicitly requires another language.

## Validation

- Validate changes by loading the app in a browser or through a local static server.
- Check that resource image loading still behaves correctly when files are present or missing.
- Ensure the download/export flow continues to work after edits to card generation logic.

## Relevant files

- `index.html` — app structure and form controls
- `app.js` — preview logic and interaction behavior
- `styles.css` — card layout and visual styling
- `resources/README.md` — supported optional asset names and usage
