// Display Unihan Data Count
const { coreSet, core2020Set, fullSet } = require ('./lib/unicode/parsed-unihan-data.js');
$.writeln (`International Ideographs Core: ${coreSet.length.toLocaleString ('en')}`);
$.writeln (`Unihan Core (2020): ${core2020Set.length.toLocaleString ('en')}`);
$.writeln (`Full Unihan: ${fullSet.length.toLocaleString ('en')}`);
