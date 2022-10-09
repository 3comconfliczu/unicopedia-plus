// Write Emoji Groups to File
const emojiTestGroups = require ('./lib/unicode/emoji-test-groups.js');
let jsonFile = $.save ($.stringify (emojiTestGroups, null, 4), 'emoji-groups.json');
$.write (`Wrote emoji groups to JSON file:\n${jsonFile}`);
