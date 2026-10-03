# Card image resources

The card maker reads these optional PNG files relative to `index.html`:

- Faction bases use `<Faction> base.png`, sized to the same 1061 x 1483 portrait layout so the artwork and text windows line up. Supported names: `Bufa base.png`, `Chara-din base.png`, `Dornodon base.png`, `Elenios base.png`, `Fairlight base.png`, `Leah base.png`, `Raia base.png`, `Rhatt base.png`, `Sheran base.png`, `Colorless base.png`, and `No color base.png`.
- `cost-mana.png`, `cost-nekron.png`, `cost-zsz.png`, and `cost-build.png` replace the four cost symbols in both the editor and card preview.
- `icon-beast.png`, `icon-magic.png`, `icon-flying.png`, and `icon-rare.png` replace the selectable card-type symbols in the editor and preview.

Transparent PNGs work best for cost and type symbols. The cost number is drawn over each cost image. If an optional symbol file is missing, the built-in letter or glyph remains visible. The card illustration is still selected from the editor and is not stored in this folder.

Choose zero, one, or two base colors. Two bases are shown as diagonal halves. Bufa and No color are exclusive and cannot be combined with another base.