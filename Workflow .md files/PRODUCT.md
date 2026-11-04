# Product

## Purpose

HKK Card Maker is an unofficial, fan-made browser tool for designing custom cards inspired by the Hungarian Fantasy Card Game. Users edit a card in a form and see a matching card preview update immediately.

## What users can create

The editor lets users set:

- A card name (up to 32 characters), card rules text (up to 260 characters), and optional flavor text (up to 180 characters).
- One or two base colors. Színtelen, Bufa, and the no-color option must each be selected alone. Supported combinations use their matching combined artwork.
- Optional illustration uploaded from the user's device. The image is used in the current browser session and is not uploaded to a server.
- Card icons, including numeric fields for reaction surcharge, protection, and monster-component quantity. Creature power and toughness accept digit and arithmetic-expression values and appear without labels in the bottom card corners.
- Costs for VP, Zanszilánk, Nekron, SZK, Építő, and Áldozás. Each accepts a number or `X`, and any combination can be used.
- Free-form card type and subtype fields, each with a picker for common values, plus rarity and creature power and toughness.
- All transparent PNG icons in `resources/Icons` outside the `Considering` folder can be inserted at the cursor in the main rules text.
- Selecting Védekezés or one of the configured band icons displays it in a centered row between the artwork and rules text; unavailable icon art uses a question-mark placeholder.
- Típus and altípus labels are bold and can be toggled between black and white in the editor.

The preview includes base artwork, user-uploaded illustration, costs, icons, card text, flavor text, and stats. The illustration area is blank until the user uploads an image. Rarity remains available in the editor but is not shown on the card. Erő and the selected second stat are hidden when their values are blank; the second stat can be either Védettség (with the Védelem icon) or Strukturális pont. Missing optional icons fall back to built-in symbols.

Transparent base PNGs are used for Narancs lap, Bufa, Színtelen, Chara-din, and the available Chara-din combinations. When a transparent base is selected and an illustration is uploaded, the illustration can be positioned and scaled behind the base with the horizontal, vertical, and size controls.

## Workflow and output

1. Open the editor and modify the fields; the card preview changes as values are entered.
2. Optionally choose an illustration and adjust the card's other details.
3. Use **Visszaállítás** to restore the sample card, or **Kép letöltése** to export the current design as a PNG.

The app runs locally in a modern browser and needs no account or installation. It does not save designs between sessions. Printing is also supported by the browser's print stylesheet.

## Scope

This tool is a visual card designer, not a game rules engine or official HKK product. It does not validate card balance or rules, publish cards, store a collection, or synchronize designs across devices.
