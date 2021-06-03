// Write Yasuoka Variants Data to File
const characters = require ('./lib/unicode/parsed-yasuoka-variants-data.js');
let jsonFile = $.save ($.stringify (characters, null, 4), 'yasuoka-variants-data.json', );
$.writeln (`Wrote Yasuoka variants data to JSON file:\n${jsonFile}`);
