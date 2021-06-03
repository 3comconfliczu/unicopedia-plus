// Write Parsed Unicode Data to File
const unicodeData = require ('./lib/unicode/parsed-unicode-data.js');
if (confirm ("The parsed Unicode data JSON file is more than 100 Megabytes. Proceed anyway?"))
{
    let start = window.performance.now ();
    let jsonFile = $.save (JSON.stringify (unicodeData, null, 4), 'unicode-data.json');
    let stop = window.performance.now ();
    $.writeln (`Wrote parsed Unicode data to JSON file in ${((stop - start) / 1000).toFixed (2)} seconds:\n${jsonFile}`);
}
