//
const fs = require ('fs');
const path = require ('path');
//
let flagEmojiRegex =/^([🇦-🇿])([🇦-🇿])$/u;
let tagFlagEmojiRegex = /^(🏴)([\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]+)\u{E007F}$/u;
//
function getFlagISOString (emoji)
{
    let isoString = "";
    let flagFound = emoji.match (flagEmojiRegex);
    if (flagFound)
    {
        let firstLetter = String.fromCodePoint (flagFound[1].codePointAt (0) - "🇦".codePointAt (0) + "A".codePointAt (0));
        let secondLetter = String.fromCodePoint (flagFound[2].codePointAt (0) - "🇦".codePointAt (0) + "A".codePointAt (0));
        isoString = `${firstLetter}${secondLetter}`;
    }
    else
    {
        let tagFlagFound = emoji.match (tagFlagEmojiRegex);
        if (tagFlagFound)
        {
            let letters = Array.from (tagFlagFound[2], (tag) => String.fromCodePoint (tag.codePointAt (0) - 0xE0000));
            isoString = `${letters.join ("").toUpperCase ().replace (/^(..)(...)$/, "$1-$2")}`;
        }
    }
    return isoString;
}
//
//
// Copy of https://www.unicode.org/repos/cldr/tags/latest/common/annotations/en.xml
// Copy of https://www.unicode.org/repos/cldr/tags/latest/common/annotationsDerived/en.xml
//
function getAnnotations (dirname, filename)
{
    let result = { };
    let xml = fs.readFileSync (path.join (__dirname, 'CLDR', dirname, filename), { encoding: 'utf8' });
    let parser = new DOMParser ();
    let doc = parser.parseFromString (xml, 'text/xml');
    let annotations = doc.querySelectorAll ('annotations > annotation');
    for (let annotation of annotations)
    {
        let character = annotation.getAttribute ('cp');
        if (!(character in result))
        {
            result[character] = { };
        }
        if (annotation.hasAttribute ('type') && (annotation.getAttribute ('type') === 'tts'))
        {
            let flagISOString = getFlagISOString (character);
            if (flagISOString)
            {
                annotation.textContent += ` [${flagISOString}]`;
            }
            result[character].shortName = annotation.textContent;
        }
        else
        {
            result[character].keywords = annotation.textContent.split ("|").map ((keyword) => { return keyword.trim (); });
        }
    }
    return result;
}
//
// Missing annotations (CLDR 38, English):
const missingAnnotations_en = 
{
    "💏🏻":
    {
        "keywords":
        [
            "couple",
            "kiss",
            "light skin tone"
        ],
        "shortName": "kiss: light skin tone"
    },
    "💏🏼":
    {
        "keywords":
        [
            "couple",
            "kiss",
            "medium-light skin tone"
        ],
        "shortName": "kiss: medium-light skin tone"
    },
    "💏🏽":
    {
        "keywords":
        [
            "couple",
            "kiss",
            "medium skin tone"
        ],
        "shortName": "kiss: medium skin tone"
    },
    "💏🏾":
    {
        "keywords":
        [
            "couple",
            "kiss",
            "medium-dark skin tone"
        ],
        "shortName": "kiss: medium-dark skin tone"
    },
    "💏🏿":
    {
        "keywords":
        [
            "couple",
            "kiss",
            "dark skin tone"
        ],
        "shortName": "kiss: dark skin tone"
    },
    "💑🏻":
    {
        "keywords":
        [
            "couple",
            "couple with heart",
            "light skin tone",
            "love"
        ],
        "shortName": "couple with heart: light skin tone"
    },
    "💑🏼":
    {
        "keywords":
        [
            "couple",
            "couple with heart",
            "medium-light skin tone",
            "love"
        ],
        "shortName": "couple with heart: medium-light skin tone"
    },
    "💑🏽":
    {
        "keywords":
        [
            "couple",
            "couple with heart",
            "medium skin tone",
            "love"
        ],
        "shortName": "couple with heart: medium skin tone"
    },
    "💑🏾":
    {
        "keywords":
        [
            "couple",
            "couple with heart",
            "medium-dark skin tone",
            "love"
        ],
        "shortName": "couple with heart: medium-dark skin tone"
    },
    "💑🏿":
    {
        "keywords":
        [
            "couple",
            "couple with heart",
            "dark skin tone",
            "love"
        ],
        "shortName": "couple with heart: dark skin tone"
    }
};
//
let annotations = getAnnotations ('annotations', 'en.xml');
Object.assign (annotations, getAnnotations ('annotationsDerived', 'en.xml'), missingAnnotations_en);
//
module.exports = annotations;
//
