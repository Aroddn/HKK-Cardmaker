# Contributing

## Project approach

HKK Card Maker is a static HTML, CSS, and JavaScript app. Keep changes small and browser-native; there is no build system, test runner, or package manager. Do not add dependencies or a backend unless a feature specifically requires one.

## Guidelines

- Follow the existing separation: structure and controls in `index.html`, behavior in `app.js`, and presentation in `styles.css`.
- Keep visible interface text in Hungarian and preserve the card's established HKK-inspired style.
- Use semantic, labelled controls and accessible status text. Update the preview immediately when editor values change.
- Use relative paths for resources. Optional images must retain a useful symbol or color fallback when unavailable.
- For card fields or visual changes, verify both the HTML preview and PNG export; canvas output may need its own rendering change.
- Keep uploaded images local to the browser. Do not introduce server transmission or persistence without an explicit product requirement.

## Before submitting

Open `index.html` in a modern browser (or use a local static server) and check the affected workflow. Verify responsive layout where relevant, image-present and image-missing behavior, faction constraints, reset, and PNG download as appropriate. Report manual checks and any known limitations with the change.
