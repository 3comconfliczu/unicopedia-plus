// Write Emoji Test Patterns to File
const emojiTestPatterns = require ('./lib/unicode/emoji-test-patterns.js');
let jsonFile = $.save ($.stringify (emojiTestPatterns, null, 4), 'emoji-test-patterns.json');
return `Wrote emoji test patterns to JSON file:\n${jsonFile}`;
