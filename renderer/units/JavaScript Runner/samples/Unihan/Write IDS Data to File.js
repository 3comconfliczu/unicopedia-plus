// Write IDS Data to File
const idsData = require ('./lib/unicode/parsed-ids-data.js');
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const jsonFile = path.join (app.getPath ('desktop'), 'ids-data.json');
fs.writeFileSync (jsonFile, $.stringify (idsData, null, 4));
$.writeln (`Wrote IDS data to JSON file:\n${jsonFile}`);
