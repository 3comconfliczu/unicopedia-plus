//
const unit = document.getElementById ('unicode-foldings-unit');
//
const clearButton = unit.querySelector ('.clear-button');
const charactersSamples = unit.querySelector ('.characters-samples');
const countNumber = unit.querySelector ('.count-number');
const loadButton = unit.querySelector ('.load-button');
const saveButton = unit.querySelector ('.save-button');
const charactersInput = unit.querySelector ('.characters-input');
const codePointsInput = unit.querySelector ('.code-points-input');
const useLocaleCheckbox = unit.querySelector ('.use-locale');
const localeSelect = unit.querySelector ('.locale-select');
const caseCountNumbers = unit.getElementsByClassName ('case-count-number');
const charactersStrings = unit.getElementsByClassName ('characters-string');
const codePointsStrings = unit.getElementsByClassName ('code-points-string');
//
const instructions = unit.querySelector ('.instructions');
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const { app } = require ('@electron/remote');
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
    function toCase (string, folding, locale)
    {
        let result = string;
        if (folding === 'uppercase')
        {
            if (typeof locale === 'undefined')
            {
                result = string.toUpperCase ();
            }
            else
            {
                result = string.toLocaleUpperCase (locale || undefined);
            }
        }
        else if (folding === 'lowercase')
        {
            if (typeof locale === 'undefined')
            {
                result = string.toLowerCase ();
            }
            else
            {
                result = string.toLocaleLowerCase (locale || undefined);
            }
        }
        return result;
    }
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
        charactersInput: "",
        useLocaleCheckbox: false,
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
        event =>
        {
            charactersInput.value = "";
            charactersInput.dispatchEvent (new Event ('input'));
            charactersInput.focus ();
        }
    );
    //
    const samples = require ('./samples.json');
    //
    let charactersMenu = sampleMenus.makeMenu
    (
        samples,
        (sample) =>
        {
            charactersInput.value = sample.string;
            charactersInput.dispatchEvent (new Event ('input'));
        }
    );
    //
    charactersSamples.addEventListener
    (
        'click',
        event =>
        {
            pullDownMenus.popup (event.currentTarget, charactersMenu);
        }
    );
    //
    defaultFolderPath = prefs.defaultFolderPath;
    //
    loadButton.addEventListener
    (
        'click',
        event =>
        {
            fileDialogs.loadTextFile
            (
                "Load text file:",
                [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
                defaultFolderPath,
                'utf8',
                (text, filePath) =>
                {
                    let maxLength = charactersInput.maxLength;
                    if (text.length > maxLength)
                    {
                        if (/[\uD800-\uDBFF]/.test (text[maxLength - 1]))   // Unpaired high surrogate
                        {
                            maxLength = maxLength - 1;
                        }
                        text = text.substring (0, maxLength);
                    }
                    charactersInput.value = text;
                    charactersInput.dispatchEvent (new Event ('input'));
                    defaultFolderPath = path.dirname (filePath);
                }
            );
        }
    );
    //
    saveButton.addEventListener
    (
        'click',
        event =>
        {
            fileDialogs.saveTextFile
            (
                "Save text file:",
                [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
                defaultFolderPath,
                (filePath) =>
                {
                    defaultFolderPath = path.dirname (filePath);
                    return charactersInput.value;
                }
            );
        }
    );
    //
    useLocaleCheckbox.checked = prefs.useLocaleCheckbox;
    useLocaleCheckbox.addEventListener
    (
        'input',
        event =>
        {
            localeSelect.disabled = !event.currentTarget.checked;
            charactersInput.dispatchEvent (new Event ('input'));
        }
    );
    //
    localeSelect.value = prefs.localeSelect;
    if (localeSelect.selectedIndex < 0) // -1: no element is selected
    {
        localeSelect.selectedIndex = 0;
    }
    localeSelect.disabled = !useLocaleCheckbox.checked;
    localeSelect.addEventListener
    (
        'input',
        event =>
        {
            charactersInput.dispatchEvent (new Event ('input'));
        }
    );
    //
    charactersInput.addEventListener
    (
        'input',
        event =>
        {
            let characters = event.currentTarget.value;
            countNumber.textContent = Array.from (characters).length;
            codePointsInput.value = unicode.charactersToCodePoints (characters, true);
            for (let index = 0; index < charactersStrings.length; index++)
            {
                let charactersString = charactersStrings[index];
                let codePointsString = codePointsStrings[index];
                charactersString.textContent = toCase (characters, charactersString.dataset.case, useLocaleCheckbox.checked ? localeSelect.value : undefined);
                codePointsString.textContent = unicode.charactersToCodePoints (charactersString.textContent);
                caseCountNumbers[index].textContent = Array.from (charactersString.textContent).length;
            }
        }
    );
    charactersInput.value = prefs.charactersInput;
    charactersInput.dispatchEvent (new Event ('input'));
    //
    codePointsInput.addEventListener
    (
        'input',
        event =>
        {
            let characters = unicode.codePointsToCharacters (event.currentTarget.value);
            countNumber.textContent = Array.from (characters).length;
            charactersInput.value = characters;
            for (let index = 0; index < charactersStrings.length; index++)
            {
                let charactersString = charactersStrings[index];
                let codePointsString = codePointsStrings[index];
                charactersString.textContent = toCase (characters, charactersString.dataset.case, useLocaleCheckbox.checked ? localeSelect.value : undefined);
                codePointsString.textContent = unicode.charactersToCodePoints (charactersString.textContent);
                caseCountNumbers[index].textContent = Array.from (charactersString.textContent).length;
            }
        }
    );
    codePointsInput.addEventListener
    (
        'change',
        event =>
        {
            event.currentTarget.value = unicode.charactersToCodePoints (charactersInput.value, true);
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
        charactersInput: charactersInput.value,
        useLocaleCheckbox: useLocaleCheckbox.checked,
        localeSelect: localeSelect.value,
        instructions: instructions.open,
        references: references.open,
        defaultFolderPath: defaultFolderPath
    };
    context.setPrefs (prefs);
};
//
