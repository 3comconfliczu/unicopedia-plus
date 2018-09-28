const fs = require ('fs');
const path = require ('path');
//
// https://www.unicode.org/Public/5.1.0/ucd/UCD.html
// https://www.unicode.org/reports/tr44/
//
let lines;
//
let versions = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/DerivedAge.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'DerivedAge.txt'), { encoding: 'ascii' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s+;\s+(\d+\.\d+)\s+#/);
        if (found)
        {
            versions.push ({ first: found[1], last: found[2] || found[1], age: found[3] });
        }
    }
}
//
let blocks = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/Blocks.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'Blocks.txt'), { encoding: 'ascii' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})\.\.([0-9a-fA-F]{4,});\s+(.+)$/);
        if (found)
        {
            blocks.push ({ first: found[1], last: found[2], name: found[3] });
        }
    }
}
//
let binaryProperties = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/PropList.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'PropList.txt'), { encoding: 'ascii' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s+;\s+(\w+)\s+#/);
        if (found)
        {
            binaryProperties.push ({ first: found[1], last: found[2] || found[1], name: found[3] });
        }
    }
}
//
let coreProperties = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/DerivedCoreProperties.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'DerivedCoreProperties.txt'), { encoding: 'ascii' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s+;\s+(\w+)\s+#/);
        if (found)
        {
            coreProperties.push ({ first: found[1], last: found[2] || found[1], name: found[3] });
        }
    }
}
//
let scripts = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/Scripts.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'Scripts.txt'), { encoding: 'ascii' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s+;\s+(\w+)\s+#/);
        if (found)
        {
            scripts.push ({ first: found[1], last: found[2] || found[1], name: found[3] });
        }
    }
}
//
let scriptExtensions = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/ScriptExtensions.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'ScriptExtensions.txt'), { encoding: 'ascii' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s+;\s+([\w\s]+)\s+#/);
        if (found)
        {
            scriptExtensions.push ({ first: found[1], last: found[2] || found[1], aliases: found[3] });
        }
    }
}
//
module.exports =
{
    versions,
    blocks,
    binaryProperties,
    coreProperties,
    scripts,
    scriptExtensions
};
//
