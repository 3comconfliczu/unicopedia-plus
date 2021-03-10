//
const unit = document.getElementById ('unicode-segmenter-unit');
//
const clearButton = unit.querySelector ('.clear-button');
const samplesButton = unit.querySelector ('.samples-button');
const countNumber = unit.querySelector ('.count-number');
const loadButton = unit.querySelector ('.load-button');
const saveButton = unit.querySelector ('.save-button');
const textString = unit.querySelector ('.text-string');
const granularitySelect = unit.querySelector ('.granularity-select');
const localeSelect = unit.querySelector ('.locale-select');
const segmentData = unit.querySelector ('.segment-data');
//
const instructions = unit.querySelector ('.instructions');
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    const { app } = remote;
    //
    let defaultLocale = app.getLocale ();
    //
    const path = require ('path');
    //
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const sampleMenus = require ('../../lib/sample-menus.js');
    const fileDialogs = require ('../../lib/file-dialogs.js');
    const linksList = require ('../../lib/links-list.js');
    const locales = require ('../../lib/locales.js');
    //
    const unicode = require ('../../lib/unicode/unicode.js');
    //
    let option;
    option = document.createElement ('option');
    option.textContent = `Default - ${locales[defaultLocale] || defaultLocale}`;
    option.value = "";
    option.title = `'${defaultLocale}'`;
    localeSelect.appendChild (option);
    option = document.createElement ('option');
    option.textContent = "―";
    option.disabled = true;
    localeSelect.appendChild (option);
    let sortedLocales = Object.keys (locales).sort ((a, b) => locales[a].localeCompare (locales[b]));
    for (let locale of sortedLocales)
    {
        let option = document.createElement ('option');
        option.textContent = locales[locale];
        option.value = locale;
        option.title = `'${locale}'`;
        localeSelect.appendChild (option);
    }
    //
    const defaultPrefs =
    {
        textString: "",
        granularitySelect: "",
        localeSelect: "",
        instructions: true,
        references: false,
        defaultFolderPath: context.defaultFolderPath
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    clearButton.addEventListener
    (
        'click',
        (event) =>
        {
            textString.value = "";
            textString.focus ();
            textString.dispatchEvent (new Event ('input'));
        }
    );
    //
    const samples = require ('./samples.json');
    //
    let textMenu = sampleMenus.makeMenu
    (
        samples,
        (sample) =>
        {
            textString.value = sample.string;
            textString.scrollTop = 0;
            textString.scrollLeft = 0;
            textString.dispatchEvent (new Event ('input'));
        }
    );
    //
    samplesButton.addEventListener
    (
        'click',
        event =>
        {
            pullDownMenus.popup (event.currentTarget, textMenu);
        }
    );
    //
    defaultFolderPath = prefs.defaultFolderPath;
    //
    loadButton.addEventListener
    (
        'click',
        (event) =>
        {
            fileDialogs.loadTextFile
            (
                "Load text file:",
                [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
                defaultFolderPath,
                'utf8',
                (text, filePath) =>
                {
                    textString.value = text;
                    textString.scrollTop = 0;
                    textString.scrollLeft = 0;
                    textString.dispatchEvent (new Event ('input'));
                    defaultFolderPath = path.dirname (filePath);
                }
            );
        }
    );
    //
    saveButton.addEventListener
    (
        'click',
        (event) =>
        {
            fileDialogs.saveTextFile
            (
                "Save text file:",
                [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
                defaultFolderPath,
                (filePath) =>
                {
                    defaultFolderPath = path.dirname (filePath);
                    return textString.value;
                }
            );
        }
    );
    //
    let segmenter;
    //
    function updateSegmenter ()
    {
        segmenter = new Intl.Segmenter (localeSelect.value || [ ], { granularity: granularitySelect.value });
    }
    //
    granularitySelect.value = prefs.granularitySelect;
    if (granularitySelect.selectedIndex < 0) // -1: no element is selected
    {
        granularitySelect.selectedIndex = 0;
    }
    granularitySelect.addEventListener
    (
        'input',
        event =>
        {
            updateSegmenter ();
            textString.dispatchEvent (new Event ('input'));
        }
    );
    //
    localeSelect.value = prefs.localeSelect;
    if (localeSelect.selectedIndex < 0) // -1: no element is selected
    {
        localeSelect.selectedIndex = 0;
    }
    localeSelect.addEventListener
    (
        'input',
        event =>
        {
            updateSegmenter ();
            textString.dispatchEvent (new Event ('input'));
        }
    );
    //
    updateSegmenter ();
    //
    function segmentSplit (string)
    {
        let segmentList = [ ];
        let segments = segmenter.segment (string);
        for (let { segment, isWordLike } of segments)
        {
            segmentList.push ({ segment, isWordLike });
        }
        return segmentList;
    }
    //
    const maxTooltipCount = 24;
    //
    function updateSegmentData (text)
    {
        while (segmentData.firstChild)
        {
            segmentData.firstChild.remove ();
        }
        let segments = segmentSplit (text);
        if (segments.length > 0)
        {
            let segmentList = document.createElement ('div');
            segmentList.className = 'segment-list';
            for (let segment of segments)
            {
                let span = document.createElement ('span');
                span.className = 'segment';
                span.classList.add (granularitySelect.value);
                if ((granularitySelect.value === 'word') && (!segment.isWordLike))
                {
                    span.classList.add ('non-word-like');
                }
                span.textContent = segment.segment;
                let characters = Array.from (segment.segment);
                let count = characters.length;
                span.title = `Count: ${count}`;
                span.title += "\n";
                span.title += "────\n";
                span.title += characters.splice (0, maxTooltipCount).map ((char) => `${unicode.characterToCodePoint (char)}\t${char}`).join ("\n");
                if (count > maxTooltipCount)
                {
                    span.title += "\n";
                    span.title += `[...${count - maxTooltipCount} more]`;
                }
                segmentList.appendChild (span);
            }
            segmentData.appendChild (segmentList);
        }
    }
    //
    textString.value = prefs.textString;
    textString.addEventListener
    (
        'input',
        event =>
        {
            let characters = event.currentTarget.value;
            countNumber.textContent = Array.from (characters).length;
            updateSegmentData (characters);
        }
    );
    textString.dispatchEvent (new Event ('input'));
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
        textString: textString.value,
        granularitySelect: granularitySelect.value,
        localeSelect: localeSelect.value,
        instructions: instructions.open,
        references: references.open,
        defaultFolderPath: defaultFolderPath
    };
    context.setPrefs (prefs);
};
//
