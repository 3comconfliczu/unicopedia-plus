//
const fs = require ('fs');
const path = require ('path');
//
let codePoints = { };
//
// Japanese_Variants.txt; compiled from:
// https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kijun/naikaku/kanji/joyokanjisakuin/index.html
let lines = fs.readFileSync (path.join (__dirname, 'Japanese', 'Japanese_Variants.txt'), { encoding: 'utf8' }).split ("\n");
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let fields = line.split ("\t");
        let source = fields[0];
        let tag = fields[1];
        let targets = fields[2].split (" ");
        if (!(source in codePoints))
        {
            codePoints[source] = { };
        }
        codePoints[source][tag] = targets.length > 1 ? targets : targets[0];
    }
}
//
module.exports = codePoints;
//
