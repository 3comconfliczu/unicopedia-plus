// Display Emoji Size Statistics
const emojiTestList = require ('./lib/unicode/emoji-test-list.js');
let sizes = { };
for (let emoji in emojiTestList)
{
    let size = Array.from (emoji).length;
    if (!(size in sizes))
    {
        sizes[size] = 0;
    }
    sizes[size]++;
}
return $.stringify (sizes, null, 4);
