// Get Display Emoji String
const emojiTestList = require ('./lib/unicode/emoji-test-list.js');
let emojis = Object.keys (emojiTestList).filter (emoji => emojiTestList[emoji].toFullyQualified);
$.writeln ("Display Emoji:", emojis.length);
$.writeln (emojis.join (""));
