# Unofficial HKK Card Maker

Unofficial HKK Card Maker is a lightweight browser-based card designer for creating custom fantasy cards inspired by the Hungarian Fantasy Card Game style. It lets you set a card name, choose base colors, add icons, assign costs, and export the finished card as a PNG.

## Features

- Build cards with a name, text, faction/base combinations, and optional illustration
- Enter a card type and subtype, or add common values from their preset lists
- Select custom card icons and resource-based cost symbols
- Mix up to two base colors with built-in validation rules; Színtelen, Bufa, and Narancs lap are exclusive
- Download the final card as an image
- Use transparent PNG base-card images where available, with JPG and fallback-color alternatives
- Start with editable Lorem ipsum samples for rules and flavor text; insert inline ability icons, including once-per-turn and once-per-game variants
- Emphasize selected ability text in bold, automatically shrink long text to fit, and display centered italic flavor text with matching weight

## Project structure

- `index.html` — app shell and card editor UI
- `app.js` — editor behavior, preview updates, and PNG export logic
- `styles.css` — card and interface styling
- `resources/` — optional art assets used by the card editor and preview

## Running locally

Because this project is a static web app, you can open it directly in a browser or serve it locally. In Chrome, opening `index.html` directly from a `file://` URL allows editing and previewing, but browser security blocks PNG export because the card uses local image files. Use a local web server for downloads.

### Option 1: open directly (preview only)

Open `index.html` in any modern browser to edit and preview cards. Use the local web server option below to download PNGs.

### Option 2: serve from a local web server

For PNG downloads and a native Save As dialog in Chrome, open a terminal in the repository root and run the included Node.js server:

```text
node serve.js
```

Then visit `http://localhost:8000/`. The save dialog lets you choose the destination and file name. If Python is installed, `python -m http.server 8000` can be used instead.

```text
http://localhost:8000/
```

## Base-card images and optional overrides

Faction base-card images are loaded from `resources/Base colors/`. Individual and combination templates are organized into folders named for their leading faction; Bufa, Színtelen, and Narancs lap templates remain directly in the base folder. Transparent PNG templates are used wherever available, enabling uploaded artwork to appear behind the card frame; other templates continue to use JPGs. All available individual faction bases and faction-pair combinations are supported. When multiple templates exist for one pair, the app uses the Raia-led template for Raia/Rhatt and the Sheran-led template for Raia/Sheran. If a configured base image cannot be loaded, its fallback color is shown instead.

Other optional resources, such as cost symbols and icons, are loaded from `resources/` when present and fall back to built-in symbols or colors when absent.

## Adjusting card icon placement

Edit `cardIconLayouts` near the top of `app.js` to resize each card icon and adjust its vertical position. Center-row icons automatically line up next to each other; their `y` setting is a vertical offset within the row and `size` is a percentage of the card's width. Left-side and separately placed icons also have individual `x`/`y` positions. The left-side group allows one icon or **Nincs**; PNG exports use the same layout as the preview.

The **Teszt** button beside **Ikonok** keeps the last selected icon visible in the preview while adjusting layouts, even after a page reload or form reset. The test-only icon does not appear in downloaded cards and the selection is remembered for the current browser tab session.

The **Teszt** button beside **Alap színek** similarly previews the last selected faction without changing the card's actual faction or PNG export. It starts off with Narancs lap as the remembered preview.

The **Mágikus támadás** and **Védekezés** checkboxes under the stats toggle the Erő and Védettség/Strukturális pont indicators, respectively. They are not separate card icons.

The card-creation rule selector above the faction choices restricts colors, costs, and stats for Varázslat/Tárgy, Lény, Építmény, Követő/Szabálylap, and Őslich. **Egyéb** is the unrestricted default. Switching rules clears values that are no longer allowed; the rule definitions and guidance are maintained in `cardRuleDefinitions` and `cardRuleGuidance` in `app.js`.

In the card-text field, select text and use the **Félkövér** button to mark it bold. The preview and PNG export both preserve the formatting, and longer ability or flavor text shrinks to fit. Flavor text is shown centered, italicized, and in Hungarian quotation marks.

For a number inside an inline Építő, Áldozás, VP, SZK, Nekron, ZSZ, Oltalom, or Reakció drágítás icon, put the number before its name in the token, for example `[3VP]` or `[2Reakció drágítás]`. Unnumbered tokens such as `[VP]` still work.

## Notes

- No package install or build step is required.
- The app stores custom uploaded images only in the browser session and does not save them to a server.
- Download output depends on the browser's canvas export capabilities.
