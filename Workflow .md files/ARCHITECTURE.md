# Architecture

## Overview

HKK Card Maker is a static, client-side web application. It has no server component, framework, build step, package manager, or application database. The browser loads the page and its local JavaScript, CSS, and optional image resources directly.

## Main components

- **`index.html`** defines the Hungarian editor form, toolbar, live card preview, and page structure. Form controls are labelled and grouped by card property.
- **`app.js`** owns the editor behavior. It reads form values, validates faction combinations, updates the preview DOM, manages a locally selected image, handles reset and download actions, and renders PNG output.
- **`styles.css`** provides the editor layout, responsive and print styles, and the card's visual composition. The preview card is HTML/CSS rather than an image.
- **`resources/`** contains optional card-base artwork and image assets. Resource images have built-in color or symbol fallbacks so missing files do not prevent the editor from working.

## Runtime and data flow

1. The browser parses `index.html`, loads `styles.css`, and defers `app.js` until the document is available.
2. Input and change events cause `app.js` to read the form with `FormData` and update the preview. Rules text is rendered as text with optional Körönként egyszer tokens replaced by their inline icons; selected costs, icons, metadata, and faction layers are rendered from the form state.
3. Faction selection is limited to two bases. Színtelen, Bufa, and the no-color option are exclusive; supported pairs can use a combined base image.
4. An uploaded illustration is represented by a browser object URL for the current page session. Reset and image replacement revoke the previous URL.
5. Download waits for available card images, draws the card onto a canvas at the base-art dimensions (or a default size), encodes a PNG blob, and triggers a browser download. Export failures are shown in the download status and logged to the console.

## State, assets, and deployment

The current card state exists in the page's form controls and DOM. There is no account, remote API, server persistence, or save/load format. Uploaded art is not sent to a server. The included resource files are referenced by relative paths; if optional files are absent, the app uses its CSS colors or text symbols instead.

Open `index.html` directly in a modern browser or serve the repository root with any static web server. A local server is useful for consistent resource loading. No build or dependency installation is needed. Google Fonts are requested by the stylesheet when network access is available; local fallback fonts are defined.

## Extension points

Add or change editor fields in `index.html`, connect them to preview rendering and export in `app.js`, then style the corresponding preview elements in `styles.css`. The main rules text supports `[Körönként egyszer]` and `[Körönként egyszer2]` tokens, which render their corresponding inline images in the HTML preview and PNG export. The card type and subtype render on separate stacked lines at the lower left below the artwork; icons are centered alongside them before the printed color name at right. Keep this layout consistent in PNG export. Any new visual element that must appear in downloaded cards needs explicit canvas rendering in the PNG export path as well as an HTML preview. Keep resource paths relative and retain missing-image fallbacks.
