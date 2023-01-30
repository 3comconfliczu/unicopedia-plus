//
const unit = document.getElementById ('unihan-variants-unit');
//
const historyButton = unit.querySelector ('.history-button');
const unihanInput = unit.querySelector ('.unihan-input');
const lookUpButton = unit.querySelector ('.look-up-button');
const extraVariantsCheckbox = unit.querySelector ('.extra-variants-checkbox');
const linearCharacter = unit.querySelector ('.linear-character');
const linearVariants = unit.querySelector ('.linear-variants');
const linearCodePoint = unit.querySelector ('.linear-code-point');
const linearCodePoints = unit.querySelector ('.linear-code-points');
const detailedRelationsCheckbox = unit.querySelector ('.detailed-relations-checkbox');
const codePointsCheckbox = unit.querySelector ('.code-points-checkbox');
const saveSVGButton = unit.querySelector ('.save-svg-button');
const graphContainer = unit.querySelector ('.graph-container');
//
const instructions = unit.querySelector ('.instructions');
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
const unihanHistorySize = 128;   // 0: unlimited
//
let unihanHistory = [ ];
let unihanHistoryIndex = -1;
let unihanHistorySave = null;
//
let currentUnihanCharacter;
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const { clipboard, shell } = require ('electron');
    const { getCurrentWindow, Menu } = require ('@electron/remote');
    //
    const currentWindow = getCurrentWindow ();
    //
    const fs = require ('fs');
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const linksList = require ('../../lib/links-list.js');
    //
    // https://github.com/mdaines/viz.js/wiki/Usage
    // https://github.com/mdaines/viz.js/wiki/Caveats
    //
    const Viz = require ('viz.js');
    const { Module, render } = require ('viz.js/full.render.js');
    //
    let viz = new Viz ({ Module, render });
    //
    const dotTemplate = fs.readFileSync (path.join (__dirname, 'template.dot'), { encoding: 'utf8' });
    //
    const regexp = require ('../../lib/unicode/regexp.js');
    const unicode = require ('../../lib/unicode/unicode.js');
    const unihan = require ('../../lib/unicode/unihan.js');
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
    const japaneseVariants = require ('../../lib/unicode/parsed-japanese-variants-data.js');
    const yasuokaVariants = require ('../../lib/unicode/parsed-yasuoka-variants-data.js');
    //
    const defaultPrefs =
    {
        unihanHistory: [ ],
        unihanCharacter: "",
        extraVariantsCheckbox: false,
        detailedRelationsCheckbox: false,
        codePointsCheckbox: false,
        defaultFolderPath: context.defaultFolderPath,
        instructions: true,
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    unihanHistory = prefs.unihanHistory;
    //
    unihanInput.addEventListener
    (
        'input',
        (event) =>
        {
            event.currentTarget.classList.remove ('invalid');
            if (event.currentTarget.value)
            {
                if (!unihan.validateUnihanInput (event.currentTarget.value))
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
                lookUpButton.click ();
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
    let variantTags =
    [
        'kCompatibilityVariant',
        //
        'kSimplifiedVariant',
        'kTraditionalVariant',
        //
        'kSemanticVariant',
        'kSpecializedSemanticVariant',
        //
        'kSpoofingVariant',
        //
        'kZVariant',
        //
        'kShinjitaiVariant',
        'kKyujitaiVariant'
    ];
    //
    const autoCompatibility = true;
    //
    function getVariantRelations (character)
    {
        let relations = [ ];
        for (let codePoint of unihanData.fullSet)
        {
            let setCharacter = String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16));
            let codePointData = { ...unihanData.codePoints[codePoint], ...japaneseVariants[codePoint] };
            for (let variantTag of variantTags)
            {
                if (variantTag in codePointData)
                {
                    let variants = codePointData[variantTag];
                    if (!Array.isArray (variants))
                    {
                        variants = [ variants ];
                    }
                    for (let variant of variants)
                    {
                        variant = variant.split ("<")[0];
                        let variantCharacter = String.fromCodePoint (parseInt (variant.replace ("U+", ""), 16));
                        if (setCharacter === character)
                        {
                            relations.push ({ to: variantCharacter, tag: variantTag });
                            if (autoCompatibility && (variantTag === 'kCompatibilityVariant'))
                            {
                                relations.push ({ from: variantCharacter, tag: 'kUnifiedVariant' });
                            }
                        }
                        else if (character === variantCharacter)
                        {
                            relations.push ({ from: setCharacter, tag: variantTag });
                            if (autoCompatibility && (variantTag === 'kCompatibilityVariant'))
                            {
                                relations.push ({ to: setCharacter, tag: 'kUnifiedVariant' });
                            }
                        }
                    }
                }
            }
            if (extraVariantsCheckbox.checked)
            {
                // Yasuoka Variants
                let variants = yasuokaVariants[codePoint] || [ ];
                for (let variant of variants)
                {
                    if (variant in unihanData.codePoints)
                    {
                        let variantCharacter = String.fromCodePoint (parseInt (variant.replace ("U+", ""), 16));
                        if (setCharacter === character)
                        {
                            relations.push ({ to: variantCharacter, tag: 'kYasuokaVariant' });
                        }
                        else if (character === variantCharacter)
                        {
                            relations.push ({ from: setCharacter, tag: 'kYasuokaVariant' });
                        }
                    }
                }
            }
        }
        return relations;
    }
    //
    let shortLabels =
    {
        'kCompatibilityVariant': " Unified ",
        'kKyujitaiVariant': " Kyūjitai ",
        'kSemanticVariant': " Semantic ",
        'kShinjitaiVariant': " Shinjitai ",
        'kSimplifiedVariant': " Simplified ",
        'kSpecializedSemanticVariant': " Specialized ",
        'kSpoofingVariant': " Spoofing ",
        'kTraditionalVariant': " Traditional ",
        'kUnifiedVariant': " Compat. ",
        'kYasuokaVariant': " Yasuoka ",
        'kZVariant': " Shape "
    };
    //
    let dotString;
    let svgResult;
    //
    let parser = new DOMParser ();
    let serializer = new XMLSerializer ();
    //
    function getFontFamily (fontFamily)
    {
        return getComputedStyle (document.body).getPropertyValue (fontFamily).replaceAll ("\"", "").trim ();
    }
    function getFontFamilyString (fontFamily)
    {
        return JSON.stringify (getFontFamily (fontFamily));
    }
    const unihanFamilyString = getFontFamilyString ('--unihan-family');
    const monospaceFamilyString = getFontFamilyString ('--monospace-family');
    const systemUIFamilyString = getFontFamilyString ('--system-ui-family');
    //
    function postProcessSVG (svg)
    {
        let doc = parser.parseFromString (svg, 'text/xml');
        let ellipses = doc.documentElement.querySelectorAll ('.node ellipse');
        for (let ellipse of ellipses)
        {
            // Fix incorrect centering of text in ellipses (circles)
            let cx = ellipse.getAttribute ('cx');
            let texts = ellipse.parentNode.querySelectorAll ('text');
            for (let text of texts)
            {
                let textAnchor = text.getAttribute ('text-anchor');
                if (textAnchor !== "middle")
                {
                    text.setAttribute ('text-anchor', "middle");
                    text.setAttribute ('x', cx);
                }
            }
            if (texts.length === 1)
            {
                let text = texts[0];
                let y = parseFloat (text.getAttribute ('y'));
                text.setAttribute ('y', y + 2); // Empirical adjustment
            }
            else
            {
                // Take this opportunity to italicize the code point of compatibility characters
                let character = texts[0].textContent;
                let text = texts[1];
                if (regexp.isCompatibility (character))
                {
                    text.setAttribute ('font-style', "italic");
                }
            }
            // Force white background (none if bold style!)
            let fill = ellipse.getAttribute ('fill');
            if (fill === "none")
            {
                ellipse.setAttribute ('fill', "#ffffff");
            }
        }
        // Remove unwanted tooltips
        let tooltips = doc.documentElement.querySelectorAll ('.edge title, .node title');
        for (let tooltip of tooltips)
        {
            let lineBreak = tooltip.nextSibling;
            if (lineBreak && (lineBreak.nodeType === 3) && (lineBreak.nodeValue.match (/\r?\n/)))
            {
                lineBreak.remove ();
            }
            tooltip.remove ();
        }
        return serializer.serializeToString (doc);
    }
    //
    function getOptionsString (character, isLookedUp)
    {
        let codePoint = unicode.charactersToCodePoints (character);
        let label = (codePointsCheckbox.checked) ?
            `<<FONT FACE=${unihanFamilyString} POINT-SIZE="33">{{character}}</FONT><BR/><FONT FACE=${monospaceFamilyString} POINT-SIZE="9"><B>{{codepoint}}</B></FONT>>` :
            `<<FONT FACE=${unihanFamilyString} POINT-SIZE="36">{{character}}</FONT>>`
        let options =
        [
            { name: "tooltip", value: JSON.stringify (unihan.getTooltip (character)) },
            { name: "style", value: isLookedUp && "bold" },
            { name: "label", value: label.replace ("{{character}}", character).replace ("{{codepoint}}", codePoint.replace ("U+", "")) }
        ];
        if (isLookedUp)
        {
            options.unshift ({  name: "class", value: JSON.stringify ("no-link") });
        }
        let optionsArray = [ ];
        for (let option of options)
        {
            if (option.value)
            {
                optionsArray.push (`${option.name} = ${option.value}`);
            }
        }
        return optionsArray.join (", ");
    }
    //
    let currentCharacter;
    //
    let characterMenuTemplate =
    [
        { label: "Copy Character", click: (menuItem) => clipboard.writeText (currentCharacter) },
        { label: "Copy Code Point", click: (menuItem) => clipboard.writeText (unicode.characterToCodePoint (currentCharacter)) }
    ];
    let characterContextualMenu = Menu.buildFromTemplate (characterMenuTemplate);
    //
    function showCharacterMenu (event)
    {
        let aTag = event.target.closest ('a');
        if (aTag)
        {
            event.preventDefault ();
            currentCharacter = aTag.querySelector ('text').textContent;
            characterContextualMenu.popup ({ window: currentWindow });
        }
    }
    //
    function displayData (character)
    {
        dotString = "";
        svgResult = "";
        saveSVGButton.disabled = true;
        // linearCharacter.textContent = "";
        while (linearCharacter.firstChild)
        {
            linearCharacter.firstChild.remove ();
        }
        // linearVariants.textContent = "";
        while (linearVariants.firstChild)
        {
            linearVariants.firstChild.remove ();
        }
        linearCodePoint.textContent = "";
        linearCodePoints.textContent = "";
        while (graphContainer.firstChild)
        {
            graphContainer.firstChild.remove ();
        }
        currentUnihanCharacter = character;
        if (character)
        {
            let indexOfUnihanCharacter = unihanHistory.indexOf (character);
            if (indexOfUnihanCharacter !== -1)
            {
                unihanHistory.splice (indexOfUnihanCharacter, 1);
            }
            unihanHistory.unshift (character);
            if ((unihanHistorySize > 0) && (unihanHistory.length > unihanHistorySize))
            {
                unihanHistory.pop ();
            }
            unihanHistoryIndex = -1;
            unihanHistorySave = null;
            let symbol = document.createElement ('span');
            symbol.className = 'symbol';
            symbol.title = unihan.getTooltip (character);
            symbol.textContent = character;
            linearCharacter.appendChild (symbol);
            let codePoint = document.createElement ('span');
            codePoint.className = 'code-point';
            if (regexp.isCompatibility (character))
            {
                codePoint.classList.add ('compatibility');
            }
            codePoint.textContent = unicode.characterToCodePoint (character);
            linearCodePoint.appendChild (codePoint);
            let relations = getVariantRelations (character);
            // console.log (relations);
            let variants = [ ];
            for (let relation of relations)
            {
                if ("to" in relation)
                {
                    variants.push (relation["to"]);
                }
                else if ("from" in relation)
                {
                    variants.push (relation["from"]);
                }
            }
            variants = [...new Set (variants.filter (variant => variant !== character))].sort ((a, b) => a.codePointAt (0) - b.codePointAt (0));
            // console.log (variants);
            if (variants.length > 0)
            {
                let isFirst = true;
                for (let variant of variants)
                {
                    let symbol = document.createElement ('span');
                    symbol.className = 'symbol';
                    symbol.title = unihan.getTooltip (variant);
                    symbol.textContent = variant;
                    linearVariants.appendChild (symbol);
                    if (!isFirst)
                    {
                        linearCodePoints.appendChild (document.createTextNode (" "));
                    }
                    isFirst = false;
                    let codePoint = document.createElement ('span');
                    codePoint.className = 'code-point';
                    if (regexp.isCompatibility (variant))
                    {
                        codePoint.classList.add ('compatibility');
                    }
                    codePoint.textContent = unicode.characterToCodePoint (variant);
                    linearCodePoints.appendChild (codePoint);
                }
            }
            try
            {
                let data = "";
                if (detailedRelationsCheckbox.checked)
                {
                    let compatibilityVariants = variants.filter (variant => (variant !== character) && regexp.isCompatibility (variant));
                    if (compatibilityVariants.length > 0)
                    {
                        data += `    { rank = same; ${compatibilityVariants.join ('; ')} }\n`;
                    }
                    data += `    { rank = same; ${character} }\n`;
                    let unifiedVariants = variants.filter (variant => (variant !== character) && (!regexp.isCompatibility (variant)));
                    if (unifiedVariants.length > 0)
                    {
                        data += `    { rank = same; ${unifiedVariants.join ('; ')} }\n`;
                    }
                }
                data += `    "${character}" [ ${getOptionsString (character, true)} ]`;
                data += variants.map (variant => `\n    "${variant}" [ ${getOptionsString (variant)} ]`).join ("");
                if (detailedRelationsCheckbox.checked)
                {
                    let toCharacters = { };
                    let fromCharacters = { };
                    for (let relation of relations)
                    {
                        if ("to" in relation)
                        {
                            let toCharacter = relation["to"];
                            if (!(toCharacter in toCharacters))
                            {
                                toCharacters[toCharacter] = [ ];
                            }
                            toCharacters[toCharacter].push (relation["tag"]);
                        }
                        else if ("from" in relation)
                        {
                            let fromCharacter = relation["from"];
                            if (!(fromCharacter in fromCharacters))
                            {
                                fromCharacters[fromCharacter] = [ ];
                            }
                            fromCharacters[fromCharacter].push (relation["tag"]);
                        }
                    }
                    // console.log (toCharacters, fromCharacters);
                    for (let toCharacter in toCharacters)
                    {
                        let tags = toCharacters[toCharacter];
                        for (let tag of tags)
                        {
                            if ((tag !== 'kYasuokaVariant') || (tags.length === 1))
                            {
                                data += `\n    "${character}" -> "${toCharacter}" [ label = ${JSON.stringify (shortLabels[tag])} ]`;
                            }
                        }
                    }
                    for (let fromCharacter in fromCharacters)
                    {
                        let tags = fromCharacters[fromCharacter];
                        for (let tag of tags)
                        {
                            if ((tag !== 'kYasuokaVariant') || (tags.length === 1))
                            {
                                data += `\n    "${fromCharacter}" -> "${character}" [ label = ${JSON.stringify (shortLabels[tag])} ]`;
                            }
                        }
                    }
                }
                else
                {
                    data += variants.map (variant => `\n    "${character}" -- "${variant}"`).join ("");
                }
                // console.log (data);
                let codePoint = unicode.charactersToCodePoints (character);
                dotString =
                    dotTemplate
                    .replace ('{{graph}}', detailedRelationsCheckbox.checked ? 'digraph' : 'graph')
                    .replace ('{{rankdir}}', detailedRelationsCheckbox.checked ? 'LR' : 'TB')
                    .replace ('{{comment}}', JSON.stringify (`${character} ${codePoint} | ${context.name} | ${context.app}`))
                    .replace ('{{fontname}}', systemUIFamilyString)
                    .replace ('{{data}}', data);
                // console.log (dotString);
                viz.renderString (dotString, { engine: 'dot', format: 'svg' })
                .then
                (
                    result =>
                    {
                        svgResult = postProcessSVG (result);
                        graphContainer.innerHTML = svgResult;
                        graphContainer.addEventListener ('contextmenu', showCharacterMenu);
                        saveSVGButton.disabled = false;
                    }
                );
            }
            catch (e)
            {
            }
        }
    }
    //
    function updateUnihanData (character)
    {
        unihanInput.value = "";
        unihanInput.blur ();
        unihanInput.dispatchEvent (new Event ('input'));
        displayData (character);
    }
    //
    graphContainer.addEventListener
    (
        'click',
        (event) =>
        {
            let aTag = event.target.closest ('a');
            if (aTag)
            {
                event.preventDefault ();
                let character = aTag.querySelector ('text').textContent;
                if (character != currentUnihanCharacter)
                {
                    updateUnihanData (character);
                }
            }
        }
    );
    //
    lookUpButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (unihanInput.value)
            {
                let character = unihan.validateUnihanInput (unihanInput.value);
                if (character)
                {
                    updateUnihanData (character);
                }
                else
                {
                    shell.beep ();
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
    function insertUnihanCharacter (menuItem)
    {
        unihanInput.value = menuItem.id;
        unihanInput.dispatchEvent (new Event ('input'));
        lookUpButton.click ();
    };
    historyButton.addEventListener
    (
        'click',
        (event) =>
        {
            let historyMenuTemplate = [ ];
            historyMenuTemplate.push ({ label: "Lookup History", enabled: false })
            // historyMenuTemplate.push ({ type: 'separator' })
            if (unihanHistory.length > 0)
            {
                for (let unihan of unihanHistory)
                {
                    historyMenuTemplate.push
                    (
                        {
                            label: `${unihan}${(process.platform === 'darwin') ? "\t" : "\xA0\xA0"}${unicode.characterToCodePoint (unihan)}`,
                            id: unihan,
                            toolTip: unicode.getCharacterBasicData (unihan).name,
                            click: insertUnihanCharacter
                        }
                    );
                }
            }
            else
            {
                historyMenuTemplate.push ({ label: "(no history yet)", enabled: false });
            }
            let historyContextualMenu = Menu.buildFromTemplate (historyMenuTemplate);
            pullDownMenus.popup (event.currentTarget, historyContextualMenu, 0);
        }
    );
    //
    extraVariantsCheckbox.checked = prefs.extraVariantsCheckbox;
    extraVariantsCheckbox.addEventListener ('click', (event) => { updateUnihanData (currentUnihanCharacter); });
    //
    detailedRelationsCheckbox.checked = prefs.detailedRelationsCheckbox;
    detailedRelationsCheckbox.addEventListener ('click', (event) => { updateUnihanData (currentUnihanCharacter); });
    //
    codePointsCheckbox.checked = prefs.codePointsCheckbox;
    codePointsCheckbox.addEventListener ('click', (event) => { updateUnihanData (currentUnihanCharacter); });
    //
    currentUnihanCharacter = prefs.unihanCharacter;
    updateUnihanData (currentUnihanCharacter);
    //
    defaultFolderPath = prefs.defaultFolderPath;
    //
    saveSVGButton.addEventListener
    (
        'click',
        (event) =>
        {
            let dotFormat = event.altKey || event.shiftKey;
            if (dotFormat)
            {
                fileDialogs.saveTextFile
                (
                    "Save DOT file:",
                    [ { name: "DOT File (*.dot)", extensions: [ 'dot' ] } ],
                    path.join (defaultFolderPath, `${currentUnihanCharacter}-Variants.dot`),
                    (filePath) =>
                    {
                        defaultFolderPath = path.dirname (filePath);
                        return dotString;
                    }
                );
            }
            else
            {
                fileDialogs.saveTextFile
                (
                    "Save SVG file:",
                    [ { name: "SVG File (*.svg)", extensions: [ 'svg' ] } ],
                    path.join (defaultFolderPath, `${currentUnihanCharacter}-Variants.svg`),
                    (filePath) =>
                    {
                        defaultFolderPath = path.dirname (filePath);
                        return svgResult;
                    }
                );
            }
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
        extraVariantsCheckbox: extraVariantsCheckbox.checked,
        detailedRelationsCheckbox: detailedRelationsCheckbox.checked,
        codePointsCheckbox: codePointsCheckbox.checked,
        defaultFolderPath: defaultFolderPath,
        instructions: instructions.open,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
