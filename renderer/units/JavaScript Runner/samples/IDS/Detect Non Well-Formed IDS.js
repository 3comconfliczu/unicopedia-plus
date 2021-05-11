// Detect Non Well-Formed IDS
const { codePoints } = require ('./lib/unicode/parsed-ids-data.js');
const { compare } = require ('./lib/unicode/ids.js');
const { codePointsToCharacters } = require ('./lib/unicode/unicode.js');
let lines = [ ];
for (let codePoint in codePoints)
{
    let { sequences } = codePoints[codePoint];
    for (let sequence of sequences)
    {
        if (compare (sequence.ids) && !(/-/u.test (sequence.ids)))
        {
            lines.push (`${codePoint}\t${codePointsToCharacters (codePoint)}\t${sequence.ids}`);
        }
    }
}
$.writeln ("Count:", lines.length);
for (let line of lines)
{
    $.writeln (line);
}
