// Display Unihan Data Count
const { coreSet, core2020Set, fullSet } = require ('./lib/unicode/parsed-unihan-data.js');
$.writeln (`IICore: ${coreSet.length.toLocaleString ('en')}`);
$.writeln (`Unihan Core: ${core2020Set.length.toLocaleString ('en')}`);
$.writeln (`Full Unihan: ${fullSet.length.toLocaleString ('en')}`);
