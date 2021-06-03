// Write Emoji List to File
const emojiTestList = require ('emoji-test-list');
let jsonFile = $.save ($.stringify (emojiTestList, null, 4), 'emoji-list.json');
return `Wrote emoji list to JSON file:\n${jsonFile}`;
