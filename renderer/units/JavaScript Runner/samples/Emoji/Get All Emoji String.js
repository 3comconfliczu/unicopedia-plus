// Get All Emoji String
const emojiTestList = require ('emoji-test-list');
let emojis = Object.keys (emojiTestList);
$.writeln ("All Emoji:", emojis.length);
$.writeln (emojis.join (""));
