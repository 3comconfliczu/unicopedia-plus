// Write Unihan Data to Property Files
const { codePoints, fullSet } = require ('./lib/unicode/parsed-unihan-data.js');
let start = window.performance.now ();
const properties = { };
for (let codePoint of fullSet)
{
    let dataProperties = codePoints[codePoint];
    for (let property in dataProperties)
    {
        if (!(property in properties))
        {
            properties[property] = { };
        }
        properties[property][codePoint] = dataProperties[property];
    }
}
let jsonFiles = [ ];
for (let property in properties)
{
    let jsonFile = $.save ($.stringify (properties[property], null, 4), `${property}.json`, 'unihan-data');
    jsonFiles.push (jsonFile);
}
let stop = window.performance.now ();
$.writeln (`Wrote Unihan data to ${jsonFiles.length} JSON property files in ${((stop - start) / 1000).toFixed (2)} seconds:`);
jsonFiles.forEach (jsonFile => { $.writeln (jsonFile); });
