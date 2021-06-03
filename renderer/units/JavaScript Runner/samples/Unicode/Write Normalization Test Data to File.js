// Write Normalization Test Data to File
const normalizationTestData = require ('./lib/unicode/parsed-normalization-test-data.js');
let start = window.performance.now ();
let jsonFile = $.save ($.stringify (normalizationTestData, null, 4), 'normalization-test-data.json');
let stop = window.performance.now ();
$.writeln (`Wrote parsed normalization test data to JSON file in ${((stop - start) / 1000).toFixed (2)} seconds:\n${jsonFile}`);
