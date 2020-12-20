//
const unit = document.getElementById ('unicode-references-unit');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
module.exports.start = function (context)
{
    const linksList = require ('../../lib/links-list.js');
    //
    const defaultPrefs =
    {
        references: true
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    references.open = prefs.references;
    //
    const unicodeLinks = require ('./unicode-links.json');
    linksList (links, unicodeLinks);
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        references: references.open
    };
    context.setPrefs (prefs);
};
//
