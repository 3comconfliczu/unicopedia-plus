//
const unitId = 'emoji-picture-book-unit';
//
const unit = document.getElementById (unitId);
//
const selectGroup = unit.querySelector ('.select-group');
const sizeRange = unit.querySelector ('.size-range');
const groupContainer = unit.querySelector ('.group-container');
const instructions = unit.querySelector ('.instructions');
//
module.exports.start = function (context)
{
    let wheelSupport = false;
    //
    const minFontSize = 32;
    const maxFontSize = 128;
    const defaultFontSize = 100; // 72, 80, 84, 96, 100
    const fontAdjustmentFactor = 1.25;  // Noto Color Emoji font is 25% larger
    //
    const colorEmojiNotDefFont = `${defaultFontSize}px "Apple Color Emoji", "Noto Color Emoji", "Segoe Color Emoji", "NotDef"`;
    const colorEmojiBlankFont = `${defaultFontSize}px "Apple Color Emoji", "Noto Color Emoji", "Segoe Color Emoji", "Blank"`;
    const fallbackFontFaces = `${defaultFontSize}px "NotDef", "Blank"`;
    //
    let canvas = document.createElement ('canvas');
    canvas.width = defaultFontSize * fontAdjustmentFactor;
    canvas.height = defaultFontSize * fontAdjustmentFactor;
    let ctx = canvas.getContext ('2d');
    //
    function isFontSupported (emoji)
    {
        ctx.font = colorEmojiBlankFont;
        return Math.round (ctx.measureText (emoji).width) > 0;
    }
    //
    function isProperlyRendered (emoji)
    {
        ctx.font = colorEmojiNotDefFont;
        return Math.round (ctx.measureText (emoji).width) <= ctx.canvas.width;
    }
    //
    function getEmojiDataString (emoji)
    {
        ctx.font = colorEmojiBlankFont;
        ctx.clearRect (0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillText (emoji, 0, defaultFontSize);
        let imageWidth = Math.round (ctx.measureText (emoji).width) || ctx.canvas.width;
        let imageHeight = ctx.canvas.height;
        return ctx.getImageData (0, 0, imageWidth, imageHeight).data.toString ();
    }
    //
    let tagFlagEmojiRegex = /^(🏴)([\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]+)\u{E007F}$/u;
    //
    function isProperEmoji (emoji)
    {
        let isProper = false;
        if (isFontSupported (emoji) && isProperlyRendered (emoji))
        {
            let foundTagFlagEmoji = emoji.match (tagFlagEmojiRegex);
            if (foundTagFlagEmoji)
            {
                if (getEmojiDataString (emoji) !== getEmojiDataString (foundTagFlagEmoji[1]))
                {
                    isProper = true;
                }
            }
            else
            {
                isProper = true;
            }
        }
        return isProper;
    }
    //
    // https://www.unicode.org/emoji/charts/emoji-versions.html
    // https://www.unicode.org/reports/tr51/
    //
    // There are three special values used for emoji characters before E1.0:
    // E0.0: Emoji components that were defined before E1.0.
    // E0.6: Emoji characters deriving from Japanese carriers that were incorporated in Unicode 6.0
    // E0.7: Emoji characters deriving from the Wing/Webdings, which appeared in Unicode v7.0. Also includes those incorporated in ARIB that began to be treated as emoji in this time period.
    //
    const versionAges =
    {
        "0.6": "Unicode 6.0",
        "0.7": "Unicode 7.0",
        "1.0": "Emoji 1.0",
        "2.0": "Emoji 2.0",
        "3.0": "Emoji 3.0",
        "4.0": "Emoji 4.0",
        "5.0": "Emoji 5.0",
        "11.0": "Emoji 11.0",
        "12.0": "Emoji 12.0",
        "12.1": "Emoji 12.1",
        "13.0": "Emoji 13.0"
    };
    //
    let flagEmojiRegex =/^([🇦-🇿])([🇦-🇿])$/u;
    //
    function getEmojiTooltip (emoji)
    {
        let emojiName = emojiList[emoji].name.toUpperCase ();
        let flagFound = emoji.match (flagEmojiRegex);
        if (flagFound)
        {
            let firstLetter = String.fromCodePoint (flagFound[1].codePointAt (0) - "🇦".codePointAt (0) + "A".codePointAt (0));
            let secondLetter = String.fromCodePoint (flagFound[2].codePointAt (0) - "🇦".codePointAt (0) + "A".codePointAt (0));
            emojiName += ` [${firstLetter}${secondLetter}]`;
        }
        else
        {
            let tagFlagFound = emoji.match (tagFlagEmojiRegex);
            if (tagFlagFound)
            {
                let letters = Array.from (tagFlagFound[2], (tag) => String.fromCodePoint (tag.codePointAt (0) - 0xE0000));
                emojiName += ` [${letters.join ("").toUpperCase ().replace (/^(..)(...)$/, "$1-$2")}]`;
            }
        }
        let emojiAge = emojiList[emoji].age;
        let age = versionAges[emojiAge] || "Age Unknown";
        let lines =
        [
            emojiName,
            age.toUpperCase (),
            // U+034F COMBINING GRAPHEME JOINER
            "<" + emojiList[emoji].code.replace (/\b([0-9a-fA-F]{4,})\b/g, "U\u034F\+$&").split (" ").join (", ") + ">"
        ];
        return lines.join ("\n");
    }
    //
    const defaultPrefs =
    {
        selectGroup: "",
        fontSize: defaultFontSize,
        instructions: true
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    let headStyle = document.createElement ('style');
    document.head.appendChild (headStyle);
    //
    function setFontSize (fontSize)
    {
        sizeRange.title = `Font size: ${Math.round (fontSize)}px`;
        headStyle.textContent = `#${unitId} .plain-panel .sheet { font-size: ${fontSize}px; }`;
    }
    //
    sizeRange.min = Math.log2 (minFontSize);
    sizeRange.max = Math.log2 (maxFontSize);
    sizeRange.value = Math.log2 (prefs.fontSize);
    //
    setFontSize (Math.pow (2, sizeRange.value));
    sizeRange.addEventListener ('input', (event) => { setFontSize (Math.pow (2, event.currentTarget.value)); });
    if (wheelSupport)
    {
        sizeRange.addEventListener
        (
            'wheel',
            (event) =>
            {
                event.preventDefault ();
                let fontSize = Math.round (Math.pow (2, event.currentTarget.value) + Math.sign (event.deltaX));
                if ((fontSize >= minFontSize) && (fontSize <= maxFontSize))
                {
                    event.currentTarget.value = Math.log2 (fontSize);
                    setFontSize (fontSize);
                }
            }
        );
    }
    //
    const emojiList = require ('emoji-test-list');
    //
    const emojiGroups = require ('emoji-test-groups');
    //
    let groupNames = [ ];
    for (let group of emojiGroups)
    {
        groupNames.push (group.name)
    }
    //
    for (let groupName of groupNames)
    {
        let option = document.createElement ('option');
        option.textContent = groupName;
        selectGroup.appendChild (option);
    }
    //
    let properEmojis = { };
    //
    function getProperEmojis ()
    {
        for (let emojiGroup of emojiGroups)
        {
            for (let emojiSubgroup of emojiGroup.subgroups)
            {
                let subgroup = properEmojis[emojiSubgroup.name] = [ ];
                for (let emoji of emojiSubgroup.characters)
                {
                    if (isProperEmoji (emoji))
                    {
                        subgroup.push (emoji);
                    }
                    else
                    {
                        let altEmojis = emojiList[emoji].toNonFullyQualified;
                        if (altEmojis)
                        {
                            for (let altEmoji of altEmojis)
                            {
                                if (isProperEmoji (altEmoji))
                                {
                                    subgroup.push (altEmoji);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    //
    function updateGroup (groupName)
    {
        while (groupContainer.firstChild)
        {
            groupContainer.firstChild.remove ();
        }
        for (let group of emojiGroups)
        {
            if (group.name === groupName)
            {
                for (let subgroup of group.subgroups)
                {
                    let subgroupEmojis = properEmojis[subgroup.name];
                    if (subgroupEmojis.length > 0)
                    {
                        let panel = document.createElement ('div');
                        panel.className = 'plain-panel';
                        let h2 = document.createElement ('h2');
                        h2.textContent = subgroup.name;
                        panel.appendChild (h2);
                        let sheet = document.createElement ('div');
                        sheet.className = 'sheet';
                        for (let emoji of subgroupEmojis)
                        {
                            let span =  document.createElement ('span');
                            span.className = 'emoji';
                            span.textContent = emoji;
                            span.title = getEmojiTooltip (emoji);
                            sheet.appendChild (span);
                        }
                        panel.appendChild (sheet);
                        groupContainer.appendChild (panel);
                    }
                }
                break;
            }
        }
    }
    //
    selectGroup.value = prefs.selectGroup;
    if (selectGroup.selectedIndex < 0) // -1: no element is selected
    {
        selectGroup.selectedIndex = 0;
    }
    document.fonts.load (fallbackFontFaces).then
    (
        () =>
        {
            getProperEmojis ();
            updateGroup (selectGroup.value);
        }
    );
    //
    selectGroup.addEventListener ('input', (event) => { updateGroup (event.currentTarget.value); });
    //
    instructions.open = prefs.instructions;
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        selectGroup: selectGroup.value,
        fontSize: Math.pow (2, sizeRange.value),
        instructions: instructions.open
    };
    context.setPrefs (prefs);
};
//
