//
const unit = document.getElementById ('unihan-radical-strokes-unit');
//
const setSelect = unit.querySelector ('.set-select');
const extraSourcesCheckbox = unit.querySelector ('.extra-sources-checkbox');
const radicalSelect = unit.querySelector ('.radical-select');
const strokesSelect = unit.querySelector ('.strokes-select');
const searchButton = unit.querySelector ('.search-button');
const resultsButton = unit.querySelector ('.results-button');
const hitCount = unit.querySelector ('.hit-count');
const totalCount = unit.querySelector ('.total-count');
const searchData = unit.querySelector ('.search-data');
//
const instructions = unit.querySelector ('.instructions');
const radicalList = unit.querySelector ('.radical-list');
const radicals = unit.querySelector ('.radicals');
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
const params = { };
//
let currentRadical;
let currentStrokes;
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const { clipboard, remote } = require ('electron');
    const { Menu } = remote;
    //
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const linksList = require ('../../lib/links-list.js');
    //
    const regexp = require ('../../lib/unicode/regexp.js');
    const unicode = require ('../../lib/unicode/unicode.js');
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
    const kangxiRadicals = require ('../../lib/unicode/kangxi-radicals.json');
    const { fromRSValue } = require ('../../lib/unicode/get-rs-strings.js');
    const { fromRadical, fromStrokes, fromRadicalStrokes } = require ('../../lib/unicode/get-rs-strings.js');
    const getCompatibilitySource = require ('../../lib/unicode/get-cjk-compatibility-source.js');
    //
    let unihanCount = unihanData.fullSet.length;
    //
    const defaultPrefs =
    {
        setSelect: "",
        extraSourcesCheckbox: false,
        radicalSelect: "",
        strokesSelect: "",
        compactLayout: false,
        instructions: true,
        radicalList: false,
        references: false,
        //
        defaultFolderPath: context.defaultFolderPath
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    defaultFolderPath = prefs.defaultFolderPath;
    //
    function saveResults (string)
    {
        fileDialogs.saveTextFile
        (
            "Save text file:",
            [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
            defaultFolderPath,
            (filePath) =>
            {
                defaultFolderPath = path.dirname (filePath);
                return string;
            }
        );
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
    params.compactLayout = prefs.compactLayout;
    params.observer = null;
    params.root = unit;
    //
    const rsDataTable = require ('./rs-data-table.js');
    //
    setSelect.value = prefs.setSelect;
    if (setSelect.selectedIndex < 0) // -1: no element is selected
    {
        setSelect.selectedIndex = 0;
    }
    //
    extraSourcesCheckbox.checked = prefs.extraSourcesCheckbox;
    //
    currentRadical = prefs.radicalSelect;
    currentStrokes = prefs.strokesSelect;
    //
    let lastStrokes = 0;
    let optionGroup = null;
    kangxiRadicals.forEach
    (
        (radical, index) =>
        {
            if (lastStrokes !== radical.strokes)
            {
                if (optionGroup)
                {
                    radicalSelect.appendChild (optionGroup);
                }
                optionGroup = document.createElement ('optgroup');
                optionGroup.label = `◎\xA0\xA0${fromRadicalStrokes (radical.strokes, true).replace (" ", "\u2002")}`;
                lastStrokes = radical.strokes;
            }
            let option = document.createElement ('option');
            option.textContent = `${fromRadical (index + 1).replace (/^(\S+)\s(\S+)\s/u, "$1\u2002$2\u2002")}`;
            option.value = index + 1;
            optionGroup.appendChild (option);
        }
    );
    radicalSelect.appendChild (optionGroup);
    //
    radicalSelect.value = currentRadical;
    if (radicalSelect.selectedIndex < 0) // -1: no element is selected
    {
        radicalSelect.selectedIndex = 0;
    }
    currentRadical = radicalSelect.value;
    //
    radicalSelect.addEventListener ('input', event => { currentRadical = event.currentTarget.value; });
    //
    const minStrokes = 0;
    const maxStrokes = 76;  // 𱁬 U+3106C kRSUnicode 173.76
    //
    let allOption = document.createElement ('option');
    allOption.textContent = "All";
    allOption.value = '*';
    strokesSelect.appendChild (allOption);
    let separatorOption = document.createElement ('option');
    separatorOption.textContent = "\u2015";   // Horizontal bar
    separatorOption.disabled = true;
    strokesSelect.appendChild (separatorOption);
    for (let strokesIndex = minStrokes; strokesIndex <= maxStrokes; strokesIndex++)
    {
        let option = document.createElement ('option');
        option.textContent = strokesIndex;
        strokesSelect.appendChild (option);
    }
    //
    strokesSelect.value = currentStrokes;
    if (strokesSelect.selectedIndex < 0) // -1: no element is selected
    {
        strokesSelect.selectedIndex = 0;
    }
    currentStrokes = strokesSelect.value;
    //
    strokesSelect.addEventListener ('input', event => { currentStrokes = event.currentTarget.value; });
    //
    const rsTags =
    [
        "kRSUnicode",   // Must be first
        "kRSKangXi",
        "kRSAdobe_Japan1_6"
    ];
    //
    function getFullRSTooltip (codePoint, verbose)
    {
        let tags = unihanData.codePoints[codePoint];
        //
        let rsValues = [ ];
        let rsIRGCount = 0;
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
        rsValues = rsValues.map ((rsValue, index) => ((index < rsIRGCount) ? "●\xA0\xA0" : "○\xA0\xA0") + fromRSValue (rsValue, verbose).join (" +\xA0"));
        //
        return rsValues.join ("\n");
    }
    //
    function getTooltip (character)
    {
        let data = unicode.getCharacterBasicData (character);
        let status = regexp.isUnified (character) ? "Unified Ideograph" : "Compatibility Ideograph";
        let source = (!regexp.isUnified (character)) ? getCompatibilitySource (character) : "";
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
        if (source)
        {
            lines.push (`Source: ${source}`);
        }
        return lines.join ("\n");
    }
    //
    function findCharactersByRadicalStrokes (options)
    {
        let items = [ ];
        for (let strokes = options.minStrokes; strokes <= options.maxStrokes; strokes++)
        {
            items.push ({ shortTitle: fromStrokes (strokes), longTitle: fromStrokes (strokes, true), characters: [ ] });
        }
        let codePoints = unihanData.codePoints;
        for (let codePoint of options.set)
        {
            let rsValues = [ ];
            let irgSourceValues = null;
            for (let rsTag of rsTags)
            {
                let rsTagValues = codePoints[codePoint][rsTag];
                if (rsTagValues)
                {
                    if (!Array.isArray (rsTagValues))
                    {
                        rsTagValues = [ rsTagValues ];
                    }
                    if (rsTag == "kRSUnicode")
                    {
                        irgSourceValues = [...rsTagValues];
                    }
                    else if (!options.extraSources)
                    {
                        break;
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
            // Remove duplicates
            rsValues = [...new Set (rsValues.map (rsValue => rsValue.replace ("'", "").replace (/\.-\d+/, ".0")))];
            irgSourceValues = [...new Set (irgSourceValues.map (rsValue => rsValue.replace ("'", "").replace (/\.-\d+/, ".0")))];
            for (let rsValue of rsValues)
            {
                let [ tagRadical, tagResidual ] = rsValue.split (".");
                if (parseInt (tagRadical) === options.radical)
                {
                    let residualStrokes = parseInt (tagResidual);
                    if ((options.minStrokes <= residualStrokes) && (residualStrokes <= options.maxStrokes))
                    {
                        let code = codePoint.replace ("U+", "");
                        let character = { symbol: String.fromCodePoint (parseInt (code, 16)), code: code };
                        if (options.extraSources)
                        {
                            let extraSource = !irgSourceValues.includes (rsValue);
                            if (extraSource)
                            {
                                character.extraSource = extraSource;
                            }
                        }
                        character.tooltip = getFullRSTooltip (codePoint);
                        character.codeTooltip = getTooltip (character.symbol);
                        items[residualStrokes - options.minStrokes].characters.push (character);
                    }
                }
            }
        }
        return items;
    }
    //
    function updateRadicalStrokesResults (hit, total)
    {
        hitCount.textContent = hit;
        totalCount.textContent = total;
        resultsButton.disabled = (hit <= 0);
    }
    //
    let currentCharactersByRadicalStrokes = [ ];
    //
    searchButton.addEventListener
    (
        'click',
        (event) =>
        {
            clearSearch (searchData);
            let set;
            if (setSelect.value === "IICore")
            {
                set = unihanData.coreSet;
            }
            else if (setSelect.value === "U-Core")
            {
                set = unihanData.core2020Set;
            }
            else if (setSelect.value === "Full")
            {
                set = unihanData.fullSet;
            }
            let findOptions =
            {
                set: set,
                extraSources: extraSourcesCheckbox.checked,
                radical: parseInt (currentRadical),
                minStrokes: (currentStrokes === '*') ? minStrokes : parseInt (currentStrokes),
                maxStrokes: (currentStrokes === '*') ? maxStrokes : parseInt (currentStrokes)
            };
            let characters = [ ];
            let items = findCharactersByRadicalStrokes (findOptions);
            for (let item of items)
            {
                for (let character of item.characters)
                {
                    characters.push (character.symbol);
                }
            };
            currentCharactersByRadicalStrokes = characters;
            updateRadicalStrokesResults (currentCharactersByRadicalStrokes.length, unihanCount);
            if (characters.length > 0)
            {
                let title = fromRadical (radicalSelect.selectedIndex + 1, false, true).replace (/^(\S+)\s(\S+)\s(\S+)\s/u, "$1\u2002$2\u2002$3\u2002");
                searchData.appendChild (rsDataTable.create (title, items, params));
            }
        }
    );
    //
    let rsResultsMenu =
    Menu.buildFromTemplate
    (
        [
            {
                label: "Copy Results", // "Copy Results as String"
                click: () => 
                {
                    if (currentCharactersByRadicalStrokes.length > 0)
                    {
                        clipboard.writeText (currentCharactersByRadicalStrokes.join (""));
                    }
                }
            },
            {
                label: "Save Results...", // "Save Results to File"
                click: () => 
                {
                    saveResults (currentCharactersByRadicalStrokes.join (""));
                }
            },
            { type: 'separator' },
            {
                label: "Clear Results",
                click: () => 
                {
                    clearSearch (searchData);
                    currentCharactersByRadicalStrokes = [ ];
                    updateRadicalStrokesResults (currentCharactersByRadicalStrokes.length, unihanCount);
                }
            }
        ]
    );
    //
    resultsButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.currentTarget, rsResultsMenu);
        }
    );
    //
    updateRadicalStrokesResults (currentCharactersByRadicalStrokes.length, unihanCount);
    //
    instructions.open = prefs.instructions;
    radicalList.open = prefs.radicalList;
    //
    let radicalsTable = require ('./radicals-table.js');
    //
    radicals.appendChild (radicalsTable.create (kangxiRadicals));
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
        setSelect: setSelect.value,
        extraSourcesCheckbox: extraSourcesCheckbox.checked,
        radicalSelect: currentRadical,
        strokesSelect: currentStrokes,
        compactLayout: params.compactLayout,
        instructions: instructions.open,
        radicalList: radicalList.open,
        references: references.open,
        //
        defaultFolderPath: defaultFolderPath
    };
    context.setPrefs (prefs);
};
//
