//
const unit = document.getElementById ('unihan-variants-unit');
//
const unihanInput = unit.querySelector ('.unihan-input');
const lookupButton = unit.querySelector ('.lookup-button');
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
//
const unihanHistorySize = 256;   // 0: unlimited
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
    const { remote } = require ('electron');
    //
    const fs = require ('fs');
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
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
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
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
        instructions: true
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    unihanHistory = prefs.unihanHistory;
    //
    const characterOrCodePointRegex = /^\s*(?:(.)|(?:[Uu]\+)?([0-9a-fA-F]{4,5}))\s*$/u;
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
            if (!regexp.isUnihan (character))
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
    function getTooltip (character)
    {
        let data = unicode.getCharacterBasicData (character);
        let status = regexp.isUnified (character) ? "Unified Ideograph" : "Compatibility Ideograph";
        let set = "Full Unihan";
        let tags = unihanData.codePoints[data.codePoint];
        if ("kIICore" in tags)
        {
            set = "IICore";
        }
        else if ("kUnihanCore2020" in tags)
        {
            set = "Unihan Core (2020)";
        }
        let lines =
        [
            `Code Point: ${data.codePoint}`,
            `Age: Unicode ${data.age} (${data.ageDate})`,
            `Set: ${set}`,
            `Status: ${status}`
        ];
        return lines.join ("\n");
    }
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
        'kZVariant'
    ];
    //
    function getVariantRelations (character)
    {
        let relations = [ ];
        for (let codePoint of unihanData.fullSet)
        {
            let setCharacter = String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16));
            let codePointData = unihanData.codePoints[codePoint];
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
                        }
                        else if (character === variantCharacter)
                        {
                            relations.push ({ from: setCharacter, tag: variantTag });
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
        'kSemanticVariant': " Semantic ",
        'kSimplifiedVariant': " Simplified ",
        'kSpecializedSemanticVariant': " Specialized ",
        'kSpoofingVariant': " Spoofing ",
        'kTraditionalVariant': " Traditional ",
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
    function postProcessSVG (svg)
    {
        let doc = parser.parseFromString (svg, 'text/xml');
        let ellipses = doc.documentElement.querySelectorAll ('ellipse');
        for (let ellipse of ellipses)
        {
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
        }
        return serializer.serializeToString (doc);
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
            symbol.title = getTooltip (character);
            symbol.textContent = character;
            linearCharacter.appendChild (symbol);
            linearCodePoint.textContent = unicode.charactersToCodePoints (character);
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
                for (let variant of variants)
                {
                    let symbol = document.createElement ('span');
                    symbol.className = 'symbol';
                    symbol.title = getTooltip (variant);
                    symbol.textContent = variant;
                    linearVariants.appendChild (symbol);
                }
                linearCodePoints.textContent = unicode.charactersToCodePoints (variants.join (""));
            }
            try
            {
                function getOptionsString (character, isLookedUp)
                {
                    let codePoint = unicode.charactersToCodePoints (character);
                    let label = (codePointsCheckbox.checked) ?
                        '<<FONT FACE="Segoe UI, system-ui, sans-serif" POINT-SIZE="33">{{character}}</FONT><BR/><FONT FACE="Monaco, DejaVu Sans Mono, Noto Mono, monospace" POINT-SIZE="9"><B>{{codepoint}}</B></FONT>>' :
                        '<<FONT FACE="Segoe UI, system-ui, sans-serif" POINT-SIZE="36">{{character}}</FONT>>'                        
                    let options =
                    [
                        { name: "tooltip", value: JSON.stringify (getTooltip (character)) },
                        { name: "style", value: isLookedUp && "bold" },
                        { name: "label", value: label.replace ("{{character}}", character).replace ("{{codepoint}}", codePoint.replace ("U+", "")) }
                    ];
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
                let data = "";
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
                    .replace ('{{data}}', data);
                // console.log (dotString);
                viz.renderString (dotString, { engine: 'dot', format: 'svg' })
                .then
                (
                    result =>
                    {
                        svgResult = postProcessSVG (result); // Hack to fix incorrect horizontal centering of text in circle!
                        graphContainer.innerHTML = svgResult;
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
        instructions: instructions.open
    };
    context.setPrefs (prefs);
};
//
