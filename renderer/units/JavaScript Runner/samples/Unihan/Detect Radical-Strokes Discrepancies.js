// Detect Radical-Strokes Discrepancies
const { codePoints, fullSet } = require ('./lib/unicode/parsed-unihan-data.js');
let diffs = [ ];
fullSet.forEach
(
    codePoint =>
    {
        let { kRSUnicode, kRSKangXi, kKangXi } = codePoints[codePoint];
        if (!Array.isArray (kRSUnicode))
        {
            kRSUnicode = [ kRSUnicode ];
        }
        if (kRSKangXi && kKangXi)
        {
            let [ kangXiRadical, kangXiStrokes ] = kRSKangXi.split ('.');
            for (let rsUnicode of kRSUnicode)
            {
                let [ unicodeRadical, unicodeStrokes ] = rsUnicode.replace ("'", "").split (".");
                if ((kangXiRadical === unicodeRadical) && (kangXiStrokes !== unicodeStrokes))
                {
                    let character = String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16));
                    let isVirtual = kKangXi.endsWith ("1");
                    diffs.push (`${character}\t${codePoint}\t${rsUnicode}\t${kRSKangXi}${isVirtual ? "\t(virtual)" : ""}`);
                }
            }
        }
    }
);
$.writeln (`Found ${diffs.length} conflicts`);
diffs.forEach (diff => $.writeln (diff));
