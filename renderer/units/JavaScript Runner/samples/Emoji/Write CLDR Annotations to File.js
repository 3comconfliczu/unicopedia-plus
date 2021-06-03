// Write CLDR Annotations to File
const annotations = require ('./lib/unicode/get-cldr-annotations.js');
let jsonFile = $.save ($.stringify (annotations, null, 4), 'cldr-annotations.json');
$.writeln (`Wrote CLDR annotations to JSON file:\n${jsonFile}`);
