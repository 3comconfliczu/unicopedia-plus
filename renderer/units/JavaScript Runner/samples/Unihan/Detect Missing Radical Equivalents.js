// Detect Missing Radical Equivalents
const kangxiRadicals = require ('./lib/unicode/kangxi-radicals.json');
const { characterToCodePoint } = require ('./lib/unicode/unicode.js');
let cjkRadicalList = [ ];
for (let kangxiRadical of kangxiRadicals)
{
    let kangxiUnified = kangxiRadical.unified;
    if ("cjk" in kangxiRadical)
    {
        let cjkRadicals = kangxiRadical.cjk;
        for (let cjkRadical of cjkRadicals)
        {
            let cjkUnified = cjkRadical.unified;
            if (cjkUnified === kangxiUnified)
            {
                cjkRadicalList.push (cjkRadical);
            }
        }
    }
}
$.writeln ("Count:", cjkRadicalList.length);
for (let cjkRadical of cjkRadicalList)
{
    let radicalInfo = `CJK Radical ${cjkRadical.number} (${cjkRadical.name})`;
    $.writeln (characterToCodePoint (cjkRadical.radical), cjkRadical.radical, radicalInfo);
}
