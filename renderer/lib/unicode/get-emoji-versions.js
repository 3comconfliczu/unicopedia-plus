//
// https://www.unicode.org/emoji/charts/emoji-versions.html
// https://www.unicode.org/reports/tr51/
//
// There are three special values used for emoji characters before E1.0:
// E0.0: Emoji components that were defined before E1.0.
// E0.6: Emoji characters deriving from Japanese carriers that were incorporated in Unicode 6.0
// E0.7: Emoji characters deriving from the Wing/Webdings, which appeared in Unicode v7.0. Also includes those incorporated in ARIB that began to be treated as emoji in this time period.
//
const emojiVersions =
{
    // "0.0": null,
    "0.6": { age: "Unicode 6.0", date: "October 2010" },
    "0.7": { age: "Unicode 7.0", date: "June 2014" },
    "1.0": { age: "Emoji 1.0", date: "June 2015" },
    "2.0": { age: "Emoji 2.0", date: "November 2015" },
    "3.0": { age: "Emoji 3.0", date: "June 2016" },
    "4.0": { age: "Emoji 4.0", date: "November 2016" },
    "5.0": { age: "Emoji 5.0", date: "June 2017" },
    "11.0": { age: "Emoji 11.0", date: "May 2018" },
    "12.0": { age: "Emoji 12.0", date: "March 2019" },
    "12.1": { age: "Emoji 12.1", date: "October 2019" },
    "13.0": { age: "Emoji 13.0", date: "March 2020" },
    "13.1": { age: "Emoji 13.1", date: "September 2020" }
};
//
module.exports = emojiVersions;
//
