// Display CLDR Annotations
const annotations = require ('./lib/unicode/get-cldr-annotations.js');
$.writeln ($.stringify (annotations, null, 4));
