const form = document.querySelector('#card-form');
const card = document.querySelector('#hkk-card');
const imageInput = document.querySelector('#card-image');
const previewImage = document.querySelector('#preview-image');
const artPlaceholder = document.querySelector('#art-placeholder');
const fileName = document.querySelector('#file-name');
const imageError = document.querySelector('#image-error');
const factionInputs = [...form.querySelectorAll('input[name="faction"]')];
const rulesTextInput = form.querySelector('#card-text');
const rulesTextIcons = [
  { token: '[Körönként egyszer2]', path: 'resources/Icons/Körönként egyszer2.png', alt: 'Körönként egyszer 2' },
  { token: '[Körönként egyszer]', path: 'resources/Icons/Körönként egyszer.png', alt: 'Körönként egyszer' }
];
const rulesTextIconByToken = new Map(rulesTextIcons.map((icon) => [icon.token, icon]));
const rulesTextIconPattern = /(\[Körönként egyszer2?\])/g;
let imageUrl = null;

const factions = [
  { key: 'bufa', label: 'Bufa', image: 'resources/Base colors/Bufa base.jpg', fallback: '#8b563d', exclusive: true },
  { key: 'chara-din', label: 'Chara-din', image: 'resources/Base colors/Chara-din/Chara-din base.jpg', fallback: '#a0473f' },
  { key: 'dornodon', label: 'Dornodon', image: 'resources/Base colors/Dornodon/Dornodon base.jpg', fallback: '#a67d3e' },
  { key: 'elenios', label: 'Elenios', image: 'resources/Base colors/Elenios/Elenios base.jpg', fallback: '#537d9a' },
  { key: 'fairlight', label: 'Fairlight', image: 'resources/Base colors/Fairlight/Fairlight base.jpg', fallback: '#cfb85e' },
  { key: 'leah', label: 'Leah', image: 'resources/Base colors/Leah/Leah base.jpg', fallback: '#658a57' },
  { key: 'raia', label: 'Raia', image: 'resources/Base colors/Raia/Raia base.jpg', fallback: '#a99a88' },
  { key: 'rhatt', label: 'Rhatt', image: 'resources/Base colors/Rhatt/Rhatt base.jpg', fallback: '#6c604c' },
  { key: 'sheran', label: 'Sheran', image: 'resources/Base colors/Sheran/Sheran base.jpg', fallback: '#7b7192' },
  { key: 'tharr', label: 'Tharr', image: 'resources/Base colors/Tharr/Tharr base.jpg', fallback: '#554b5d' },
  { key: 'colorless', label: 'Színtelen', image: 'resources/Base colors/Szintelen base.jpg', fallback: '#898b88', exclusive: true },
  { key: 'no-color', label: 'Narancs lap', image: 'resources/Base colors/Narancs lap base.jpg', fallback: '#343b3c', exclusive: true }
];
const factionByKey = new Map(factions.map((faction) => [faction.key, faction]));
const exclusiveFactionKeys = new Set(['bufa', 'colorless', 'no-color']);
const factionCombinationByKeys = new Map([
  ['chara-din+fairlight', {
    label: 'Chara-din-Fairlight',
    image: 'resources/Base colors/Chara-din/Chara-din Fairlight base.jpg',
    fallback: '#b38c4e'
  }],
  ['chara-din+leah', {
    label: 'Chara-din-Leah',
    image: 'resources/Base colors/Chara-din/Chara-din Leah base.jpg',
    fallback: '#82694b'
  }],
  ['chara-din+raia', {
    label: 'Chara-din-Raia',
    image: 'resources/Base colors/Chara-din/Chara-din Raia base.jpg',
    fallback: '#a07064'
  }],
  ['chara-din+rhatt', {
    label: 'Chara-din-Rhatt',
    image: 'resources/Base colors/Chara-din/Chara-din Rhatt base.jpg',
    fallback: '#865448'
  }],
  ['chara-din+sheran', {
    label: 'Chara-din-Sheran',
    image: 'resources/Base colors/Chara-din/Chara-din Sheran base.jpg',
    fallback: '#8d5c69'
  }],
  ['chara-din+dornodon', {
    label: 'Dornodon-Chara-din',
    image: 'resources/Base colors/Dornodon/Dornodon Chara-din base.jpg',
    fallback: '#9b7a52'
  }],
  ['chara-din+elenios', {
    label: 'Elenios-Chara-din',
    image: 'resources/Base colors/Elenios/Elenios Chara-din base.jpg',
    fallback: '#7b7090'
  }],
  ['chara-din+tharr', {
    label: 'Chara-din-Tharr',
    image: 'resources/Base colors/Chara-din/Chara-din Tharr base.jpg',
    fallback: '#554b5d'
  }],
  ['dornodon+elenios', {
    label: 'Elenios-Dornodon',
    image: 'resources/Base colors/Elenios/Elenios Dornodon base.jpg',
    fallback: '#897055'
  }],
  ['dornodon+fairlight', {
    label: 'Dornodon-Fairlight',
    image: 'resources/Base colors/Dornodon/Dornodon Fairlight base.jpg',
    fallback: '#bca554'
  }],
  ['dornodon+leah', {
    label: 'Dornodon-Leah',
    image: 'resources/Base colors/Dornodon/Dornodon Leah base.jpg',
    fallback: '#687a60'
  }],
  ['dornodon+raia', {
    label: 'Dornodon-Raia',
    image: 'resources/Base colors/Dornodon/Dornodon Raia base.jpg',
    fallback: '#a1896a'
  }],
  ['dornodon+rhatt', {
    label: 'Dornodon-Rhatt',
    image: 'resources/Base colors/Dornodon/Dornodon Rhatt base.jpg',
    fallback: '#7b6c56'
  }],
  ['dornodon+sheran', {
    label: 'Sheran-Dornodon',
    image: 'resources/Base colors/Sheran/Sheran Dornodon base.jpg',
    fallback: '#897055'
  }],
  ['dornodon+tharr', {
    label: 'Dornodon-Tharr',
    image: 'resources/Base colors/Dornodon/Dornodon Tharr base.jpg',
    fallback: '#6a5a61'
  }],
  ['elenios+fairlight', {
    label: 'Elenios-Fairlight',
    image: 'resources/Base colors/Elenios/Elenios Fairlight base.jpg',
    fallback: '#9d9b79'
  }],
  ['elenios+leah', {
    label: 'Elenios-Leah',
    image: 'resources/Base colors/Elenios/Elenios leah base.jpg',
    fallback: '#6c856f'
  }],
  ['elenios+raia', {
    label: 'Elenios-Raia',
    image: 'resources/Base colors/Elenios/Elenios Raia base.jpg',
    fallback: '#8c6d5a'
  }],
  ['elenios+rhatt', {
    label: 'Elenios-Rhatt',
    image: 'resources/Base colors/Elenios/Elenios Rhatt base.jpg',
    fallback: '#6c7080'
  }],
  ['elenios+sheran', {
    label: 'Elenios-Sheran',
    image: 'resources/Base colors/Elenios/Elenios Sheran base.jpg',
    fallback: '#6d7393'
  }],
  ['elenios+tharr', {
    label: 'Elenios-Tharr',
    image: 'resources/Base colors/Elenios/Elenios Tharr base.jpg',
    fallback: '#5e5d72'
  }],
  ['fairlight+leah', {
    label: 'Fairlight-Leah',
    image: 'resources/Base colors/Fairlight/Fairlight Leah base.jpg',
    fallback: '#9a9a5a'
  }],
  ['fairlight+raia', {
    label: 'Fairlight-Raia',
    image: 'resources/Base colors/Fairlight/Fairlight Raia base.jpg',
    fallback: '#b4a373'
  }],
  ['fairlight+rhatt', {
    label: 'Fairlight-Rhatt',
    image: 'resources/Base colors/Fairlight/Fairlight Rhatt base.jpg',
    fallback: '#9e8c55'
  }],
  ['fairlight+sheran', {
    label: 'Fairlight-Sheran',
    image: 'resources/Base colors/Fairlight/Fairlight Sheran base.jpg',
    fallback: '#a59978'
  }],
  ['fairlight+tharr', {
    label: 'Fairlight-Tharr',
    image: 'resources/Base colors/Fairlight/Fairlight Tharr base.jpg',
    fallback: '#92816d'
  }],
  ['leah+raia', {
    label: 'Leah-Raia',
    image: 'resources/Base colors/Leah/Leah Raia base.jpg',
    fallback: '#879273'
  }],
  ['leah+rhatt', {
    label: 'Leah-Rhatt',
    image: 'resources/Base colors/Leah/Leah Rhatt base.jpg',
    fallback: '#687352'
  }],
  ['leah+sheran', {
    label: 'Leah-Sheran',
    image: 'resources/Base colors/Leah/Leah Sheran base.jpg',
    fallback: '#708078'
  }],
  ['leah+tharr', {
    label: 'Leah-Tharr',
    image: 'resources/Base colors/Leah/Leah Tharr base.jpg',
    fallback: '#5d6a5a'
  }],
  ['raia+rhatt', {
    label: 'Raia-Rhatt',
    image: 'resources/Base colors/Raia/Raia Rhatt base.jpg',
    fallback: '#8a7d6a'
  }],
  ['raia+sheran', {
    label: 'Raia-Sheran',
    image: 'resources/Base colors/Raia/Raia Sheran base.jpg',
    fallback: '#92859d'
  }],
  ['rhatt+sheran', {
    label: 'Sheran-Rhatt',
    image: 'resources/Base colors/Sheran/Sheran Rhatt base.jpg',
    fallback: '#736978'
  }],
  ['raia+tharr', {
    label: 'Tharr-Raia',
    image: 'resources/Base colors/Tharr/Tharr Raia base.jpg',
    fallback: '#7f726d'
  }],
  ['rhatt+tharr', {
    label: 'Tharr-Rhatt',
    image: 'resources/Base colors/Tharr/Tharr Rhatt base.jpg',
    fallback: '#605667'
  }],
  ['sheran+tharr', {
    label: 'Tharr-Sheran',
    image: 'resources/Base colors/Tharr/Tharr Sheran base.jpg',
    fallback: '#685f78'
  }]
]);

const costDetails = [
  { key: 'vp', label: 'VP', symbol: 'VP', style: 'vp', image: 'resources/cost-vp.png' },
  { key: 'zanszilank', label: 'Zanszilánk', symbol: 'Z', style: 'zanszilank', image: 'resources/cost-zanszilank.png' },
  { key: 'nekron', label: 'Nekron', symbol: 'N', style: 'nekron', image: 'resources/cost-nekron.png' },
  { key: 'szk', label: 'SZK', symbol: 'SZK', style: 'szk', image: 'resources/cost-szk.png' },
  { key: 'epito', label: 'Építő', symbol: 'É', style: 'builder', image: 'resources/cost-builder.png' },
  { key: 'aldozas', label: 'Áldozás', symbol: 'Á', style: 'sacrifice', image: 'resources/cost-sacrifice.png' }
];

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
    ? `Nem tölthető be az alapszín-kép: ${missingBases.join(', ')}.`
    : '';
}

function updateFactionControls(message = 'Legfeljebb kettőt válassz. A Színtelen, a Bufa és a Narancs lap külön kell legyen kiválasztva.') {
  const selected = factionInputs.filter((input) => input.checked);
  const hasExclusive = selected.some((input) => exclusiveFactionKeys.has(input.value));

  factionInputs.forEach((input) => {
    input.disabled = !input.checked && (selected.length >= 2 || hasExclusive);
  });

  document.querySelector('#faction-count').textContent = `${selected.length} / 2 kiválasztva`;
  document.querySelector('#faction-guidance').textContent = message;
}

function renderRulesText(element, text) {
  element.replaceChildren();
  text.split(rulesTextIconPattern).forEach((part) => {
    if (rulesTextIconByToken.has(part)) {
      const icon = document.createElement('img');
      icon.className = 'rules-inline-icon';
      icon.src = rulesTextIconByToken.get(part).path;
      icon.alt = rulesTextIconByToken.get(part).alt;
      element.append(icon);
    } else if (part) element.append(document.createTextNode(part));
  });
}

function handleFactionChange(event) {
  const input = event.currentTarget;
  const selected = factionInputs.filter((option) => option.checked);

  if (input.checked && selected.length > 2) {
    input.checked = false;
    updateFactionControls('Egy kártyán legfeljebb két alapszín lehet.');
  } else if (input.checked && selected.some((option) => option !== input && exclusiveFactionKeys.has(option.value))) {
    input.checked = false;
    updateFactionControls(`${factionByKey.get(input.value).label} nem kombinálható a Színtelennel, a Bufával vagy a Narancs lappal.`);
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
  const flavorText = String(values.get('flavorText') || '').trim();
  const selectedFactions = values.getAll('faction');
  const type = String(values.get('type') || '').trim();
  const subtype = String(values.get('subtype') || '').trim();
  const rarity = values.get('rarity') || 'Gyakori';
  const power = String(values.get('power') || '').trim();
  const toughness = String(values.get('toughness') || '').trim();

  document.querySelector('#preview-name').textContent = name || 'Névtelen kártya';
  document.querySelector('#preview-card-type').textContent = type;
  document.querySelector('#preview-card-type').hidden = !type;
  document.querySelector('#preview-subtype').textContent = subtype;
  document.querySelector('#preview-subtype').hidden = !subtype;
  document.querySelector('#preview-rarity').textContent = rarity;
  renderRulesText(document.querySelector('#preview-text'), text || 'Nincs kártyaszöveg.');
  const previewFlavorText = document.querySelector('#preview-flavor-text');
  previewFlavorText.textContent = flavorText;
  previewFlavorText.hidden = !flavorText;
  document.querySelector('#text-count').textContent = values.get('text').length;

  document.querySelector('#preview-power').textContent = power;
  document.querySelector('#preview-toughness').textContent = toughness;

  const activeCostCount = costDetails.filter(({ key }) => String(values.get(key) || '').trim() !== '').length;
  card.dataset.costCount = String(activeCostCount);
  const baseLayers = document.querySelector('#base-color-layers');
  const combination = selectedFactions.length === 2
    ? factionCombinationByKeys.get([...selectedFactions].sort().join('+'))
    : null;
  const baseFactions = combination
    ? [combination]
    : selectedFactions.map((key) => factionByKey.get(key));
  baseLayers.classList.toggle('multi-color', baseFactions.length === 2);
  baseLayers.innerHTML = baseFactions.map((faction) => {
    const image = faction.image
      ? `<img class="resource-image" src="${faction.image}" alt="">`
      : '';
    return `<div class="card-base-layer" data-faction-label="${faction.label}" style="--faction-fallback: ${faction.fallback}">${image}</div>`;
  }).join('');
  updateFactionImageStatus();
  watchResourceImages(baseLayers);

  const selectedIcons = values.getAll('icon');
  const reactionSurcharge = String(values.get('reactionSurcharge') || '').trim();
  if (selectedIcons.includes('Reakció drágítás') && reactionSurcharge) {
    selectedIcons[selectedIcons.indexOf('Reakció drágítás')] = `Reakció drágítás: ${reactionSurcharge}`;
  }

  const protection = values.get('protection');
  if (selectedIcons.includes('Oltalom') && protection) {
    selectedIcons[selectedIcons.indexOf('Oltalom')] = `Oltalom: ${String(protection).trim()}`;
  }
  const monsterComponent = Number(values.get('monsterComponent'));
  if (selectedIcons.includes('Szörnykomponens')) {
    const componentCount = Number.isInteger(monsterComponent) && monsterComponent > 0 ? monsterComponent : 1;
    selectedIcons.splice(selectedIcons.indexOf('Szörnykomponens'), 1, ...Array(componentCount).fill('Szörnykomponens'));
  }
  document.querySelector('#preview-icons').replaceChildren(...selectedIcons.map((label) => {
    const icon = document.createElement('span');
    icon.className = 'card-icon';
    icon.textContent = label;
    return icon;
  }));

  document.querySelector('#preview-costs').innerHTML = costDetails.map(({ key, label, symbol, style, image }) => {
    const amount = String(values.get(key) || '').trim();
    return amount
      ? `<span class="card-cost ${style}" aria-label="${label}: ${amount}"><b aria-hidden="true"><img class="resource-image" src="${image}" alt=""><span class="cost-glyph">${symbol}</span><span class="cost-amount">${amount}</span></b></span>`
      : '';
  }).join('');

  watchResourceImages(document.querySelector('#preview-costs'));
}

function bindPresetPicker(picker, input) {
  picker.addEventListener('change', () => {
    const selectedValue = picker.value;
    if (!selectedValue) {
      input.value = '';
    } else {
      const existingValues = input.value
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      if (!existingValues.some((value) => value.toLowerCase() === selectedValue.toLowerCase())) {
        existingValues.push(selectedValue);
        input.value = existingValues.join(', ');
      }
    }
    updatePreview();
  });
}
bindPresetPicker(form.querySelector('#subtype-picker'), form.querySelector('#card-subtype'));
bindPresetPicker(form.querySelector('#type-picker'), form.querySelector('#card-type'));
function insertRulesTextIcon(token) {
  const start = rulesTextInput.selectionStart;
  const end = rulesTextInput.selectionEnd;
  const before = rulesTextInput.value.slice(0, start);
  const after = rulesTextInput.value.slice(end);
  const prefix = before && !/\s$/.test(before) ? ' ' : '';
  const suffix = after && !/^\s/.test(after) ? ' ' : '';
  const insertion = `${prefix}${token}${suffix}`;
  const availableLength = rulesTextInput.maxLength - (rulesTextInput.value.length - (end - start));
  if (availableLength < insertion.length) return;

  rulesTextInput.setRangeText(insertion, start, end, 'end');
  rulesTextInput.dispatchEvent(new Event('input', { bubbles: true }));
  rulesTextInput.focus();
}
document.querySelector('#insert-once-icon').addEventListener('click', () => {
  insertRulesTextIcon(rulesTextIcons[1].token);
});
document.querySelector('#insert-once-icon-2').addEventListener('click', () => {
  insertRulesTextIcon(rulesTextIcons[0].token);
});
form.addEventListener('input', updatePreview);
form.addEventListener('change', updatePreview);
form.querySelectorAll('.icon-choice-numeric').forEach((choice) => {
  const toggle = choice.querySelector('input[name="icon"]');
  const valueInput = choice.querySelector('.icon-value, .icon-quantity');
  const updateValueVisibility = () => {
    valueInput.hidden = !toggle.checked;
    valueInput.disabled = !toggle.checked;
  };
  toggle.addEventListener('change', updateValueVisibility);
});
factionInputs.forEach((input) => input.addEventListener('change', handleFactionChange));

imageInput.addEventListener('change', async () => {
  const file = imageInput.files[0];
  if (imageUrl) URL.revokeObjectURL(imageUrl);
  imageUrl = null;
  previewImage.removeAttribute('src');
  previewImage.hidden = true;
  artPlaceholder.hidden = false;
  fileName.textContent = 'Nincs kép kiválasztva';
  imageError.hidden = true;
  imageError.textContent = '';

  if (!file) return;
  if (!file.type.startsWith('image/')) {
    imageInput.value = '';
    imageError.textContent = 'Válassz egy érvényes képfájlt.';
    imageError.hidden = false;
    return;
  }

  const candidateUrl = URL.createObjectURL(file);
  previewImage.src = candidateUrl;
  try {
    await previewImage.decode();
    imageUrl = candidateUrl;
    previewImage.hidden = false;
    artPlaceholder.hidden = true;
    fileName.textContent = file.name;
  } catch {
    URL.revokeObjectURL(candidateUrl);
    previewImage.removeAttribute('src');
    imageInput.value = '';
    imageError.textContent = 'A kiválasztott fájl nem tölthető be képként.';
    imageError.hidden = false;
  }
});

document.querySelector('#reset-button').addEventListener('click', () => {
  form.reset();
  if (imageUrl) URL.revokeObjectURL(imageUrl);
  imageUrl = null;
  previewImage.removeAttribute('src');
  previewImage.hidden = true;
  artPlaceholder.hidden = false;
  fileName.textContent = 'Nincs kép kiválasztva';
  imageError.hidden = true;
  imageError.textContent = '';
  form.querySelectorAll('.icon-choice-numeric').forEach((choice) => {
    const toggle = choice.querySelector('input[name="icon"]');
    const valueInput = choice.querySelector('.icon-value, .icon-quantity');
    valueInput.hidden = !toggle.checked;
    valueInput.disabled = !toggle.checked;
  });
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
  if (style === 'vp') {
    context.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
  } else {
    const shapes = {
      zanszilank: [[.5, 0], [1, .5], [.5, 1], [0, .5]],
      nekron: [[.25, 0], [.75, 0], [1, .5], [.75, 1], [.25, 1], [0, .5]],
      szk: [[.28, 0], [.72, 0], [1, .28], [1, .72], [.72, 1], [.28, 1], [0, .72], [0, .28]],
      builder: [[.5, 0], [1, 1], [0, 1]],
      sacrifice: [[.5, 0], [1, .25], [.82, .85], [.5, 1], [.18, .85], [0, .25]]
    };
    const points = shapes[style] || shapes.szk;
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
  const textX = alignment === 'center'
    ? rect.x + rect.width / 2
    : alignment === 'right'
      ? rect.x + rect.width
      : rect.x;
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

function drawWrappedRulesText(context, text, rect, font, color, lineHeight, alignment, icons) {
  context.save();
  context.beginPath();
  context.rect(rect.x, rect.y, rect.width, rect.height);
  context.clip();
  context.font = font;
  context.fillStyle = color;
  context.textAlign = 'left';
  context.textBaseline = 'top';
  const iconSize = lineHeight * 1.25;
  const paragraphs = text.split('\n');
  let y = rect.y;

  for (const paragraph of paragraphs) {
    const words = paragraph.match(/\[Körönként egyszer2?\]|[^\s]+/g) || [];
    let line = [];
    let lineWidth = 0;

    const drawLine = () => {
      const startX = alignment === 'center'
        ? rect.x + (rect.width - lineWidth) / 2
        : alignment === 'right'
          ? rect.x + rect.width - lineWidth
          : rect.x;
      let x = startX;
      line.forEach((part) => {
        if (part.type === 'icon') {
          context.drawImage(icons.get(part.token), x, y + (lineHeight - iconSize) / 2, iconSize, iconSize);
        } else {
          context.fillText(part.text, x, y);
        }
        x += part.width;
      });
      y += lineHeight;
      line = [];
      lineWidth = 0;
    };

    for (const word of words) {
      const parts = rulesTextIconByToken.has(word)
        ? [{ type: 'icon', token: word, width: iconSize }]
        : [{ type: 'text', text: word, width: context.measureText(word).width }];
      const wordWidth = parts.reduce((width, part) => width + part.width, 0);
      const spaceWidth = line.length ? context.measureText(' ').width : 0;
      if (line.length && lineWidth + spaceWidth + wordWidth > rect.width) drawLine();
      if (line.length) {
        line.push({ type: 'text', text: ' ', width: context.measureText(' ').width });
        lineWidth += context.measureText(' ').width;
      }
      line.push(...parts);
      lineWidth += wordWidth;
      if (y + lineHeight > rect.y + rect.height) break;
    }
    if (line.length && y + lineHeight <= rect.y + rect.height) drawLine();
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
  context.textAlign = nameStyle.textAlign;
  context.textBaseline = 'top';
  context.shadowColor = 'rgba(255, 249, 232, .8)';
  context.shadowBlur = 3 * scaleY;
  context.shadowOffsetY = scaleY;
  const nameTextX = nameStyle.textAlign === 'right'
    ? nameRect.x + nameRect.width
    : nameStyle.textAlign === 'center'
      ? nameRect.x + nameRect.width / 2
      : nameRect.x;
  context.fillText(nameElement.textContent, nameTextX, nameRect.y, nameRect.width);
  context.shadowColor = 'transparent';
  context.shadowBlur = 0;
  context.shadowOffsetY = 0;

  const metaType = document.querySelector('#preview-card-type');
  const metaSubtype = document.querySelector('#preview-subtype');
  if (metaType && metaSubtype) {
    [metaType, metaSubtype].filter((element) => !element.hidden).forEach((element) => {
      const metaRect = getCanvasRect(element, cardRect, scaleX, scaleY);
      const metaStyle = getComputedStyle(element);
      context.fillStyle = metaStyle.color;
      context.font = `${metaStyle.fontStyle} ${metaStyle.fontWeight} ${Math.max(9, parseFloat(metaStyle.fontSize) * scaleY)}px ${metaStyle.fontFamily}`;
      context.textAlign = metaStyle.textAlign;
      context.textBaseline = 'middle';
      const textX = metaStyle.textAlign === 'right'
        ? metaRect.x + metaRect.width
        : metaStyle.textAlign === 'center'
          ? metaRect.x + metaRect.width / 2
          : metaRect.x;
      context.fillText(element.textContent, textX, metaRect.y + metaRect.height / 2, metaRect.width);
    });
  }

  document.querySelectorAll('#preview-costs .card-cost').forEach((cost) => {
    const badge = cost.querySelector('b');
    const rect = getCanvasRect(badge, cardRect, scaleX, scaleY);
    const style = ['vp', 'zanszilank', 'nekron', 'szk', 'builder', 'sacrifice'].find((name) => cost.classList.contains(name));
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
    const amountFontSize = Math.max(8, Math.min(16, amountRect.height * 1.4 / amount.textContent.length));
    context.font = `600 ${amountFontSize}px monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(amount.textContent, rect.x + rect.width / 2, amountRect.y + amountRect.height / 2, rect.width * .9);
  });

  document.querySelectorAll('#preview-icons .card-icon').forEach((icon) => {
    const rect = getCanvasRect(icon, cardRect, scaleX, scaleY);
    context.fillStyle = 'rgba(41, 45, 44, .8)';
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
    context.strokeStyle = '#777970';
    context.lineWidth = Math.max(1, scaleX);
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    const iconStyle = getComputedStyle(icon);
    context.fillStyle = iconStyle.color;
    context.font = `700 ${parseFloat(iconStyle.fontSize) * scaleY}px ${iconStyle.fontFamily}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(icon.textContent, rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width - 4 * scaleX);
  });

  const rules = document.querySelector('#preview-text');
  const rulesRect = getCanvasRect(rules, cardRect, scaleX, scaleY);
  const rulesStyle = getComputedStyle(rules);
  const fontSize = parseFloat(rulesStyle.fontSize) * scaleY;
  const lineHeight = parseFloat(rulesStyle.lineHeight) * scaleY || fontSize * 1.42;
  const rulesInlineIcons = new Map();
  for (const icon of rulesTextIcons) {
    if (rulesTextInput.value.includes(icon.token)) {
      const image = new Image();
      image.src = icon.path;
      await image.decode();
      rulesInlineIcons.set(icon.token, image);
    }
  }
  drawWrappedRulesText(context, rulesTextInput.value || 'Nincs kártyaszöveg.', {
    x: rulesRect.x,
    y: rulesRect.y,
    width: rulesRect.width,
    height: rulesRect.height
  }, `${rulesStyle.fontStyle} ${rulesStyle.fontWeight} ${fontSize}px ${rulesStyle.fontFamily}`, rulesStyle.color, lineHeight, rulesStyle.textAlign,
  rulesInlineIcons);

  const flavor = document.querySelector('#preview-flavor-text');
  if (!flavor.hidden) {
    const flavorRect = getCanvasRect(flavor, cardRect, scaleX, scaleY);
    const flavorStyle = getComputedStyle(flavor);
    const flavorFontSize = parseFloat(flavorStyle.fontSize) * scaleY;
    const flavorLineHeight = parseFloat(flavorStyle.lineHeight) * scaleY || flavorFontSize * 1.2;
    drawWrappedText(context, flavor.textContent, flavorRect,
      `${flavorStyle.fontStyle} ${flavorStyle.fontWeight} ${flavorFontSize}px ${flavorStyle.fontFamily}`,
      flavorStyle.color, flavorLineHeight, flavorStyle.textAlign);
  }

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

      const value = box.querySelector('strong');
      if (value) {
        const valueRect = getCanvasRect(value, cardRect, scaleX, scaleY);
        const valueStyle = getComputedStyle(value);
        context.fillStyle = valueStyle.color;
        context.font = `${valueStyle.fontWeight} ${parseFloat(valueStyle.fontSize) * scaleY}px ${valueStyle.fontFamily}`;
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