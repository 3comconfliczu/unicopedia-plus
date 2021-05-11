// List CJK Strokes in IDS
const { codePoints } = require ('./lib/unicode/parsed-ids-data.js');
const { characterToCodePoint } = require ('./lib/unicode/unicode.js');
let strokeList = [ ];
for (let codePoint in codePoints)
{
    let { sequences } = codePoints[codePoint];
    for (let sequence of sequences)
    {
        if (!/-/u.test (sequence.ids))
        {
            let strokes = sequence.ids.match (/([㇀-㇣])/gu);
            if (strokes)
            {
                strokeList.push (...strokes);
            }
        }
    }
}
let uniqueStrokes = [...new Set (strokeList)].sort ();
$.writeln ("Count:", uniqueStrokes.length);
for (let stroke of uniqueStrokes)
{
    $.writeln (characterToCodePoint (stroke), stroke);
}
