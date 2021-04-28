// List IDS Indivisible Characters
const { codePoints } = require ('./lib/unicode/parsed-ids-data.js');
const { codePointsToCharacters } = require ('./lib/unicode/unicode.js');
let indivisibleCharacters = [ ];
for (let codePoint in codePoints)
{
    let { sequences } = codePoints[codePoint];
    let character = codePointsToCharacters (codePoint);
    for (let sequence of sequences)
    {
        if (sequence.ids === character)
        {
            indivisibleCharacters.push (`${codePoint}\t${character}`);
            break;
        }
    }
}
$.writeln ("Count:", indivisibleCharacters.length);
$.writeln (indivisibleCharacters.join ("\n"));
