//
const unit = document.getElementById ('unihan-inspector-unit');
//
const unihanInput = unit.querySelector ('.unihan-input');
const lookupButton = unit.querySelector ('.lookup-button');
const randomButton = unit.querySelector ('.random-button');
const randomSetSelect = unit.querySelector ('.random-set-select');
const infoContainer = unit.querySelector ('.info-container');
//
const instructions = unit.querySelector ('.instructions');
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
let currentTypefaceLanguage;
//
const unihanHistorySize = 256;   // 0: unlimited
//
let unihanHistory = [ ];
let unihanHistoryIndex = -1;
let unihanHistorySave = null;
//
let currentUnihanCharacter;
//
let showCategories;
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    //
    const linksList = require ('../../lib/links-list.js');
    //
    const regexp = require ('../../lib/unicode/regexp.js');
    const unicode = require ('../../lib/unicode/unicode.js');
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
    const numericValuesData = require ('../../lib/unicode/parsed-numeric-values-data.js');
    const compatibilityVariants = require ('../../lib/unicode/get-cjk-compatibility-variants.js');
    const getCompatibilitySource = require ('../../lib/unicode/get-cjk-compatibility-source.js');
    const japaneseVariants = require ('../../lib/unicode/parsed-japanese-variants-data.js');
    const yasuokaVariants = require ('../../lib/unicode/parsed-yasuoka-variants-data.js');
    const kangxiRadicals = require ('../../lib/unicode/kangxi-radicals.json');
    const { fromRSValue } = require ('../../lib/unicode/get-rs-strings.js');
    //
    const defaultPrefs =
    {
        unihanHistory: [ ],
        unihanCharacter: "",
        typefaceLanguage: "",
        randomSetSelect: "",
        showCategories: false,
        instructions: true,
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    unihanHistory = prefs.unihanHistory;
    //
    randomSetSelect.value = prefs.randomSetSelect;
    if (randomSetSelect.selectedIndex < 0) // -1: no element is selected
    {
        randomSetSelect.selectedIndex = 0;
    }
    //
    showCategories = prefs.showCategories;
    //
    const defaultFontSize = 72;
    //
    const cjkBlankFont = `${defaultFontSize}px "Sans CJK JP", "Sans CJK KR", "Sans CJK SC", "Sans CJK TC", "Sans CJK HK", "Blank"`;
    // const cjkBlankFont = `${defaultFontSize}px "Sans CJK JP", "Sans CJK KR", "Sans CJK SC", "Sans CJK TC", "Sans CJK HK", "Sans CJK MO", "Blank"`;
    //
    let canvas = document.createElement ('canvas');
    canvas.width = defaultFontSize;
    canvas.height = defaultFontSize;
    let ctx = canvas.getContext ('2d');
    ctx.font = cjkBlankFont;
    //
    function isProperlyRendered (string)
    {
        let witdh = Math.round (ctx.measureText (string).width);
        return (witdh > 0) && (witdh <= ctx.canvas.width);
    }
    //
    const languages =
    {
        "ja": { label: "JP", title: "Japanese typeface" },
        "ko": { label: "KR", title: "Korean typeface" },
        "zh-Hans": { label: "SC", title: "Simplified Chinese typeface" },
        "zh-Hant-TW": { label: "TC", title: "Traditional Chinese (Taiwan) typeface" },
        "zh-Hant-HK": { label: "HK", title: "Traditional Chinese (Hong Kong) typeface" },
        // "zh-Hant-MO": { label: "MO", title: "Traditional Chinese (Macao) typeface" }
    };
    const languageKeys = Object.keys (languages);
    //
    currentTypefaceLanguage = prefs.typefaceLanguage;
    if (!languageKeys.includes (currentTypefaceLanguage))
    {
        currentTypefaceLanguage = languageKeys[0];
    }
    //
    function getTooltip (character)
    {
        let data = unicode.getCharacterBasicData (character);
        return `${data.codePoint.replace (/U\+/, "U\u034F\+")}\xA0${character}` + (regexp.isRadical (character) ? " (Radical)" : ""); // U+034F COMBINING GRAPHEME JOINER
    }
    function onLinkClick (event)
    {
        updateUnihanData (event.currentTarget.dataset.char);
    }
    //
    const codePointOrCharacterPattern = '\\b(U\\+[0-9a-fA-F]{4,5})\\b|(.)';
    const codePointOrCharacterRegex = new RegExp (codePointOrCharacterPattern, 'gu');
    //
    function appendTextWithLinks (node, text)
    {
        let matches = text.matchAll (codePointOrCharacterRegex);
        let clickables = [ ];
        for (let match of matches)
        {
            let matched = match[0];
            let index = match.index;
            let lastIndex = index + matched.length;
            let codePoint;
            let char;
            if (match[1])
            {
                codePoint = matched.toUpperCase ();
                char = String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16));
                if (regexp.isUnihan (char) || regexp.isRadical (char))
                {
                    clickables.push ({ type: 'code-point', matched, index, lastIndex, codePoint, char });
                }
            }
            else if (match[2])
            {
                char = matched;
                if (regexp.isUnihan (char) || regexp.isRadical (char))
                {
                    codePoint = unicode.characterToCodePoint (char);
                    clickables.push ({ type: 'char', matched, index, lastIndex, codePoint, char });
                }
            }
        }
        for (let index = clickables.length - 2; index >= 0; index--)
        {
            let current = clickables[index];
            let next = clickables[index + 1];
            if ((current.char === next.char) && (current.type !== next.type) && (text.slice (current.lastIndex, next.index) === " "))
            {
                // Merge into current
                current.type = 'combo';
                current.matched = `${current.matched} ${next.matched}`;
                current.index = current.index;
                current.lastIndex = next.lastIndex;
                // Remove next
                clickables.splice (index + 1, 1);
            }
        }
        let lastIndex = 0;
        for (clickable of clickables)
        {
            node.appendChild (document.createTextNode (text.slice (lastIndex, clickable.index)));
            lastIndex = clickable.lastIndex;
            link = document.createElement ('span');
            link.className = 'unihan-character-link';
            if (clickable.char != currentUnihanCharacter)
            {
                link.classList.add ('clickable');
                link.dataset.char = clickable.char;
                link.addEventListener ('click', onLinkClick);
            }
            link.textContent = clickable.matched;
            link.title = getTooltip (clickable.char);
            node.appendChild (link);
        }
        node.appendChild (document.createTextNode (text.slice (lastIndex, text.length)));
    }
    //
    function appendFields (node, fieldItems)
    {
        for (let fieldItem of fieldItems)
        {
            if (!fieldItem)
            {
                let lineBreak = document.createElement ('br');
                node.appendChild (lineBreak);
            }
            else if (fieldItem.value)
            {
                let field = document.createElement ('div');
                field.className = 'field';
                if (Array.isArray (fieldItem.value))
                {
                    if (fieldItem.value.length > 0)
                    {
                        let name = document.createElement ('span');
                        name.className = 'name';
                        name.textContent = fieldItem.name.replace (/ /g, "\xA0");
                        field.appendChild (name);
                        field.appendChild (document.createTextNode (": "));
                        let value = document.createElement ('span');
                        value.className = 'value';
                        let list = document.createElement ('ul');
                        list.className = 'list';
                        fieldItem.value.forEach
                        (
                            (element, index) =>
                            {
                                let item = document.createElement ('li');
                                item.className = 'item';
                                if (Array.isArray (fieldItem.class))
                                {
                                    let itemClass = fieldItem.class[index];
                                    if (itemClass)
                                    {
                                        item.classList.add (itemClass);
                                    }
                                }
                                appendTextWithLinks (item, element);
                                list.appendChild (item);
                            }
                        );
                        value.appendChild (list);
                        field.appendChild (value);
                    }
                }
                else
                {
                    let name = document.createElement ('span');
                    name.className = 'name';
                    name.textContent = fieldItem.name.replace (/ /g, "\xA0");
                    field.appendChild (name);
                    field.appendChild (document.createTextNode (": "));
                    let value = document.createElement ('span');
                    value.className = 'value';
                    if (fieldItem.tooltip)
                    {
                        value.textContent = fieldItem.value;
                        value.title = fieldItem.tooltip;
                    }
                    else
                    {
                        appendTextWithLinks (value, fieldItem.value);
                    }
                    if (typeof fieldItem.class === 'string')
                    {
                        value.classList.add (fieldItem.class);
                    }
                    field.appendChild (value);
                }
                node.appendChild (field);
            }
        }
    }
    //
    function getCoreSetTooltip (valueString)
    {
        const sources =
        {
            "G": "China",       // "CN"
            "H": "Hong Kong",   // "HK"
            "J": "Japan",       // "JP"
            "K": "South Korea", // "KR"
            "M": "Macao",       // "MO"
            "P": "North Korea", // "KP"
            "T": "Taiwan"       // "TW"
        };
        let priority = valueString.match (/[ABC]/);
        let source = valueString.match (/[GHJKMPT]/g).map (source => sources[source]).sort ().join (", ");
        let properties =
        [
            { "name": "Priority", "value": priority && priority[0] },
            { "name": "Source", "value": source }
        ];
        let tooltip = [ ];
        for (let property of properties)
        {
            if (property.value)
            {
                tooltip.push (`${property.name}:\xA0${property.value}`);
            }
        }
        return tooltip.join ("\n");
    }
    //
    function displayData (character)
    {
        function displayCharacterData (character, codePoint, tags)
        {
            function getVariants (character, variantTag)
            {
                let variants = [ ];
                let codePoint = unicode.characterToCodePoint (character);
                let tags = unihanData.codePoints[codePoint];
                if (tags && (variantTag in tags))
                {
                    let variantArray = tags[variantTag];
                    if (!Array.isArray (variantArray))
                    {
                        variantArray = [ variantArray ];
                    }
                    for (let variant of variantArray)
                    {
                        variant = variant.split ("<")[0];
                        variants.push (String.fromCodePoint (parseInt (variant.replace ("U+", ""), 16)));
                    }
                }
                return variants;
            }
            //
            function getJapaneseVariants (character, variantTag)
            {
                let variants = [ ];
                let codePoint = unicode.characterToCodePoint (character);
                let tags = japaneseVariants[codePoint];
                if (tags && (variantTag in tags))
                {
                    let variantArray = tags[variantTag];
                    if (!Array.isArray (variantArray))
                    {
                        variantArray = [ variantArray ];
                    }
                    for (let variant of variantArray)
                    {
                        variants.push (String.fromCodePoint (parseInt (variant.replace ("U+", ""), 16)));
                    }
                }
                return variants;
            }
            //
            function getYasuokaVariants (character)
            {
                let codePoint = unicode.characterToCodePoint (character);
                let variants = yasuokaVariants[codePoint] || [ ];
                return variants.map (variant => String.fromCodePoint (parseInt (variant.replace ("U+", ""), 16)));
            }
            //
            let characterData = document.createElement ('div');
            characterData.className = 'character-data';
            //
            let unihanCard = document.createElement ('div');
            unihanCard.className = 'unihan-card';
            let unihanWrapper = document.createElement ('div');
            unihanWrapper.className = 'unihan-wrapper';
            let unihanCharacter = document.createElement ('div');
            unihanCharacter.textContent = character;
            unihanCharacter.className = 'unihan-character';
            unihanWrapper.appendChild (unihanCharacter);
            let indexOfUnihanCharacter = unihanHistory.indexOf (unihanCharacter.textContent);
            if (indexOfUnihanCharacter !== -1)
            {
                unihanHistory.splice (indexOfUnihanCharacter, 1);
            }
            unihanHistory.unshift (unihanCharacter.textContent);
            if ((unihanHistorySize > 0) && (unihanHistory.length > unihanHistorySize))
            {
                unihanHistory.pop ();
            }
            unihanHistoryIndex = -1;
            unihanHistorySave = null;
            let filler = document.createElement ('div');
            filler.className = 'filler';
            unihanWrapper.appendChild (filler);
            let unihanCodePoint= document.createElement ('div');
            unihanCodePoint.textContent = codePoint;
            unihanCodePoint.className = 'unihan-code-point';
            unihanWrapper.appendChild (unihanCodePoint);
            unihanCard.appendChild (unihanWrapper);
            let typefaceWidget = document.createElement ('div');
            typefaceWidget.className = 'typeface-widget';
            let typefacePrevious = document.createElement ('span');
            typefacePrevious.className = 'typeface-previous';
            typefacePrevious.innerHTML = '<svg class="previous-icon" viewBox="0 0 10 10"><polygon points="9,0 1,5 9,10"></polygon></svg>'
            typefaceWidget.appendChild (typefacePrevious);
            let typefaceTag = document.createElement ('span');
            typefaceTag.className = 'typeface-tag';
            typefaceWidget.appendChild (typefaceTag);
            let typefaceNext = document.createElement ('span');
            typefaceNext.className = 'typeface-next';
            typefaceNext.innerHTML = '<svg class="next-icon" viewBox="0 0 10 10"><polygon points="1,0 9,5 1,10"></polygon></svg>'
            typefaceWidget.appendChild (typefaceNext);
            unihanWrapper.appendChild (typefaceWidget);
            //
            function updateTypefaceWidget ()
            {
                if (isProperlyRendered (unihanCharacter.textContent))
                {
                    typefaceWidget.classList.remove ('default');
                    unihanCharacter.lang = currentTypefaceLanguage;
                    let currentLanguage = languages[currentTypefaceLanguage];
                    typefaceTag.textContent = currentLanguage.label;
                    typefaceTag.title = currentLanguage.title;
                }
                else
                {
                    typefaceWidget.classList.add ('default');
                    unihanCharacter.lang = "";
                    typefaceTag.textContent = "--";
                    typefaceTag.title = "Default typeface";
                }
            }
            document.fonts.load (cjkBlankFont).then
            (
                () =>
                {
                    updateTypefaceWidget ();
                }
            );
            //
            function updateTypeface (reverse)
            {
                let index = languageKeys.indexOf (unihanCharacter.lang);
                if (reverse)
                {
                    index--;
                    if (index < 0)
                    {
                        index = languageKeys.length - 1;
                    }
                }
                else
                {
                    index++;
                    if (index >= languageKeys.length)
                    {
                        index = 0;
                    }
                }
                currentTypefaceLanguage = languageKeys[index];
                unihanCharacter.lang = currentTypefaceLanguage;
                let currentLanguage = languages[currentTypefaceLanguage];
                typefaceTag.textContent = currentLanguage.label;
                typefaceTag.title = currentLanguage.title;
            }
            //
            typefacePrevious.addEventListener ('click', event => { updateTypeface (true); });
            typefaceNext.addEventListener ('click', event => { updateTypeface (false); });
            //
            if (regexp.isRadical (character))
            {
                let unihanRadicalTag = document.createElement ('div');
                unihanRadicalTag.className = 'unihan-radical-tag';
                // "Radical", "[Radical]", "(Radical)", "<Radical>", "＊Radical＊", "*Radical*", "•Radical•"
                unihanRadicalTag.textContent = "(Radical)";
                unihanWrapper.appendChild (unihanRadicalTag);
            }
            //
            let unicodeData = unicode.getCharacterData (character);
            let age = unicodeData.age && `Unicode ${unicodeData.age} (${unicodeData.ageDate})`;
            let standardizedVariation = unicodeData.standardizedVariation;
            standardizedVariation = standardizedVariation && standardizedVariation.replace (" ", "\xA0");
            let unicodeFields =
            [
                { name: "Name", value: unicodeData.name },
                { name: "Age", value: age },
                { name: "Plane", value: unicodeData.planeName, tooltip: unicodeData.planeRange },
                { name: "Block", value: unicodeData.blockName, tooltip: unicodeData.blockRange },
                { name: "Script", value: unicodeData.script },
                { name: "Script Extensions", value: unicodeData.scriptExtensions },
                { name: "General Category", value: unicodeData.category },
                { name: "Extended Properties", value: unicodeData.extendedProperties },
                { name: "Decomposition", value: unicodeData.decomposition },
                { name: "Standardized Variation", value: standardizedVariation },
                { name: "Equivalent Unified Ideograph", value: unicodeData.equivalentUnifiedIdeograph }
            ];
            //
            let unicodeInfo = document.createElement ('div');
            unicodeInfo.className = 'unicode-info';
            for (let unicodeField of unicodeFields)
            {
                if (unicodeField.value)
                {
                    let field = document.createElement ('div');
                    field.className = 'field';
                    let name = document.createElement ('span');
                    name.className = 'name';
                    name.textContent = unicodeField.name.replace (/ /g, "\xA0");
                    field.appendChild (name);
                    field.appendChild (document.createTextNode (": "));
                    let value = document.createElement ('span');
                    value.className = 'value';
                    let text = Array.isArray (unicodeField.value) ? unicodeField.value.join (", ") : unicodeField.value;
                    value.textContent = text;
                    if (unicodeField.tooltip)
                    {
                        value.title = unicodeField.tooltip;
                    }
                    field.appendChild (value);
                    unicodeInfo.appendChild (field);
                }
            }
            //
            let unihanInfo = document.createElement ('div');
            unihanInfo.className = 'unihan-info';
            if (tags)
            {
                let set;
                let setTooltip;
                if ("kIICore" in tags)
                {
                    set = "IICore";
                    setTooltip = getCoreSetTooltip (tags["kIICore"]);
                }
                else if ("kUnihanCore2020" in tags)
                {
                    set = "Unihan Core (2020)";
                    setTooltip = getCoreSetTooltip (tags["kUnihanCore2020"]);
                }
                else
                {
                    set = "Full Unihan";
                }
                let status = regexp.isUnified (character) ? "Unified Ideograph" : "Compatibility Ideograph";
                let source = (!regexp.isUnified (character)) ? getCompatibilitySource (character) : "";
                let rsValues = [ ];
                let rsClasses = [ ];
                let rsIRGCount = 0;
                //
                const rsTags =
                [
                    "kRSUnicode",   // Must be first
                    "kRSKangXi",
                    "kRSAdobe_Japan1_6"
                ];
                //
                for (let rsTag of rsTags)
                {
                    let rsTagValues = tags[rsTag];
                    if (rsTagValues)
                    {
                        if (!Array.isArray (rsTagValues))
                        {
                            rsTagValues = [ rsTagValues ];
                        }
                        if (rsTag === "kRSUnicode")
                        {
                            rsIRGCount = rsTagValues.length;
                        }
                        for (let rsTagValue of rsTagValues)
                        {
                            if (rsTag === "kRSAdobe_Japan1_6")
                            {
                                let parsed = rsTagValue.match (/^([CV])\+[0-9]{1,5}\+([1-9][0-9]{0,2}\.[1-9][0-9]?\.[0-9]{1,2})$/);
                                if (parsed[1] === "C")
                                {
                                    let [ index, strokes, residual ] = parsed[2].split (".");
                                    rsValues.push ([ index, residual ].join ("."));
                                }
                            }
                            else
                            {
                                rsValues.push (rsTagValue);
                            }
                        }
                    }
                }
                //
                // Remove duplicates
                rsValues = [...new Set (rsValues)];
                //
                rsClasses = rsValues.map ((rsValue, index) => (index < rsIRGCount) ? 'irg-source' : 'no-irg-source');
                //
                rsValues = rsValues.map (rsValue => fromRSValue (rsValue).join (" +\xA0"));
                //
                let definitionValue = tags["kDefinition"];
                let related = unihanData.related[character] || [ ];
                let numericValue = numericValuesData[codePoint] || "";
                let unified = [ ];
                if (unicodeData.decomposition)
                {
                     unified.push (String.fromCodePoint (parseInt (unicodeData.decomposition.replace ("U+", ""), 16)));
                }
                let compatibility = compatibilityVariants[character] || [ ];
                let simplified = getVariants (character, 'kSimplifiedVariant');
                let traditional = getVariants (character, 'kTraditionalVariant');
                let semantic = getVariants (character, 'kSemanticVariant');
                let specialized = getVariants (character, 'kSpecializedSemanticVariant');
                let spoofing = getVariants (character, 'kSpoofingVariant');
                let shape = getVariants (character, 'kZVariant');
                let shinjitai = getJapaneseVariants (character, 'kShinjitaiVariant');
                let kyujitai = getJapaneseVariants (character, 'kKyujitaiVariant');
                let yasuoka = getYasuokaVariants (character).filter (variant => regexp.isUnihan (variant));
                let unihanFields =
                [
                    { name: "Set", value: set, tooltip: setTooltip },
                    { name: "Status", value: status },
                    { name: "Source", value: source },
                    { name: "Radical/Strokes", value: rsValues, class: rsClasses },
                    { name: "Definition", value: definitionValue },
                    { name: "Numeric Value", value: numericValue },
                    //
                    { name: "Related", value: related.join (" ") },
                    //
                    { name: "Unified Variant", value: unified.join (" ") },
                    { name: "Compatibility Variants", value: compatibility.join (" ") },
                    //
                    { name: "Simplified Variants", value: simplified.join (" ") },
                    { name: "Traditional Variants", value: traditional.join (" ") },
                    //
                    { name: "Semantic Variants", value: semantic.join (" ") },
                    { name: "Specialized Variants", value: specialized.join (" ") },
                    //
                    { name: "Spoofing Variants", value: spoofing.join (" ") },
                    //
                    { name: "Shape (Z-) Variants", value: shape.join (" ") },
                    //
                    { name: "Shinjitai Variants", value: shinjitai.join (" ") },
                    { name: "Kyūjitai Variants", value: kyujitai.join (" ") },
                    //
                    { name: "Yasuoka Variants", value: yasuoka.join (" ") }
                ];
                appendFields (unihanInfo, unihanFields);
            }
            else if (regexp.isRadical (character))
            {
                let radicalIndex = -1;
                for (let kangxiIndex = 0; kangxiIndex < kangxiRadicals.length; kangxiIndex++)
                {
                    let kangxiRadical = kangxiRadicals[kangxiIndex];
                    if (kangxiRadical.radical === character)
                    {
                        radicalIndex = kangxiIndex;
                        break;
                    }
                    else if ("cjk" in kangxiRadical)
                    {
                        let ckjRadicals = kangxiRadical.cjk;
                        for (let cjkIndex = 0; cjkIndex < ckjRadicals.length; cjkIndex++)
                        {
                            let cjkRadical = ckjRadicals[cjkIndex];
                            if (cjkRadical.radical === character)
                            {
                                radicalIndex = kangxiIndex;
                                break;
                            }
                        }
                    }
                }
                let kangXiRadical;
                let unified;
                let kangxiClass;
                let cjkRadicals = [ ];
                let cjkClasses = [ ];
                if (radicalIndex >= 0)
                {
                    let kangxiRadical = kangxiRadicals[radicalIndex];
                    kangXiRadical = `${radicalIndex + 1} ${kangxiRadical.radical} (${kangxiRadical.name})`;
                    if (kangxiRadical.radical === character)
                    {
                        kangxiClass = 'kangxi-radical-current';
                        unified = kangxiRadical.unified;
                    }
                    else
                    {
                        kangxiClass = 'kangxi-radical';
                    }
                    if ("cjk" in kangxiRadical)
                    {
                        let ckjRadicals = kangxiRadical.cjk;
                        for (let cjkIndex = 0; cjkIndex < ckjRadicals.length; cjkIndex++)
                        {
                            let cjkRadical = ckjRadicals[cjkIndex];
                            cjkRadicals.push (`${radicalIndex + 1} ${cjkRadical.radical} (${cjkRadical.name})`);
                            if (cjkRadical.radical === character)
                            {
                                cjkClasses.push ('cjk-radical-current');
                                unified = cjkRadical.unified;
                            }
                            else
                            {
                                cjkClasses.push ('cjk-radical');
                            }
                        }
                    }
                }
                else
                {
                    // Only one case: ⺀ U+2E80 CJK RADICAL REPEAT
                    kangXiRadical = "<unknown>";   // "？", "?", "??", "<unknown>"
                }
                //
                let radicalFields =
                [
                    { name: "KangXi Radical", value: kangXiRadical, class: kangxiClass },
                    { name: "CJK Radicals", value: cjkRadicals, class: cjkClasses },
                    { name: "Equivalent Unified Ideograph", value: unified }
                ];
                appendFields (unihanInfo, radicalFields);
            }
            else
            {
                let invalidUnihan = document.createElement ('div');
                invalidUnihan.className = 'field invalid-unihan';
                // "Not a Unihan character"
                // "Not a valid Unihan character"
                // "No Unihan character information"
                invalidUnihan.textContent = "No Unihan information available";
                unihanInfo.appendChild (invalidUnihan);
            }
            //
            characterData.appendChild (unihanCard);
            characterData.appendChild (unicodeInfo);
            characterData.appendChild (unihanInfo);
            infoContainer.appendChild (characterData);
        }
        //
        function displayTags (tags)
        {
            function createTagsList (showCategories)
            {
                let tagsList = document.createElement ('table');
                tagsList.className = 'tags-list';
                let headerRow = document.createElement ('tr');
                headerRow.className = 'header-row';
                let tagHeader = document.createElement ('th');
                tagHeader.className = 'tag-header';
                tagHeader.textContent = "Unihan\xA0Tag"; // "Unihan\xA0Property"
                headerRow.appendChild (tagHeader);
                let valueHeader = document.createElement ('th');
                valueHeader.className = 'value-header';
                valueHeader.textContent = "Value";
                headerRow.appendChild (valueHeader);
                tagsList.appendChild (headerRow);
                if (showCategories)
                {
                    for (let category of unihanData.categories)
                    {
                        let categoryTags = category.tags.filter (tag => (tag in tags));
                        if (categoryTags.length > 0)
                        {
                            let categoryRow = document.createElement ('tr');
                            categoryRow.className = 'category-row';
                            let categoryName = document.createElement ('td');
                            categoryName.className = 'category-name';
                            categoryName.textContent = category.name;
                            categoryName.colSpan = 2;
                            categoryRow.appendChild (categoryName);
                            tagsList.appendChild (categoryRow);
                            for (let tag of categoryTags)
                            {
                                let value = tags[tag];
                                if (value)
                                {
                                    let tagRow = document.createElement ('tr');
                                    let tagCell = document.createElement ('td');
                                    tagCell.className = 'tag';
                                    tagCell.textContent = tag;
                                    tagCell.title = unihanData.tags[tag].name;
                                    tagRow.appendChild (tagCell);
                                    let valueCell = document.createElement ('td');
                                    valueCell.className = 'value';
                                    if (Array.isArray (value))
                                    {
                                        let list = document.createElement ('ul');
                                        list.className = 'list';
                                        for (let element of value)
                                        {
                                            let item = document.createElement ('li');
                                            item.className = 'item';
                                            appendTextWithLinks (item, element);
                                            list.appendChild (item);
                                        }
                                        valueCell.appendChild (list);
                                    }
                                    else
                                    {
                                        appendTextWithLinks (valueCell, value);
                                    }
                                    tagRow.appendChild (valueCell);
                                    tagsList.appendChild (tagRow);
                                }
                            }
                        }
                    }
                }
                else
                {
                    let sortedKeys = Object.keys (tags).sort ((a, b) => a.localeCompare (b));
                    for (let tag of sortedKeys)
                    {
                        let tagRow = document.createElement ('tr');
                        let value = tags[tag];
                        let tagCell = document.createElement ('td');
                        tagCell.className = 'tag';
                        tagCell.textContent = tag;
                        tagCell.title = unihanData.tags[tag].name;
                        tagRow.appendChild (tagCell);
                        let valueCell = document.createElement ('td');
                        valueCell.className = 'value';
                        if (Array.isArray (value))
                        {
                            let list = document.createElement ('ul');
                            list.className = 'list';
                            for (let element of value)
                            {
                                let item = document.createElement ('li');
                                item.className = 'item';
                                appendTextWithLinks (item, element);
                                list.appendChild (item);
                            }
                            valueCell.appendChild (list);
                        }
                        else
                        {
                            appendTextWithLinks (valueCell, value);
                        }
                        tagRow.appendChild (valueCell);
                        tagsList.appendChild (tagRow);
                    }
                }
                return tagsList;
            }
            //
            if (tags)
            {
                let tagsData = document.createElement ('div');
                tagsData.className = 'tags-data';
                //
                let interface = document.createElement ('div');
                interface.className = 'interface';
                let optionGroup = document.createElement ('span');
                optionGroup.className = 'option-group';
                let categoriesOption = document.createElement ('span');
                categoriesOption.className = 'option';
                let categoriesLabel = document.createElement ('label');
                let categoriesCheckbox = document.createElement ('input');
                categoriesCheckbox.className = "categories-checkbox";
                categoriesCheckbox.type = 'checkbox';
                categoriesCheckbox.checked = showCategories;
                categoriesCheckbox.addEventListener
                (
                    'input',
                    event =>
                    {
                        showCategories = event.currentTarget.checked;
                        while (tagsWrapper.firstChild)
                        {
                            tagsWrapper.firstChild.remove ();
                        }
                        tagsWrapper.appendChild (createTagsList (showCategories));
                    }
                );
                categoriesLabel.appendChild (categoriesCheckbox);
                let categoriesText = document.createTextNode ("\xA0Categories");
                categoriesLabel.appendChild (categoriesText);
                categoriesOption.appendChild (categoriesLabel);
                optionGroup.appendChild (categoriesOption);
                interface.appendChild (optionGroup);
                infoContainer.appendChild (interface);
                //
                let tagsWrapper = document.createElement ('div');
                tagsWrapper.appendChild (createTagsList (showCategories));
                tagsData.appendChild (tagsWrapper);
                //
                infoContainer.appendChild (tagsData);
            }
        }
        //
        while (infoContainer.firstChild)
        {
            infoContainer.firstChild.remove ();
        }
        currentUnihanCharacter = character;
        if (character)
        {
            let codePoint = unicode.characterToCodePoint (character);
            let tags = unihanData.codePoints[codePoint];
            displayCharacterData (character, codePoint, tags);
            displayTags (tags);
        }
    }
    //
    const characterOrCodePointRegex = /^\s*(?:(.)\p{Variation_Selector}?|(?:[Uu]\+)?([0-9a-fA-F]{4,5}))\s*$/u;
    //
    function parseUnihanCharacter (inputString)
    {
        let character = "";
        let match = inputString.match (characterOrCodePointRegex);
        if (match)
        {
            if (match[1])
            {
                character = match[1];
            }
            else if (match[2])
            {
                character = String.fromCodePoint (parseInt (match[2], 16));
            }
            if (!(regexp.isUnihan (character) || regexp.isRadical (character)))
            {
                character = "";
            }
        }
        return character;
    }
    // 
    unihanInput.addEventListener
    (
        'input',
        (event) =>
        {
            event.currentTarget.classList.remove ('invalid');
            if (event.currentTarget.value)
            {
                if (!parseUnihanCharacter (event.currentTarget.value))
                {
                    event.currentTarget.classList.add ('invalid');
                }
            }
        }
    );
    unihanInput.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === 'Enter')
            {
                event.preventDefault ();
                lookupButton.click ();
            }
        }
    );
    unihanInput.addEventListener
    (
        'keydown',
        (event) =>
        {
            if (event.altKey)
            {
                if (event.key === 'ArrowUp')
                {
                    event.preventDefault ();
                    if (unihanHistoryIndex === -1)
                    {
                        unihanHistorySave = event.currentTarget.value;
                    }
                    unihanHistoryIndex++;
                    if (unihanHistoryIndex > (unihanHistory.length - 1))
                    {
                        unihanHistoryIndex = (unihanHistory.length - 1);
                    }
                    if (unihanHistoryIndex !== -1)
                    {
                        event.currentTarget.value = unihanHistory[unihanHistoryIndex];
                        event.currentTarget.dispatchEvent (new Event ('input'));
                    }
                }
                else if (event.key === 'ArrowDown')
                {
                    event.preventDefault ();
                    unihanHistoryIndex--;
                    if (unihanHistoryIndex < -1)
                    {
                        unihanHistoryIndex = -1;
                        unihanHistorySave = null;
                    }
                    if (unihanHistoryIndex === -1)
                    {
                        if (unihanHistorySave !== null)
                        {
                            event.currentTarget.value = unihanHistorySave;
                            event.currentTarget.dispatchEvent (new Event ('input'));
                        }
                    }
                    else
                    {
                        event.currentTarget.value = unihanHistory[unihanHistoryIndex];
                        event.currentTarget.dispatchEvent (new Event ('input'));
                    }
                }
            }
        }
    );
    //
    function updateUnihanData (character)
    {
        unihanInput.value = "";
        unihanInput.dispatchEvent (new Event ('input'));
        displayData (character);
        unit.scrollTop = 0;
        unit.scrollLeft = 0;
    }
    //
    lookupButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (unihanInput.value)
            {
                let character = parseUnihanCharacter (unihanInput.value);
                if (character)
                {
                    updateUnihanData (character);
                }
                else
                {
                    remote.shell.beep ();
                }
            }
            else
            {
                unihanHistoryIndex = -1;
                unihanHistorySave = null;
                updateUnihanData ("");
            }
        }
    );
    //
    currentUnihanCharacter = prefs.unihanCharacter;
    updateUnihanData (currentUnihanCharacter);
    //
    function randomElement (elements)
    {
        return elements [Math.floor (Math.random () * elements.length)];
    }
    //
    randomButton.addEventListener
    (
        'click',
        (event) =>
        {
            let set;
            if (randomSetSelect.value === "IICore")
            {
                set = unihanData.coreSet;
            }
            else if (randomSetSelect.value === "UCore")
            {
                set = unihanData.core2020Set;
            }
            else if (randomSetSelect.value === "Full")
            {
                set = unihanData.fullSet;
            }
            let codePoint = randomElement (set);
            updateUnihanData (String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16)));
        }
    );
    //
    instructions.open = prefs.instructions;
    //
    references.open = prefs.references;
    //
    const refLinks = require ('./ref-links.json');
    linksList (links, refLinks);
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        unihanHistory: unihanHistory,
        unihanCharacter: currentUnihanCharacter,
        typefaceLanguage: currentTypefaceLanguage,
        randomSetSelect: randomSetSelect.value,
        showCategories: showCategories,
        instructions: instructions.open,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
