// Write Parsed Numeric Values Data to File
const characters = require ('./lib/unicode/parsed-numeric-values-data.js');
let jsonFile = $.save ($.stringify (characters, null, 4), 'numeric-values-data.json');
$.writeln (`Wrote parsed numeric values data to JSON file:\n${jsonFile}`);
