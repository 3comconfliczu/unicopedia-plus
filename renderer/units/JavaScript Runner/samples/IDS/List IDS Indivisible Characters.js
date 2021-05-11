// List IDS Indivisible Characters
const { codePoints } = require ('./lib/unicode/parsed-ids-data.js');
const { codePointsToCharacters } = require ('./lib/unicode/unicode.js');
const { coreSet, core2020Set } = require ('./lib/unicode/parsed-unihan-data.js');
let indivisibleCharacters = [ ];
for (let codePoint in codePoints)
{
    let { sequences } = codePoints[codePoint];
    let character = codePointsToCharacters (codePoint);
    for (let sequence of sequences)
    {
        if (sequence.ids === character)
        {
            let set = "Full";
            if (coreSet.includes (codePoint))
            {
                set = "IICore";
            }
            else if (core2020Set.includes (codePoint))
            {
                set = "U-Core";
            }
            indivisibleCharacters.push (`${codePoint}\t${character}\t${set}`);
            break;
        }
    }
}
$.writeln ("Count:", indivisibleCharacters.length);
$.writeln (indivisibleCharacters.join ("\n"));
