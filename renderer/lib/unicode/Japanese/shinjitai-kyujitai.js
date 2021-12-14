// Usage: node shinjitai-kyujitai.js > Japanese_Variants.txt
//
const fs = require ('fs');
//
function characterToCodePoint (character, noPrefix)
{
    let code = character.codePointAt (0).toString (16).toUpperCase ().padStart (4, "0");
    return (noPrefix) ? code : `U+${code}`;
}
//
let outputLines = [ ];
//
let lines = fs.readFileSync ('shinjitai-kyujitai.txt', { encoding: 'utf8' }).split (/\r?\n/).sort ();
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let fields = line.split ("\t");
        let source = fields[0];
        let dests = fields[1].split (" ").sort ();
        let shinjitai = characterToCodePoint (source);
        let kyujitaiArray = dests.map (kyujitai => characterToCodePoint (kyujitai));
        outputLines.push (`${shinjitai}\tkKyujitaiVariant\t${kyujitaiArray.length > 1 ? kyujitaiArray.join (" ") : kyujitaiArray[0] }`);
        for (let kyujitai of kyujitaiArray)
        {
            outputLines.push (`${kyujitai}\tkShinjitaiVariant\t${shinjitai}`);
        }
    }
}
console.log ("# File: Japanese_Variants.txt");
console.log (`# Date: ${new Date ().toISOString ().replace (/T.*$/, "")}`);
console.log ("# Contents: Shinjitai and Kyūjitai Variants");
console.log ("# Reference: https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kijun/naikaku/kanji/joyokanjisakuin/index.html");
console.log ("#");
console.log (outputLines.sort ().join ("\n"));
console.log ("# EOF");
//
