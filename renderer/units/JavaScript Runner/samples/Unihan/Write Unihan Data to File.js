// Write Unihan Data to File
const { codePoints, fullSet } = require ('./lib/unicode/parsed-unihan-data.js');
let start = window.performance.now ();
let sortedCodePoints = { };
fullSet.forEach (codePoint => { sortedCodePoints[codePoint] = codePoints[codePoint]; });
let jsonFile = $.save (JSON.stringify (sortedCodePoints, null, 4), 'unihan-data.json');
let stop = window.performance.now ();
$.writeln (`Wrote Unihan data to JSON file in ${((stop - start) / 1000).toFixed (2)} seconds:\n${jsonFile}`);
