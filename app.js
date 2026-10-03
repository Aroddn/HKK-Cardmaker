const form = document.querySelector('#card-form');
const card = document.querySelector('#hkk-card');
const imageInput = document.querySelector('#card-image');
const previewImage = document.querySelector('#preview-image');
const artPlaceholder = document.querySelector('#art-placeholder');
const fileName = document.querySelector('#file-name');
const factionInputs = [...form.querySelectorAll('input[name="faction"]')];
let imageUrl = null;

const factions = [
  { key: 'bufa', label: 'Bufa', image: 'resources/Bufa base.png', fallback: '#8b563d', exclusive: true },
  { key: 'chara-din', label: 'Chara-din', image: 'resources/Chara-din base.png', fallback: '#a0473f' },
  { key: 'dornodon', label: 'Dornodon', image: 'resources/Dornodon base.png', fallback: '#a67d3e' },
  { key: 'elenios', label: 'Elenios', image: 'resources/Elenios base.png', fallback: '#537d9a' },
  { key: 'fairlight', label: 'Fairlight', image: 'resources/Fairlight base.png', fallback: '#cfb85e' },
  { key: 'leah', label: 'Leah', image: 'resources/Leah base.png', fallback: '#658a57' },
  { key: 'raia', label: 'Raia', image: 'resources/Raia base.png', fallback: '#a99a88' },
  { key: 'rhatt', label: 'Rhatt', image: 'resources/Rhatt base.png', fallback: '#6c604c' },
  { key: 'sheran', label: 'Sheran', image: 'resources/Sheran base.png', fallback: '#7b7192' },
  { key: 'colorless', label: 'Színtelen', image: 'resources/Colorless base.png', fallback: '#898b88' },
  { key: 'no-color', label: 'Nincs szín', image: 'resources/No color base.png', fallback: '#343b3c', exclusive: true }
];
const factionByKey = new Map(factions.map((faction) => [faction.key, faction]));
const exclusiveFactionKeys = new Set(['bufa', 'no-color']);

const iconDetails = {
  beast: { symbol: '&#9876;', label: 'Vad', image: 'resources/icon-beast.png' },
  magic: { symbol: '&#10022;', label: 'Varázslat', image: 'resources/icon-magic.png' },
  flying: { symbol: '&#10038;', label: 'Repülés', image: 'resources/icon-flying.png' },
  rare: { symbol: '&#9733;', label: 'Ritka', image: 'resources/icon-rare.png' }
};

const costDetails = [
  { key: 'mana', label: 'Mana', symbol: 'M', style: 'mana', image: 'resources/cost-mana.png' },
  { key: 'nekron', label: 'Nekron', symbol: 'N', style: 'nekron', image: 'resources/cost-nekron.png' },
  { key: 'zsz', label: 'ZSZ', symbol: 'Z', style: 'zsz', image: 'resources/cost-zsz.png' },
  { key: 'build', label: 'Építés', symbol: 'B', style: 'build', image: 'resources/cost-build.png' }
];

const keywordLabels = {
  leszedes: 'Leszedés',
  reakcio: 'Reakció',
  huzas: 'Húzás',
  kereses: 'Keresés',
  eroforras: 'Erőforrás',
  sebzes: 'Sebzés',
  gyogyulas: 'Gyógyulás',
  dobatas: 'Dobatás',
  lopas: 'Lopás',
  semmizes: 'Szemmisítés',
  visszavetel: 'Visszavétel',
  token: 'Token'
};

function watchResourceImages(root = document) {
  root.querySelectorAll('.resource-image').forEach((image) => {
    const imageContainer = image.parentElement;
    const markLoaded = () => {
      imageContainer.classList.add('has-resource-image');
      imageContainer.classList.remove('missing-resource');
      updateFactionImageStatus();
    };
    const removeMissing = () => {
      imageContainer.classList.add('missing-resource');
      image.remove();
      updateFactionImageStatus();
    };

    image.addEventListener('load', markLoaded, { once: true });
    image.addEventListener('error', removeMissing, { once: true });

    if (image.complete) {
      if (image.naturalWidth > 0) markLoaded();
      else removeMissing();
    }
  });
}

function updateFactionImageStatus() {
  const missingBases = [...document.querySelectorAll('#base-color-layers .missing-resource')]
    .map((layer) => layer.dataset.factionLabel);
  const status = document.querySelector('#faction-image-status');
  status.textContent = missingBases.length
    ? `Hiányzó alapszín-kép: ${missingBases.join(', ')}. Add hozzá a PNG fájlt a resources mappába.`
    : '';
}

function updateFactionControls(message = 'Legfeljebb kettőt válassz. A Bufa és a Nincs szín külön kell legyen kiválasztva.') {
  const selected = factionInputs.filter((input) => input.checked);
  const hasExclusive = selected.some((input) => exclusiveFactionKeys.has(input.value));

  factionInputs.forEach((input) => {
    input.disabled = !input.checked && (selected.length >= 2 || hasExclusive);
  });

  document.querySelector('#faction-count').textContent = `${selected.length} / 2 kiválasztva`;
  document.querySelector('#faction-guidance').textContent = message;
}

function handleFactionChange(event) {
  const input = event.currentTarget;
  const selected = factionInputs.filter((option) => option.checked);

  if (input.checked && selected.length > 2) {
    input.checked = false;
    updateFactionControls('Egy kártyán legfeljebb két alapszín lehet.');
  } else if (input.checked && selected.some((option) => option !== input && exclusiveFactionKeys.has(option.value))) {
    input.checked = false;
    updateFactionControls(`${factionByKey.get(input.value).label} nem kombinálható a Bufával vagy a Nincs színnel.`);
  } else if (input.checked && exclusiveFactionKeys.has(input.value) && selected.length > 1) {
    input.checked = false;
    updateFactionControls(`${factionByKey.get(input.value).label} külön kell legyen kiválasztva.`);
  } else {
    updateFactionControls();
  }

  updatePreview();
}

function updatePreview() {
  const values = new FormData(form);
  const name = values.get('name').trim();
  const text = values.get('text').trim();
  const selectedFactions = values.getAll('faction');
  const cardType = values.get('cardType') || 'creature';
  const subtype = values.get('subtype').trim() || 'Kategória';
  const edition = values.get('edition') || 'Zén';
  const rarity = values.get('rarity') || 'Gyakori';
  const power = Number(values.get('power')) || 0;
  const toughness = Number(values.get('toughness')) || 0;
  const typeLabels = {
    creature: 'Lény',
    spell: 'Varázslat',
    enchantment: 'Bűbájvarázslat',
    artifact: 'Eszköz',
    support: 'Támogató',
    event: 'Esemény',
    structure: 'Épület',
    token: 'Token'
  };

  document.querySelector('#preview-name').textContent = name || 'Névtelen kártya';
  document.querySelector('#preview-card-type').textContent = typeLabels[cardType] || 'Lény';
  document.querySelector('#preview-subtype').textContent = subtype;
  document.querySelector('#preview-rarity').textContent = rarity;
  document.querySelector('#preview-edition').textContent = `${edition} • ${cardType === 'creature' ? '001' : 'HKK'}`;
  document.querySelector('#preview-text').textContent = text || 'Nincs kártyaszöveg.';
  document.querySelector('#text-count').textContent = values.get('text').length;

  const showStats = cardType === 'creature';
  const statsPanel = document.querySelector('#preview-stats');
  statsPanel.hidden = !showStats;
  document.querySelector('#preview-power').textContent = power;
  document.querySelector('#preview-toughness').textContent = toughness;

  const activeCostCount = costDetails.filter(({ key }) => Number(values.get(key)) > 0).length;
  card.dataset.costCount = String(activeCostCount);
  const baseLayers = document.querySelector('#base-color-layers');
  baseLayers.classList.toggle('multi-color', selectedFactions.length === 2);
  baseLayers.innerHTML = selectedFactions.map((key) => {
    const faction = factionByKey.get(key);
    return `<div class="card-base-layer" data-faction-label="${faction.label}" style="--faction-fallback: ${faction.fallback}"><img class="resource-image" src="${faction.image}" alt=""></div>`;
  }).join('');
  updateFactionImageStatus();
  watchResourceImages(baseLayers);

  const selectedIcons = values.getAll('icon');
  document.querySelector('#preview-icons').innerHTML = selectedIcons.map((icon) => {
    const detail = iconDetails[icon];
    return `<span class="card-icon"><img class="resource-image" src="${detail.image}" alt="" aria-hidden="true"><span class="icon-fallback" aria-hidden="true">${detail.symbol}</span>${detail.label}</span>`;
  }).join('');

  const selectedKeywords = values.getAll('keyword');
  document.querySelector('#preview-keywords').innerHTML = selectedKeywords.map((keyword) => `<span class="card-keyword">${keywordLabels[keyword] || keyword}</span>`).join('');

  document.querySelector('#preview-costs').innerHTML = costDetails.map(({ key, label, symbol, style, image }) => {
    const amount = Number(values.get(key)) || 0;
    return amount > 0
      ? `<span class="card-cost ${style}" aria-label="${label}: ${amount}"><b aria-hidden="true"><img class="resource-image" src="${image}" alt=""><span class="cost-glyph">${symbol}</span><span class="cost-amount">${amount}</span></b></span>`
      : '';
  }).join('');

  watchResourceImages(document.querySelector('#preview-icons'));
  watchResourceImages(document.querySelector('#preview-costs'));
}

form.addEventListener('input', updatePreview);
form.addEventListener('change', updatePreview);
factionInputs.forEach((input) => input.addEventListener('change', handleFactionChange));

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (imageUrl) URL.revokeObjectURL(imageUrl);
  imageUrl = file ? URL.createObjectURL(file) : null;
  previewImage.hidden = !imageUrl;
  artPlaceholder.hidden = Boolean(imageUrl);
  if (imageUrl) previewImage.src = imageUrl;
  fileName.textContent = file ? file.name : 'Nincs kép kiválasztva';
});

document.querySelector('#reset-button').addEventListener('click', () => {
  form.reset();
  if (imageUrl) URL.revokeObjectURL(imageUrl);
  imageUrl = null;
  previewImage.removeAttribute('src');
  previewImage.hidden = true;
  artPlaceholder.hidden = false;
  fileName.textContent = 'Nincs kép kiválasztva';
  updateFactionControls();
  updatePreview();
});

function getCanvasRect(element, cardRect, scaleX, scaleY) {
  const rect = element.getBoundingClientRect();
  return {
    x: (rect.left - cardRect.left) * scaleX,
    y: (rect.top - cardRect.top) * scaleY,
    width: rect.width * scaleX,
    height: rect.height * scaleY
  };
}

function traceCostShape(context, style, x, y, width, height) {
  context.beginPath();
  if (style === 'mana') {
    context.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
  } else {
    const points = style === 'nekron'
      ? [[.25, 0], [.75, 0], [1, .5], [.75, 1], [.25, 1], [0, .5]]
      : style === 'zsz'
        ? [[.5, 0], [1, .5], [.5, 1], [0, .5]]
        : [[.28, 0], [.72, 0], [1, .28], [1, .72], [.72, 1], [.28, 1], [0, .72], [0, .28]];
    points.forEach(([pointX, pointY], index) => {
      const px = x + pointX * width;
      const py = y + pointY * height;
      if (index === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    });
    context.closePath();
  }
}

function drawCover(context, image, rect) {
  const scale = Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  context.save();
  context.beginPath();
  context.rect(rect.x, rect.y, rect.width, rect.height);
  context.clip();
  context.drawImage(image, rect.x + (rect.width - width) / 2, rect.y + (rect.height - height) / 2, width, height);
  context.restore();
}

function drawFallbackArtwork(context, rect) {
  const sky = context.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
  sky.addColorStop(0, '#141c32');
  sky.addColorStop(.62, '#252d3c');
  sky.addColorStop(1, '#191d1d');
  context.fillStyle = sky;
  context.fillRect(rect.x, rect.y, rect.width, rect.height);
  context.fillStyle = '#d2cba8';
  context.beginPath();
  context.arc(rect.x + rect.width * .78, rect.y + rect.height * .2, rect.width * .07, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#1a202b';
  context.beginPath();
  context.moveTo(rect.x, rect.y + rect.height * .83);
  context.lineTo(rect.x + rect.width * .24, rect.y + rect.height * .43);
  context.lineTo(rect.x + rect.width * .39, rect.y + rect.height * .72);
  context.lineTo(rect.x + rect.width * .59, rect.y + rect.height * .36);
  context.lineTo(rect.x + rect.width * .82, rect.y + rect.height * .74);
  context.lineTo(rect.x + rect.width, rect.y + rect.height * .48);
  context.lineTo(rect.x + rect.width, rect.y + rect.height);
  context.lineTo(rect.x, rect.y + rect.height);
  context.closePath();
  context.fill();
}

function drawWrappedText(context, text, rect, font, color, lineHeight, alignment) {
  context.save();
  context.beginPath();
  context.rect(rect.x, rect.y, rect.width, rect.height);
  context.clip();
  context.font = font;
  context.fillStyle = color;
  context.textAlign = alignment;
  context.textBaseline = 'top';
  const textX = alignment === 'center' ? rect.x + rect.width / 2 : rect.x;
  let y = rect.y;
  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    let line = '';
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && context.measureText(candidate).width > rect.width) {
        context.fillText(line, textX, y);
        y += lineHeight;
        line = word;
      } else {
        line = candidate;
      }
      if (y + lineHeight > rect.y + rect.height) break;
    }
    if (line && y + lineHeight <= rect.y + rect.height) {
      context.fillText(line, textX, y);
      y += lineHeight;
    }
    if (y + lineHeight > rect.y + rect.height) break;
  }
  context.restore();
}

async function renderCardPng() {
  const cardRect = card.getBoundingClientRect();
  const baseImage = card.querySelector('#base-color-layers img');
  const exportWidth = baseImage?.naturalWidth || 1061;
  const exportHeight = baseImage?.naturalHeight || 1483;
  const scaleX = exportWidth / cardRect.width;
  const scaleY = exportHeight / cardRect.height;
  const canvas = document.createElement('canvas');
  canvas.width = exportWidth;
  canvas.height = exportHeight;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas rendering is unavailable.');
  context.imageSmoothingQuality = 'high';

  const baseLayers = [...document.querySelectorAll('#base-color-layers .card-base-layer')];
  if (!baseLayers.length) {
    context.fillStyle = '#111719';
    context.fillRect(0, 0, exportWidth, exportHeight);
  }
  baseLayers.forEach((layer, index) => {
    context.save();
    if (baseLayers.length === 2) {
      context.beginPath();
      if (index === 0) {
        context.moveTo(0, 0);
        context.lineTo(exportWidth, 0);
        context.lineTo(0, exportHeight);
      } else {
        context.moveTo(exportWidth, 0);
        context.lineTo(exportWidth, exportHeight);
        context.lineTo(0, exportHeight);
      }
      context.closePath();
      context.clip();
    }
    const image = layer.querySelector('img');
    if (image?.naturalWidth) context.drawImage(image, 0, 0, exportWidth, exportHeight);
    else {
      context.fillStyle = getComputedStyle(layer).backgroundColor;
      context.fillRect(0, 0, exportWidth, exportHeight);
    }
    context.restore();
  });

  const artRect = getCanvasRect(document.querySelector('.art-frame'), cardRect, scaleX, scaleY);
  if (!previewImage.hidden && previewImage.naturalWidth) drawCover(context, previewImage, artRect);
  else drawFallbackArtwork(context, artRect);

  const nameElement = document.querySelector('#preview-name');
  const nameRect = getCanvasRect(nameElement, cardRect, scaleX, scaleY);
  const nameStyle = getComputedStyle(nameElement);
  context.fillStyle = nameStyle.color;
  context.font = `${nameStyle.fontWeight} ${parseFloat(nameStyle.fontSize) * scaleY}px ${nameStyle.fontFamily}`;
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.shadowColor = 'rgba(255, 249, 232, .8)';
  context.shadowBlur = 3 * scaleY;
  context.shadowOffsetY = scaleY;
  context.fillText(nameElement.textContent, nameRect.x + nameRect.width / 2, nameRect.y, nameRect.width);
  context.shadowColor = 'transparent';
  context.shadowBlur = 0;
  context.shadowOffsetY = 0;

  const metaType = document.querySelector('#preview-card-type');
  const metaSubtype = document.querySelector('#preview-subtype');
  if (metaType && metaSubtype) {
    const metaRect = getCanvasRect(document.querySelector('.card-topline'), cardRect, scaleX, scaleY);
    context.fillStyle = '#2f3a38';
    context.font = `600 ${Math.max(9, parseFloat(getComputedStyle(metaType).fontSize) * scaleY)}px ${getComputedStyle(metaType).fontFamily}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`${metaType.textContent} • ${metaSubtype.textContent}`, metaRect.x + metaRect.width / 2, metaRect.y + metaRect.height / 2);
  }

  document.querySelectorAll('#preview-costs .card-cost').forEach((cost) => {
    const badge = cost.querySelector('b');
    const rect = getCanvasRect(badge, cardRect, scaleX, scaleY);
    const style = ['mana', 'nekron', 'zsz', 'build'].find((name) => cost.classList.contains(name));
    traceCostShape(context, style, rect.x, rect.y, rect.width, rect.height);
    context.fillStyle = getComputedStyle(badge).backgroundColor;
    context.fill();
    context.save();
    context.clip();
    const symbolImage = badge.querySelector('img');
    if (symbolImage?.naturalWidth) context.drawImage(symbolImage, rect.x, rect.y, rect.width, rect.height);
    context.restore();
    const glyph = badge.querySelector('.cost-glyph');
    if (glyph && getComputedStyle(glyph).display !== 'none') {
      const glyphRect = getCanvasRect(glyph, cardRect, scaleX, scaleY);
      context.fillStyle = '#fff';
      context.font = `700 ${Math.max(12, glyphRect.height * .8)}px Georgia, serif`;
      context.textAlign = 'center';
      context.textBaseline = 'top';
      context.fillText(glyph.textContent, rect.x + rect.width / 2, glyphRect.y);
    }
    const amount = badge.querySelector('.cost-amount');
    const amountRect = getCanvasRect(amount, cardRect, scaleX, scaleY);
    context.fillStyle = '#fff';
    context.font = `600 ${Math.max(16, amountRect.height * 1.4)}px monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(amount.textContent, rect.x + rect.width / 2, amountRect.y + amountRect.height / 2);
  });

  document.querySelectorAll('#preview-icons .card-icon').forEach((icon) => {
    const rect = getCanvasRect(icon, cardRect, scaleX, scaleY);
    context.fillStyle = 'rgba(41, 45, 44, .8)';
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
    context.strokeStyle = '#777970';
    context.lineWidth = Math.max(1, scaleX);
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    const iconImage = icon.querySelector('img');
    const fallback = icon.querySelector('.icon-fallback');
    if (iconImage?.naturalWidth) {
      const iconRect = getCanvasRect(iconImage, cardRect, scaleX, scaleY);
      context.drawImage(iconImage, iconRect.x, iconRect.y, iconRect.width, iconRect.height);
    } else if (fallback && getComputedStyle(fallback).display !== 'none') {
      const iconRect = getCanvasRect(fallback, cardRect, scaleX, scaleY);
      context.fillStyle = '#d0b775';
      context.font = `${Math.max(14, iconRect.height)}px Georgia, serif`;
      context.textAlign = 'left';
      context.textBaseline = 'middle';
      context.fillText(fallback.textContent, iconRect.x, iconRect.y + iconRect.height / 2);
    }
    const fallbackText = fallback?.textContent || '';
    const label = icon.textContent.replace(fallbackText, '').trim();
    const iconStyle = getComputedStyle(icon);
    context.fillStyle = iconStyle.color;
    context.font = `700 ${parseFloat(iconStyle.fontSize) * scaleY}px ${iconStyle.fontFamily}`;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(label, rect.x + 22 * scaleX, rect.y + rect.height / 2);
  });

  const rules = document.querySelector('#preview-text');
  const rulesRect = getCanvasRect(document.querySelector('.card-rules'), cardRect, scaleX, scaleY);
  const rulesStyle = getComputedStyle(rules);
  const fontSize = parseFloat(rulesStyle.fontSize) * scaleY;
  const lineHeight = parseFloat(rulesStyle.lineHeight) * scaleY || fontSize * 1.42;
  drawWrappedText(context, rules.textContent, {
    x: rulesRect.x + 10 * scaleX,
    y: rulesRect.y + 9 * scaleY,
    width: rulesRect.width - 20 * scaleX,
    height: rulesRect.height - 15 * scaleY
  }, `${rulesStyle.fontStyle} ${rulesStyle.fontWeight} ${fontSize}px ${rulesStyle.fontFamily}`, rulesStyle.color, lineHeight, rulesStyle.textAlign);

  const statsPanel = document.querySelector('#preview-stats');
  if (!statsPanel.hidden) {
    const statBoxes = statsPanel.querySelectorAll('.stat-box');
    statBoxes.forEach((box) => {
      const boxRect = getCanvasRect(box, cardRect, scaleX, scaleY);
      context.fillStyle = '#101a20';
      context.fillRect(boxRect.x, boxRect.y, boxRect.width, boxRect.height);
      context.strokeStyle = '#d2b15e';
      context.lineWidth = Math.max(1, scaleX);
      context.strokeRect(boxRect.x, boxRect.y, boxRect.width, boxRect.height);

      const label = box.querySelector('.stat-label');
      const value = box.querySelector('strong');
      if (label) {
        const labelRect = getCanvasRect(label, cardRect, scaleX, scaleY);
        context.fillStyle = '#d2b15e';
        context.font = `${getComputedStyle(label).fontWeight} ${Math.max(8, labelRect.height * .5)}px ${getComputedStyle(label).fontFamily}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(label.textContent, labelRect.x + labelRect.width / 2, labelRect.y + labelRect.height / 2);
      }
      if (value) {
        const valueRect = getCanvasRect(value, cardRect, scaleX, scaleY);
        context.fillStyle = '#fff';
        context.font = `700 ${Math.max(18, valueRect.height * 1.6)}px ${getComputedStyle(value).fontFamily}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(value.textContent, valueRect.x + valueRect.width / 2, valueRect.y + valueRect.height / 2);
      }
    });
  }

  const setMark = document.querySelector('.card-set');
  const setRect = getCanvasRect(setMark, cardRect, scaleX, scaleY);
  const setStyle = getComputedStyle(setMark);
  context.fillStyle = setStyle.color;
  context.font = `${setStyle.fontWeight} ${parseFloat(setStyle.fontSize) * scaleY}px ${setStyle.fontFamily}`;
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.fillText(setMark.textContent, setRect.x, setRect.y);

  const rarityMark = document.querySelector('.card-rarity');
  if (rarityMark) {
    const rarityRect = getCanvasRect(rarityMark, cardRect, scaleX, scaleY);
    const rarityStyle = getComputedStyle(rarityMark);
    context.fillStyle = rarityStyle.color;
    context.font = `${rarityStyle.fontWeight} ${parseFloat(rarityStyle.fontSize) * scaleY}px ${rarityStyle.fontFamily}`;
    context.textAlign = 'right';
    context.textBaseline = 'top';
    context.fillText(rarityMark.textContent, rarityRect.x + rarityRect.width, rarityRect.y);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not encode the card image.')), 'image/png');
  });
}

const downloadButton = document.querySelector('#download-button');
downloadButton.addEventListener('click', async () => {
  const status = document.querySelector('#download-status');
  status.textContent = '';
  downloadButton.disabled = true;
  try {
    const loadedImages = [...card.querySelectorAll('img')].filter((image) => image.complete && image.naturalWidth > 0);
    await Promise.all(loadedImages.map((image) => image.decode().catch(() => null)));
    const blob = await renderCardPng();
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = document.querySelector('#preview-name').textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'hkk-card';
    link.href = downloadUrl;
    link.download = `${safeName}.png`;
    link.click();
    status.textContent = `Created ${link.download}`;
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  } catch (error) {
    status.textContent = 'Nem sikerült elkészíteni a PNG fájlt. Ellenőrizd, hogy a kártyaképek érvényes PNG, JPG vagy GIF fájlok legyenek.';
    console.error(error);
  } finally {
    downloadButton.disabled = false;
  }
});

watchResourceImages();
updateFactionControls();
updatePreview();