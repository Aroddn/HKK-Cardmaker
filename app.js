const form = document.querySelector('#card-form');
const card = document.querySelector('#hkk-card');
const imageInput = document.querySelector('#card-image');
const previewImage = document.querySelector('#preview-image');
const backgroundCardImage = document.querySelector('#background-card-image');
const backgroundImagePositionControls = document.querySelector('#background-image-position-controls');
const fileName = document.querySelector('#file-name');
const imageError = document.querySelector('#image-error');
const factionInputs = [...form.querySelectorAll('input[name="faction"]')];
const cardRuleInput = form.querySelector('#card-rule');
const costInputs = [...form.querySelectorAll('.cost-value')];
const powerInput = form.querySelector('#card-power');
const secondaryStatTypeInput = form.querySelector('#card-secondary-stat-type');
const secondaryStatInput = form.querySelector('#card-toughness');
const powerIconInput = form.querySelector('input[name="powerIcon"]');
const secondaryStatIconInput = form.querySelector('input[name="secondaryStatIcon"]');
const rulesTextInput = form.querySelector('#card-text');
const typeTextColorToggle = document.querySelector('#toggle-type-text-color');
const cardBandIconAssets = new Map([
  ['védekezés', 'Védekezés'],
  ['életkioltó', 'Életkioltó'],
  ['élőholt', 'Élőholt'],
  ['ereklye', 'Ereklye'],
  ['erőd', 'Erőd'],
  ['fa', 'Fa'],
  ['fém', 'Fém'],
  ['háló', 'Háló'],
  ['hegymélyi', 'Hegymélyi'],
  ['hideg', 'Hideg'],
  ['horgony', 'Horgony'],
  ['idézés', 'Idézés'],
  ['isteni', 'Isteni'],
  ['kegy', 'Kegy'],
  ['KF', 'KF'],
  ['kincs', 'Kincs'],
  ['köd', 'Köd'],
  ['legendás', 'Legendás'],
  ['mentális', 'Mentális'],
  ['ősmágia', 'Ősmágiaa'],
  ['őrző', 'Őrző'],
  ['repül', 'Repül'],
  ['Reakció drágítás', 'Reakció drágítás'],
  ['rezisztencia', 'Rezisztencia'],
  ['sav', 'Sav'],
  ['tűz', 'Tűz'],
  ['villám', 'Villám'],
  ['Oltalom', 'Oltalom'],
  ['Szörnykomponens', 'Szörnykomponens']
].map(([value, name]) => [value, name && `resources/Icons/${name}.png`]));
// Center-row y is a vertical offset; positioned icons use card x/y percentages.
// Size is a percentage of the card width.
const cardIconLayouts = new Map([
  ['életkioltó', { group: 'center', y: -15, size: 11 }],
  ['ereklye', { group: 'center', y: -17.5, size: 7.1 }],
  ['fa', { group: 'center', y: -17, size: 9.5 }],
  ['fém', { group: 'center', y: -25, size: 7.7  }],
  ['háló', { group: 'center', y: -16, size: 9.5 }],
  ['hideg', { group: 'center', y: -15, size: 11 }],
  ['idézés', { group: 'center', y: -16, size: 9.5 }],
  ['KF', { group: 'center', y: -17, size: 7.1 }],
  ['kincs', { group: 'center', y: -17, size: 7.1 }],
  ['köd', { group: 'center', y: -16, size: 13 }],
  ['legendás', { group: 'center', y: -25, size: 11 }],
  ['mentális', { group: 'center', y: -16, size: 8.5 }],
  ['Oltalom', { group: 'center', y: -17, size: 8.8 }],
  ['Szörnykomponens', { group: 'center', y: -17, size: 9.5 }],
  ['ősmágia', { group: 'center', y: -15, size: 9.5 }],
  ['Reakció drágítás', { group: 'center', y: -17, size: 9.5 }],
  ['rezisztencia', { group: 'center', y: -17, size: 9.5 }],
  ['sav', { group: 'center', y: -15, size: 8.5 }],
  ['tűz', { group: 'center', y: -17, size: 7.7 }],
  ['védekezés', { group: 'center', y: -9, size:8.5 }],
  ['villám', { group: 'center', y: -17, size: 8.5 }],

  ['élőholt', { group: 'side', x: 5.1, size: 8.5 }],
  ['hegymélyi', { group: 'side', x: 4, size: 9.5 }],
  ['erőd', { group: 'side', x: 4, size: 10.5 }],
  ['horgony', { group: 'side', x: 3.5, size: 10.5 }],
  ['kegy', { group: 'side', x: 4.5, size: 8 }],
  ['őrző', { group: 'side', x: 6, size: 8 }],

  ['isteni', { group: 'positioned', x: 94, y: 55.8, size: 3.8 }],
  ['repül', { group: 'positioned', x: 94, y: 59.3, size: 3.8 }]
]);
const sideIconStackY = 59.7;
const rulesTextIcons = [
  ...[
    'Csont',
    'Ell körében egyszer',
    'Ereklye',
    'Erőd',
    'Fa',
    'Fém',
    'Hegymélyi',
    'Horgony',
    'Háló',
    'Játékonként egyszer',
    'Játékonként egyszer_new',
    'KF',
    'Kegy',
    'Körönként egyszer',
    'Körönként egyszer_new',
    'Legendás',
    'Lehelet',
    'Passzivizálás',
    'Mentális',
    'Rezisztencia',
    'Sav',
    'Szörnykomponens',
    'Tűz',
    'VP',
    'Villám',
    'Védekezés',
    'Védelem',
    'Áldozás',
    'Életkioltó',
    'Élőholt',
    'Építő',
    'Ősmágia',
    'Saját körben egyszer'
  ].map((name) => ({
    token: `[${name}]`,
    path: `resources/Icons/${name}.png`,
    alt: name.replace(/_new$/, ' (új)')
  }))
];
const rulesTextIconByToken = new Map(rulesTextIcons.map((icon) => [icon.token, icon]));
const rulesTextIconTokenPattern = rulesTextIcons
  .map(({ token }) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .sort((a, b) => b.length - a.length)
  .join('|');
let imageUrl = null;

const factions = [
  { key: 'bufa', label: 'Bufa', image: 'resources/Base colors/Bufa base_transparent.png', fallback: '#8b563d', exclusive: true },
  { key: 'chara-din', label: 'Chara-din', image: 'resources/Base colors/Chara-din/Chara-din base_transparent.png', fallback: '#a0473f' },
  { key: 'dornodon', label: 'Dornodon', image: 'resources/Base colors/Dornodon/Dornodon base_transparent.png', fallback: '#a67d3e' },
  { key: 'elenios', label: 'Elenios', image: 'resources/Base colors/Elenios/Elenios base_transparent_new.png', fallback: '#537d9a' },
  { key: 'fairlight', label: 'Fairlight', image: 'resources/Base colors/Fairlight/Fairlight base_transparent.png', fallback: '#cfb85e' },
  { key: 'leah', label: 'Leah', image: 'resources/Base colors/Leah/Leah base_transparent.png', fallback: '#658a57' },
  { key: 'raia', label: 'Raia', image: 'resources/Base colors/Raia/Raia base_transparent.png', fallback: '#a99a88' },
  { key: 'rhatt', label: 'Rhatt', image: 'resources/Base colors/Rhatt/Rhatt base_transparent.png', fallback: '#6c604c' },
  { key: 'sheran', label: 'Sheran', image: 'resources/Base colors/Sheran/Sheran base_tranparent.png', fallback: '#7b7192' },
  { key: 'tharr', label: 'Tharr', image: 'resources/Base colors/Tharr/Tharr base_tranparent.png', fallback: '#554b5d' },
  { key: 'colorless', label: 'Színtelen', image: 'resources/Base colors/Szintelen base_transparent.png', fallback: '#898b88', exclusive: true },
  { key: 'no-color', label: 'Narancs lap', image: 'resources/Base colors/Narancs lap base_transparent_new.png', fallback: '#343b3c', exclusive: true }
];
const factionByKey = new Map(factions.map((faction) => [faction.key, faction]));
const exclusiveFactionKeys = new Set(['bufa', 'colorless', 'no-color']);
const cardRuleDefinitions = {
  other: {
    allowOrange: true,
    orangeOnly: false,
    allowCosts: true,
    allowBuilderCost: true,
    allowPower: true,
    secondaryStats: ['toughness', 'structural']
  },
  'spell-item': {
    allowOrange: false,
    orangeOnly: false,
    allowCosts: true,
    allowBuilderCost: false,
    allowPower: false,
    secondaryStats: []
  },
  creature: {
    allowOrange: false,
    orangeOnly: false,
    allowCosts: true,
    allowBuilderCost: false,
    allowPower: true,
    secondaryStats: ['toughness']
  },
  building: {
    allowOrange: false,
    orangeOnly: false,
    allowCosts: true,
    allowBuilderCost: true,
    allowPower: false,
    secondaryStats: ['structural']
  },
  follower: {
    allowOrange: true,
    orangeOnly: true,
    allowCosts: false,
    allowBuilderCost: false,
    allowPower: false,
    secondaryStats: []
  },
  lich: {
    allowOrange: true,
    orangeOnly: true,
    allowCosts: false,
    allowPower: false,
    secondaryStats: ['toughness']
  }
};
const cardRuleGuidance = {
  other: 'Minden szín, költség és stat szabadon választható.',
  'spell-item': 'Narancs lap és Építő költség nélkül; Erő és második érték nem adható meg.',
  creature: 'Narancs lap és Építő költség nélkül; Erő és Védettség választható.',
  building: 'Narancs lap nélkül; csak Strukturális pont adható meg. Építő költség is választható.',
  follower: 'Csak Narancs lap; költség és stat nem adható meg.',
  lich: 'Csak Narancs lap; költség és Erő nem adható meg.'
};
const factionCombinationByKeys = new Map([
  ['chara-din+fairlight', {
    label: 'Chara-din-Fairlight',
    image: 'resources/Base colors/Chara-din/Chara-din Fairlight base_transparent.png',
    fallback: '#b38c4e'
  }],
  ['chara-din+leah', {
    label: 'Chara-din-Leah',
    image: 'resources/Base colors/Chara-din/Chara-din Leah base_transparent.png',
    fallback: '#82694b'
  }],
  ['chara-din+raia', {
    label: 'Chara-din-Raia',
    image: 'resources/Base colors/Chara-din/Chara-din Raia base_transparent.png',
    fallback: '#a07064'
  }],
  ['chara-din+rhatt', {
    label: 'Chara-din-Rhatt',
    image: 'resources/Base colors/Chara-din/Chara-din Rhatt base_transparent.png',
    fallback: '#865448'
  }],
  ['chara-din+sheran', {
    label: 'Chara-din-Sheran',
    image: 'resources/Base colors/Chara-din/Chara-din Sheran base_transparent.png',
    fallback: '#8d5c69'
  }],
  ['chara-din+dornodon', {
    label: 'Dornodon-Chara-din',
    image: 'resources/Base colors/Dornodon/Dornodon Chara-din base_transparent.png',
    fallback: '#9b7a52'
  }],
  ['chara-din+elenios', {
    label: 'Elenios-Chara-din',
    image: 'resources/Base colors/Elenios/Elenios Chara-din base_transparent.png',
    fallback: '#7b7090'
  }],
  ['chara-din+tharr', {
    label: 'Chara-din-Tharr',
    image: 'resources/Base colors/Chara-din/Chara-din Tharr base_transparent.png',
    fallback: '#554b5d'
  }],
  ['dornodon+elenios', {
    label: 'Elenios-Dornodon',
    image: 'resources/Base colors/Elenios/Elenios Dornodon base_transparent.png',
    fallback: '#897055'
  }],
  ['dornodon+fairlight', {
    label: 'Dornodon-Fairlight',
    image: 'resources/Base colors/Dornodon/Dornodon Fairlight base_transparent.png',
    fallback: '#bca554'
  }],
  ['dornodon+leah', {
    label: 'Dornodon-Leah',
    image: 'resources/Base colors/Dornodon/Dornodon Leah base_transparent.png',
    fallback: '#687a60'
  }],
  ['dornodon+raia', {
    label: 'Dornodon-Raia',
    image: 'resources/Base colors/Dornodon/Dornodon Raia base_transparent.png',
    fallback: '#a1896a'
  }],
  ['dornodon+rhatt', {
    label: 'Dornodon-Rhatt',
    image: 'resources/Base colors/Dornodon/Dornodon Rhatt base_transparent.png',
    fallback: '#7b6c56'
  }],
  ['dornodon+sheran', {
    label: 'Sheran-Dornodon',
    image: 'resources/Base colors/Sheran/Sheran Dornodon base_transparent.png',
    fallback: '#897055'
  }],
  ['dornodon+tharr', {
    label: 'Dornodon-Tharr',
    image: 'resources/Base colors/Dornodon/Dornodon Tharr base_transparent.png',
    fallback: '#6a5a61'
  }],
  ['elenios+fairlight', {
    label: 'Elenios-Fairlight',
    image: 'resources/Base colors/Elenios/Elenios Fairlight base_transparent.png',
    fallback: '#9d9b79'
  }],
  ['elenios+leah', {
    label: 'Elenios-Leah',
    image: 'resources/Base colors/Elenios/Elenios Leah base_transparent.png',
    fallback: '#6c856f'
  }],
  ['elenios+raia', {
    label: 'Elenios-Raia',
    image: 'resources/Base colors/Elenios/Elenios Raia base_transparent.png',
    fallback: '#8c6d5a'
  }],
  ['elenios+rhatt', {
    label: 'Elenios-Rhatt',
    image: 'resources/Base colors/Elenios/Elenios Rhatt base_transparent.png',
    fallback: '#6c7080'
  }],
  ['elenios+sheran', {
    label: 'Elenios-Sheran',
    image: 'resources/Base colors/Elenios/Elenios Sheran base_transparent.png',
    fallback: '#6d7393'
  }],
  ['elenios+tharr', {
    label: 'Elenios-Tharr',
    image: 'resources/Base colors/Elenios/Elenios Tharr base_transparent_new.png',
    fallback: '#5e5d72'
  }],
  ['fairlight+leah', {
    label: 'Fairlight-Leah',
    image: 'resources/Base colors/Fairlight/Fairlight Leah base_transparent.png',
    fallback: '#9a9a5a'
  }],
  ['fairlight+raia', {
    label: 'Fairlight-Raia',
    image: 'resources/Base colors/Fairlight/Fairlight Raia base_transparent.png',
    fallback: '#b4a373'
  }],
  ['fairlight+rhatt', {
    label: 'Fairlight-Rhatt',
    image: 'resources/Base colors/Fairlight/Fairlight Rhatt base_transparent.png',
    fallback: '#9e8c55'
  }],
  ['fairlight+sheran', {
    label: 'Fairlight-Sheran',
    image: 'resources/Base colors/Fairlight/Fairlight Sheran base_transparent.png',
    fallback: '#a59978'
  }],
  ['fairlight+tharr', {
    label: 'Fairlight-Tharr',
    image: 'resources/Base colors/Fairlight/Fairlight Tharr base_transparent.png',
    fallback: '#92816d'
  }],
  ['leah+raia', {
    label: 'Leah-Raia',
    image: 'resources/Base colors/Leah/Leah Raia base_transparent.png',
    fallback: '#879273'
  }],
  ['leah+rhatt', {
    label: 'Leah-Rhatt',
    image: 'resources/Base colors/Leah/Leah Rhatt base_transparent.png',
    fallback: '#687352'
  }],
  ['leah+sheran', {
    label: 'Leah-Sheran',
    image: 'resources/Base colors/Leah/Leah Sheran base_transparent.png',
    fallback: '#708078'
  }],
  ['leah+tharr', {
    label: 'Leah-Tharr',
    image: 'resources/Base colors/Leah/Leah Tharr base_transparent.png',
    fallback: '#5d6a5a'
  }],
  ['raia+rhatt', {
    label: 'Raia-Rhatt',
    image: 'resources/Base colors/Raia/Raia Rhatt base_transparent.png',
    fallback: '#8a7d6a'
  }],
  ['raia+sheran', {
    label: 'Raia-Sheran',
    image: 'resources/Base colors/Sheran/Sheran Raia base_transparent.png',
    fallback: '#92859d'
  }],
  ['rhatt+sheran', {
    label: 'Sheran-Rhatt',
    image: 'resources/Base colors/Sheran/Sheran Rhatt base_transparent.png',
    fallback: '#736978'
  }],
  ['raia+tharr', {
    label: 'Tharr-Raia',
    image: 'resources/Base colors/Tharr/Tharr Raia base_transparent.png',
    fallback: '#7f726d'
  }],
  ['rhatt+tharr', {
    label: 'Tharr-Rhatt',
    image: 'resources/Base colors/Tharr/Tharr Rhatt base_transparent.png',
    fallback: '#605667'
  }],
  ['sheran+tharr', {
    label: 'Tharr-Sheran',
    image: 'resources/Base colors/Tharr/Tharr Sheran base_transparent.png',
    fallback: '#685f78'
  }]
]);

const costDetails = [
  { key: 'vp', label: 'VP', symbol: 'VP', style: 'vp', image: 'resources/Cost/VP_transparent.png' },
  { key: 'szk', label: 'SZK', symbol: 'SZK', style: 'szk', image: 'resources/Cost/Csont_transparent.png' },
  { key: 'epito', label: 'Építő', symbol: 'É', style: 'builder', image: 'resources/Cost/Építő_transparent.png' },
  { key: 'zanszilank', label: 'Zanszilánk', symbol: 'Z', style: 'zanszilank', image: 'resources/Cost/ZSZ_transparent.png' },
  { key: 'nekron', label: 'Nekron', symbol: 'N', style: 'nekron', image: 'resources/Cost/Nekron_transparent.png' },
  { key: 'aldozas', label: 'Áldozás', symbol: 'Á', style: 'sacrifice', image: 'resources/Cost/Áldozás_transparent.png' }
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

function applyCardRuleRestrictions(clearInvalidValues = false) {
  const rule = cardRuleDefinitions[cardRuleInput.value] || cardRuleDefinitions.other;
  const orangeFaction = factionInputs.find((input) => input.value === 'no-color');
  const orangeFactionLabel = orangeFaction.closest('.faction-option');

  if (rule.orangeOnly) {
    factionInputs.forEach((input) => {
      if (input !== orangeFaction) input.checked = false;
    });
    orangeFaction.checked = true;
  } else if (!rule.allowOrange && orangeFaction.checked) {
    if (clearInvalidValues) orangeFaction.checked = false;
  }

  costInputs.forEach((input) => {
    const allowed = rule.allowCosts && (rule.allowBuilderCost || input.name !== 'epito');
    input.disabled = !allowed;
    if (clearInvalidValues && !allowed) input.value = '';
  });

  const previousSecondaryType = secondaryStatTypeInput.value;
  const secondaryStatTypeOptions = [...secondaryStatTypeInput.options].filter((option) => option.value);
  secondaryStatTypeOptions.forEach((option) => {
    option.disabled = !rule.secondaryStats.includes(option.value);
  });
  if (cardRuleInput.value === 'building') {
    secondaryStatTypeInput.value = 'structural';
    if (clearInvalidValues && previousSecondaryType !== 'structural') secondaryStatInput.value = '';
  } else if (!rule.secondaryStats.includes(previousSecondaryType)) {
    secondaryStatTypeInput.value = '';
    if (clearInvalidValues && previousSecondaryType) secondaryStatInput.value = '';
  }

  powerInput.disabled = !rule.allowPower;
  secondaryStatInput.disabled = !rule.secondaryStats.length;
  secondaryStatTypeInput.disabled = !rule.secondaryStats.length;
  powerIconInput.disabled = !rule.allowPower;
  secondaryStatIconInput.disabled = !rule.secondaryStats.length;
  if (clearInvalidValues && !rule.allowPower) {
    powerInput.value = '';
    powerIconInput.checked = false;
  }
  if (clearInvalidValues && !rule.secondaryStats.length) {
    secondaryStatInput.value = '';
    secondaryStatIconInput.checked = false;
  } else if (clearInvalidValues && !rule.secondaryStats.includes(previousSecondaryType) && previousSecondaryType) {
    secondaryStatInput.value = '';
    secondaryStatIconInput.checked = false;
  }

  orangeFactionLabel.classList.toggle('rule-locked', rule.orangeOnly);
  document.querySelector('#card-rule-guidance').textContent = cardRuleGuidance[cardRuleInput.value] || cardRuleGuidance.other;
}

function updateFactionControls(message) {
  const selected = factionInputs.filter((input) => input.checked);
  const hasExclusive = selected.some((input) => exclusiveFactionKeys.has(input.value));
  const rule = cardRuleDefinitions[cardRuleInput.value] || cardRuleDefinitions.other;
  const orangeFaction = factionInputs.find((input) => input.value === 'no-color');
  const maxFactionsReached = selected.length >= 2;

  factionInputs.forEach((input) => {
    const disallowedByRule = rule.orangeOnly
      ? input !== orangeFaction
      : input === orangeFaction && !rule.allowOrange;
    input.disabled = disallowedByRule || (!input.checked && (maxFactionsReached || hasExclusive));
  });

  document.querySelector('#faction-count').textContent = `${selected.length} / 2 kiválasztva`;
  const ruleGuidance = rule.orangeOnly
    ? 'Ez a szabály csak Narancs lap színt enged.'
    : rule.allowOrange
      ? ''
      : 'Ez a szabály nem engedi a Narancs lap színt.';
  const standardGuidance = message || 'Legfeljebb kettőt válassz. A Színtelen, a Bufa és a Narancs lap nem kombinálható más színnel.';
  document.querySelector('#faction-guidance').textContent = [ruleGuidance, standardGuidance].filter(Boolean).join(' ');
}

function renderRulesText(element, text) {
  element.replaceChildren();
  const segments = new RegExp(`\\*\\*([\\s\\S]+?)\\*\\*|(${rulesTextIconTokenPattern})`, 'g');
  let position = 0;
  for (const match of text.matchAll(segments)) {
    if (match.index > position) element.append(document.createTextNode(text.slice(position, match.index)));
    if (match[1]) {
      const bold = document.createElement('strong');
      renderRulesText(bold, match[1]);
      element.append(bold);
    } else {
      const icon = rulesTextIconByToken.get(match[2]);
      const image = document.createElement('img');
      image.className = 'rules-inline-icon';
      image.src = icon.path;
      image.alt = icon.alt;
      element.append(image);
    }
    position = match.index + match[0].length;
  }
  if (position < text.length) element.append(document.createTextNode(text.slice(position)));
}

function drawDomText(context, element, renderRect, scaleX, scaleY) {
  const rect = getCanvasRect(element, renderRect, scaleX, scaleY);
  context.save();
  context.beginPath();
  context.rect(rect.x, rect.y, rect.width, rect.height);
  context.clip();

  const drawTextNode = (node) => {
    const style = getComputedStyle(node.parentElement);
    const cssZoom = getEffectiveCssZoom(node.parentElement);
    const fontSize = parseFloat(style.fontSize) * cssZoom * scaleX;
    const lineHeight = parseFloat(style.lineHeight) * cssZoom * scaleY;
    const letterSpacing = parseFloat(style.letterSpacing) * cssZoom * scaleX;
    context.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
    context.fillStyle = style.color;
    context.textAlign = 'left';
    context.textBaseline = 'alphabetic';
    if ('letterSpacing' in context) {
      context.letterSpacing = Number.isFinite(letterSpacing) ? `${letterSpacing}px` : '0px';
    }

    const range = document.createRange();
    range.selectNodeContents(node);
    const lineRects = [...range.getClientRects()];
    if (!lineRects.length) return;
    let text = '';
    let lineTop = null;
    let lineX = 0;
    let sourceOffset = 0;
    const drawLine = () => {
      if (!text || lineTop === null) return;
      const metrics = context.measureText(text);
      const ascent = metrics.fontBoundingBoxAscent || fontSize * 0.8;
      const descent = metrics.fontBoundingBoxDescent || fontSize * 0.2;
      const baseline = lineTop + Math.max(0, (lineHeight - ascent - descent) / 2) + ascent;
      context.fillText(text, lineX, baseline);
      text = '';
      lineTop = null;
    };

    for (const character of node.textContent) {
      const start = sourceOffset;
      sourceOffset += character.length;
      if (character === '\n') {
        drawLine();
        continue;
      }

      range.setStart(node, start);
      range.setEnd(node, sourceOffset);
      const charRect = range.getBoundingClientRect();
      if (!charRect.width && !charRect.height) continue;

      const lineRect = lineRects.reduce((nearest, candidate) => (
        Math.abs(candidate.top - charRect.top) < Math.abs(nearest.top - charRect.top) ? candidate : nearest
      ), lineRects[0]);
      const currentLineTop = (lineRect.top - renderRect.top) * scaleY;
      if (lineTop !== null && Math.abs(currentLineTop - lineTop) > 0.5) drawLine();
      if (lineTop === null) {
        lineTop = currentLineTop;
        lineX = (charRect.left - renderRect.left) * scaleX;
      }
      text += character;
    }
    drawLine();
  };

  const drawNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      drawTextNode(node);
    } else if (node instanceof HTMLImageElement) {
      if (node.complete && node.naturalWidth) {
        drawContain(context, node, getCanvasRect(node, renderRect, scaleX, scaleY));
      }
    } else {
      node.childNodes.forEach(drawNode);
    }
  };

  element.childNodes.forEach(drawNode);
  context.restore();
}

function fitRulesText(element, textLength, maxLength) {
  element.style.removeProperty('font-size');
  const baseSize = parseFloat(getComputedStyle(element).fontSize);
  const minimumSize = baseSize * 0.65;
  const lengthScale = Math.min(1, textLength / maxLength);
  let size = Math.max(minimumSize, baseSize * (1 - 0.3 * lengthScale));
  if (size < baseSize) element.style.fontSize = `${size}px`;
  while (element.scrollHeight > element.clientHeight + 1 && size > minimumSize) {
    size = Math.max(minimumSize, size - baseSize * 0.015);
    element.style.fontSize = `${size}px`;
  }
}

function fitPreviewText() {
  const rulesText = rulesTextInput.value.trim();
  const flavorInput = document.querySelector('#card-flavor-text');
  fitRulesText(document.querySelector('#preview-text'), rulesText.length, rulesTextInput.maxLength);
  fitRulesText(document.querySelector('#preview-flavor-text'), flavorInput.value.trim().length, flavorInput.maxLength);
}

function handleFactionChange(event) {
  const input = event.currentTarget;
  const rule = cardRuleDefinitions[cardRuleInput.value] || cardRuleDefinitions.other;
  const selected = factionInputs.filter((option) => option.checked);

  if (rule.orangeOnly && input.value === 'no-color' && !input.checked) {
    input.checked = true;
  } else if (input.checked && selected.length > 2) {
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
  const power = String(values.get('power') || '').trim();
  const toughness = String(values.get('toughness') || '').trim();
  const powerIconEnabled = values.get('powerIcon') === 'on';
  const secondaryStatIconEnabled = values.get('secondaryStatIcon') === 'on';
  const secondaryStatType = values.get('secondaryStatType') || 'toughness';
  const secondaryStatLabel = secondaryStatType === 'structural' ? 'Strukturális pont' : 'Védettség';

  document.querySelector('#preview-name').textContent = name;
  document.querySelector('#preview-card-type').textContent = type;
  document.querySelector('#preview-card-type').hidden = !type;
  document.querySelector('#preview-subtype').textContent = subtype;
  document.querySelector('#preview-subtype').hidden = !subtype;
  const previewRulesText = document.querySelector('#preview-text');
  renderRulesText(previewRulesText, text);
  const previewFlavorText = document.querySelector('#preview-flavor-text');
  previewFlavorText.textContent = `„${flavorText}”`;
  previewFlavorText.hidden = !flavorText;
  fitPreviewText();
  document.querySelector('#text-count').textContent = values.get('text').length;

  document.querySelector('#preview-power').textContent = power;
  document.querySelector('#preview-toughness').textContent = toughness;
  const powerStat = document.querySelector('.stat-power');
  const powerIcon = document.querySelector('#preview-power-icon');
  const secondaryStat = document.querySelector('#preview-secondary-stat');
  const toughnessIcon = document.querySelector('#preview-toughness-icon');
  powerStat.hidden = !power;
  secondaryStat.hidden = !toughness;
  powerIcon.hidden = !powerIconEnabled || !power;
  secondaryStat.setAttribute('aria-label', `${secondaryStatLabel}: ${toughness}`);
  toughnessIcon.hidden = !secondaryStatIconEnabled || !toughness;
  document.querySelector('#card-toughness').setAttribute('aria-label', `${secondaryStatLabel} értéke`);
  document.querySelector('#preview-stats').hidden = !power && !toughness;

  const activeCostCount = costDetails.filter(({ key }) => String(values.get(key) || '').trim() !== '').length;
  card.dataset.costCount = String(activeCostCount);
  document.querySelector('#cost-warning').hidden = activeCostCount <= 3;
  const baseLayers = document.querySelector('#base-color-layers');
  const combination = selectedFactions.length === 2
    ? factionCombinationByKeys.get([...selectedFactions].sort().join('+'))
    : null;
  const baseFactions = combination
    ? [combination]
    : selectedFactions.map((key) => factionByKey.get(key));
  const hasTransparentBase = baseFactions.some(({ image }) => (
    image?.includes('_transparent') || image?.includes('_tranparent')
  ));
  const useBackgroundCardImage = hasTransparentBase && Boolean(imageUrl);
  card.dataset.backgroundImageMode = String(useBackgroundCardImage);
  backgroundCardImage.hidden = !useBackgroundCardImage;
  if (useBackgroundCardImage) {
    if (backgroundCardImage.getAttribute('src') !== imageUrl) {
      backgroundCardImage.src = imageUrl;
    }
  } else {
    backgroundCardImage.removeAttribute('src');
  }
  previewImage.hidden = !imageUrl || useBackgroundCardImage;
  backgroundImagePositionControls.hidden = !useBackgroundCardImage;
  updateBackgroundImagePosition();
  baseLayers.classList.toggle('multi-color', baseFactions.length === 2);
  baseLayers.innerHTML = baseFactions.map((faction) => {
    const image = faction.image
      ? `<img class="resource-image" src="${faction.image}" alt="">`
      : '';
    return `<div class="card-base-layer" data-faction-label="${faction.label}" style="--faction-fallback: ${faction.fallback}">${image}</div>`;
  }).join('');
  updateFactionImageStatus();
  watchResourceImages(baseLayers);

  const selectedIcons = [
    ...values.getAll('icon'),
    ...values.getAll('sideIcon'),
    ...values.getAll('separateIcon')
  ].filter(Boolean);
  const selectedBandIcons = selectedIcons
    .filter((icon) => cardBandIconAssets.has(icon))
    .flatMap((icon) => icon === 'Szörnykomponens'
      ? Array(Math.max(1, Number(values.get('monsterComponent')) || 1)).fill(icon)
      : [icon]);
  const bandIconValues = new Map([
    ['Reakció drágítás', String(values.get('reactionSurcharge') || '').trim()],
    ['Oltalom', String(values.get('protection') || '').trim()]
  ].filter(([iconName, value]) => value && selectedIcons.includes(iconName)));
  const bandIconContainer = document.querySelector('#preview-band-icons');
  const renderedIconCounts = new Map();
  const totalIconCounts = new Map();
  selectedBandIcons.forEach((iconName) => {
    totalIconCounts.set(iconName, (totalIconCounts.get(iconName) || 0) + 1);
  });
  const centerIconContainer = bandIconContainer.querySelector('.card-band-icons-center');
  const sideIconContainer = bandIconContainer.querySelector('.card-band-icons-side');
  const positionedIconContainer = bandIconContainer.querySelector('.card-band-icons-positioned');
  const centerIconOffsetX = String(values.get('centerIconOffsetX') || '0');
  const centerIconOffsetY = String(values.get('centerIconOffsetY') || '0');
  centerIconContainer.style.setProperty('--center-icons-offset-x', `${centerIconOffsetX}%`);
  centerIconContainer.style.setProperty('--center-icons-offset-y', `${centerIconOffsetY}%`);
  document.querySelector('#center-icon-offset-x-value').textContent = `${centerIconOffsetX}%`;
  document.querySelector('#center-icon-offset-y-value').textContent = `${centerIconOffsetY}%`;
  const monsterComponentLayout = cardIconLayouts.get('Szörnykomponens');
  const monsterComponentCount = totalIconCounts.get('Szörnykomponens') || 0;
  const centerIconNames = selectedBandIcons.filter((iconName) => cardIconLayouts.get(iconName)?.group === 'center');
  const otherCenterIconWidth = centerIconNames.reduce((width, iconName) => (
    iconName === 'Szörnykomponens' ? width : width + cardIconLayouts.get(iconName).size
  ), 0);
  const centerIconGap = 0.3 * 0.84;
  const availableMonsterWidth = Math.max(
    0,
    84 - otherCenterIconWidth - Math.max(0, centerIconNames.length - 1) * centerIconGap
  );
  const monsterComponentStep = monsterComponentCount > 1
    ? Math.max(
      monsterComponentLayout.size * 0.02,
      (availableMonsterWidth - monsterComponentLayout.size) / (monsterComponentCount - 1)
    )
    : 0;
  const defaultMonsterComponentOverlap = Number.parseFloat(
    getComputedStyle(centerIconContainer).getPropertyValue('--monster-component-overlap')
  );
  const monsterComponentOverlap = monsterComponentCount > 1
    ? Math.min(defaultMonsterComponentOverlap, (monsterComponentStep - centerIconGap) / monsterComponentLayout.size - 1)
    : defaultMonsterComponentOverlap;
  sideIconContainer.style.top = `${sideIconStackY}%`;
  centerIconContainer.replaceChildren();
  sideIconContainer.replaceChildren();
  positionedIconContainer.replaceChildren();
  selectedBandIcons.forEach((iconName) => {
    const icon = document.createElement('span');
    icon.className = 'card-band-icon';
    const iconValue = bandIconValues.get(iconName);
    const iconLabel = iconValue ? `${iconName}: ${iconValue}` : iconName;
    icon.title = iconLabel;
    icon.setAttribute('aria-label', iconLabel);
    const layout = cardIconLayouts.get(iconName);
    if (!layout) throw new Error(`Missing card icon layout for "${iconName}".`);
    if (layout.group === 'center') icon.classList.add('card-band-icon-center-item');
    if (iconName === 'Szörnykomponens') {
      icon.style.zIndex = String((renderedIconCounts.get(iconName) || 0) + 1);
      icon.style.setProperty('--monster-component-overlap', String(monsterComponentOverlap));
      if (renderedIconCounts.get(iconName)) {
        icon.style.marginLeft = 'calc(var(--icon-size) * var(--monster-component-overlap))';
      }
    }
    const occurrence = renderedIconCounts.get(iconName) || 0;
    renderedIconCounts.set(iconName, occurrence + 1);
    const duplicateOffset = (occurrence - (totalIconCounts.get(iconName) - 1) / 2) * (layout.size + 0.5);
    if (layout.group === 'center') {
      icon.style.setProperty('--icon-size', `${layout.size}cqw`);
      icon.style.setProperty('--icon-y', `${layout.y}%`);
    } else if (layout.group === 'side') {
      icon.classList.add('card-band-icon-side-item');
      icon.style.setProperty('--icon-size', `${layout.size}cqw`);
      icon.style.marginLeft = `${layout.x}cqw`;
    } else {
      icon.style.setProperty('--icon-size', `${layout.size}%`);
      icon.style.left = `calc(${layout.x}% + ${duplicateOffset}%)`;
      icon.style.top = `${layout.y}%`;
    }
    const assetPath = cardBandIconAssets.get(iconName);
    if (assetPath) {
      const image = document.createElement('img');
      image.src = assetPath;
      image.alt = '';
      icon.append(image);
      if (iconValue) {
        const value = document.createElement('span');
        value.className = 'card-band-icon-value';
        if (iconName === 'Reakció drágítás') {
          value.classList.add('card-band-icon-value-reaction-surcharge');
        }
        value.textContent = iconValue;
        icon.append(value);
      }
    } else {
      icon.classList.add('card-band-icon-placeholder');
      icon.textContent = '?';
    }
    const iconContainer = layout.group === 'center'
      ? centerIconContainer
      : layout.group === 'side'
        ? sideIconContainer
        : positionedIconContainer;
    iconContainer.append(icon);
  });
  bandIconContainer.hidden = selectedBandIcons.length === 0;
  fitBandIconValues();
  selectedIcons.splice(0, selectedIcons.length, ...selectedIcons.filter((icon) => !cardBandIconAssets.has(icon)));
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

typeTextColorToggle.addEventListener('click', () => {
  const useWhite = typeTextColorToggle.getAttribute('aria-pressed') !== 'true';
  typeTextColorToggle.setAttribute('aria-pressed', String(useWhite));
  typeTextColorToggle.textContent = `Kártyanév, típus és altípus színe: ${useWhite ? 'fehér' : 'fekete'}`;
  card.dataset.typeTextColor = useWhite ? 'white' : 'black';
});

function updateBackgroundImagePosition() {
  const horizontal = document.querySelector('#background-image-horizontal').value;
  const vertical = document.querySelector('#background-image-vertical').value;
  const scale = document.querySelector('#background-image-scale').value;
  backgroundCardImage.style.left = `calc(50% + ${horizontal}%)`;
  backgroundCardImage.style.top = `calc(50% + ${vertical}%)`;
  backgroundCardImage.style.width = `${scale}%`;
  backgroundCardImage.style.height = `${scale}%`;
  document.querySelector('#background-image-horizontal-value').textContent = `${horizontal}%`;
  document.querySelector('#background-image-vertical-value').textContent = `${vertical}%`;
  document.querySelector('#background-image-scale-value').textContent = `${scale}%`;
}

document.querySelectorAll('#background-image-position-controls input').forEach((input) => {
  input.addEventListener('input', updateBackgroundImagePosition);
});

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
    lowercaseInitialLetters(input);
    updatePreview();
  });
}
bindPresetPicker(form.querySelector('#subtype-picker'), form.querySelector('#card-subtype'));
bindPresetPicker(form.querySelector('#type-picker'), form.querySelector('#card-type'));
function lowercaseInitialLetters(input) {
  const value = input.value;
  const changes = [];
  for (const match of value.matchAll(/(^|[,;\n]\s*)(\p{L})/gu)) {
    const original = match[2];
    const lowercase = original.toLocaleLowerCase('hu-HU');
    if (original !== lowercase) {
      changes.push({
        start: match.index + match[1].length,
        original,
        lowercase
      });
    }
  }
  if (!changes.length) return;

  const selectionStart = input.selectionStart;
  const selectionEnd = input.selectionEnd;
  const selectionDirection = input.selectionDirection;
  const mapPosition = (position) => {
    let offset = 0;
    for (const change of changes) {
      if (position <= change.start) break;
      if (position <= change.start + change.original.length) {
        return change.start + offset + change.lowercase.length;
      }
      offset += change.lowercase.length - change.original.length;
    }
    return position + offset;
  };
  input.value = value.replace(/(^|[,;\n]\s*)(\p{L})/gu,
    (match, separator, letter) => separator + letter.toLocaleLowerCase('hu-HU'));
  input.setSelectionRange(mapPosition(selectionStart), mapPosition(selectionEnd), selectionDirection);
}
const typeTextInputs = [form.querySelector('#card-type'), form.querySelector('#card-subtype')];
typeTextInputs.forEach((input) => {
  lowercaseInitialLetters(input);
  input.addEventListener('input', () => lowercaseInitialLetters(input));
});
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
document.querySelector('#bold-rules-text').addEventListener('click', () => {
  const start = rulesTextInput.selectionStart;
  const end = rulesTextInput.selectionEnd;
  if (start === end || rulesTextInput.value.length + 4 > rulesTextInput.maxLength) return;

  const selection = rulesTextInput.value.slice(start, end);
  rulesTextInput.setRangeText(`**${selection}**`, start, end, 'select');
  rulesTextInput.dispatchEvent(new Event('input', { bubbles: true }));
  rulesTextInput.focus();
  rulesTextInput.setSelectionRange(start + 2, end + 2);
});
const rulesTextIconButtons = document.querySelector('#rules-text-icon-buttons');
rulesTextIcons.forEach((icon) => {
  const button = document.createElement('button');
  button.className = 'text-insert-button';
  button.type = 'button';
  button.title = icon.alt;

  const image = document.createElement('img');
  image.src = icon.path;
  image.alt = '';
  button.append(image, document.createTextNode(icon.alt));
  button.addEventListener('click', () => insertRulesTextIcon(icon.token));
  rulesTextIconButtons.append(button);
});
form.addEventListener('input', updatePreview);
form.addEventListener('change', updatePreview);
document.querySelector('#center-icon-position-reset').addEventListener('click', () => {
  form.querySelector('#center-icon-offset-x').value = '0';
  form.querySelector('#center-icon-offset-y').value = '0';
  updatePreview();
});
cardRuleInput.addEventListener('change', () => {
  applyCardRuleRestrictions(true);
  updateFactionControls();
  updatePreview();
});
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
  backgroundCardImage.hidden = true;
  backgroundCardImage.removeAttribute('src');
  fileName.textContent = 'Nincs kép kiválasztva';
  imageError.hidden = true;
  imageError.textContent = '';

  if (!file) {
    updatePreview();
    return;
  }
  if (!file.type.startsWith('image/')) {
    imageInput.value = '';
    imageError.textContent = 'Válassz egy érvényes képfájlt.';
    imageError.hidden = false;
    updatePreview();
    return;
  }

  const candidateUrl = URL.createObjectURL(file);
  previewImage.src = candidateUrl;
  try {
    await previewImage.decode();
    imageUrl = candidateUrl;
    previewImage.hidden = false;
    fileName.textContent = file.name;
    updatePreview();
  } catch {
    URL.revokeObjectURL(candidateUrl);
    previewImage.removeAttribute('src');
    imageInput.value = '';
    imageError.textContent = 'A kiválasztott fájl nem tölthető be képként.';
    imageError.hidden = false;
    updatePreview();
  }
});

document.querySelector('#reset-button').addEventListener('click', () => {
  form.reset();
  if (imageUrl) URL.revokeObjectURL(imageUrl);
  imageUrl = null;
  previewImage.removeAttribute('src');
  previewImage.hidden = true;
  backgroundCardImage.removeAttribute('src');
  backgroundCardImage.hidden = true;
  fileName.textContent = 'Nincs kép kiválasztva';
  imageError.hidden = true;
  imageError.textContent = '';
  form.querySelectorAll('.icon-choice-numeric').forEach((choice) => {
    const toggle = choice.querySelector('input[name="icon"]');
    const valueInput = choice.querySelector('.icon-value, .icon-quantity');
    valueInput.hidden = !toggle.checked;
    valueInput.disabled = !toggle.checked;
  });
  applyCardRuleRestrictions();
  updateFactionControls();
  updatePreview();
});

function getCanvasRect(element, renderRect, scaleX, scaleY) {
  const rect = element.getBoundingClientRect();
  return {
    x: (rect.left - renderRect.left) * scaleX,
    y: (rect.top - renderRect.top) * scaleY,
    width: rect.width * scaleX,
    height: rect.height * scaleY
  };
}

function getEffectiveCssZoom(element) {
  let zoom = 1;
  for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
    const ancestorZoom = Number.parseFloat(getComputedStyle(ancestor).zoom);
    if (Number.isFinite(ancestorZoom)) zoom *= ancestorZoom;
  }
  return zoom;
}

function fitBandIconValues() {
  document.querySelectorAll('#preview-band-icons .card-band-icon-value').forEach((value) => {
    const icon = value.closest('.card-band-icon');
    if (!icon) throw new Error('Card icon value is missing its icon container.');
    const textWidth = value.scrollWidth;
    const availableWidth = icon.clientWidth * 0.58;
    const scale = textWidth > 0 ? Math.min(1, availableWidth / textWidth) : 1;
    value.style.setProperty('--band-icon-value-scale-x', String(scale));
  });
}

function truncateCanvasText(context, text, maxWidth) {
  const ellipsis = '…';
  if (context.measureText(text).width <= maxWidth) return text;
  const characters = [...text];
  while (characters.length && context.measureText(`${characters.join('')}${ellipsis}`).width > maxWidth) {
    characters.pop();
  }
  return context.measureText(ellipsis).width <= maxWidth ? `${characters.join('')}${ellipsis}` : '';
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

function drawContain(context, image, rect) {
  const scale = Math.min(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  context.drawImage(image, rect.x + (rect.width - width) / 2, rect.y + (rect.height - height) / 2, width, height);
}

async function renderCardPng() {
  const renderRect = document.querySelector('#base-color-layers').getBoundingClientRect();
  const baseImage = card.querySelector('#base-color-layers img');
  const exportWidth = baseImage?.naturalWidth || 1061;
  const exportHeight = baseImage?.naturalHeight || 1483;
  const scaleX = exportWidth / renderRect.width;
  const scaleY = exportHeight / renderRect.height;
  const canvas = document.createElement('canvas');
  canvas.width = exportWidth;
  canvas.height = exportHeight;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas rendering is unavailable.');
  context.imageSmoothingQuality = 'high';

  const baseLayers = [...document.querySelectorAll('#base-color-layers .card-base-layer')];
  if (card.dataset.backgroundImageMode === 'true' && backgroundCardImage.naturalWidth) {
    drawCover(context, backgroundCardImage, getCanvasRect(backgroundCardImage, renderRect, scaleX, scaleY));
  }
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

  if (card.dataset.backgroundImageMode !== 'true' && !previewImage.hidden && previewImage.naturalWidth) {
    drawCover(context, previewImage, getCanvasRect(document.querySelector('.art-frame'), renderRect, scaleX, scaleY));
  }

  const nameElement = document.querySelector('#preview-name');
  const nameRect = getCanvasRect(nameElement, renderRect, scaleX, scaleY);
  const nameStyle = getComputedStyle(nameElement);
  context.fillStyle = nameStyle.color;
  context.font = `${nameStyle.fontWeight} ${parseFloat(nameStyle.fontSize) * scaleX}px ${nameStyle.fontFamily}`;
  context.letterSpacing = `${parseFloat(nameStyle.letterSpacing) * scaleX}px`;
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
  context.fillText(truncateCanvasText(context, nameElement.textContent, nameRect.width), nameTextX, nameRect.y);
  context.shadowColor = 'transparent';
  context.shadowBlur = 0;
  context.shadowOffsetY = 0;

  const metaType = document.querySelector('#preview-card-type');
  const metaSubtype = document.querySelector('#preview-subtype');
  if (metaType && metaSubtype) {
    [metaType, metaSubtype].filter((element) => !element.hidden).forEach((element) => {
      const metaRect = getCanvasRect(element, renderRect, scaleX, scaleY);
      const metaStyle = getComputedStyle(element);
      context.save();
      context.beginPath();
      context.rect(metaRect.x, metaRect.y, metaRect.width, metaRect.height);
      context.clip();
      context.fillStyle = metaStyle.color;
      context.font = `${metaStyle.fontStyle} ${metaStyle.fontWeight} ${parseFloat(metaStyle.fontSize) * scaleX}px ${metaStyle.fontFamily}`;
      context.letterSpacing = `${parseFloat(metaStyle.letterSpacing) * scaleX}px`;
      context.textAlign = metaStyle.textAlign;
      context.textBaseline = 'middle';
      const textX = metaStyle.textAlign === 'right'
        ? metaRect.x + metaRect.width
        : metaStyle.textAlign === 'center'
          ? metaRect.x + metaRect.width / 2
          : metaRect.x;
      context.fillText(element.textContent, textX, metaRect.y + metaRect.height / 2);
      context.restore();
    });
  }

  document.querySelectorAll('#preview-costs .card-cost').forEach((cost) => {
    const badge = cost.querySelector('b');
    const rect = getCanvasRect(badge, renderRect, scaleX, scaleY);
    const style = ['vp', 'zanszilank', 'nekron', 'szk', 'builder', 'sacrifice'].find((name) => cost.classList.contains(name));
    const symbolImage = badge.querySelector('img');
    if (!symbolImage?.naturalWidth) {
      traceCostShape(context, style, rect.x, rect.y, rect.width, rect.height);
      context.fillStyle = getComputedStyle(badge).backgroundColor;
      context.fill();
      const glyph = badge.querySelector('.cost-glyph');
      if (glyph) {
        const glyphRect = getCanvasRect(glyph, renderRect, scaleX, scaleY);
        const glyphStyle = getComputedStyle(glyph);
        context.save();
        context.fillStyle = '#fff';
        context.font = `${glyphStyle.fontWeight} ${parseFloat(glyphStyle.fontSize) * scaleX}px ${glyphStyle.fontFamily}`;
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillText(glyph.textContent, rect.x + rect.width / 2, glyphRect.y);
        context.restore();
      }
    } else {
      drawContain(context, symbolImage, rect);
    }
    const amount = badge.querySelector('.cost-amount');
    const amountRect = getCanvasRect(amount, renderRect, scaleX, scaleY);
    const amountStyle = getComputedStyle(amount);
    context.save();
    context.fillStyle = amountStyle.color;
    context.font = `${amountStyle.fontStyle} ${amountStyle.fontWeight} ${parseFloat(amountStyle.fontSize) * scaleX}px ${amountStyle.fontFamily}`;
    context.letterSpacing = `${parseFloat(amountStyle.letterSpacing) * scaleX}px`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(amount.textContent, rect.x + rect.width / 2, amountRect.y + amountRect.height / 2, rect.width * .9);
    context.restore();
  });

  document.querySelectorAll('#preview-icons .card-icon').forEach((icon) => {
    const rect = getCanvasRect(icon, renderRect, scaleX, scaleY);
    context.fillStyle = 'rgba(41, 45, 44, .8)';
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
    context.strokeStyle = '#777970';
    context.lineWidth = Math.max(1, scaleX);
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    const iconStyle = getComputedStyle(icon);
    context.fillStyle = iconStyle.color;
    context.font = `700 ${parseFloat(iconStyle.fontSize) * scaleX}px ${iconStyle.fontFamily}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(icon.textContent, rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width - 4 * scaleX);
  });

  document.querySelectorAll('#preview-band-icons .card-band-icon').forEach((icon) => {
    const rect = getCanvasRect(icon, renderRect, scaleX, scaleY);
    const image = icon.querySelector('img');
    if (image?.naturalWidth) {
      drawContain(context, image, getCanvasRect(image, renderRect, scaleX, scaleY));
    } else {
      context.fillStyle = '#fffdf7';
      context.strokeStyle = '#514b3b';
      context.lineWidth = Math.max(1, scaleX);
      context.beginPath();
      context.arc(rect.x + rect.width / 2, rect.y + rect.height / 2,
        Math.min(rect.width, rect.height) / 2, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = '#292c2b';
      context.font = `700 ${rect.height * .72}px Georgia, 'Times New Roman', serif`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('?', rect.x + rect.width / 2, rect.y + rect.height / 2);
    }
    const value = icon.querySelector('.card-band-icon-value');
    if (value) {
      const valueRect = getCanvasRect(value, renderRect, scaleX, scaleY);
      const valueStyle = getComputedStyle(value);
      context.fillStyle = valueStyle.color;
      context.font = `${valueStyle.fontWeight} ${parseFloat(valueStyle.fontSize) * scaleX}px ${valueStyle.fontFamily}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      const horizontalScale = Number.parseFloat(value.style.getPropertyValue('--band-icon-value-scale-x')) || 1;
      context.save();
      context.translate(valueRect.x + valueRect.width / 2, valueRect.y + valueRect.height / 2);
      context.scale(horizontalScale, 1);
      context.fillText(value.textContent, 0, 0);
      context.restore();
    }
  });

  drawDomText(context, document.querySelector('#preview-text'), renderRect, scaleX, scaleY);

  const flavor = document.querySelector('#preview-flavor-text');
  if (!flavor.hidden) {
    drawDomText(context, flavor, renderRect, scaleX, scaleY);
  }

  const statsPanel = document.querySelector('#preview-stats');
  if (!statsPanel.hidden) {
    const statBoxes = [...statsPanel.querySelectorAll('.stat-box')].filter((box) => !box.hidden);
    statBoxes.forEach((box) => {
      const boxRect = getCanvasRect(box, renderRect, scaleX, scaleY);
      context.fillStyle = '#101a20';
      context.fillRect(boxRect.x, boxRect.y, boxRect.width, boxRect.height);
      context.strokeStyle = '#d2b15e';
      context.lineWidth = Math.max(1, scaleX);
      context.strokeRect(boxRect.x, boxRect.y, boxRect.width, boxRect.height);

      const icon = box.querySelector('.stat-icon');
      if (icon && !icon.hidden && icon.tagName === 'IMG' && icon.naturalWidth) {
        const iconRect = getCanvasRect(icon, renderRect, scaleX, scaleY);
        drawContain(context, icon, iconRect);
      } else if (icon && !icon.hidden && icon.classList.contains('stat-power-icon')) {
        const iconRect = getCanvasRect(icon, renderRect, scaleX, scaleY);
        const iconStyle = getComputedStyle(icon);
        context.beginPath();
        context.arc(iconRect.x + iconRect.width / 2, iconRect.y + iconRect.height / 2,
          Math.min(iconRect.width, iconRect.height) / 2, 0, Math.PI * 2);
        context.fillStyle = iconStyle.backgroundColor;
        context.fill();
        context.strokeStyle = iconStyle.borderTopColor;
        context.lineWidth = Math.max(1, scaleX);
        context.stroke();
        context.fillStyle = iconStyle.color;
        context.font = `${iconStyle.fontWeight} ${parseFloat(iconStyle.fontSize) * scaleX}px ${iconStyle.fontFamily}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(icon.textContent, iconRect.x + iconRect.width / 2, iconRect.y + iconRect.height / 2);
      }

      const value = box.querySelector('strong');
      if (value) {
        const valueRect = getCanvasRect(value, renderRect, scaleX, scaleY);
        const valueStyle = getComputedStyle(value);
        context.fillStyle = valueStyle.color;
        context.font = `${valueStyle.fontWeight} ${parseFloat(valueStyle.fontSize) * scaleX}px ${valueStyle.fontFamily}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(value.textContent, valueRect.x + valueRect.width / 2, valueRect.y + valueRect.height / 2);
      }
    });
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not encode the card image.')), 'image/png');
  });
}

const downloadButton = document.querySelector('#download-button');
downloadButton.addEventListener('click', async () => {
  const status = document.querySelector('#download-status');
  status.textContent = '';
  status.classList.remove('is-visible');
  status.removeAttribute('data-state');
  downloadButton.disabled = true;
  try {
    const suggestedName = `${document.querySelector('#preview-name').textContent.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-').replace(/[. ]+$/g, '') || 'hkk-card'}.png`;
    const saveFilePromise = typeof window.showSaveFilePicker === 'function'
      ? window.showSaveFilePicker({
        suggestedName,
        types: [{ description: 'PNG kép', accept: { 'image/png': ['.png'] } }]
      }).then(
        (handle) => ({ handle }),
        (error) => ({ error })
      )
      : null;
    const loadedImages = [...card.querySelectorAll('img')].filter((image) => image.complete && image.naturalWidth > 0);
    await Promise.all(loadedImages.map((image) => image.decode().catch(() => null)));
    await document.fonts.ready;
    const blob = await renderCardPng();
    if (saveFilePromise) {
      const saveResult = await saveFilePromise;
      if ('error' in saveResult) throw saveResult.error;
      const writable = await saveResult.handle.createWritable();
      try {
        await writable.write(blob);
        await writable.close();
      } catch (error) {
        try {
          await writable.abort();
        } catch (abortError) {
          console.error(abortError);
        }
        throw error;
      }
      status.textContent = `Saved ${saveResult.handle.name}`;
    } else {
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = suggestedName;
      link.click();
      status.textContent = `A letöltés elkészült: ${link.download}. A böngésző az alapértelmezett letöltési mappába menthette.`;
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    }
    status.dataset.state = 'success';
    status.classList.add('is-visible');
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      status.textContent = location.protocol === 'file:'
        ? 'A fájlválasztó megszakította a mentést; a kártyakép nem lett elmentve. Ez az oldal file:// címen fut. Indítsd el a node serve.js parancsot, majd nyisd meg a http://localhost:8000/ címet.'
        : 'A fájlválasztó megszakította a mentést; a kártyakép nem lett elmentve.';
      status.dataset.state = 'info';
    } else {
      status.textContent = location.protocol === 'file:' && error instanceof DOMException && error.name === 'SecurityError'
        ? 'A Chrome biztonsági okból nem engedi a PNG-exportot közvetlenül megnyitott fájlból. Futtasd a mappában: node serve.js, majd nyisd meg a http://localhost:8000 címet a mentési hely kiválasztásához.'
        : 'Nem sikerült elmenteni a PNG-fájlt. Ellenőrizd, hogy a kártyaképek érvényes PNG, JPG vagy GIF fájlok legyenek.';
      status.dataset.state = 'error';
      console.error(error);
    }
    status.classList.add('is-visible');
  } finally {
    downloadButton.disabled = false;
  }
});

const cardResizeObserver = new ResizeObserver(() => {
  fitPreviewText();
  fitBandIconValues();
});
cardResizeObserver.observe(card);
watchResourceImages();
applyCardRuleRestrictions();
updateFactionControls();
updatePreview();
document.fonts.ready.then(fitBandIconValues);