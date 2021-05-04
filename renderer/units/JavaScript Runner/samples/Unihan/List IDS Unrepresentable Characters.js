// List IDS Unrepresentable Characters
const { codePoints } = require ('./lib/unicode/parsed-ids-data.js');
const { characterToCodePoint, codePointsToCharacters } = require ('./lib/unicode/unicode.js');
const { coreSet, core2020Set } = require ('./lib/unicode/parsed-unihan-data.js');
let unrepresentableCharacters = [ ];
for (let codePoint in codePoints)
{
    let { sequences } = codePoints[codePoint];
    let character = codePointsToCharacters (codePoint);
    for (let sequence of sequences)
    {
        if (/？/u.test (sequence.ids))
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
            unrepresentableCharacters.push ({ character, ids: sequence.ids, set } );
        }
    }
}
$.writeln ("Please wait...");
setTimeout
(
    () =>
    {
        $.clear ();
        $.writeln ("Count:", unrepresentableCharacters.length);
        for (let character of unrepresentableCharacters)
        {
            $.writeln (`${characterToCodePoint (character.character)}\t${character.character}\t${character.set}\t${character.ids}`);
        }
    }
);
