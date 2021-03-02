//
const idcCharacters =
{
    // Prefix operators
    "⿰": { name: "IDC Left to Right", arity: 2 },              // \p{IDS_Binary_Operator}
    "⿱": { name: "IDC Above to Below", arity: 2 },             // \p{IDS_Binary_Operator}
    "⿲": { name: "IDC Left to Middle and Right", arity: 3 },   // \p{IDS_Trinary_Operator}
    "⿳": { name: "IDC Above to Middle and Below", arity: 3 },  // \p{IDS_Trinary_Operator}
    "⿴": { name: "IDC Full Surround", arity: 2 },              // \p{IDS_Binary_Operator}
    "⿵": { name: "IDC Surround from Above", arity: 2 },        // \p{IDS_Binary_Operator}
    "⿶": { name: "IDC Surround from Below", arity: 2 },        // \p{IDS_Binary_Operator}
    "⿷": { name: "IDC Surround from Left", arity: 2 },         // \p{IDS_Binary_Operator}
    "⿸": { name: "IDC Surround from Upper Left", arity: 2 },   // \p{IDS_Binary_Operator}
    "⿹": { name: "IDC Surround from Upper Right", arity: 2 },  // \p{IDS_Binary_Operator}
    "⿺": { name: "IDC Surround from Lower Left", arity: 2 },   // \p{IDS_Binary_Operator}
    "⿻": { name: "IDC Overlaid", arity: 2 },                   // \p{IDS_Binary_Operator}
    "〾": { name: "Ideographic Variation Indicator", arity: 1 },
    "↔": { name: "Mirror Operator", arity: 1 },
    "↷": { name: "Rotation Operator", arity: 1 },
    // Infix operators (unupported for the time being)
    // "-": { name: "Subtraction Operator", arity: -2 },
    // "+": { name: "Joining Operator", arity: -2 }
};
//
module.exports = { idcCharacters }
//