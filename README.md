# Unofficial HKK Card Maker

Unofficial HKK Card Maker is a lightweight browser-based card designer for creating custom fantasy cards inspired by the Hungarian Fantasy Card Game style. It lets you set a card name, choose base colors, add icons, assign costs, and export the finished card as a PNG.

## Features

- Build cards with a name, text, faction/base combinations, and optional illustration
- Select custom card icons and resource-based cost symbols
- Mix up to two base colors with built-in validation rules
- Download the final card as an image
- Use optional PNG overrides from the `resources/` directory for faction bases and symbols

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

## Optional artwork and overrides

The `resources/` folder can contain PNG files that replace default card bases and icon assets. See [resources/README.md](resources/README.md) for the supported files and their naming requirements.

## Notes

- No package install or build step is required.
- The app stores custom uploaded images only in the browser session and does not save them to a server.
- Download output depends on the browser's canvas export capabilities.
