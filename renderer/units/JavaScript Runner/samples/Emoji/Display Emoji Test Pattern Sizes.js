// Display Emoji Test Pattern Sizes
const emojiTestPatterns = require ('./lib/unicode/emoji-test-patterns.js');
for (let name in emojiTestPatterns)
{
    let pattern = emojiTestPatterns[name];
    $.writeln (`${name}: ${pattern.length}`);
}
