// Detect Kyūjitai as Compatibility Ideographs
const japaneseVariants = require ('./lib/unicode/parsed-japanese-variants-data.js');
const { codePointsToCharacters } = require ('./lib/unicode/unicode.js');
const { isCompatibility } = require ('./lib/unicode/regexp.js');
let compatibilityCharacters = [ ];
for (let codePoint in japaneseVariants)
{
    if (isCompatibility (codePointsToCharacters (codePoint)))
    {
        if ("kShinjitaiVariant" in japaneseVariants[codePoint])
        {
            compatibilityCharacters.push (codePoint);
        }
    }
}
$.writeln (`Found ${compatibilityCharacters.length} kyūjitai compatibility characters`);
compatibilityCharacters.forEach (codePoint => $.writeln (`${codePoint}\t${codePointsToCharacters (codePoint)}`));
