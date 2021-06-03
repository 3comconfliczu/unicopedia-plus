// Write Emoji Test Patterns to File
const emojiTestPatterns = require ('emoji-test-patterns');
let jsonFile = $.save ($.stringify (emojiTestPatterns, null, 4), 'emoji-test-patterns.json');
return `Wrote emoji test patterns to JSON file:\n${jsonFile}`;
