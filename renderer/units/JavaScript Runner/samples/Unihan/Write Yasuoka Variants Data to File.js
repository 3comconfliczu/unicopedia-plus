// Write Yasuoka Variants Data to File
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const characters = require ('./lib/unicode/parsed-yasuoka-variants-data.js');
const jsonFile = path.join (app.getPath ('desktop'), 'yasuoka-variants-data.json');
fs.writeFileSync (jsonFile, $.stringify (characters, null, 4));
$.writeln (`Wrote Yasuoka variants data to JSON file:\n${jsonFile}`);
