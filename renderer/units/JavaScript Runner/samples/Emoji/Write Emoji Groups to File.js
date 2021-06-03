// Write Emoji Groups to File
const emojiTestGroups = require ('emoji-test-groups');
let jsonFile = $.save ($.stringify (emojiTestGroups, null, 4), 'emoji-groups.json');
return `Wrote emoji groups to JSON file:\n${jsonFile}`;
