# Unofficial HKK Card Maker

Unofficial HKK Card Maker is a lightweight browser-based card designer for creating custom fantasy cards inspired by the Hungarian Fantasy Card Game style. It lets you set a card name, choose base colors, add icons, assign costs, and export the finished card as a PNG.

## Features

- Build cards with a name, text, faction/base combinations, and optional illustration
- Enter a card type and subtype, or add common values from their preset lists
- Select custom card icons and resource-based cost symbols
- Mix up to two base colors with built-in validation rules; Színtelen, Bufa, and Narancs lap are exclusive
- Download the final card as an image
- Use the included JPG base-card images for supported factions, with fallback colors for factions without an image

## Project structure

- `index.html` — app shell and card editor UI
- `app.js` — editor behavior, preview updates, and PNG export logic
- `styles.css` — card and interface styling
- `resources/` — optional art assets used by the card editor and preview

## Running locally

Because this project is a static web app, you can open it directly in a browser or serve it locally.

### Option 1: open directly

Open `index.html` in any modern browser.

### Option 2: serve from a local web server

From the repository root, run:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000/
```

## Base-card images and optional overrides

Faction base-card images are loaded from `resources/Base colors/`. Available individual bases are used for Bufa, Chara-din, Dornodon, Elenios, Fairlight, Leah, Raia, Rhatt, Sheran, Színtelen, and Narancs lap. Combined templates are used for Chara-din-Tharr, Sheran-Dornodon, and the available Elenios combinations (Chara-din, Dornodon, Fairlight, Leah, and Rhatt). Tharr on its own uses its built-in fallback color until an individual image is available. If a configured base image cannot be loaded, its fallback color is shown instead.

Other optional resources, such as cost symbols and icons, are loaded from `resources/` when present and fall back to built-in symbols or colors when absent.

## Notes

- No package install or build step is required.
- The app stores custom uploaded images only in the browser session and does not save them to a server.
- Download output depends on the browser's canvas export capabilities.
