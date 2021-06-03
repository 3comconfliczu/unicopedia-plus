// Write Parsed Unicode Extra Data to File
const extraData = require ('./lib/unicode/parsed-extra-data.js');
let jsonFile = $.save (JSON.stringify (extraData, null, 4), 'unicode-extra-data.json');
$.write (`Wrote parsed Unicode extra data to JSON file:\n${jsonFile}`);
