// Get All Emoji String
const emojiTestList = require ('./lib/unicode/emoji-test-list.js');
let emojis = Object.keys (emojiTestList);
$.writeln ("All Emoji:", emojis.length);
$.writeln (emojis.join (""));
