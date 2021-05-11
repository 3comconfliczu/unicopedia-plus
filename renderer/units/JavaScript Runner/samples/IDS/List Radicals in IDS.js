// List Radicals in IDS
const { codePoints } = require ('./lib/unicode/parsed-ids-data.js');
const { characterToCodePoint } = require ('./lib/unicode/unicode.js');
let radicalList = [ ];
for (let codePoint in codePoints)
{
    let { sequences } = codePoints[codePoint];
    for (let sequence of sequences)
    {
        let radicals = sequence.ids.match (/(\p{Radical})/gu);
        if (radicals)
        {
            radicalList.push (...radicals);
        }
    }
}
let uniqueRadicals = [...new Set (radicalList)].sort ();
$.writeln ("Count:", uniqueRadicals.length);
for (let radical of uniqueRadicals)
{
    $.writeln (characterToCodePoint (radical), radical);
}
