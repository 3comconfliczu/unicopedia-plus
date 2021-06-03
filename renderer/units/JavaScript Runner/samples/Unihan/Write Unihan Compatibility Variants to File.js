// Write Unihan Compatibility Variants to File
const compatibilityVariants = require ('./lib/unicode/get-cjk-compatibility-variants.js');
let sortedCompatibilityVariants = { };
let sortedCharacters = Object.keys (compatibilityVariants).sort ((a, b) => a.codePointAt (0) - b.codePointAt (0));
for (let character of sortedCharacters)
{
     let variants = compatibilityVariants[character];
     sortedCompatibilityVariants[character] = (variants.length === 1) ? variants[0] : variants;
}
let jsonFile = $.save ($.stringify (sortedCompatibilityVariants, null, 4), 'unihan-compatibility-variants.json');
$.writeln (`Wrote Unihan compatibility variants to JSON file:\n${jsonFile}`);
