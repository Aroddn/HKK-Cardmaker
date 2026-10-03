class Lapkereso {
  formTarget = null;
  resultTarget = null;
  fromLinkData = null;
  browserHistory = null;
  cards = [];
  hiddenCardIDs = [];
  colors = [];
  types = [];
  subTypes = [];
  creatureSubTypes = [];
  editions = [];
  grouper = new CardsGrouper();
  lastKeresesData = {};
  drawers = {};
  drawer = null;
  hideTiltottMagia = false;
  sortFunction = this.SortByName;
  paklibaOnClick = null;
  kiegeszitobeOnClick = null;
  keresesCallback = null;
  showMasodlagosImages = 0;
  cardsImageDrawer = null;
  
  flagTypes = { 1: 'leszedÃ©s', 2: 'reakciÃ³', 4: 'hÃºzÃ¡s', 8: 'keresÃ©s', 16: 'erÅforrÃ¡s', 32: 'sebzÃ©s', 64: 'gyÃ³gyulÃ¡s', 128: 'dobatÃ¡s', 256: 'lopÃ¡s', 512: 'semmizÃ©s', 1024: 'visszavÃ©tel', 2048: 'token'}
  
  extraTypes = {
    1000: {'name': '- LÃ©nyek -', 'types': [1, 2, 3, 20, 21] }, 
    1001: {'name': '- VarÃ¡zslatok -', 'types': [9, 10, 11, 12, 13, 14, 15, 16] }, 
    1002: {'name': '- BÅ±bÃ¡jvarÃ¡zslatok -', 'types': [11, 12, 13, 14, 15, 16] }
  };
  
  extraEditions = {
    1000: {'name': '- ZÃ©n -', 'editions': [43,44,45,48,49,50,51,52,53,54,59,60,61,62,63,64,65,66,69,70,71,73,74,75,76,82,83,84,85,88,89,90,91,93,94,95,96,99,100,101,102,105,106,107,108,111,112,113,114,117,118,119,120,124,125,126,127,129,130,133,134,135,136,137,138,139,140,142,143,145,146,148,149,150,151,152,153,155,156,157,158,159,160,162,163,164,165,169,171,172,173,174,181,183,184,188,189,191,192,193,194,196,197,199,200,201,202,204,205,207,208,213,216,217,218,223,224,225,234,235,236,238,239,240]},
    1001: {'name': '- CsillagkÃ©pek -', 'editions': [11,12,13,14,16,15,17,18,19,20,21,22]},
    1002: {'name': '- InvÃ¡ziÃ³ -', 'editions': [26,27,28,30,31,32,33,34,35,36,38,39,40,41]},
    1003: {'name': '- Alfa pakli -', 'editions': [166,175,176,177,178,179,185,186,209,210,221,222,231,232,233,241,242,243]}
  }
  
  constructor(parameters = {}) {
    this.API = parameters.API;
    this.formTarget = parameters.formTarget ?? null;
    this.resultTarget = parameters.resultTarget ?? null;
    
    if (typeof(parameters.browserHistory) !== 'undefined') {
      this.browserHistory = parameters.browserHistory;
      this.browserHistory.Subscribe(this, ['lapkereso']);
    }

    if (typeof(parameters.fromLinkDatas) !== 'undefined') { 
      this.SetFromLink(parameters.fromLinkDatas);
    }
    var self = this;
    if (parameters.observer) {
      parameters.observer.Subscribe(new SubscribeEvent({
        'key': 'lapkeresoLogin',
        'type': 'loginDataApplied',
        'callback': function() {
          self.LoadCardConstants();
        }
      }));
    }
    
    this.SetView('image');
    this.ToggleUnimportant();
    
    this.SetPaklibaOnClick(function(card) {
      document.location = 'lap/' + card.link + '/' + card.ID;
    });
    if (!IsMobile()) {
      $('.toggleHelp').hide();
    }
  }

  InitCardConstants(data) {
    let editionNames = {};
    this.editions = {};

    for (let e in data.editions) {
      let editionID = data.editions[e].id;
      editionNames[editionID] = this.GetEditionNev(data.editions[e]);
      this.editions[editionID] = data.editions[e];
    }
    let selectEditions = { ...editionNames};
    selectEditions[1000] = this.extraEditions[1000].name;
    selectEditions[1001] = this.extraEditions[1001].name;
    selectEditions[1002] = this.extraEditions[1002].name;
    selectEditions[1003] = this.extraEditions[1003].name;
    this.FillMagicSuggestField($('#kiegeszito', this.formTarget), selectEditions);
    this.FillMagicSuggestField($('#szin', this.formTarget), data.colors);

    let selectTypes = { ...data.mainTypes};
    selectTypes[1000] = this.extraTypes[1000].name;
    selectTypes[1001] = this.extraTypes[1001].name;
    selectTypes[1002] = this.extraTypes[1002].name;
    this.FillMagicSuggestField($('#tipus', this.formTarget), selectTypes);
    this.FillMagicSuggestField($('#altipus', this.formTarget), data.subTypes);
    this.FillMagicSuggestField($('#jelek', this.formTarget), data.otherTypes);
    this.FillMagicSuggestField($('#grafikus', this.formTarget), data.illustrators);
    this.FillMagicSuggestField($('#funkcio', this.formTarget), this.flagTypes);
    this.FillSelect($('[name=gyakorisag]', this.formTarget), {'0': '-Ãsszes-', 'common' : 'gyakori', 'uncommon' : 'nem gyakori', 'rare' : 'ritka', 'ultraRare' : 'ultra ritka'});
    this.types = data.mainTypes;
    this.subTypes = data.subTypes;
    this.creatureSubTypes = data.creatureSubTypes;
    this.colors = data.colors;

    var yearListFrom = {0: '- bÃ¡rmikortÃ³l -'};
    var yearListTo = {0: '- bÃ¡rmikorig -'};
    var year = new Date().getFullYear()+1;
    for (var i = 1995; i <= year; i++) {
      yearListFrom[i] = i;
      yearListTo[i] = i;
    }
    this.FillSelect($('[name=megjelenesFrom]', this.formTarget), yearListFrom);
    this.FillSelect($('[name=megjelenesTo]', this.formTarget), yearListTo);

    if (this.fromLinkData !== null) {
      this.SetFieldsValue(this.fromLinkData);
    }
    this.ToggleCsakPakliSzinek();
  }
  
  PakliszerkesztoExists() { return typeof(pakliszerkeszto) !== 'undefined'; }
  LoadCardConstants() {
    let self = this;
    
    if (account.user.HKKTesztelo || account.user.retroHKKTesztelo) {
      $('.teszteloiLapokCheckbox').removeClass('d-none');
    }
    if (!this.PakliszerkesztoExists()) {
      $('.pakliSzinekCheckbox').addClass('d-none');
      $('#szinSelectorCol').removeClass('col-4').addClass('col-6');
    }
    
    this.API.CallAuthAPI({
      'url': 'lapkereso/cardConstants',
      'dataType': "json",
      'type': 'get'
    }, function(data) {
      self.InitCardConstants(data);
    });
  }
  
  GetEditionNev(edition) {
    if (edition.tipus !== '' && edition.tipus !== '-1') {
      return edition.tipus + ': ' + edition.nev;
    } else {
      return edition.nev;
    }
  }
 
  SetPaklibaOnClick(onClick) {
    this.paklibaOnClick = onClick;
    this.drawer.SetPaklibaOnClick(this.paklibaOnClick);
  }

  SetKiegeszitobeOnClick(onClick) {
    this.kiegeszitobeOnClick = onClick;
    this.drawer.SetKiegeszitobeOnClick(this.kiegeszitobeOnClick);
  }

  SetHiddenCardIDs(cardIDs) {
    this.hiddenCardIDs = cardIDs;
  }

  FillMagicSuggestField(target, options) {
    var msData = [];
    
    for (var i in options) {
      if (options[i] !== '-') {
        msData.push({'id': i, 'name' : options[i]});
      }
    }
    
    msData.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });
    
    $(target).magicSuggest({ data: msData,  'allowFreeEntries': false, 'placeholder': 'Ãrd be vagy vÃ¡laszd ki', 'noSuggestionText': 'Nincs talÃ¡lat' });
  }
  
  GetMagicSuggestSelected(ms) {
    var selection = $(ms).magicSuggest().getSelection();
    var selectedIDs = [];
    for (var i in selection) {
      selectedIDs.push(selection[i].id);
    }
    return selectedIDs;
  }

  GetMagicSuggestSelectedJoined(ms) {
    return this.GetMagicSuggestSelected(ms).join();
  }
  
  FillSelect(target, options) {
    $(target).html('');
    for (var i in options) {
      $('<option>', {'value' : i, 'html':options[i]}).appendTo(target);
    }
  }

  SetFromLink(data) {
    data.kiegeszito = data.kiegeszito.replace('&fbclid', '');
    let notEmptyData = {};
    for (let i in data) {
      if (data[i] !== '') {
        notEmptyData[i] = data[i];
      }
    }
    
    if (Object.keys(notEmptyData).length === 0) {
      this.fromLinkData = null;
    } else {
      this.fromLinkData = notEmptyData;
    }
    
    if (this.fromLinkData && this.fromLinkData.kiegeszito && this.fromLinkData.kiegeszito == "245") {
      this.showMasodlagosImages = 1;
    }
  }
  
  SetFieldsValue(keresesJSON) {
    let actualKeresesJSON = this.GetKeresesData();
    if (Object.values(keresesJSON).length > 0 && JSON.stringify(actualKeresesJSON) !== JSON.stringify(keresesJSON)) {
      this.SetMagicSuggestValues($('#kiegeszito'), keresesJSON.kiegeszito || '');
      this.SetMagicSuggestValues($('#szin'), keresesJSON.szin || '');
      this.SetMagicSuggestValues($('#grafikus'), keresesJSON.grafikus || '');
      
      let tipusokFromJson = [];
      if (keresesJSON.tipus) {
        tipusokFromJson = (keresesJSON.tipus || '').split(',');
      }

      let tipusok = [];
      let altipusok = [];
      let jelek = [];
      for (let i in tipusokFromJson) {
        let tipus = tipusokFromJson[i];
        if (tipus >= 1000) {
          jelek.push(tipus - 1000);
        } else if (tipus >= 100) {
          altipusok.push(tipus - 100);
        } else {
          tipusok.push(tipus);
        }
      }

      this.SetMagicSuggestValuesFromArray($('#tipus'), tipusok);
      this.SetMagicSuggestValuesFromArray($('#altipus'), altipusok);
      this.SetMagicSuggestValuesFromArray($('#jelek'), jelek);

      let cardFlagsArray = new Array();
      let cardFlags = keresesJSON.cardFlags || 0;
      let cardFlagsBinary = (cardFlags >>> 0).toString(2);
      for (let i = 0; i < cardFlagsBinary.length; i++) {
        if (cardFlagsBinary[i] === "1") {
          let bitValue = Math.pow(2, cardFlagsBinary.length - i - 1);
          cardFlagsArray.push(bitValue);
        }
      }
      this.SetMagicSuggestValuesFromArray($('#funkcio'), cardFlagsArray);

      let flags = (keresesJSON.flags || '').split(',');
      $('[name=token]', this.formTarget)[0].checked = flags.indexOf('token') !== -1;
      $('[name=foilosujranyomas]', this.formTarget)[0].checked = flags.indexOf('foilosujranyomas') !== -1;
      $('[name=vanFullart]', this.formTarget)[0].checked = flags.indexOf('vanFullart') !== -1;
      $('[name=vanGold]', this.formTarget)[0].checked = flags.indexOf('vanGold') !== -1;
      $('[name=retro]', this.formTarget)[0].checked = flags.indexOf('retro') !== -1;
      $('[name=ujnemzedek]', this.formTarget)[0].checked = (flags.indexOf('ujnemzedek') !== -1 || keresesJSON.forceUjnemzedek === true);
      $('[name=magikusvedelem]', this.formTarget)[0].checked = flags.indexOf('magikusvedelem') !== -1;
      $('[name=ketszinu]', this.formTarget)[0].checked = flags.indexOf('ketszinu') !== -1;
      $('[name=nemrepul]', this.formTarget)[0].checked = flags.indexOf('nemrepul') !== -1;
      $('[name=valtozokoltseg]', this.formTarget)[0].checked = flags.indexOf('valtozokoltseg') !== -1;

      $('[name=nevben]', this.formTarget).val(keresesJSON.nev || '');
      $('[name=szovegben]', this.formTarget).val(keresesJSON.szoveg || '');
      $('[name=flavorban]', this.formTarget).val(keresesJSON.flavor || '');

      let megjelenes = (keresesJSON.megjelenes || '').split('-');
      $('[name=megjelenesFrom]', this.formTarget).val(megjelenes[0] || 0);
      $('[name=megjelenesTo]', this.formTarget).val(megjelenes[1] || 0);
      
      $('[name=gyakorisag]', this.formTarget).val(keresesJSON.gyakorisag || 0);
      $('[name=teszteloiLapok]', this.formTarget)[0].checked = keresesJSON.teszteloiLapok || 0;
      
      this.FillKoltsegekFromString(keresesJSON.koltseg || '');
      
      this.RunWithoutCallback();
    }
  }
  
  FillKoltsegekFromString(koltseg) {
    var costTypes = ['vp', 'szk', 'epito', 'aldozas', 'semmi', 'zanszilank'];    
    for (let i in costTypes) { 
      $('[name=' + costTypes[i] +'min]', this.formTarget).val('');
      $('[name=' + costTypes[i] +'max]', this.formTarget).val('');
    }
    let koltsegek = koltseg.split(',');
    for (let i in koltsegek) {
      let costType = this.GetKoltsegTypeFromCombinedKoltseg(koltsegek[i]);
      let koltsegValues = this.GetKoltsegValuesFromCombinedKoltseg(koltsegek[i], costType);
      let koltsegMinMax = koltsegValues.split('-');
      
      if (parseInt(koltsegMinMax[0]) !== 0) {
        $('[name=' + costType +'min]', this.formTarget).val(koltsegMinMax[0]);
      }
      if (parseInt(koltsegMinMax[1]) !== 0) {
        $('[name=' + costType +'max]', this.formTarget).val(koltsegMinMax[1]);
      }
    }
  }
  
  GetKoltsegValuesFromCombinedKoltseg(koltseg, costType) {
    let koltsegValues = koltseg.replace(costType, '');
    if (koltsegValues[0] === '-') {
      koltsegValues = '0' + koltsegValues;
    }
    if (koltsegValues[koltsegValues.length - 1] === '-') {
      koltsegValues += '0';
    }
    return koltsegValues;
  }
  
  GetKoltsegTypeFromCombinedKoltseg(koltseg) {
    var costTypes = ['vp', 'szk', 'epito', 'aldozas', 'semmi', 'zanszilank'];    
    for (let i in costTypes) {
      if (koltseg.indexOf(costTypes[i]) !== -1) {
        return costTypes[i];
      }
    }
    
    return '';
  }
  
  SetMagicSuggestValues(ms, values) {
    this.SetMagicSuggestValuesFromArray(ms, values.split(','));
  }
  
  SetMagicSuggestValuesFromArray(ms, array) {
    $(ms).magicSuggest().clear();
    if (array.length > 0 && array[0] !== "") {
      $(ms).magicSuggest().setValue(array);
    }
  }
  
  ToggleCsakPakliSzinek() {
    let ms = $('#szin').magicSuggest();
    if ($('#pakliSzinek')[0].checked) {
      ms.disable();
    } else {
      ms.enable();
    } 
  }
  
  GetKeresesData() {
    var flags = [];
    var szin = this.GetMagicSuggestSelectedJoined($('#szin'));
    if (this.PakliszerkesztoExists() && $('#pakliSzinek')[0].checked) {
      szin = pakliszerkeszto.PakliSzinek().join(',');
    }
    var grafikus = this.GetMagicSuggestSelectedJoined($('#grafikus'));
    var gyakorisag = $('[name=gyakorisag]', this.formTarget).val();
    var teszteloiLapok = $('[name=teszteloiLapok]', this.formTarget)[0].checked ? 1 : 0;
    var kiegeszito = this.GetEditionsFromSelect($('#kiegeszito'));
    var nevben = $('[name=nevben]', this.formTarget).val();
    var szovegben = $('[name=szovegben]', this.formTarget).val();
    var flavorban = $('[name=flavorban]', this.formTarget).val();
    let cardFlags = 0;
    var funkciok = this.GetMagicSuggestSelected($('#funkcio'));
    for (let i in funkciok) {
      cardFlags += parseInt(funkciok[i]);
    }
    
    var megjelenesFrom = $('[name=megjelenesFrom]', this.formTarget).val();
    var megjelenesTo = $('[name=megjelenesTo]', this.formTarget).val();
    var megjelenes = (megjelenesFrom !== '0' ? megjelenesFrom : '') + '-' + (megjelenesTo !== '0' ? megjelenesTo : '');
    
    var tipusok = this.GetTipusokFromSelect($('#tipus'));

    var altipusok = this.GetMagicSuggestSelected($('#altipus'));
    for (var i in altipusok) {
      tipusok.push(parseInt(altipusok[i]) + 100);
    }

    var jelek = this.GetMagicSuggestSelected($('#jelek'));
    for (var i in jelek) {
      tipusok.push(parseInt(jelek[i]) + 1000);
    }
    
    var keresesData = {
      'kiegeszito': kiegeszito.join(','),
      'tipus': tipusok.join(','), 'szin': szin, 'gyakorisag': gyakorisag,
      'nev': nevben, 'szoveg': szovegben, 'flavor': flavorban,
      'koltseg': this.BuildKoltseg(),
      'grafikus': grafikus,
      'cardFlags': cardFlags,
      'teszteloiLapok': teszteloiLapok
    };
    if (megjelenes !== '-') {
      keresesData.megjelenes = megjelenes;
    }
    
    if ($('[name=token]', this.formTarget)[0].checked) {
      flags.push('token');
    }
    
    if ($('[name=foilosujranyomas]', this.formTarget)[0].checked) {
      flags.push('foilosujranyomas');
    }
    
    if ($('[name=vanFullart]', this.formTarget)[0].checked) {
      flags.push('vanFullart');
    }
    
    if ($('[name=vanGold]', this.formTarget)[0].checked) {
      flags.push('vanGold');
    }
    
    if ($('[name=retro]', this.formTarget)[0].checked) {
      flags.push('retro');
    }

    if (this.PakliszerkesztoExists()) {
      let pakliszerkesztoUjNemzedek = pakliszerkeszto.deckParameters.ujnemzedek;
      if (pakliszerkesztoUjNemzedek == 2) {
        keresesData.ujNemzedekOverride = 1;
      }
      if (pakliszerkesztoUjNemzedek == 3) {
        keresesData.ujNemzedekOverride = 2;
      }
    }
    if ($('[name=ujnemzedek]', this.formTarget)[0].checked) {
      flags.push('ujnemzedek');
    }
    
    if ($('[name=magikusvedelem]', this.formTarget)[0].checked) {
      flags.push('magikusvedelem');
    }

    if ($('[name=ketszinu]', this.formTarget)[0].checked) {
      flags.push('ketszinu');
    }

    if ($('[name=nemrepul]', this.formTarget)[0].checked) {
      flags.push('nemrepul');
    }

    if ($('[name=valtozokoltseg]', this.formTarget)[0].checked) {
      flags.push('valtozokoltseg');
    }

    if (flags.length > 0) {
      keresesData.flags = flags.join(',');
    }

    if (this.hideTiltottMagia) {
      keresesData.hideTiltottMagia = 1;
    }

    if (this.PakliszerkesztoExists()) {
      keresesData.pakliszerkeszto = 1;
    }

    let onlyNotValueFields = {};
    for (let field in keresesData) {
      if (keresesData[field] !== '' && keresesData[field] !== '0') {
        onlyNotValueFields[field] = keresesData[field];
      }
    }
    
    this.CreateLinkFromKeresesData(onlyNotValueFields);
    return onlyNotValueFields;
  }
  
  CreateLinkFromKeresesData(keresesData) {
    if (this.browserHistory === null) {
      return;
    }
    
    let urlBase = 'lapkereso';
    let urlElements = [];
    if (keresesData.szin) { urlElements.push('szin=' + keresesData.szin); }
    if (keresesData.tipus) { urlElements.push('tipus=' + keresesData.tipus); }
    if (keresesData.nev) { urlElements.push('nev=' + keresesData.nev); }
    if (keresesData.kiegeszito) { urlElements.push('kiegeszito=' + keresesData.kiegeszito); }
    if (keresesData.szoveg) { urlElements.push('szoveg=' + keresesData.szoveg); }
    if (keresesData.flavor) { urlElements.push('flavor=' + keresesData.flavor); }
    if (keresesData.flags) { urlElements.push('flags=' + keresesData.flags); }
    if (keresesData.cardFlags) { urlElements.push('cardFlags=' + keresesData.cardFlags); }
    if (keresesData.megjelenes) { urlElements.push('megjelenes=' + keresesData.megjelenes); }
    if (keresesData.gyakorisag) { urlElements.push('gyakorisag=' + keresesData.gyakorisag); }
    if (keresesData.teszteloiLapok) { urlElements.push('teszteloiLapok=' + keresesData.teszteloiLapok); }
    if (keresesData.koltseg) { urlElements.push('koltseg=' + keresesData.koltseg); }
    if (keresesData.grafikus) { urlElements.push('grafikus=' + keresesData.grafikus); }

    if (urlElements.length > 0) {
      let url = urlBase + '/' + urlElements.join('/');
      this.browserHistory.Push(url, 'LapkeresÅ');
    }
  }
  
  SetKeresesCallback(callback) {
    this.keresesCallback = callback;
  }

  RunWithoutCallback() {
    let self = this;
    let keresesData = this.GetKeresesData();
    this.StartKereses(keresesData, function(data) {
      self.ShowKeresesResult(data, keresesData); 
    });
  }
  
  Run() {
    let self = this;
    let keresesData = this.GetKeresesData();
    
    if (Object.keys(keresesData).length === 0) {
      $('#hitsCounter').html('<span class = "text-danger fw-bold">Adj meg legalÃ¡bb egy keresÃ©si feltÃ©telt!</span>');
      return;
    }
    
    this.StartKereses(keresesData, function(data) {
      self.ShowKeresesResult(data, keresesData); 
      if (self.keresesCallback !== null && self.lastKeresesData !== JSON.stringify(self.GetKeresesData())) {
        self.keresesCallback();
        self.lastKeresesData = JSON.stringify(self.GetKeresesData());
      }
    });
  }

  GetEditionsFromSelect(DOMElement) {
    let editions = new Array();
    let editionsFromSelect = this.GetMagicSuggestSelected(DOMElement);
    
    for (let i in editionsFromSelect) {
      let edition = editionsFromSelect[i];
      if (edition in this.extraEditions) {
        for (let p in this.extraEditions[edition].editions) {
          editions.push(this.extraEditions[edition].editions[p]);
        }
      } else {
        editions.push(edition);
      }
    }

    return editions;
  }
  
  GetTipusokFromSelect(DOMElement) {
    let types = new Array();
    let typesFromSelect = this.GetMagicSuggestSelected(DOMElement);
    
    for (let i in typesFromSelect) {
      let type = typesFromSelect[i];
      if (type in this.extraTypes) {
        for (let p in this.extraTypes[type].types) {
          types.push(this.extraTypes[type].types[p]);
        }
      } else {
        types.push(type);
      }
    }

    return types;
  }

  UpdateHitCounter(hitCount) {
    let szukitsdJobban = hitCount >= 1000 ? ' (szÅ±kÃ­tsd jobban a keresÃ©si feltÃ©teleket!)' : '';
    $('#hitsCounter').html(hitCount + ' kÃ¡rtya felelt meg a beÃ¡llÃ­tott feltÃ©teleknek.' + szukitsdJobban);
    $('<span>', {'id': 'additionalCounterInfo', 'class': 'fw-bold'}).appendTo($('#hitsCounter'));
  }
  
  CopyToClipboard() {
    let cardNames = new Array();
    for (let c in this.cards) {
      cardNames.push(this.cards[c].name);
    }
    let text = cardNames.join("\n");
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('A talÃ¡lati eredmÃ©nyeket a vÃ¡gÃ³lapra mÃ¡soltuk');
      })
      .catch((err) => {
        alert('VÃ¡gÃ³lapra mÃ¡solÃ¡s sikertelen!');
      });
  }
  
  ShowKeresesResult(data, callInfo) {
    this.cards = [];
    for (let i in data.cards) {
      let card = data.cards[i];
      if (this.hiddenCardIDs.indexOf(card.ID) === -1) {
        this.cards.push(card);
      }
    }
    this.UpdateHitCounter(this.cards.length);
    this.ShowSortedCards();

    behoDebugger.ProcessCallDebugInfo(data, 'LapkeresoAPI: ' + JSON.stringify(callInfo));
  }
  
  StartKereses(keresesData, callback) {
    this.cardsImageDrawer.SetFlagsForShow(keresesData.flags);
    this.cardsImageDrawer.SetShowedKiadas(keresesData.kiegeszito);
    
    let parameters = {
      'type': 'get',      
      'url': 'lapkereso/kereses',
      'data': keresesData,
      'dataType': "json"
    };
    this.API.CallAuthAPI(parameters, function(data) {
      callback(data);
    });
    
    /*$.ajax({
      url: 'api/api.php?lapkereso/kereses',
      data: keresesData,
      dataType: "json",
      type: 'get',
      beforeSend: function(xhr) { xhr.setRequestHeader("Authorization", localStorage.behoSession); },

      success: function(data) {
        callback(data);
      },
      
      error: function() {
        $('<div>',{'class': 'text-danger', 'html': 'A keresÃ©s sikertelen volt, prÃ³bÃ¡lkozz kÃ©sÅbb!'}).appendTo($('#lapkeresoResults'));
      }
    });*/
  }

  CallAPI(parameters) {
    parameters.caller = this;
    let self = this;
    this.API.CallAuthAPI(parameters, function(data, callbackParameters) {
      self.ProcessAPIOutput(data, callbackParameters);
      if (parameters.callback) {
        parameters.callback(data, callbackParameters);
      }
    });
  }

  GetCardsByID(cardIDs, callback) {
    var keresesData = { 'id': cardIDs.join(',')};
    this.StartKereses(keresesData, function(data) { callback(data); });
  }

  BuildKoltseg() {
    var costs = [];

    var costTypes = ['vp', 'szk', 'epito', 'aldozas', 'semmi', 'zanszilank'];
    for (var i in costTypes) {
      var costType = costTypes[i];
      var min = $('[name=' + costType +'min]', this.formTarget).val();
      var max = $('[name=' + costType +'max]', this.formTarget).val();

      if (min !== '' || max !== '') {
        var cost = min + '-' + max + costType;
        costs.push(cost);
      }
    }

    return costs.join(',');
  }
  
  SetView(view, pakliszerkeszto = 0) {
    this.CloseTooltips();
    switch (view) {
      case 'name':
        this.drawer = this.GetDrawer('name');
        this.drawer.SetPaklibaOnClick(this.paklibaOnClick);
        this.drawer.SetKiegeszitobeOnClick(this.kiegeszitobeOnClick);
        if (!pakliszerkeszto) {
          this.drawer.SetShowedKiadas(this.GetEditionsFromSelect($('#kiegeszito')));
          this.drawer.SetFlagsForShow(this.GetKeresesData().flags);
        }
        $('.lapkeresoView').removeClass('active');
        $('.lapkeresoViewName').addClass('active');
        break;
      case 'image':
        this.drawer = this.GetDrawer('image');
        this.drawer.SetPaklibaOnClick(this.paklibaOnClick);
        this.drawer.SetKiegeszitobeOnClick(this.kiegeszitobeOnClick);
        $('.lapkeresoView').removeClass('active');
        $('.lapkeresoViewCard').addClass('active');
        break;
      case 'groupColor':
        $('.lapkeresoGroup').removeClass('active');
        if (this.grouper instanceof CardsColorGrouper) {
          this.grouper = new CardsGrouper();
        } else {
          this.grouper = new CardsColorGrouper(this.colors);
          $('.lapkeresoGroupColor').addClass('active');
        }
        break;
      case 'groupType':
        $('.lapkeresoGroup').removeClass('active');
        if (this.grouper instanceof CardsTypeGrouper) {
          this.grouper = new CardsGrouper();
        } else {
          this.grouper = new CardsTypeGrouper(this.types);
          $('.lapkeresoGroupType').addClass('active');          
        }
        break;
      case 'groupEdition':
        $('.lapkeresoGroup').removeClass('active');
        if (this.grouper instanceof CardsEditionGrouper) {
          this.grouper = new CardsGrouper();
        } else {
          this.grouper = new CardsEditionGrouper(this.editions);
          $('.lapkeresoGroupEdition').addClass('active');
        }
        break;
    }
    this.ShowCards($(this.resultTarget));
  }
  
  GetDrawer(drawerType) {
    this.InitCardsImageDrawerMaker();
    if (drawerType in this.drawers) {
      return this.drawers[drawerType];
    } else {
      if (drawerType === 'name') {
        this.drawers[drawerType] = new CardsNameDrawer();
      } else if (drawerType === 'image') {
        this.drawers[drawerType] = this.cardsImageDrawer;
      }
      
      this.drawers[drawerType].SetPaklibaOnClick(this.paklibaOnClick);
      this.drawers[drawerType].SetKiegeszitobeOnClick(this.kiegeszitobeOnClick);

      return this.drawers[drawerType];
    }
  }
  
  InitCardsImageDrawerMaker() {
    this.cardsImageDrawer = new CardsImageDrawer();
    if (this.fromLinkData && this.fromLinkData.kiegeszito && this.fromLinkData.kiegeszito === "245") {
      this.cardsImageDrawer.SetForceShowMasodlagosImages(1, parseInt(this.fromLinkData.kiegeszito));
    }
    return this.cardsImageDrawer;
  }
  
  SetNameDrawerCardClass(callback) {
    this.drawers['name'].cardClass = callback;
  }
  
  RecheckDrawedCardNameClass(card) {
    let cardClass = this.drawers['name'].cardClass(card);
    if (cardClass === '') {
      $('#lapkeresoCard_' + card.ID).removeClass('existsInDeck');
    } else {
      $('#lapkeresoCard_' + card.ID).addClass('existsInDeck');
    }
  }
  
  SetSortBy(sortType) {
    switch (sortType) {
      case 'name':
        this.sortFunction = this.sortFunction.name === this.SortByName.name ? this.SortByNameDesc : this.SortByName;
        $('.lapkeresoSortName').toggleClass('active');
        break;
    }
    this.ShowSortedCards();
  }

  ShowSortedCards() {
    var sortFunction = this.sortFunction;
    this.cards.sort(function(a, b) {return sortFunction(a, b);});
    this.ShowCards($(this.resultTarget));
  }
  
  SortByName(a, b) { return a.name.localeCompare(b.name); }
  SortByNameDesc(a, b) { return b.name.localeCompare(a.name); }
  
  ShowCards(target) {
    $(target).html('');
    var groups = this.grouper.GetGroups(this.cards);
    for (var i in groups) {
      var groupID = 'group' + i;
      var groupBackground = $('<div>', {'class' : 'p-0 lapkeresoGroup lapkeresoGroup' + groups[i].name}).appendTo(target);
      if (groups[i].name !== '') {
        var groupName = groups[i].name + ' (' + groups[i].cards.length +' db)';
        $("<h4>", {'data-bs-toggle' : 'collapse', 'data-bs-target': '#' + groupID, 'html': groupName}).appendTo(groupBackground);
      }
      var group = $('<div>', {'id': groupID, 'class' : 'collapse show multi-collapse'}).appendTo(groupBackground);
      this.drawer.ShowCards(groups[i].cards, group);
    }
  }
  
  HideTiltottMagiaCards(hide = false) { this.hideTiltottMagia = hide; }
  
  ResetFields() {
    if (!this.formTarget || this.formTarget.length === 0) {
      this.formTarget = $('#lapkeresoForm');
    }
    let ujnemzedekChecked = $('#ujnemzedek', this.formTarget)[0].checked;
    let teszteloiLapokChecked = $('#teszteloiLapok', this.formTarget)[0].checked;
    $(this.formTarget).trigger('reset');
    $('#szin', this.formTarget).magicSuggest().clear();    
    $('#tipus', this.formTarget).magicSuggest().clear();
    $('#altipus', this.formTarget).magicSuggest().clear();
    $('#jelek', this.formTarget).magicSuggest().clear();
    $('#funkcio', this.formTarget).magicSuggest().clear();
    $('#kiegeszito', this.formTarget).magicSuggest().clear();
    $('#grafikus', this.formTarget).magicSuggest().clear();
    $('#ujnemzedek', this.formTarget)[0].checked = ujnemzedekChecked;
    $('#teszteloiLapok', this.formTarget)[0].checked = teszteloiLapokChecked;
  }
  
  ResetShowedCards() {
    this.ResetFields();
    $('#hitsCounter').html('');
    this.cards = {};
    this.ShowCards($(this.resultTarget));
  }
  
  ToggleUnimportant() {
    $('.hideIfUnimportant', this.formTarget).toggleClass("visually-hidden");
    $('#nezetToggleButton').val($('.hideIfUnimportant', this.formTarget).hasClass("visually-hidden") ? 'RÃ©szletes keresÅ' : 'EgyszerÅ± keresÅ')
  }
  
  CloseTooltips() {
    if (this.drawer) {
      this.drawer.CloseTooltip();
    }
  }
  
  DisableUjnemzedekAndSetTo(value = true) {
    $('#ujnemzedek', this.formTarget)[0].checked = value;
    $('#ujnemzedek', this.formTarget).attr('disabled', value);
  }
  
  EnableUjnemzedekAndSetTo(value = false) {
    $('#ujnemzedek', this.formTarget)[0].checked = value;
    $('#ujnemzedek', this.formTarget).attr('disabled', value);
  }
  
  DisableTeszteloiLapokAndSetTo(value = true) {
    $('#teszteloiLapok', this.formTarget)[0].checked = value;
    $('#teszteloiLapok', this.formTarget).attr('disabled', value);
  }
  
  EnableTeszteloiLapokAndSetTo(value = false) {
    $('#teszteloiLapok', this.formTarget)[0].checked = value;
    $('#teszteloiLapok', this.formTarget).attr('disabled', value);
  }

  EnableRetroAndSetTo(value = false) {
    $('#retro', this.formTarget)[0].checked = value;
    $('#retro', this.formTarget).attr('disabled', value);
  }

  SetState(elements) {
    let keresesTypes = ['szin','kiegeszito','grafikus','tipus','flags','cardFlags','nev','szoveg','flavor','megjelenes','gyakorisag', 'teszteloiLapok'];
    let keresesElements = {};
    for (let i in elements) {
      let parameter = elements[i].split('=');
      if (keresesTypes.indexOf(parameter[0]) !== -1) {
        keresesElements[parameter[0]] = parameter[1];
      }
    }
    this.SetFieldsValue(keresesElements);
  }
}

class CardsGrouper {
  elements = [];
  groups = [];
  backgrounds = {
    'Fairlight': 'yellow',
    'Tharr': 'brown',
    'Sheran': 'darkgreen',
    'Elenios': 'cyan',
    'Raia': 'lightgrey',
    'Dornodon': 'red',
    'Leah': 'black',
    'Chara-din': 'purple',
    'Bufa': 'orange',
    'Nincs': 'white',
    'SzÃ­ntelen': 'gray',
    'Rhatt': 'lightgreen'
  };
  
  constructor(elements = {}) {
    this.elements = Object.keys(elements).map(key => elements[key]);
  }

  GetGroups(cards) {
    this.groups = [];
    
    for (var i in cards) {
      this.AddCardGroup(cards[i]);
    }

    return this.groups;
  }
  
  AddCardGroup(card) {
    if (!this.groups[1]) {
      this.groups[1] = {'name' : '', 'cards' : [] };
    }
    this.groups[1].cards.push(card);
  }
}

class CardsTypeGrouper extends CardsGrouper {
  AddCardGroup(card) {
    var color = card.color[0];
    for (var t in card.type) {
      var type = card.type[t];
      if (this.elements.indexOf(type) === -1) {
        continue;
      }
      if (!this.groups[type]) {
        this.groups[type] = {'name' : type, 'background': this.backgrounds[color], 'cards' : [] };
      }
      this.groups[type].cards.push(card);
    }
  }
};

class CardsEditionGrouper extends CardsGrouper  {
  constructor(elements) {
    super();
    this.elements = elements;
  }

  AddCardGroup(card) {
    var color = card.color[0];
    var lastEditionIndex = card.editions.length - 1;
    var edition = card.editions[lastEditionIndex];
    if (!this.elements[edition] && lastEditionIndex > 0) {
      edition = card.editions[lastEditionIndex - 1];
    }
    
    if (!this.elements[edition]) {
      return;
    }
    if (!this.groups[edition]) {
      this.groups[edition] = {'name' : this.elements[edition].nev, 'background': this.backgrounds[color], 'cards' : [] };
    }
    this.groups[edition].cards.push(card);
  }
}

class CardsColorGrouper extends CardsGrouper  {
  AddCardGroup(card) {
    var color = card.color[0];
    var colorIndex = this.elements.indexOf(color);
    if (!this.groups[colorIndex]) {
      this.groups[colorIndex] = {'name' : this.elements[colorIndex], 'background': this.backgrounds[color], 'cards' : [] };
    }
    this.groups[colorIndex].cards.push(card);
  }
};

class ForcedMasodlagosImageCards {
  static cardMasoglagosImages = {
    247: { 12:1, 17:1, 21:1, 31:1, 33:1, 43:1, 61:1, 75:1, 84:1, 104:1, 133:1, 201:1, 236:1, 269:1, 271:1, 277:1, 292:1, 312:1, 314:1, 327:1, 345:1, 351:1, 352:1, 
359:1, 369:1, 370:1, 371:1, 373:1, 374:1, 379:1, 386:1, 398:1, 402:1, 420:1, 422:1, 425:1, 430:1, 437:1, 439:1, 440:1, 441:1, 442:1, 446:1, 447:1, 450:1, 451:1, 452:1, 459:1, 460:1, 465:1, 470:1, 473:1, 
481:1, 488:1, 489:1, 490:1, 493:1, 511:1, 523:1, 524:1, 530:1, 531:2, 532:1, 535:1, 539:1, 545:1, 549:1, 552:1, 559:1, 562:1, 563:1, 564:1, 565:2, 567:1, 571:1, 573:1, 576:1, 584:1, 
593:1, 595:1, 635:1, 650:1, 655:1, 663:1, 665:1, 667:1, 685:1, 692:1, 702:1, 707:1, 709:1, 720:1, 738:1, 747:1, 767:1, 796:1, 808:1, 882:1, 884:1, 885:1, 886:1, 893:1, 896:1, 897:1, 900:1, 905:1, 908:1, 909:1, 915:2, 922:1, 924:1, 926:1, 927:1, 929:1, 931:1, 948:1, 954:1, 958:1, 960:1, 965:1, 
971:1, 974:1, 977:1, 980:1, 981:1, 982:1, 986:1, 992:1, 998:1, 1001:1, 1002:1, 1004:1, 1007:1, 1012:1, 1013:1, 1014:1, 1024:1, 1029:1, 1035:2, 1042:1, 1050:1, 1052:1, 1055:1, 1056:1, 
1068:1, 1070:1, 1077:1, 1101:1, 1160:1, 1163:1, 1209:1, 1212:1, 1227:1, 1243:1, 1246:1, 1248:1, 1250:1, 1251:1, 1252:1, 1257:1, 1262:1, 1263:1, 1276:1, 1279:1, 1311:1, 1316:1, 1321:1, 
1326:1, 1330:1, 1336:1, 1340:1, 1348:1, 1356:1, 1357:1, 1361:1, 1367:1, 1372:1, 1387:1, 1396:1, 1420:1, 1427:1, 1430:1, 1471:1, 1475:1, 1478:1, 1505:1, 1516:1, 1520:1, 1532:1, 1533:1, 
1536:1, 1538:1, 1542:1, 1544:1, 1545:1, 1548:1, 1557:1, 1560:1, 1561:1, 1565:1, 1570:1, 1571:1, 1572:1, 1597:2, 1604:1, 1612:1, 1617:1, 1620:1, 1628:1, 1644:1, 1646:1, 1649:1, 1651:1, 
1656:1, 1658:1, 1659:1, 1663:1, 1666:1, 1674:1, 1689:1, 1701:1, 1702:1, 1706:1, 1707:1, 1710:1, 1716:1, 1719:1, 1722:1, 1724:1, 1727:1, 1729:1, 1732:1, 1733:1, 1734:1, 1735:1, 1744:1, 1750:1, 1754:1, 1757:1, 1762:1, 1763:1, 1765:1, 1766:1, 1770:1, 
1772:1, 1774:1, 1775:1, 1782:1, 1785:1, 1797:1, 1800:1, 1805:1, 1806:1, 1808:1, 1811:1, 1813:1, 1815:1, 1816:1, 1818:1, 1819:1, 1822:1, 1825:1, 1828:1, 1834:1, 1838:1,1840:1, 1842:1, 
1843:1, 1846:1, 1848:1, 1850:1, 1851:1, 1853:2, 1857:1, 1866:1, 1867:1, 1870:2, 1872:1, 1877:1, 1881:1, 1882:1, 1885:1, 1889:1, 1914:1, 1940:1, 1962:1, 1996:1, 2005:1, 2041:1, 3329:1 },
    237: {1601: 1, 1193: 1, 9150: 1, 7644: 1},
    264: {8950: 1, 8562: 1, 11434: 1}
  };
}

class CardsDrawer {
  static showTypes = {
    NORMAL: 0,
    FULLART: 2,
    GOLD: 3
  };
  
  type = '';
  paklibaOnClick = null;
  kiegeszitobeOnClick = null;
  showedTooltip = null;
  animationTarget = null;
  maxShowedCards = 1000;
  forceShowMasodlagosImages = 0;
  forceVednokKiadas = 0;
  showedKiadas = 0;
  showedType = 0;
  retro = 0;
  
  SetPaklibaOnClick(onClick) { this.paklibaOnClick = onClick; }
  SetKiegeszitobeOnClick(onClick) { this.kiegeszitobeOnClick = onClick; }
  
  PakliszerkesztoExists() { return typeof(pakliszerkeszto) !== 'undefined'; }
  StartFadeAnimation(ev, card) {
    let originalImage = $(ev.target).is('img') ? ev.target : $('.tooltip img');
    let originalPosition = $(originalImage).offset();
    if (IsMobile()) {
      originalPosition = $(originalImage).position();
    }

    let imgSrc = CardsDrawer.CardImagePath(card);

    let top = originalPosition.top - $(originalImage).height();
    let left = originalPosition.left;
    let imgStyle = 'top:'+top+'px;left:'+left+'px;';
    let animationTarget = $('<img>', {'class': 'position-fixed', 'height': $(originalImage).height()+'px', 'src': imgSrc, 'style': imgStyle}).appendTo(document.body);
    let animationParams = { opacity: 0.25, left: 0, "top": 0, width: "10%" };
    if (IsMobile()) {
      animationParams.top = $(window).height();
    }

    $(animationTarget).animate(animationParams, 500, function() { 
      $(animationTarget).remove(); 
    });
  }
  
  SetForceShowMasodlagosImages(val, vednokKiadas = 0) { 
    this.forceShowMasodlagosImages = val; 
    this.forceVednokKiadas = vednokKiadas;
  }
  
  SetFlagsForShow(flags) {
    // 2025.12.08: sajÃ¡tgÃ©pen ez vmiÃ©rt ki volt kommentelve
    this.showedType = CardsDrawer.showTypes.NORMAL;
    this.retro = 0;
    if (typeof(flags) == 'undefined') {
      return;
    }
    if (flags.indexOf('vanFullart') !== -1 && flags.indexOf('vanGold') === -1) {
      this.showedType = CardsDrawer.showTypes.FULLART;
    } else if (flags.indexOf('vanGold') !== -1) {
      this.showedType = CardsDrawer.showTypes.GOLD;
    }
    this.retro = flags.indexOf('retro') !== -1;
  }
  
  SetShowedKiadas(kiadas) { 
    this.showedKiadas = kiadas; 
  }
  
  AddOnClickTo(imgParams, card) {
    if (this.paklibaOnClick !== null) {
      var self = this;
      
      imgParams['mouseup'] = function(e) {
        if (e.button === 1) {
          e.preventDefault();
        }
      };

      imgParams['click'] = function(ev) {
        ev.preventDefault();
        if (self.PakliszerkesztoExists()) {
          self.StartFadeAnimation(ev, card);
        }
        self.paklibaOnClick(card, ev); 
      };
    }
  }
  
  static CardImagePath(card, masodlagos = 0, vednokKiadas = 0, onlyShowedKiadas = 0, retro = 0) {
    if (card.teszteloiLap) {
      return 'pic/hkk_hatlap.jpg';
    }
    
    let cardImagePath = 'HKKCardImage.php?cardID=' + card.ID;
    if (ForcedMasodlagosImageCards.cardMasoglagosImages[onlyShowedKiadas] && ForcedMasodlagosImageCards.cardMasoglagosImages[onlyShowedKiadas][card.ID]) {
      cardImagePath += '&masodlagos=' + ForcedMasodlagosImageCards.cardMasoglagosImages[onlyShowedKiadas][card.ID];
    } else if (masodlagos > 0) {
      cardImagePath += '&masodlagos=1';
    }
    if (vednokKiadas > 0) {
      cardImagePath += '&vednokKiadas='+vednokKiadas;
    }

    if (retro) {
      cardImagePath += '&retro=1';
    }
    if (onlyShowedKiadas) {
      cardImagePath += '&showedKiadas=' + onlyShowedKiadas;
    }
    if (beholderAPI.behoCK.length > 0) {
      cardImagePath += '&behoCK=' + beholderAPI.behoCK;
    }
    return cardImagePath;
  }
  
  ShowCards(cards, target) {
    let showedCards = 0;
    for (var i in cards) {
      if (i % this.colNum === 0) {
        var row = $("<div>", {'class':'row'}).appendTo(target);      
      }
      this.AppendCardTo(cards[i], row);
      if (++showedCards >= this.maxShowedCards) {
        break;
      }
    }
    
    $('#additionalCounterInfo').html('');
    if (this.type === 'image' && showedCards === this.maxShowedCards) {
      $('#additionalCounterInfo').html('KÃ©pmegjelenÃ­tÅ nÃ©zetben csak ' + showedCards + ' kÃ¡rtya jelenik meg!');
    }

    this.AddEmptyColsToRowEnd(row, showedCards);
  }
  
  AddEmptyColsToRowEnd(row, cardsLength) {
    var remainingCols = (this.colNum - cardsLength % this.colNum) % this.colNum;
    for (var i = 0; i < remainingCols; i++) {
      $("<div>", {'class':'col'}).appendTo(row);
    }
  }
  
  AddTooltip(target, card) {
    $(target).attr('data-bs-toggle', 'tooltip');
    $(target).attr('data-bs-html', 'true');
    $(target).attr('data-bs-placement', 'right');
    
    let masodlagos = this.forceShowMasodlagosImages || this.showedType === CardsDrawer.showTypes.GOLD || this.showedType === CardsDrawer.showTypes.FULLART;
    let content = '<img src = \"' + CardsDrawer.CardImagePath(card, masodlagos, this.forceVednokKiadas, this.showedKiadas, this.retro) + '\"/>';
    if (card.teszteloiLap) {
      let cardDOM = $("<div>");
      $('<img>', {'src': CardsDrawer.CardImagePath(card, this.forceShowMasodlagosImages, this.forceVednokKiadas, this.showedKiadas, this.retro)}).appendTo(cardDOM);
      CardsImageDrawer.AddTeszteloiLapInfo(cardDOM, card);
      content = '<div class = "HKKCard tooltipCard">'+cardDOM.html()+'</div>';
    }
      
    if (IsMobile()) {
      $(target).attr('data-bs-trigger', 'manual');    
      if (this.paklibaOnClick !== null) {
        content += '<div class = "row">'+
          '<div class = "col-5"><div class="AddPakliba btn m-1 btn-sm btn-primary">Pakliba</div></div>'+
          '<div class = "col-5"><div class="AddKiegeszitobe btn m-1 btn-sm btn-danger">KiegÃ©szÃ­tÅbe</div></div>'+
          '</div>';
      }
    }
    
    $(target).attr('data-bs-title', content);
    $(target).tooltip();
    
    if (!IsMobile()) {
      $(target).hover(function(){
        $('.tooltip').hide();
      });
    }
  }
  
  AddTooltipParamsTo(params, card) {
    let drawer = this;
    params['click'] = function() {
      let tooltip = this;
      $(this).tooltip("show");
      $('.tooltip img').on('click',function() { drawer.CloseTooltip(); });
      $('.tooltip .AddPakliba').on('click',function(ev) { 
        drawer.StartFadeAnimation(ev, card);
        drawer.paklibaOnClick(card);
        $(tooltip).tooltip("hide");
      });
      $('.tooltip .AddKiegeszitobe').on('click',function(ev) { 
        drawer.StartFadeAnimation(ev, card);
        drawer.kiegeszitobeOnClick(card);
        $(tooltip).tooltip("hide");
      });
      if (drawer.showedTooltip && drawer.showedTooltip !== this) {
        drawer.CloseTooltip();
      }
      drawer.showedTooltip = this;
    };
  }
  
  CloseTooltip() {
    if ($(this.showedTooltip).tooltip) {
      $(this.showedTooltip).tooltip("hide"); 
    }
    this.showedTooltip = null;
  }
}

class CardsNameDrawer extends CardsDrawer {
  type = 'name';
  cardClass = null;
  
  constructor() {
    super();
    this.cardClass = function() { return ''; };
    this.colNum = IsMobile() ? 2 : 4;
  }
  
  AppendCardTo(card, row) {
    let cardDOM = $("<a>", {'class':'col'}).appendTo(row);
    let nameParams = {'id':'lapkeresoCard_'+card.ID, 'class' : 'h-100 cardName ' + this.cardClass(card), 'html': card.name};
    
    if (this.showedKiadas == 0) {
      this.showedKiadas = 9999;
    }
    if (IsMobile() && this.PakliszerkesztoExists()) {
      this.AddTooltipParamsTo(nameParams, card);
      var c = $('<div>', nameParams).appendTo(cardDOM);
      this.AddTooltip(c, card);
    } else {
      this.AddOnClickTo(nameParams, card);
       
      var c = $('<div>', nameParams).appendTo(cardDOM);
      this.AddTooltip(c, card);
    }
  }
};

class CardsImageDrawer extends CardsDrawer {
  type = 'image';
  colNum = 3;
  maxShowedCards = 200;
  commonnesses = {'common': 'gyakori', 'uncommon': 'nem gyakori', 'rare': 'ritka', 'ultraRare' : 'ultra ritka'};
  
  AppendCardTo(card, row) {
    let cardDOM = $("<a>", {'class':'HKKCard m-1 col'}).appendTo(row);
    let onlyShowedKiadas = this.showedKiadas;
    if (!onlyShowedKiadas && card.editions.length == 1) {
      onlyShowedKiadas = card.editions[0];
    }
    let masodlagos = this.forceShowMasodlagosImages || this.showedType == CardsDrawer.showTypes.GOLD || this.showedType == CardsDrawer.showTypes.FULLART;
    let imgParams = {'data-src' : CardsDrawer.CardImagePath(card, masodlagos, this.forceVednokKiadas, onlyShowedKiadas, this.retro), 'title': this.GetCardTitle(card)};
    
    if (IsMobile() && this.PakliszerkesztoExists()) {
      this.AddTooltipParamsTo(imgParams, card);
      let img = this.CreateImage(cardDOM, imgParams);
      this.AddTooltip(img, card);
    } else {
      this.AddOnClickTo(imgParams, card);
      imgParams.href = 'lap/' + card.link + '/' + card.ID;
      this.CreateImage(cardDOM, imgParams);
      if (card.teszteloiLap) {
        CardsImageDrawer.AddTeszteloiLapInfo(cardDOM, card);
      }
    }
  }
  
  static AddTeszteloiLapInfo(target, card) {
    let info = $('<div>', {'class': 'teszteloiLap'}).appendTo(target);
    $('<div>', {'class': 'nev', 'html': card.name}).appendTo(info);
    let reak = card.type.indexOf('reakciÃ³ drÃ¡gÃ­tÃ¡s');
    if (reak != -1) {
      card.type.splice(reak, 1);
    }
    $('<div>', {'class': 'tipus', 'html': card.type.join(', ')}).appendTo(info);
    $('<div>', {'class': 'leiras', 'html': card.text}).appendTo(info);
    
    if (card.color[1] === 'Nincs') {
      card.color = [card.color[0]];
    }
    info.addClass('teszteloiLap'+card.color.join('-'));
    
    let isTargy = (card.type.indexOf('TÃ¡rgy') != -1);
    if (card.type.indexOf('KÃ¶vetÅ') != -1 || card.type.indexOf('SzabÃ¡lylap') != -1) {
      info.addClass('teszteloiLapNarancs');
    }
    $('<div>', {'class': 'szin', 'html': card.color.join(', ')}).appendTo(info);
    
    if (card.idezesiKoltseg.vp == '-') {
      return;
    }
    
    let idezesiKoltseg = $('<div>', {'class': 'idezesiKoltseg'}).appendTo(info);
    let semmi = card.idezesiKoltseg.semmi ? parseInt(card.idezesiKoltseg.semmi) : 0;
    
    let kellVPBlock = true;
    let kellEpitoBlock = true;
    if (card.idezesiKoltseg.vp == 0 && parseInt(card.idezesiKoltseg.zanszilank) + semmi + parseInt(card.idezesiKoltseg.szk) > 0) {
      kellVPBlock = false;
    }
    if ((card.type.indexOf('ÃpÃ­tmÃ©ny') != -1 || card.type.indexOf('SzÃ¶rny') != -1|| card.type.indexOf('BÅ±bÃ¡j') != -1) && card.idezesiKoltseg.vp == 0 && parseInt(card.idezesiKoltseg.zanszilank) != 0) {
      kellVPBlock = false;
    }
    if ((card.type.indexOf('ÃpÃ­tmÃ©ny') != -1) && card.idezesiKoltseg.epito == 0) {
      kellEpitoBlock = false;
    }
    if (card.type.indexOf('ÃpÃ­tmÃ©ny') == -1 && card.type.indexOf('TÃ¡rgy') == -1 && kellVPBlock) {
      let vp = $('<div>', {'class': 'VP'}).appendTo(idezesiKoltseg);
      $('<div>', {'class': 'back', 'html': '@'}).appendTo(vp);
      $('<div>', {'class': 'front', 'html': ':'}).appendTo(vp);
      $('<div>', {'class': 'value', 'html': card.idezesiKoltseg.vp}).appendTo(vp);
    }
    if (card.type.indexOf('ÃpÃ­tmÃ©ny') != -1 && kellEpitoBlock) {
      let epito = $('<div>', {'class': 'epito'}).appendTo(idezesiKoltseg);
      $('<div>', {'class': 'back', 'html': 'e'}).appendTo(epito);
      $('<div>', {'class': 'front', 'html': 'E'}).appendTo(epito);
      $('<div>', {'class': 'value', 'html': card.idezesiKoltseg.epito}).appendTo(epito);
    }

    if (card.idezesiKoltseg.zanszilank != '0') {
      let zanszilank = $('<div>', {'class': 'zanszilank'}).appendTo(idezesiKoltseg);
      $('<div>', {'class': 'back', 'html': '@'}).appendTo(zanszilank);
      $('<div>', {'class': 'front', 'html': ':'}).appendTo(zanszilank);
      $('<div>', {'class': 'value', 'html': card.idezesiKoltseg.zanszilank}).appendTo(zanszilank);
    }
    
    if (card.idezesiKoltseg.semmi !== '0' && card.idezesiKoltseg.semmi !== '') {
      let nekron = $('<div>', {'class': 'nekron'}).appendTo(idezesiKoltseg);
      $('<div>', {'class': 'back', 'html': 'p'}).appendTo(nekron);
      $('<div>', {'class': 'front', 'html': 'L'}).appendTo(nekron);
      $('<div>', {'class': 'value', 'html': card.idezesiKoltseg.semmi}).appendTo(nekron);
    }
    
    if (card.idezesiKoltseg.aldozas > 0) {
      let aldozas = $('<div>', {'class': 'nekron'}).appendTo(idezesiKoltseg);
      $('<div>', {'class': 'back', 'html': 'c'}).appendTo(aldozas);
      $('<div>', {'class': 'front', 'html': 'C'}).appendTo(aldozas);
      $('<div>', {'class': 'value', 'html': card.idezesiKoltseg.aldozas}).appendTo(aldozas);
    }
    if (card.idezesiKoltseg.szk && isTargy) {
      if (card.idezesiKoltseg.szk == 0 && card.idezesiKoltseg.vp != 0) {
        card.idezesiKoltseg.szk = card.idezesiKoltseg.vp;
      }
      if ((card.idezesiKoltseg.aldozas == 0 && card.idezesiKoltseg.zanszilank == 0 && card.idezesiKoltseg.semmi == 0) || card.idezesiKoltseg.szk !== '0') {
        let szk = $('<div>', {'class': 'szk'}).appendTo(idezesiKoltseg);
        $('<div>', {'class': 'back', 'html': 's'}).appendTo(szk);
        $('<div>', {'class': 'front', 'html': 'S'}).appendTo(szk);
        $('<div>', {'class': 'value', 'html': card.idezesiKoltseg.szk}).appendTo(szk);
      }
    }


    let kozepIkonok = $('<div>', {'class': 'kozepIkonok'}).appendTo(info);
    if (typeof(card.szk) != 'undefined' && card.szk > 0) {
      for (let i = 0; i < card.szk; i++) {
        $('<span>', {'html': '*'}).appendTo(kozepIkonok);
      }
    }
    if (typeof(card.reakciodragitas) != 'undefined' && card.reakciodragitas != '') {
      let dragitasIcons = {'x-1':'â', 'x': 'Ã', '2': 'Ã', '1': 'Ã', '3': 'Ã'};
      $('<span>', {'html': dragitasIcons[card.reakciodragitas]}).appendTo(kozepIkonok);
    }
    if (typeof(card.tamadas) == 'undefined') {
      let creatureTypes = ['KalandozÃ³','SzÃ¶rny','AvatÃ¡r','Galetki', 'TorzszÃ¼lÃ¶tt'];
      for (let i in card.type) {
        if (creatureTypes.indexOf(card.type[i]) != -1) {
          card.tamadas = '0';
          break;
        }
      }
    }
    if (typeof(card.tamadas) != 'undefined' && card.tamadas != '-') {
      let tamadas = $('<div>', {'class': 'tamadas'}).appendTo(info);
      if (card.tamadas.indexOf('*') !== -1) {
        tamadas.addClass('magikus');
      }
      $('<div>', {'class': 'back', 'html': 'b'}).appendTo(tamadas);
      $('<div>', {'class': 'front', 'html': 'B'}).appendTo(tamadas);
      let tamadasValue = card.tamadas.replace('*', '');
      $('<div>', {'class': 'value', 'html': tamadasValue}).appendTo(tamadas);
    }

    if (card.vedekezes && card.vedekezes != '-') {
      let vedekezes = $('<div>', {'class': 'vedekezes'}).appendTo(info);
      if (card.vedekezes.indexOf('*') !== -1) {
        vedekezes.addClass('magikus');
      }
      $('<div>', {'class': 'back', 'html': 'a'}).appendTo(vedekezes);
      $('<div>', {'class': 'front', 'html': 'A'}).appendTo(vedekezes);
      let vedekezesValue = card.vedekezes.replace('*', '');
      $('<div>', {'class': 'value', 'html': vedekezesValue}).appendTo(vedekezes);
    }
  }
  
  CreateImage(target, imageParams) {
    let link = $('<a>', {'href': imageParams.href}).appendTo(target);
    let img = $("<img>", imageParams).appendTo(link);
    $(img).lazy();
    
    return img;
  }
  
  GetCardTitle(card) {
    let cardEditions = [];
    for (let i in card.editions) {
      let e = card.editions[i];
      if (lapkereso.editions[e]) {
        cardEditions.push(lapkereso.editions[e].nev);
      }
    }
    return "KiadÃ¡s: " + cardEditions.join(',') + "\nGyakorisÃ¡g: " + this.commonnesses[card.commonness];
  }
};
