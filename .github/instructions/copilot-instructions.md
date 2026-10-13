# Copilot instructions for Unofficial HKK Card Maker

## Project context

This repository is a vanilla HTML/CSS/JavaScript web app. There is no framework, build system, or package manager setup. Keep changes small, direct, and compatible with browser-only execution unless explicitly required.

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
- The overall visual design must remain non modernist and faithful to the original HKK card style.
- Keep visible UI text in Hungarian unless a task explicitly requires another language.

## Validation

- Validate changes by loading the app in a browser or through a local static server.
- Check that resource image loading still behaves correctly when files are present or missing.
- Ensure the download/export flow continues to work after edits to card generation logic.

## Agent task log

- Keep a concise history of completed repository tasks in `agent-log.md`.
- Append one dated entry per task with a short summary of what was requested and what was done, including validation results when relevant.
- Summarize rather than copying full prompts, and never include secrets or other sensitive information.

## Relevant files

- `index.html` — app structure and form controls
- `app.js` — preview logic and interaction behavior
- `styles.css` — card layout and visual styling
- `resources` — icons folder
