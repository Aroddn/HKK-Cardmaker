# Card image resources

The card maker reads these optional PNG files relative to `index.html`:

- Faction bases use `<Faction> base.png`, sized to the same 1061 x 1483 portrait layout so the artwork and text windows line up. Supported names: `Bufa base.png`, `Chara-din base.png`, `Dornodon base.png`, `Elenios base.png`, `Fairlight base.png`, `Leah base.png`, `Raia base.png`, `Rhatt base.png`, `Sheran base.png`, `Colorless base.png`, and `No color base.png`.
- `cost-vp.png`, `cost-zanszilank.png`, `cost-nekron.png`, `cost-szk.png`, `cost-builder.png`, and `cost-sacrifice.png` replace the six cost symbols in both the editor and card preview.

Transparent PNGs work best for cost symbols. Each cost value accepts freeform text such as `X` or `X+1` and is drawn inside its icon. If an optional cost symbol file is missing, the built-in symbol remains visible. The card illustration is still selected from the editor and is not stored in this folder.

Choose zero, one, or two base colors. Two bases are shown as diagonal halves. Bufa and No color are exclusive and cannot be combined with another base.