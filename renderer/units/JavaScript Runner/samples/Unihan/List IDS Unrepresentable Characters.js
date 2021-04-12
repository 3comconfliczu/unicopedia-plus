// List IDS Unrepresentable Characters
const { codePoints } = require ('./lib/unicode/parsed-ids-data.js');
const { characterToCodePoint, codePointsToCharacters } = require ('./lib/unicode/unicode.js');
let unrepresentableCharacters = [ ];
for (let codePoint in codePoints)
{
    let { sequences } = codePoints[codePoint];
    let character = codePointsToCharacters (codePoint);
    for (let sequence of sequences)
    {
        if (/？/u.test (sequence.ids))
        {
            unrepresentableCharacters.push ({ character, ids: sequence.ids } );
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
            $.writeln (`${characterToCodePoint (character.character)}\t${character.character}\t${character.ids}`);
        }
    }
);
