//
const unit = document.getElementById ('unihan-components-unit');
//
const tabs = unit.querySelectorAll ('.tab-bar .tab-radio');
const tabPanes = unit.querySelectorAll ('.tab-panes .tab-pane');
const tabInfos = unit.querySelectorAll ('.tab-infos .tab-info');
//
const lookUpHistoryButton = unit.querySelector ('.look-up-ids .history-button');
const lookUpUnihanInput = unit.querySelector ('.look-up-ids .unihan-input');
const lookUpLookUpButton = unit.querySelector ('.look-up-ids .look-up-button');
const lookUpIdsContainer = unit.querySelector ('.look-up-ids .ids-container');
const lookUpInstructions = unit.querySelector ('.look-up-ids .instructions');
const lookUpReferences = unit.querySelector ('.look-up-ids .references');
const lookUpLinks = unit.querySelector ('.look-up-ids .links');
//
const lookUpUnihanHistorySize = 128;   // 0: unlimited
//
let lookUpUnihanHistory = [ ];
let lookUpUnihanHistoryIndex = -1;
let lookUpUnihanHistorySave = null;
//
let currentLookUpUnihanCharacter;
//
const parseClearButton = unit.querySelector ('.parse-ids .clear-button');
const parseSamplesButton = unit.querySelector ('.parse-ids .samples-button');
const parseCountNumber = unit.querySelector ('.parse-ids .count-number');
const parseLoadButton = unit.querySelector ('.parse-ids .load-button');
const parseSaveButton = unit.querySelector ('.parse-ids .save-button');
const parseIdsCharacters = unit.querySelector ('.parse-ids .characters-input');
const parseDisplayModeSelect = unit.querySelector ('.parse-ids .display-mode-select');
const parseErrorMessage = unit.querySelector ('.parse-ids .error-message');
const parseExcessCharacters = unit.querySelector ('.parse-ids .excess-characters');
const parseGraphContainer = unit.querySelector ('.parse-ids .graph-container');
const parseInstructions = unit.querySelector ('.parse-ids .instructions');
const parseReferences = unit.querySelector ('.parse-ids .references');
const parseLinks = unit.querySelector ('.parse-ids .links');
//
let parseDefaultFolderPath;
//
const matchSearchString = unit.querySelector ('.match-ids .search-string');
const matchSearchMessage = unit.querySelector ('.match-ids .search-message');
const matchNestedMatch = unit.querySelector ('.match-ids .nested-match');
const matchUseRegex = unit.querySelector ('.match-ids .use-regex');
const matchSearchButton = unit.querySelector ('.match-ids .search-button');
const matchResultsButton = unit.querySelector ('.match-ids .results-button');
const matchHitCount = unit.querySelector ('.match-ids .hit-count');
const matchTotalCount = unit.querySelector ('.match-ids .total-count');
const matchSearchData = unit.querySelector ('.match-ids .search-data');
const matchInstructions = unit.querySelector ('.match-ids .instructions');
const matchRegexExamples = unit.querySelector ('.match-ids .regex-examples');
const matchReferences = unit.querySelector ('.match-ids .references');
const matchLinks = unit.querySelector ('.match-ids .links');
//
const matchParams = { };
//
let matchDefaultFolderPath;
//
module.exports.start = function (context)
{
    const { clipboard, remote, shell, webFrame } = require ('electron');
    const { BrowserWindow, getCurrentWebContents, getCurrentWindow, Menu } = remote;
    //
    const mainWindow = getCurrentWindow ();
    const webContents = getCurrentWebContents ();
    //
    const fs = require ('fs');
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const sampleMenus = require ('../../lib/sample-menus.js');
    const linksList = require ('../../lib/links-list.js');
    //
    const regexp = require ('../../lib/unicode/regexp.js');
    const unicode = require ('../../lib/unicode/unicode.js');
    const kangxiRadicals = require ('../../lib/unicode/kangxi-radicals.json');
    const { codePoints, unencodedCharacters } = require ('../../lib/unicode/parsed-ids-data.js');
    const ids = require ('../../lib/unicode/ids.js');
    //
    const idsRefLinks = require ('./ids-ref-links.json');
    //
    let unihanCount = Object.keys (codePoints).length;  // No CJK compatibility ideographs
    //
    const defaultPrefs =
    {
        tabName: "",
        //
        lookupUnihanHistory: [ ],
        lookupUnihanCharacter: "",
        lookupInstructions: true,
        lookupReferences: false,
        //
        parseIdsCharacters: "",
        parseDisplayModeSelect: "",
        parseInstructions: true,
        parseReferences: false,
        parseDefaultFolderPath: context.defaultFolderPath,
        //
        matchSearchString: "",
        matchNestedMatch: false,
        matchUseRegex: false,
        matchPageSize: 64,
        matchInstructions: true,
        matchRegexExamples: false,
        matchReferences: false,
        matchDefaultFolderPath: context.defaultFolderPath
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    let textSeparator = (process.platform === 'darwin') ? "\t" : "\xA0\xA0";
    //
    let insertCharacter = (menuItem) => { webContents.insertText (menuItem.id); };
    //
    let insertMenuTemplate =
    [
        {　label: "Insert Operator",　submenu:　[　]　},
        {　label: "Insert Radical Form",　submenu:　[　]　},
        {　label: "Insert Unencoded Component",　submenu:　[　]　}
    ];
    let operatorSubmenu = insertMenuTemplate[0].submenu;
    for (let operator in ids.operators)
    {
        let idcData = ids.operators[operator];
        operatorSubmenu.push
        (
            {
                label: `${operator}${textSeparator}<${unicode.characterToCodePoint (operator)}>${textSeparator}${idcData.name}`,
                id: operator,
                click: insertCharacter
            }
        );
    }
    let radicalFormSubmenu = insertMenuTemplate[1].submenu;
    const equivalentRadicals =
    {
        // "⺍": "𭕄",
        // "⺩": "𤣩",
        // "⺫": "罒",
        // "⻏": "阝"
    };
    for (let kangxiRadical of kangxiRadicals)
    {
        let number = kangxiRadical.number;
        let radical = kangxiRadical.radical;
        let unified = kangxiRadical.unified;
        let radicalForm = (radical in equivalentRadicals) ? equivalentRadicals[radical] : unified;
        let name = kangxiRadical.name;
        let info = `KangXi Rad.\xA0${number}\xA0\xA0${radical}\xA0\xA0(${name})`;
        radicalFormSubmenu.push
        (
            {
                label: `${radicalForm}${textSeparator}<${unicode.characterToCodePoint (radicalForm)}>${textSeparator}${info}`,
                id: radicalForm,
                click: insertCharacter
            }
        );
        if ("cjk" in kangxiRadical)
        {
            let ckjRadicals = kangxiRadical.cjk;
            for (let ckjRadical of ckjRadicals)
            {
                let radical = ckjRadical.radical;
                let radicalForm;
                if (radical in equivalentRadicals)
                {
                    radicalForm = equivalentRadicals[radical];
                }
                else if (ckjRadical.unified === unified)
                {
                    radicalForm = radical;
                }
                else
                {
                    radicalForm = ckjRadical.unified;
                }
                let info = `CJK Radical\xA0${number}\xA0\xA0${radical}\xA0\xA0(${ckjRadical.name})`;
                radicalFormSubmenu.push
                (
                    {
                        label: `${radicalForm}${textSeparator}<${unicode.characterToCodePoint (radicalForm)}>${textSeparator}${info}`,
                        id: radicalForm,
                        click: insertCharacter
                    }
                );
            }
        }
    }
    let unencodedSubmenu = insertMenuTemplate[2].submenu;
    for (let character in unencodedCharacters)
    {
        let value = unencodedCharacters[character];
        unencodedSubmenu.push
        (
            {
                label: `<${unicode.characterToCodePoint (character)}>${textSeparator}${value.number}\xA0${value.comment}`,
                id: character,
                click: insertCharacter
            }
        );
    }
    let insertContextualMenu = Menu.buildFromTemplate (insertMenuTemplate);
    //
    function updateTab (tabName)
    {
        let foundIndex = 0;
        tabs.forEach
        (
            (tab, index) =>
            {
                let match = (tab.parentElement.textContent === tabName);
                if (match)
                {
                    foundIndex = index;
                }
                else
                {
                    tab.checked = false;
                    tabPanes[index].hidden = true;
                    tabInfos[index].hidden = true;
                }
            }
        );
        tabs[foundIndex].checked = true;
        tabPanes[foundIndex].hidden = false;
        tabInfos[foundIndex].hidden = false;
    }
    //
    updateTab (prefs.tabName);
    //
    for (let tab of tabs)
    {
        tab.addEventListener ('click', (event) => { updateTab (event.currentTarget.parentElement.textContent); });
    }
    //
    function clearSearch (data)
    {
        while (data.firstChild)
        {
            data.firstChild.remove ();
        }
    }
    //
    function getTooltip (character, isInvalid)
    {
        let tooltip;
        let data = unicode.getCharacterBasicData (character);
        tooltip = `<${data.codePoint}>\xA0${(data.name === "<control>") ? data.alias : data.name}`;
        if (character in unencodedCharacters)
        {
            let value = unencodedCharacters[character];
            tooltip += `\n${value.number}\xA0${value.comment}`;
        }
        else if (isInvalid)
        {
            tooltip += `\n(not a valid component)`;
        }
        return tooltip;
    }
    //
    function createIDSTable (unihanCharacter, IDSCharacters, IDSSource)
    {
        let table = document.createElement ('table');
        table.className = 'wrapper';
        let characters = document.createElement ('tr');
        characters.className = 'characters';
        let character = document.createElement ('td');
        character.className = 'character';
        character.title = getTooltip (unihanCharacter);
        character.textContent = unihanCharacter;
        characters.appendChild (character);
        let characterGap = document.createElement ('td');
        characterGap.className = 'gap';
        characters.appendChild (characterGap);
        let idsCharacters = document.createElement ('td');
        idsCharacters.className = 'ids-characters';
        if (IDSCharacters)
        {
            for (let IDScharacter of IDSCharacters)
            {
                let symbol = document.createElement ('span');
                symbol.className = 'symbol';
                symbol.title = getTooltip (IDScharacter);
                symbol.textContent = IDScharacter;
                idsCharacters.appendChild (symbol);
            }
        }
        if (IDSSource)
        {
            characters.title = `Source: ${IDSSource}`;
        }
        characters.appendChild (idsCharacters);
        table.appendChild (characters);
        let rowGap = document.createElement ('tr');
        rowGap.className = 'row-gap';
        table.appendChild (rowGap);
        let codePoints = document.createElement ('tr');
        codePoints.className = 'code-points';
        let codePoint = document.createElement ('td');
        codePoint.className = 'code-point';
        codePoint.textContent = unicode.characterToCodePoint (unihanCharacter);
        codePoints.appendChild (codePoint);
        codepointGap = document.createElement ('td');
        codepointGap.className = 'gap';
        codePoints.appendChild (codepointGap);
        let idsCodePoints = document.createElement ('td');
        idsCodePoints.className = 'ids-code-points';
        if (IDSCharacters)
        {
            idsCodePoints.textContent = unicode.charactersToCodePoints (IDSCharacters);
        }
        codePoints.appendChild (idsCodePoints);
        table.appendChild (codePoints);
        return table;
    }
    //
    lookUpUnihanHistory = prefs.lookupUnihanHistory;
    //
    function displayLookUpData (unihanCharacter)
    {
        while (lookUpIdsContainer.firstChild)
        {
            lookUpIdsContainer.firstChild.remove ();
        }
        currentLookUpUnihanCharacter = unihanCharacter;
        if (unihanCharacter)
        {
            let indexOfUnihanCharacter = lookUpUnihanHistory.indexOf (unihanCharacter);
            if (indexOfUnihanCharacter !== -1)
            {
                lookUpUnihanHistory.splice (indexOfUnihanCharacter, 1);
            }
            lookUpUnihanHistory.unshift (unihanCharacter);
            if ((lookUpUnihanHistorySize > 0) && (lookUpUnihanHistory.length > lookUpUnihanHistorySize))
            {
                lookUpUnihanHistory.pop ();
            }
            lookUpUnihanHistoryIndex = -1;
            lookUpUnihanHistorySave = null;
            //
            let data = codePoints[unicode.characterToCodePoint (unihanCharacter)];
            if (data)
            {
                for (let sequence of data.sequences)
                {
                    lookUpIdsContainer.appendChild (createIDSTable (unihanCharacter, sequence.ids, sequence.source));
                }
            }
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
            if (!(regexp.isUnihan (character) && regexp.isUnified (character)))
            {
                character = "";
            }
        }
        return character;
    }
    //
    lookUpUnihanInput.addEventListener
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
    lookUpUnihanInput.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === 'Enter')
            {
                event.preventDefault ();
                lookUpLookUpButton.click ();
            }
        }
    );
    lookUpUnihanInput.addEventListener
    (
        'keydown',
        (event) =>
        {
            if (event.altKey)
            {
                if (event.key === 'ArrowUp')
                {
                    event.preventDefault ();
                    if (lookUpUnihanHistoryIndex === -1)
                    {
                        lookUpUnihanHistorySave = event.currentTarget.value;
                    }
                    lookUpUnihanHistoryIndex++;
                    if (lookUpUnihanHistoryIndex > (lookUpUnihanHistory.length - 1))
                    {
                        lookUpUnihanHistoryIndex = (lookUpUnihanHistory.length - 1);
                    }
                    if (lookUpUnihanHistoryIndex !== -1)
                    {
                        event.currentTarget.value = lookUpUnihanHistory[lookUpUnihanHistoryIndex];
                        event.currentTarget.dispatchEvent (new Event ('input'));
                    }
                }
                else if (event.key === 'ArrowDown')
                {
                    event.preventDefault ();
                    lookUpUnihanHistoryIndex--;
                    if (lookUpUnihanHistoryIndex < -1)
                    {
                        lookUpUnihanHistoryIndex = -1;
                        lookUpUnihanHistorySave = null;
                    }
                    if (lookUpUnihanHistoryIndex === -1)
                    {
                        if (lookUpUnihanHistorySave !== null)
                        {
                            event.currentTarget.value = lookUpUnihanHistorySave;
                            event.currentTarget.dispatchEvent (new Event ('input'));
                        }
                    }
                    else
                    {
                        event.currentTarget.value = lookUpUnihanHistory[lookUpUnihanHistoryIndex];
                        event.currentTarget.dispatchEvent (new Event ('input'));
                    }
                }
            }
        }
    );
    //
    function updateLookUpUnihanData (character)
    {
        lookUpUnihanInput.value = "";
        lookUpUnihanInput.blur ();
        lookUpUnihanInput.dispatchEvent (new Event ('input'));
        displayLookUpData (character);
        unit.scrollTop = 0;
        unit.scrollLeft = 0;
    }
    //
    lookUpLookUpButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (lookUpUnihanInput.value)
            {
                let character = parseUnihanCharacter (lookUpUnihanInput.value);
                if (character)
                {
                    updateLookUpUnihanData (character);
                }
                else
                {
                    shell.beep ();
                }
            }
            else
            {
                lookUpUnihanHistoryIndex = -1;
                lookUpUnihanHistorySave = null;
                updateLookUpUnihanData ("");
            }
        }
    );
    //
    function insertUnihanCharacter (menuItem)
    {
        lookUpUnihanInput.value = menuItem.id;
        lookUpUnihanInput.dispatchEvent (new Event ('input'));
        lookUpLookUpButton.click ();
    };
    lookUpHistoryButton.addEventListener
    (
        'click',
        (event) =>
        {
            let historyMenuTemplate = [ ];
            historyMenuTemplate.push ({ label: "Lookup History", enabled: false })
            // historyMenuTemplate.push ({ type: 'separator' })
            if (lookUpUnihanHistory.length > 0)
            {
                for (let unihan of lookUpUnihanHistory)
                {
                    historyMenuTemplate.push
                    (
                        {
                            label: `${unihan}${textSeparator}${unicode.characterToCodePoint (unihan)}`,
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
    currentLookUpUnihanCharacter = prefs.lookupUnihanCharacter;
    updateLookUpUnihanData (currentLookUpUnihanCharacter);
    //
    lookUpInstructions.open = prefs.lookupInstructions;
    //
    lookUpReferences.open = prefs.lookupReferences;
    //
    linksList (lookUpLinks, idsRefLinks);
    //
    parseDefaultFolderPath = prefs.parseDefaultFolderPath;
    //
    parseClearButton.addEventListener
    (
        'click',
        (event) =>
        {
            parseIdsCharacters.value = "";
            parseIdsCharacters.focus ();
            parseIdsCharacters.dispatchEvent (new Event ('input'));
        }
    );
    //
    const parseSamples = require ('./parse-samples.json');
    //
    let parseTextMenu = sampleMenus.makeMenu
    (
        parseSamples,
        (sample) =>
        {
            parseIdsCharacters.value = sample.string;
            parseIdsCharacters.dispatchEvent (new Event ('input'));
        }
    );
    //
    parseSamplesButton.addEventListener
    (
        'click',
        event =>
        {
            pullDownMenus.popup (event.currentTarget, parseTextMenu);
        }
    );
    //
    parseLoadButton.addEventListener
    (
        'click',
        (event) =>
        {
            fileDialogs.loadTextFile
            (
                "Load text file:",
                [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
                parseDefaultFolderPath,
                'utf8',
                (text, filePath) =>
                {
                    parseIdsCharacters.value = text;
                    parseIdsCharacters.dispatchEvent (new Event ('input'));
                    parseDefaultFolderPath = path.dirname (filePath);
                }
            );
        }
    );
    //
    parseSaveButton.addEventListener
    (
        'click',
        (event) =>
        {
            fileDialogs.saveTextFile
            (
                "Save text file:",
                [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
                parseDefaultFolderPath,
                (filePath) =>
                {
                    parseDefaultFolderPath = path.dirname (filePath);
                    return parseIdsCharacters.value;
                }
            );
        }
    );
    //
    parseDisplayModeSelect.value = prefs.parseDisplayModeSelect;
    if (parseDisplayModeSelect.selectedIndex < 0) // -1: no element is selected
    {
        parseDisplayModeSelect.selectedIndex = 0;
    }
    parseDisplayModeSelect.addEventListener
    (
        'input',
        event =>
        {
            parseIdsCharacters.dispatchEvent (new Event ('input'));
        }
    );
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
    function getFontFamily (fontFamily)
    {
        return getComputedStyle (document.body).getPropertyValue (fontFamily).replaceAll ("\"", "").trim ();
    }
    function getFontFamilyString (fontFamily)
    {
        return JSON.stringify (getFontFamily (fontFamily));
    }
    const idsFamilyString = getFontFamilyString ('--ids-family');
    //
    function postProcessSVG (svg)
    {
        let doc = parser.parseFromString (svg, 'text/xml');
        // Fix incorrect centering of text in polygon
        let polygons = doc.documentElement.querySelectorAll ('.node polygon');
        for (let polygon of polygons)
        {
            let texts = polygon.parentNode.querySelectorAll ('text');
            if (texts.length === 1)
            {
                let text = texts[0];
                let y = parseFloat (text.getAttribute ('y'));
                text.setAttribute ('y', y + 2); // Empirical adjustment
           }
        }
        // Remove unwanted tooltips
        let tooltips = doc.documentElement.querySelectorAll ('.edge title, .node title');
        for (let tooltip of tooltips)
        {
            tooltip.remove ();
        }
        return serializer.serializeToString (doc);
    }
    //
    let parser = new DOMParser ();
    let serializer = new XMLSerializer ();
    //
    function treeToGraphData (tree)
    {
        // console.log (require ('../../lib/json2.js').stringify (tree, null, 4));
        let data = "";
        let nodeIndex = 0;
        function walkTree (tree)
        {
            if ((typeof tree === 'string') && (Array.from (tree).length === 1))
            {
                if (ids.isValidOperand (tree))
                {
                    data += `    n${nodeIndex++} [ label = ${JSON.stringify (tree)}, fillcolor = "#F7F7F7", tooltip = ${JSON.stringify (getTooltip (tree))} ]\n`;
                }
                else
                {
                    data += `    n${nodeIndex++} [ label = ${JSON.stringify (tree)}, color = "#CC0000", fontcolor = "#CC0000", style = dashed, tooltip = ${JSON.stringify (getTooltip (tree, true))} ]\n`;
                }
            }
            else if (typeof tree === 'object')
            {
                if (tree === null)
                {
                    data += `    n${nodeIndex++} [ style = invis ]\n`;
                }
                else
                {
                    if ('operator' in tree)
                    {
                        let currentNodeIndex = nodeIndex;
                        data += `    n${nodeIndex++} [ label = "${tree.operator}", tooltip = ${JSON.stringify (getTooltip (tree.operator))} ]\n`;
                        for (let index = 0; index < tree.operands.length; index++)
                        {
                            if (tree.operands[index])
                            {
                                data += `    n${currentNodeIndex} -> n${nodeIndex}\n`;
                            }
                            else
                            {
                                data += `    n${currentNodeIndex} -> n${nodeIndex} [ color = "#CC0000" ]\n`;
                            }
                            walkTree (tree.operands[index]);
                        }
                    }
                }
            }
        }
        walkTree (tree);
        return data;
    }
    //
    function displayParseData (idsString)
    {
        parseErrorMessage.hidden = true;
        dotString = "";
        svgResult = "";
        while (parseGraphContainer.firstChild)
        {
            parseGraphContainer.firstChild.remove ();
        }
        if (idsString)
        {
            let delta = ids.compare (idsString);
            if (delta > 0)
            {
                parseExcessCharacters.textContent = [...idsString].slice (-delta).join ("");
                parseErrorMessage.hidden = false;
            }
            let data = treeToGraphData (ids.getTree (idsString));
            dotString =
                dotTemplate
                .replace ('{{rankdir}}', parseDisplayModeSelect.value)
                .replace ('{{fontname}}', idsFamilyString)
                .replace ('{{data}}', data);
            // console.log (dotString);
            try
            {
                viz.renderString (dotString, { engine: 'dot', format: 'svg' })
                .then
                (
                    result =>
                    {
                        svgResult = postProcessSVG (result);
                        parseGraphContainer.innerHTML = svgResult;
                    }
                );
            }
            catch (e)
            {
            }
        }
    }
    //
    parseIdsCharacters.addEventListener
    (
        'input',
        (event) =>
        {
            let idsCharacters = event.currentTarget.value;
            parseCountNumber.textContent = Array.from (idsCharacters).length;
            displayParseData (idsCharacters);
        }
    );
    //
    parseIdsCharacters.value = prefs.parseIdsCharacters;
    parseIdsCharacters.dispatchEvent (new Event ('input'));
    //
    parseIdsCharacters.addEventListener
    (
        'contextmenu',
        (event) =>
        {
            if (BrowserWindow.getFocusedWindow () === mainWindow)   // Should not be necessary...
            {
                event.preventDefault ();
                let factor = webFrame.getZoomFactor ();
                insertContextualMenu.popup ({ window: mainWindow, x: Math.round (event.x * factor), y: Math.round (event.y * factor) });
            }
        }
    );
    //
    parseInstructions.open = prefs.parseInstructions;
    //
    parseReferences.open = prefs.parseReferences;
    //
    linksList (parseLinks, idsRefLinks);
    //
    matchDefaultFolderPath = prefs.matchDefaultFolderPath;
    //
    matchNestedMatch.checked = prefs.matchNestedMatch;
    //
    matchUseRegex.checked = prefs.matchUseRegex;
    //
    const matchDataTable = require ('./match-data-table.js');
    //
    matchParams.pageSize = prefs.matchPageSize;
    //
    matchSearchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === 'Enter')
            {
                event.preventDefault ();
                matchSearchButton.click ();
            }
        }
    );
    matchSearchString.addEventListener
    (
        'focusin',
        (event) =>
        {
            if (event.currentTarget.classList.contains ('error'))
            {
                matchSearchMessage.classList.add ('shown');
            }
        }
    );
    matchSearchString.addEventListener
    (
        'focusout',
        (event) =>
        {
            if (event.currentTarget.classList.contains ('error'))
            {
                matchSearchMessage.classList.remove ('shown');
            }
        }
    );
    matchSearchString.addEventListener
    (
        'input',
        (event) =>
        {
            event.currentTarget.classList.remove ('error');
            matchSearchMessage.textContent = "";
            matchSearchMessage.classList.remove ('shown');
            if (matchUseRegex.checked)
            {
                try
                {
                    regexp.build (event.currentTarget.value, { useRegex: matchUseRegex.checked });
                }
                catch (e)
                {
                    event.currentTarget.classList.add ('error');
                    matchSearchMessage.textContent = e.message;
                    if (event.currentTarget === document.activeElement)
                    {
                        matchSearchMessage.classList.add ('shown');
                    }
                }
            }
        }
    );
    matchSearchString.value = prefs.matchSearchString;
    matchSearchString.dispatchEvent (new Event ('input'));
    //
    matchSearchString.addEventListener
    (
        'contextmenu',
        (event) =>
        {
            if (BrowserWindow.getFocusedWindow () === mainWindow)   // Should not be necessary...
            {
                event.preventDefault ();
                let factor = webFrame.getZoomFactor ();
                insertContextualMenu.popup ({ window: mainWindow, x: Math.round (event.x * factor), y: Math.round (event.y * factor) });
            }
        }
    );
    //
    matchUseRegex.addEventListener
    (
        'change',
        (event) => matchSearchString.dispatchEvent (new Event ('input'))
    );
    //
    function testMatchCharacter (character, regex, characterCheckedList, nestedMatch)
    {
        let result = false;
        if (character in characterCheckedList)
        {
            result = characterCheckedList[character];
        }
        else
        {
            result = regex.test (character);
            if (result)
            {
                characterCheckedList[character] = true;
            }
            else
            {
                let codePoint = unicode.characterToCodePoint (character);
                let data = codePoints[codePoint];
                for (let sequence of data.sequences)
                {
                    if (regex.test (sequence.ids))
                    {
                        characterCheckedList[character] = true;
                        result = true;
                        break;
                    }
                    else
                    {
                        characterCheckedList[character] = false;
                        if (nestedMatch)
                        {
                            let nestedCharacters = sequence.ids.match (/\p{Unified_Ideograph}/gu);
                            if (nestedCharacters)
                            {
                                for (let nestedCharacter of nestedCharacters)
                                {
                                    if (nestedCharacter !== character)
                                    {
                                        result = testMatchCharacter (nestedCharacter, regex, characterCheckedList, nestedMatch);
                                        if (result)
                                        {
                                            characterCheckedList[character] = true;
                                            characterCheckedList[nestedCharacter] = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if (result)
                        {
                            break;
                        }
                    }
                }
            }
        }
        return result;
    }
    //
    function findCharactersByMatch (regex, nestedMatch)
    {
        let itemArray = [ ];
        let characterCheckedList = { };
        for (let codePoint in codePoints)
        {
            let character = unicode.codePointsToCharacters (codePoint);
            if (testMatchCharacter (character, regex, characterCheckedList))
            {
                itemArray.push ({ character, nested: false });
            }
        }
        if (nestedMatch)
        {
            let nestedCharacterCheckedList = { };
            for (let codePoint in codePoints)
            {
                let character = unicode.codePointsToCharacters (codePoint);
                if (!(characterCheckedList[character]))
                {
                    if (testMatchCharacter (character, regex, nestedCharacterCheckedList, nestedMatch))
                    {
                        itemArray.push ({ character, nested: true });
                    }
                }
            }
        }
        return itemArray.sort ((a, b) => a.character.codePointAt (0) - b.character.codePointAt (0));
    }
    //
    function updateMatchResults (hitCount, totalCount)
    {
        matchHitCount.textContent = hitCount;
        matchTotalCount.textContent = totalCount;
        matchResultsButton.disabled = (hitCount <= 0);
    }
    //
    let currentCharactersByMatch = [ ];
    //
    matchSearchButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (!matchSearchString.classList.contains ('error'))
            {
                let searchString = matchSearchString.value;
                if (searchString)
                {
                    let regex = null;
                    try
                    {
                        regex = regexp.build (searchString, { useRegex: matchUseRegex.checked });
                    }
                    catch (e)
                    {
                    }
                    if (regex)
                    {
                        clearSearch (matchSearchData);
                        let characters = [ ];
                        let items = findCharactersByMatch (regex, matchNestedMatch.checked);
                        for (let item of items)
                        {
                            characters.push (item.character);
                        };
                        currentCharactersByMatch = characters;
                        updateMatchResults (currentCharactersByMatch.length, unihanCount);
                        if (currentCharactersByMatch.length > 0)
                        {
                            matchParams.pageIndex = 0;
                            matchSearchData.appendChild (matchDataTable.create (items, matchParams));
                        }
                    }
                }
            }
            else
            {
                shell.beep ();
            }
        }
    );
    //
    function saveResults (string)
    {
        fileDialogs.saveTextFile
        (
            "Save text file:",
            [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
            matchDefaultFolderPath,
            (filePath) =>
            {
                matchDefaultFolderPath = path.dirname (filePath);
                return string;
            }
        );
    }
    //
    let matchResultsMenu =
    Menu.buildFromTemplate
    (
        [
            {
                label: "Copy Results", // "Copy Results as String"
                click: () => 
                {
                    if (currentCharactersByMatch.length > 0)
                    {
                        clipboard.writeText (currentCharactersByMatch.join (""));
                    }
                }
            },
            {
                label: "Save Results...", // "Save Results to File"
                click: () => 
                {
                    saveResults (currentCharactersByMatch.join (""));
                }
            },
            { type: 'separator' },
            {
                label: "Clear Results",
                click: () => 
                {
                    clearSearch (matchSearchData);
                    currentCharactersByMatch = [ ];
                    updateMatchResults (currentCharactersByMatch.length, unihanCount);
                }
            }
        ]
    );
    //
    matchResultsButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.currentTarget, matchResultsMenu);
        }
    );
    //
    updateMatchResults (currentCharactersByMatch.length, unihanCount);
    //
    matchInstructions.open = prefs.matchInstructions;
    matchRegexExamples.open = prefs.matchRegexExamples;
    //
    matchReferences.open = prefs.matchReferences;
    //
    linksList (matchLinks, idsRefLinks);
};
//
module.exports.stop = function (context)
{
    function getCurrentTabName ()
    {
        let currentTabName = "";
        for (let tab of tabs)
        {
            if (tab.checked)
            {
                currentTabName = tab.parentElement.textContent;
                break;
            }
        }
        return currentTabName;
    }
    //
    let prefs =
    {
        tabName: getCurrentTabName (),
        //
        lookupUnihanHistory: lookUpUnihanHistory,
        lookupUnihanCharacter: currentLookUpUnihanCharacter,
        lookupInstructions: lookUpInstructions.open,
        lookupReferences: lookUpReferences.open,
        //
        parseIdsCharacters: parseIdsCharacters.value,
        parseDisplayModeSelect: parseDisplayModeSelect.value,
        parseInstructions: parseInstructions.open,
        parseReferences: parseReferences.open,
        parseDefaultFolderPath: parseDefaultFolderPath,
        //
        matchSearchString: matchSearchString.value,
        matchNestedMatch: matchNestedMatch.checked,
        matchUseRegex: matchUseRegex.checked,
        matchPageSize: matchParams.pageSize,
        matchInstructions: matchInstructions.open,
        matchRegexExamples: matchRegexExamples.open,
        matchReferences: matchReferences.open,
        matchDefaultFolderPath: matchDefaultFolderPath
    };
    context.setPrefs (prefs);
};
//
