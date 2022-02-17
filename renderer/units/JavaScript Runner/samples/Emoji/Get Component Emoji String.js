// Get Component Emoji String
const emojiTestList = require ('./lib/unicode/emoji-test-list.js');
let emojis = Object.keys (emojiTestList).filter (emoji => emojiTestList[emoji].isComponent);
$.writeln ("Component Emoji:", emojis.length);
$.writeln (emojis.join (""));
