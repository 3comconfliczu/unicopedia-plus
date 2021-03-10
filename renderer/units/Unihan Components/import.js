//
const unit = document.getElementById ('unihan-components-unit');
//
const tabs = unit.querySelectorAll ('.tab-bar .tab-radio');
const tabPanes = unit.querySelectorAll ('.tab-panes .tab-pane');
const tabInfos = unit.querySelectorAll ('.tab-infos .tab-info');
//
const lookupHistoryButton = unit.querySelector ('.lookup-ids .history-button');
const lookupUnihanInput = unit.querySelector ('.lookup-ids .unihan-input');
const lookupLookupButton = unit.querySelector ('.lookup-ids .lookup-button');
const lookupIdsContainer = unit.querySelector ('.lookup-ids .ids-container');
const lookupInstructions = unit.querySelector ('.lookup-ids .instructions');
const lookupReferences = unit.querySelector ('.lookup-ids .references');
const lookupLinks = unit.querySelector ('.lookup-ids .links');
//
const lookupUnihanHistorySize = 128;   // 0: unlimited
//
let lookupUnihanHistory = [ ];
let lookupUnihanHistoryIndex = -1;
let lookupUnihanHistorySave = null;
//
let currentLookupUnihanCharacter;
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
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const linksList = require ('../../lib/links-list.js');
    //
    const regexp = require ('../../lib/unicode/regexp.js');
    const unicode = require ('../../lib/unicode/unicode.js');
    const { codePoints, unencodedCharacters } = require ('../../lib/unicode/parsed-ids-data.js');
    //
    const idsRefLinks = require ('./ids-ref-links.json');
    //
    const ids = require ('./ids.js');
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
    let insertIDC = (menuItem) => { webContents.insertText (menuItem.id); };
    //
    let insertMenuTemplate =
    [
        {
            label: "Insert Operator",
            submenu:
            [
            ]
        }
    ];
    let operatorsSubmenu = insertMenuTemplate[0].submenu;
    for (let idc in ids.idcCharacters)
    {
        let idcData = ids.idcCharacters[idc];
        operatorsSubmenu.push
        (
            {
                label: `${idc}\xA0\xA0<${unicode.characterToCodePoint (idc)}>\xA0${idcData.name}`,
                id: idc,
                click: insertIDC
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
    function createIDSTable (unihanCharacter, IDSCharacters, IDSSource)
    {
        let table = document.createElement ('table');
        table.className = 'wrapper';
        let characters = document.createElement ('tr');
        characters.className = 'characters';
        let character = document.createElement ('td');
        character.className = 'character';
        let data = unicode.getCharacterBasicData (unihanCharacter);
        character.title = `${data.codePoint}\xA0${data.name}`;
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
                let data = unicode.getCharacterBasicData (IDScharacter);
                symbol.title = `${data.codePoint}\xA0${data.name}`;
                if (IDScharacter in unencodedCharacters)
                {
                    symbol.title += `\n(${unencodedCharacters[IDScharacter]})`;
                }
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
    lookupUnihanHistory = prefs.lookupUnihanHistory;
    //
    function displayData (unihanCharacter)
    {
        while (lookupIdsContainer.firstChild)
        {
            lookupIdsContainer.firstChild.remove ();
        }
        currentLookupUnihanCharacter = unihanCharacter;
        if (unihanCharacter)
        {
            let indexOfUnihanCharacter = lookupUnihanHistory.indexOf (unihanCharacter);
            if (indexOfUnihanCharacter !== -1)
            {
                lookupUnihanHistory.splice (indexOfUnihanCharacter, 1);
            }
            lookupUnihanHistory.unshift (unihanCharacter);
            if ((lookupUnihanHistorySize > 0) && (lookupUnihanHistory.length > lookupUnihanHistorySize))
            {
                lookupUnihanHistory.pop ();
            }
            lookupUnihanHistoryIndex = -1;
            lookupUnihanHistorySave = null;
            //
            let data = codePoints[unicode.characterToCodePoint (unihanCharacter)];
            if (data)
            {
                for (let sequence of data.sequences)
                {
                    lookupIdsContainer.appendChild (createIDSTable (unihanCharacter, sequence.ids, sequence.source));
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
    lookupUnihanInput.addEventListener
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
    lookupUnihanInput.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === 'Enter')
            {
                event.preventDefault ();
                lookupLookupButton.click ();
            }
        }
    );
    lookupUnihanInput.addEventListener
    (
        'keydown',
        (event) =>
        {
            if (event.altKey)
            {
                if (event.key === 'ArrowUp')
                {
                    event.preventDefault ();
                    if (lookupUnihanHistoryIndex === -1)
                    {
                        lookupUnihanHistorySave = event.currentTarget.value;
                    }
                    lookupUnihanHistoryIndex++;
                    if (lookupUnihanHistoryIndex > (lookupUnihanHistory.length - 1))
                    {
                        lookupUnihanHistoryIndex = (lookupUnihanHistory.length - 1);
                    }
                    if (lookupUnihanHistoryIndex !== -1)
                    {
                        event.currentTarget.value = lookupUnihanHistory[lookupUnihanHistoryIndex];
                        event.currentTarget.dispatchEvent (new Event ('input'));
                    }
                }
                else if (event.key === 'ArrowDown')
                {
                    event.preventDefault ();
                    lookupUnihanHistoryIndex--;
                    if (lookupUnihanHistoryIndex < -1)
                    {
                        lookupUnihanHistoryIndex = -1;
                        lookupUnihanHistorySave = null;
                    }
                    if (lookupUnihanHistoryIndex === -1)
                    {
                        if (lookupUnihanHistorySave !== null)
                        {
                            event.currentTarget.value = lookupUnihanHistorySave;
                            event.currentTarget.dispatchEvent (new Event ('input'));
                        }
                    }
                    else
                    {
                        event.currentTarget.value = lookupUnihanHistory[lookupUnihanHistoryIndex];
                        event.currentTarget.dispatchEvent (new Event ('input'));
                    }
                }
            }
        }
    );
    //
    function updateUnihanData (character)
    {
        lookupUnihanInput.value = "";
        lookupUnihanInput.blur ();
        lookupUnihanInput.dispatchEvent (new Event ('input'));
        displayData (character);
        unit.scrollTop = 0;
        unit.scrollLeft = 0;
    }
    //
    lookupLookupButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (lookupUnihanInput.value)
            {
                let character = parseUnihanCharacter (lookupUnihanInput.value);
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
                lookupUnihanHistoryIndex = -1;
                lookupUnihanHistorySave = null;
                updateUnihanData ("");
            }
        }
    );
    //
    function insertUnihanCharacter (menuItem)
    {
        lookupUnihanInput.value = menuItem.id;
        lookupUnihanInput.dispatchEvent (new Event ('input'));
        lookupLookupButton.click ();
    };
    lookupHistoryButton.addEventListener
    (
        'click',
        (event) =>
        {
            let historyMenuTemplate = [ ];
            if (lookupUnihanHistory.length > 0)
            {
                for (let unihan of lookupUnihanHistory)
                {
                    historyMenuTemplate.push
                    (
                        {
                            label: `${unihan}${(process.platform === 'darwin') ? "\t" : "\xA0\xA0"}${unicode.characterToCodePoint (unihan)}`,
                            id: unihan,
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
            pullDownMenus.popup (event.currentTarget, historyContextualMenu);
        }
    );
    //
    currentLookupUnihanCharacter = prefs.lookupUnihanCharacter;
    updateUnihanData (currentLookupUnihanCharacter);
    //
    lookupInstructions.open = prefs.lookupInstructions;
    //
    lookupReferences.open = prefs.lookupReferences;
    //
    linksList (lookupLinks, idsRefLinks);
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
        lookupUnihanHistory: lookupUnihanHistory,
        lookupUnihanCharacter: currentLookupUnihanCharacter,
        lookupInstructions: lookupInstructions.open,
        lookupReferences: lookupReferences.open,
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
