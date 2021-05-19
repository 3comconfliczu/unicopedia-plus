// Detect Unihan Asymmetric Variants
const { codePoints } = require ('./lib/unicode/parsed-unihan-data.js');
const symmetricVariantProperties =
[
    "kSemanticVariant",
    "kSpecializedSemanticVariant",
    "kSpoofingVariant",
    "kZVariant"
];
let asymmetricVariants = { };
for (let codePoint in codePoints)
{
    let properties = codePoints[codePoint];
    for (let property in properties)
    {
        if (symmetricVariantProperties.includes (property))
        {
            let variants = properties[property];
            if (!Array.isArray (variants))
            {
                variants = [ variants ];
            }
            for (let variant of variants)
            {
                let comparedCodePoint = variant.split ("<")[0];
                let comparedProperties = codePoints[comparedCodePoint];
                let found = false;
                let currentVariant = variant;
                if (property in comparedProperties)
                {
                    let comparedVariants = comparedProperties[property];
                    if (!Array.isArray (comparedVariants))
                    {
                        comparedVariants = [ comparedVariants ];
                    }
                    for (let comparedVariant of comparedVariants)
                    {
                        if (comparedVariant.split ("<")[0] === codePoint)
                        {
                            found = true;
                            break;
                        }
                    }
                }
                if (!found)
                {
                    if (!(codePoint in asymmetricVariants))
                    {
                        asymmetricVariants[codePoint] = { };
                    }
                    if ((property in asymmetricVariants[codePoint]))
                    {
                        if (!Array.isArray (asymmetricVariants[codePoint][property]))
                        {
                            asymmetricVariants[codePoint][property] = [ asymmetricVariants[codePoint][property] ];
                        }
                        asymmetricVariants[codePoint][property].push (currentVariant);
                    }
                    else
                    {
                        asymmetricVariants[codePoint][property] = currentVariant;
                    }
                }
            }
        }
    }
}
return $.stringify (asymmetricVariants, null, 4);
