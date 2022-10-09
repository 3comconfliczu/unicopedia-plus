// Write Emoji List to File
const emojiTestList = require ('./lib/unicode/emoji-test-list.js');
let jsonFile = $.save ($.stringify (emojiTestList, null, 4), 'emoji-list.json');
$.write (`Wrote emoji list to JSON file:\n${jsonFile}`);
