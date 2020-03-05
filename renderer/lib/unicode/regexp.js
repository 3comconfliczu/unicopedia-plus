//
function build (pattern, options)
{
    if (!options)
    {
        options = { };
    }
    let flags = 'u';
    if (!options.caseSensitive)
    {
         flags += 'i';
    }
    if (!options.useRegex)
    {
         pattern = Array.from (pattern, (char) => `\\u{${char.codePointAt (0).toString (16)}}`).join ('');
    }
    if (options.wholeWord)
    {
        const beforeWordBoundary = '(?<![\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])';
        const afterWordBoundary = '(?![\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])';
        pattern = `${beforeWordBoundary}(?:${pattern})${afterWordBoundary}`;
    }
    return new RegExp (pattern, flags);
};
//
// Temporary until Electron framework adds support for Unicode 13.0
//
const ranges =
[
    '\\p{Assigned}',
    '\\u08BE-\\u08C7',
    '\\u0B55',
    '\\u0D04',
    '\\u0D81',
    '\\u1ABF-\\u1AC0',
    '\\u2B97',
    '\\u2E50-\\u2E52',
    '\\u31BB-\\u31BF',
    '\\u4DB6-\\u4DBF',
    '\\u9FF0-\\u9FFC',
    '\\uA7C7-\\uA7CA',
    '\\uA7F5-\\uA7F6',
    '\\uA82C',
    '\\uAB68-\\uAB6B',
    '\\u{1019C}',
    '\\u{10E80}-\\u{10EA9}',
    '\\u{10EAB}-\\u{10EAD}',
    '\\u{10EB0}-\\u{10EB1}',
    '\\u{10FB0}-\\u{10FCB}',
    '\\u{11147}',
    '\\u{111CE}-\\u{111CF}',
    '\\u{1145A}',
    '\\u{11460}-\\u{11461}',
    '\\u{11900}-\\u{11906}',
    '\\u{11909}',
    '\\u{1190C}-\\u{11913}',
    '\\u{11915}-\\u{11916}',
    '\\u{11918}-\\u{11935}',
    '\\u{11937}-\\u{11938}',
    '\\u{1193B}-\\u{11946}',
    '\\u{11950}-\\u{11959}',
    '\\u{11FB0}',
    '\\u{16FE4}',
    '\\u{16FF0}-\\u{16FF1}',
    '\\u{18AF3}-\\u{18AFF}',
    '\\u{18B00}-\\u{18CD5}',
    '\\u{18D00}-\\u{18D08}',
    '\\u{1F10D}-\\u{1F10F}',
    '\\u{1F16D}-\\u{1F16F}',
    '\\u{1F1AD}',
    '\\u{1F6D6}-\\u{1F6D7}',
    '\\u{1F6FB}-\\u{1F6FC}',
    '\\u{1F8B0}-\\u{1F8B1}',
    '\\u{1F90C}',
    '\\u{1F972}',
    '\\u{1F977}-\\u{1F978}',
    '\\u{1F9A3}-\\u{1F9A4}',
    '\\u{1F9AB}-\\u{1F9AD}',
    '\\u{1F9CB}',
    '\\u{1FA74}',
    '\\u{1FA83}-\\u{1FA86}',
    '\\u{1FA96}-\\u{1FAA8}',
    '\\u{1FAB0}-\\u{1FAB6}',
    '\\u{1FAC0}-\\u{1FAC2}',
    '\\u{1FAD0}-\\u{1FAD6}',
    '\\u{1FB00}-\\u{1FB92}',
    '\\u{1FB94}-\\u{1FBCA}',
    '\\u{1FBF0}-\\u{1FBF9}',
    '\\u{2A6D7}-\\u{2A6DD}',
    '\\u{30000}-\\u{3134A}'
];
//
// const assignedPattern = '\\p{Assigned}';
const assignedPattern = `[${ranges.join ('')}]`;
const assignedRegex = new RegExp (assignedPattern, 'u');
//
// const unihanPattern = '(?:(?=\\p{Script=Han})(?=\\p{Other_Letter}).)';
const unihanPattern = '[\\u3400-\\u4DBF\\u4E00-\\u9FFC\\uF900-\\uFA6D\\uFA70-\\uFAD9\\u{20000}-\\u{2A6DD}\\u{2A700}-\\u{2B734}\\u{2B740}-\\u{2B81D}\\u{2B820}-\\u{2CEA1}\\u{2CEB0}-\\u{2EBE0}\\u{2F800}-\\u{2FA1D}\\u{30000}-\\u{3134A}]';
const unihanRegex = new RegExp (unihanPattern, 'u');
//
// const unifiedPattern = '\\p{Unified_Ideograph}';
const unifiedPattern = '[\\p{Unified_Ideograph}\\u4DB6-\\u4DBF\\u9FF0-\\u9FFC\\u{2A6D7}-\\u{2A6DD}\\u{30000}-\\u{3134A}]';
const unifiedRegex = new RegExp (unifiedPattern, 'u');
//
const radicalPattern = '\\p{Radical}';
const radicalRegex = new RegExp (radicalPattern, 'u');
//
function isAssigned (character)
{
    return assignedRegex.test (character);
}
//
function isUnihan (character)
{
    return unihanRegex.test (character);
}
//
function isUnified (character)
{
    return unifiedRegex.test (character);
}
//
function isRadical (character)
{
    return radicalRegex.test (character);
}
//
module.exports =
{
    build,
    isAssigned,
    isUnihan,
    isUnified,
    isRadical
};
//
