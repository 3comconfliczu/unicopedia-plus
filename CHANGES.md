# Release Notes

This project adheres to [Semantic Versioning](https://semver.org/).

## 10.4.2

- Updated Unihan reference links.
- Updated `@electron/remote` module to version `1.2.1`.
- Updated `Electron` to version `13.1.9`.

## 10.4.1

- Updated `Electron` to version `13.1.7`.
- Updated `Electron Packager` to version `15.3.0`.

## 10.4.0

- Used set of `Source Han Sans` variable fonts version `2.004`.
- Added font weight selection menu to the **CJK Font Variants** utility.
- Updated `Electron` to version `13.1.4`.

## 10.3.0

- Added `Creative Commons Symbols` samples to the **Unicode Inspector** utility.
- Added `CJK Strokes` samples to the **CJK Font Variants** utility.
- Updated `@electron/remote` module to version `1.2.0`.
- Updated `Electron` to version `13.1.3`.

## 10.2.0

- Fixed potential vulnerability of built-in `$.save ()` function in the **JavaScript Runner** utility.
- Updated `Electron` to version `13.1.1`.

## 10.1.0

- Used `@electron/remote` module.
- Added new built-in function `$.save ()` to the **JavaScript Runner** utility.
- Updated **JavaScript Runner** sample scripts accordingly.
- Updated `Electron` to version `13.1.0`.

## 10.0.0

- Removed the experimental **Unihan Components** utility.

## 9.11.0

- Updated `IDS.TXT` data file.
- Updated `BabelStoneHanPUA.woff2` font file.
- Updated `Electron` to version `13.0.1`.

## 9.10.0

- Added placeholder for a new **Find by Components** feature to the **Unihan Components** utility.
- Added helper lists of unencoded glyphs to the **Unihan Components** utility.
- Reorganized items of the Insert contextual menu available on the input fields of the **Unihan Components** utility.
- Updated `IDS.TXT` data file.
- Updated `BabelStoneHanPUA.woff2` font file.
- Updated `Electron` to version `12.0.8`.

## 9.9.1

- Added new submenu: `Insert CJK Stroke` to the contextual menu available on the input field of the **Parse IDS** and **Match IDS** features of the **Unihan Components** utility.
- Updated `IDS.TXT` data file.
- Updated `BabelStoneHanPUA.woff2` font file.
- Updated `Electron` to version `12.0.7`.

## 9.9.0

- Added support for building `.AppImage` (for Linux), and `.exe` (for Windows) executable files.
- Added new Unihan sample script: `List CJK Strokes in IDS` to the **JavaScript Runner** utility.
- Added Unihan set info (`IICore`, `U-Core`, `Full`) to the sample scripts: `List IDS Indivisible Characters` and `List IDS Unrepresentable Characters` in the **JavaScript Runner** utility.
- Updated `IDS.TXT` data file.
- Updated `Electron` to version `12.0.6`.

## 9.8.0

- Enabled smart zoom feature; fixed position issue of pull-down button menu.
- Added support for building `.zip` (compressed archive), `.dmg` (disk image), and `.pkg` (installer) files for macOS.
- Updated `IDS.TXT` data file.

## 9.7.1

- Updated `IDS.TXT` data file.
- Updated `BabelStoneHanPUA.woff2` font file.
- Updated `Electron` to version `12.0.5`.

## 9.7.0

- Added optional entry character to the **Parse IDS** feature of the **Unihan Components** utility.
- Updated `IDS.TXT` data file.
- Updated `BabelStoneHanPUA.woff2` font file.
- Updated `Electron` to version `12.0.4`.

## 9.6.0

- Added three Unihan sample scripts: `List IDS Indivisible Characters`, `List IDS Unrepresentable Characters`, and `Detect Radical-Strokes Discrepancies` to the **JavaScript Runner** utility.
- Revamped the `Insert Radical Form` submenu belonging to the contextual menu available on the input fields of the **Parse IDS** and **Match IDS** features of the **Unihan Components** utility.
- Improved `kangxi-radicals.json`.
- Updated `IDS.TXT` data file.

## 9.5.0

- Improved display of possible excess characters in the **Parse IDS** feature of the **Unihan Components** utility.
- Updated the `Noto Sans CJK` set of fonts to version `2.003`.
- Refined additional data of `kangxi-radicals.json`.
- Updated `BabelStoneHanPUA.woff2` font file.
- Updated `IDS.TXT` data file.

## 9.4.0

- Added two submenus: `Insert Radical Form` (experimental) and `Insert Unencoded Component` (in addition to `Insert Operator`) to the contextual menu available on the input field of the **Parse IDS** and **Match IDS** features of the **Unihan Components** utility.
- Added Unihan sample scripts `Detect Missing Radical Equivalents` and `List Radicals in IDS` to the **JavaScript Runner** utility.
- Assigned the "orphaned" `CJK Radical Repeat` character to a variant of `KangXi Radical Ice`: affects the **Unihan Components**, **Unihan Inspector**, and **Unihan Radical-Strokes** utilities.
- Updated `IDS.TXT` data file.

## 9.3.3

- Improved history pop-up menus for specimens and looked up characters.
- Used proper verb terminology for lookup: look up.
- Updated `IDS.TXT` data file.
- Updated `Electron` to version `12.0.2`.

## 9.3.2

- Removed all unwanted tooltips in generated SVG in the **Unihan Variants** utility, and in the **Parse IDS** feature of the **Unihan Components** utility.
- Sanitized IDS string in the **Parse IDS** feature of the **Unihan Components** utility.
- Updated `BabelStoneHanPUA.woff2` font file.

## 9.3.1

- Updated `IDS.TXT` data file: fixes all non well-formed IDS.

## 9.3.0

- Added character count info and error visual hints for invalid IDS sequences (invalid components, expected components, excess components) to the **Parse IDS** feature of the **Unihan Components** utility.
- Added Unihan sample script `Detect Non Well-Formed IDS.js` to the **JavaScript Runner** utility.
- Updated all screenshots.

## 9.2.0

- Added **Parse IDS** feature to the **Unihan Components** utility to visualize (and validate) graph trees of custom IDS.
- Updated emoji shortnames and keywords in the **Emoji Data Finder** utility, using `CLDR 39.0` annotations.
- Updated `Electron` to version `12.0.1`.

## 9.1.0

- Added history pop-up menus for specimens and looked up characters to the **Unicode Data Finder**, **Unihan Components**, **Unihan Data Finder**, **Unihan Inspector**, and **Unihan Variants** utilities.
- Used dimmed style effect for nested-matching characters displayed in the **Match IDS** feature of the **Unihan Components** utility.
- Fixed issue in the **Match IDS** feature of the **Unihan Components** utility, where some characters would not be nested-matched by mistake in specific cases.
- Updated `IDS.TXT` data file and `BabelStoneHanPUA.woff2` font file.
- Improved styling of `<code>` and `<kbd>` tags.
- Added `Confirm Quit` dialog.

## 9.0.0

- Added new experimental **Unihan Components** utility, made up of two features: **Lookup IDS** and **Match IDS**.
- Added new Unihan sample script `Write IDS Data to File.js` to the **JavaScript Runner** utility.
- Reorganized and fixed Unihan reference links.
- Updated `Electron` to version `12.0.0`.

## 8.13.0

- Fixed cursor for currently looked up character in the **Unihan Variants** utility.
- Added compatibility character source info to the **Unihan Data Finder**, **Unihan Inspector**, **Unihan Radical-Strokes**, and **Unihan Variants** utilities.
- Focused characters input field automatically on clicking `Clear` button in the **CJK Font Variants**, **Unicode Foldings**, **Unicode Inspector**, and **Unicode Normalizer** utilities.

## 8.12.0

- Added new Unihan sample script `Detect Unihan Asymmetric Variants` to the **JavaScript Runner** utility.
- Added *Compat.* relation (reverse link of *Unified*) to the **Unihan Variants** utility.

## 8.11.0

- Added Japanese variants (*Shinjitai* and *Kyūjitai*) to the **Unihan Inspector** and **Unihan Variants** utilities, as well as the **Match Character** feature of the **Unihan Data Finder** utility.
- Improved layout of graph nodes in the **Unihan Variants** utility.
- Added CJK Unusual samples to the **Unicode Inspector** utility.
- Updated samples in the **Unicode Foldings** utility.
- Updated `Electron` to version `11.2.1`.

## 8.10.1

- Updated font stacks: improved display of letters with diacritics on Windows.
- Updated `Electron` to version `11.2.0`.

## 8.10.0

- Used common CSS variables for font stacks.
- Updated and expanded font stacks: fixed locale-related issues ([Issue #7](https://github.com/tonton-pixel/unicopedia-plus/issues/7)).
- Improved layout of characters and font consistency in the **Unihan Variants** utility.
- Expanded Unicode and Unihan reference links.
- Used recommended code units sequence format, i.e., between angle brackets, for UTF-8, UTF-16, UTF-32 in the **Unicode Inspector** utility.

## 8.9.2

- Fixed wrapping overflow of very long words in the **Unicode Segmenter** utility.

## 8.9.1

- Updated samples in the **Unicode Segmenter** utility; added specific word segmentation issues, as reported in [Issue #9](https://github.com/tonton-pixel/unicopedia-plus/issues/9).
- Improved segment tootips: count and list of first 24 characters are systematically displayed for each segmentation granularity.

## 8.9.0

- Added new **Unicode Segmenter** utility.
- Updated `Electron` to version `11.1.1`.

## 8.8.0

- Updated emoji shortnames and keywords in the **Emoji Data Finder** utility, using `CLDR 38.1` annotations.
- Reorganized Unicode and Unihan reference links, moved to specific utilities where appropriate.
- Updated `Electron` to version `11.1.0`.

## 8.7.0

- Updated the `Noto Sans CJK` set of fonts to version `2.002`.
- Added `Biangbiang Noodles` and `Taito (84 Strokes)` samples to the **CJK Font Variants** utility.
- Updated reference links and screenshots accordingly.
- Updated `Electron` to version `11.0.5`.
- Updated `Electron Packager` to version `15.2.0`.

## 8.6.0

- Used new built-in `Intl.Segmenter` for grapheme splitting in the **CJK Font Variants** utility.
- Updated `Electron` to version `11.0.2`.

## 8.5.1

- Allowed stripping out optional variation selector in validation of Unihan character in the **View by Grid** feature of the **Unihan Data Finder** utility and in the **Unihan Inspector** and **Unihan Variants** utilities.
- Updated reference links to latest version of `IVD_Sequences.txt`.
- Updated list of supported locales.

## 8.5.0

- Cleaned up some code.
- Updated CSS font family stacks.
- Added version date to emoji tooltips in the **Emoji Picture Book** utility.
- Added context menu to external reference links, allowing copy of URL to clipboard.
- Updated `Get Radical Statistics` sample script in the **JavaScript Runner** utility.
- Added missing CJK Extension G reference link to the **Unihan References** utility.
- Updated `Electron` to version `10.1.5`.

## 8.4.0

- Fixed [Issue #7](https://github.com/tonton-pixel/unicopedia-plus/issues/7), by replacing all overriding `font-family: system-ui` CSS declarations with `font-family: inherit`.
- Updated subscript and superscript digits samples in the **Unicode Inspector** utility.

## 8.3.1

- Forced proper Latin font `Segoe UI` as a substitute to `system-ui` on Windows: fixes [Issue #6](https://github.com/tonton-pixel/unicopedia-plus/issues/6).
- Updated Unihan reference links.

## 8.3.0

- Updated emoji shortnames and keywords in the **Emoji Data Finder** utility, using latest `CLDR 38.0` annotations.
- Updated CLDR annotations-related sample scripts in the **JavaScript Runner** utility.
- Added character count info to the **CJK Font Variants**, **Unicode Foldings**, **Unicode Inspector**, and **Unicode Normalizer** utilities.
- Added `Load...` and `Save...` buttons to the **Filter Text** feature of the **Emoji Data Finder** utility.
- Updated screenshots accordingly.
- Updated `CJK Numbers` sample in the **Unicode Inspector** utility.
- Updated `Electron` to version `10.1.3`.

## 8.2.0

- Added support for `Emoji 13.1` to the **Emoji Data Finder** and **Emoji Picture Book** utilities:
    - Updated instructions/documentation.
    - Updated emoji age and date informations.
    - Updated `emoji-test-list`, `emoji-test-groups`, `emoji-test-patterns` NPM modules to their version `13.1.x`.
- Restricted display of modal dialogs over main window only.
- Updated `Electron` to version `10.1.2`.
- Updated `Grapheme Split` to version `2.4.2`.

## 8.1.0

- Used proper terminology: `Character` instead of `Symbol` in the data table headers of the **Unicode Data Finder** and **Unihan Data Finder** utilities.
- Updated `Electron` to version `10.1.1`.
- Updated `Grapheme Split` to version `2.4.1`.

## 8.0.1

- Fixed issue introduced in `Electron 10.0.0`: on `Linux`, the app would unexpectedly crash when dismissing the `License` or `System Info` dialog window with the `Escape` key.
- Fixed resetting multiline fields scroll to left as well as top.

## 8.0.0

- Updated `Electron` to version `10.0.0`: adds full support for `Unicode 13.0` (`ICU 67.1`), for regular expressions, case folding, and normalization.
- Updated `Electron Packager` to version `15.1.0`.

## 7.12.0

- Switched to Unicode 13.0-aware `graphemesplit` module.
- Updated global hot key.
- Updated `Electron` to version `9.2.0`.

## 7.11.1

- Added case folding samples to the **Unicode Foldings** utility: `Roman Numerals` and `Cherokee`.
- Updated `Electron` to version `9.1.1`.

## 7.11.0

- Improved user interface of the **Unihan Inspector** utility: switch automatically to the default system font when the looked up character cannot be properly rendered in the five CJK typefaces.
- Updated `Electron` to version `9.1.0`.

## 7.10.0

- Added samples of emoji listed by `Age (Date)` to the **Filter Text** feature of the **Emoji Data Finder** utility.
- Added case folding samples to the **Unicode Foldings** utility, for the scripts: `Adlam`, `Armenian`, `Coptic`, `Georgian`, `Glagolitic`, `Medefaidrin`, `Old Hungarian`, `Osage`, and `Warang Citi`.
- Fixed resetting multiline fields scroll to top.
- Updated `Electron Packager` to version `15.0.0`.

## 7.9.0

- Added display of `System Info` dialog from the `Help` menu.
- Updated instructions.

## 7.8.0

- Added a new field to the **Unihan Inspector** utility: `Related` Unihan characters.
- Updated `Electron` to version `9.0.5`.

## 7.7.0

- Added more alternative notations to the list of recognized code point formats.
- Added `HTML Hex` to the list of codes in the **Unicode Inspector** utility.
- Updated `Electron` to version `9.0.4`.

## 7.6.1

- Fixed error when attempting to open user data or temporary directories from the Developer menu.

## 7.6.0

- Defined platform-independent focus outline color for text areas.
- Updated app building instructions.
- Updated `Electron` to version `9.0.3`.

## 7.5.0

- Improved security.
- Updated `Electron` to version `8.3.0`.

## 7.4.4

- Updated `Electron` to version `8.2.4`.

## 7.4.3

- Updated emoji shortnames and keywords in the **Emoji Data Finder** utility, using latest `CLDR 37.0` annotations.
- Improved display of monospaced fonts on Linux by adding "DejaVu Sans Mono" to the font stack.
- Updated Help menu.
- Updated documentation.

## 7.4.2

- Added keyboard shortcut (`CommandOrControl+Enter`) to run script while focus is in the code text area in the **JavaScript Runner** utility.
- Updated `Electron` to version `8.2.3`.

## 7.4.1

- Fixed 1 low severity vulnerability.
- Updated `Electron` to version `8.2.1`.

## 7.4.0

- Updated `Electron` to version `8.2.0`.

## 7.3.0

- Added support for `Unicode 13.0` regular expressions by temporarily installing up-to-date `regexpu-core` module.
- Added `Chorasmian`, `Dives_Akuru`, `Khitan_Small_Script`, `Yezidi` to the list of supported scripts in the **Regex Properties** utility.

**Warning**: until the `Electron` framework adds full support for `Unicode 13.0` (`ICU 66`), results for case folding and normalization are still partially unreliable (restricted to `Unicode 12.1`) in the **Unicode Foldings** and **Unicode Normalizer** utilities.

## 7.2.0

- Replaced `Full Unihan Set` checkbox with `Set:` [ `IICore`, `Unihan Core (2020)`, `Full Unihan` ] drop-down menu in the **Unihan Inspector** and **Unihan Radical-Strokes** utilities.
- Added separate code point tooltip to the **Unihan Radical-Strokes** utility.
- Added Unihan set info in tooltip or table in the **Unihan Data Finder** and **Unihan Variants** utilities.
- Updated samples for `Unassigned Characters` in the **Unicode Inspector** utility.
- Updated emoji shortnames and keywords in the **Emoji Data Finder** utility, using `CLDR 36.1` annotations.
- Updated reference links, instructions and screenshots.
- Updated `Electron` to version `8.1.1`.

## 7.1.0

- Added `All Group` menu item to all groups of the `Samples` menu in the **Filter Text** feature of the **Emoji Data Finder** utility.
- Added age of emoji to the tooltip of all displayed emoji in the **Emoji Picture Book** utility.
- Updated `Electron` to version `8.1.0`.

## 7.0.0

- Added support for **Unicode 13.0**.
- Updated scripts and regex samples.
- Updated all screenshots.
- Updated `Electron` to version `8.0.3`.

**Warning**: until `Electron` supports `Unicode 13.0`, some features yield results still pertaining to `Unicode 12.1` and are therefore partially unreliable:
- Unicode properties `\p{...}` or `\P{...}` in regular expressions entered in the various search input fields.
- Normalization.
- Case folding.

## 6.7.0

- Added display of code points to the **Unihan Variants** utility.
- Updated Unicode release dates.
- Updated `Electron` to version `8.0.2`.

## 6.6.0

- Added support for `Emoji 13.0` to the **Emoji Data Finder** and **Emoji Picture Book** utilities:
    - Updated instructions/documentation.
    - Updated emoji age and date informations, including special handling of emoji characters before `Emoji 1.0`.
    - Updated `emoji-test-list`, `emoji-test-groups`, `emoji-test-patterns` NPM modules to their version `13.0.0`.
- Added partial support for `Emoji 13.0` to the emoji properties of the **Unicode Inspector** utility:
    - Updated `emoji-data.txt` data file to version `13.0`.
- Used text cursor for all user-selectable text.

## 6.5.3

- Added HTML named entity to the list of codes in the **Unicode Inspector** utility.
- Improved code selection for regex examples and Unicode escape sequences.
- Improved layout of additional tables in instructions and documentation.
- Improved `Get Block Statistics` sample script.
- Reorganized CSS code architecture.

## 6.5.2

- Updated CJK reference links.
- Updated Unicode and Unihan regex examples.
- Updated `Electron` to version `8.0.1`.
- Updated `Electron Packager` to version `14.2.1`.

## 6.5.1

- Added faint highlighted style to the 12 misclassified CJK *Unified* Ideographs belonging to the CJK *Compatibility* Ideographs block in the **View by Grid** feature of the **Unihan Data Finder** utility.
- Removed max length restriction of input field in the **Filter Text** feature of the **Emoji Data Finder** utility.
- Updated instructions, reference links, and regex example.

## 6.5.0

- Added standardized variation sequence of CJK compatibility characters to the **Unicode Inspector** and **Unihan Inspector** utilities.
- Updated samples (`IVD Sequences` and `Standardized Variations`) of the **CJK Font Variants** utility.
- Revamped the zoom level actions (`Actual Size`, `Zoom In`, `Zoom Out`) of the `View` menu.
- Updated `Electron` to version `8.0.0`.

## 6.4.2

- Added emoji groups and subgroups to samples and tooltips of the **Emoji Data Finder** utility.

## 6.4.1

- Improved copy to clipboard of both linear fields (looked up character and its variants) in the **Unihan Variants** utility: used tab separator instead of line break.
- Added new Unihan reference link.
- Updated `Electron` to version `7.1.11`.

## 6.4.0

- Updated release notes (CHANGES.md).
- Reordered variant relations by logical groups in the **Unihan Variants** utility.
- Improved linear layout and used thicker border for looked up character in the **Unihan Variants** utility.

## 6.3.0

- Fixed unsuccessful run of app (after *start* or *build* of downloaded source code) on several platforms, by changing incorrectly synchronized directory name on GitHub repository: `cldr` -> `CLDR` (uppercase).
- Restored the `--asar` option of the `electron-packager` command for all platforms in the `package.json` file.
- Updated `Electron` to version `7.1.10`.

## 6.2.3

- Added release notes (CHANGES.md).
- Improved layout of emoji in the **Emoji Data Finder** utility.
- Added support for 4 Unicode properties: `Joining Type`, `Joining Group`, `Indic Positional Category`, `Indic Syllabic Category` to the **Unicode Inspector** utilty. 
- Fixed incorrect build on `win32` by temporarily removing the `--asar` option of the `electron-packager` command.

## 6.2.2

- Fixed missing handling of `Save Results...` in the **Unihan Radical-Strokes** utility.

## 6.2.1

- Allowed alt-click as an alternative to shift-click in the **CJK Font Variants** utility.
- Added a hidden "save DOT source" debug feature to the **Unihan Variants** utility.
- Updated instructions.

## 6.2.0

- Added the full list of radical-strokes combinations as tooltip to each Unihan character listed in the **Unihan Radical-Strokes** utility.
- Added the detailed list of code points with Unicode names as tooltip to each emoji listed in the **Emoji Data Finder** utility.

## 6.1.0

- Added a "Save as SVG" feature to the **Unihan Variants** utility.
- Updated instructions and screenshots accordingly.

## 6.0.0

- Added a new **Unihan Variants** utility.
- Updated screenshots, instructions and `README.md` file accordingly.
- Improved horizontal centering of Unihan characters in the **View by Grid** feature of the **Unihan Data Finder** utility.
- Enabled opening of external links in SVG graphs.
- Updated `Electron` to version `7.1.9`.
- Updated `Electron Packager` to version `14.2.0`.

## 5.16.5

- Fixed opening of invalid anchors.
- Updated `Electron` to version `7.1.8`.

## 5.16.4

- Fixed app timestamp date.
- Updated copyright years.
- Updated emoji version dates.
- Updated handling of default smart zoom setting.

## 5.16.3

- Improved display of data table in the **Match Character** feature of the **Unihan Data Finder** utility, by graying out rows of variant characters, if any.
- Increased font size of Unihan input field for better legibility.
- Updated screenshot.

## 5.16.2

- Improved layout of Unihan data tables, by refactoring styling code.
- Cleaned up variable and class names in Unihan data tables code.
- Added regex example.
- Updated screenshot.
- Updated `Electron` to version `7.1.7`.

## 5.16.1

- Used constant terminology for characters and code points.
- Fixed typo.
- Simplified code.
- Added regex example.
- Updated screenshots.

## 5.16.0

- Moved the **Radical/Strokes** feature out of the **Unihan Data Finder** utility to a new **Unihan Radical-Strokes** utility.
- Added a new **Match Character** feature to the **Unihan Data Finder** utility, including a `Match Variants` option.
- Updated instructions and screenshots accordingly.
- Updated `Electron` to version `7.1.6`.

## 5.15.3

- Improved compact layout of chart of the **Radical/Strokes** feature of the **Unihan Data Finder** utility.
- Improved unique names for surrogates and private use characters, making use of a pattern consistent with the Unicode name derivation rules.
- Fixed removal of menu bar in license window on Linux.
- Updated `Electron` to version `7.1.5`.

## 5.15.2

- Fixed unique names of CJK Unified Ideographs, making use of the Unicode name derivation rules.
- Updated screenshots accordingly.
- Added samples for unassigned characters to the **Unicode Inspector** utility.
- Updated `Electron` to version `7.1.4`.

## 5.15.1

- Fixed incorrect display of age information in specific cases.
- Fixed missing non-character information for plane 16 private use characters.
- Added regex example to the **Match Character** feature of the **Unicode Data Finder** utility, for the total of 137,929 Unicode characters defined in [Unicode 12.1](https://www.unicode.org/versions/Unicode12.1.0/).

## 5.15.0

- Added tooltips with age, script, script extensions and general category to the data table rows of the **Unicode Data Finder** utility.
- Added tooltips with age and status of Unihan characters (unified or compatibility ideograph) to the data table rows of the **Find by Tag Value** feature, and to the data table cells of the **View by Grid** feature of the **Unihan Data Finder** utility.
- Added status (unified or compatibility ideograph) to the basic Unihan information of the **Unihan Inspector** utility.
- Appended date (month & year) to the age information in all utilities.
- Fixed missing age information for plane 16 private use characters.
- Updated instructions and screenshots accordingly.

## 5.14.0

- Replaced deprecated HTML Imports with explicit reading of HTML files and dynamic templates.
- Updated `Electron` to version `7.1.3`.

## 5.13.2

- Renamed license HTML file to prevent licensing ambiguity on GitHub.
- Added appropriate `lang` attribute to CJK reference links.
- Replaced custom code with `padStart()` string function for cleaner code and better performance.
- Fixed UI init order issue and added tooltip to each option of the `Locale` drop-down menu in the **Unicode Foldings** utility.

## 5.13.1

- Used stronger contrasting colors for the diff color mode of the **CJK Font Variants** utility.
- Added new regex example for `kTotalStrokes` to the **Find by Tag Value** feature of the **Unihan Data Finder** utility.
- Updated `Electron Packager` to version `14.1.1`.

## 5.13.0

- Added diff color mode to the **CJK Font Variants** utility.
- Cleaned up table creation in the **Radical/Strokes** feature of the **Unihan Data Finder** utility.
- Updated various samples.
- Updated `Electron` to version `7.1.2`.

## 5.12.1

- Added new CJK samples.
- Improved support for `Emoji 12.1`.
- Added separator lines for non compact layout in the **Radical/Strokes** feature of the **Unihan Data Finder** utility.
- Updated `Electron` to version `7.1.1`.

## 5.12.0

- Improved layout of checkboxes.
- Added support for `Emoji 12.1`.
- Added `Display Emoji Size Statistics` sample script.
- Updated `Electron` to version `7.1.0`.

## 5.11.1

- Fixed issues in `<input type="search">` fields by reverting `Electron` to version `6.1.1`.

## 5.11.0

- Improved the **Unicode Foldings** utility: added a `Locale` drop-down menu and related sample strings.
- Added a new Unicode sample script `Test Special Case Foldings` to the **JavaScript Runner** utility.
- Added an optional `Case Foldings` info field to the **Unicode Inspector** utility.
- Added Bopomofo samples to the **CJK Font Variants** utility.
- Replaced deprecated `get` functions with equivalent properties.
- Displayed custom menu bar as early as possible.
- Improved styling of disabled drop-down menus.
- Updated instructions and screenshots.
- Updated `Electron` to version `7.0.0`.

## 5.10.0

- Added a new **Unicode Foldings** utility.
- Added/updated samples, reference links and regex examples.

## 5.9.3

- Updated various samples.
- Added Unihan reference links.
- Added priority and source(s) tooltip to the IICore set field in the **Unihan Inspector** utility.
- Updated `Electron` to version `6.0.12`.

## 5.9.2

- Added unusual CJK samples to the **Unicode Inspector** utility.
- Updated screenshot accordingly.
- Used distinct background color for user text selection.
- Updated `Electron` to version `6.0.11`.

## 5.9.1

- Improved horizontal centering of CJK characters in vertical mode in the **CJK Font Variants** utility.
- Added new CJK sample string: Hiragana Named Sequences.
- Disabled unintentional user selection of table headers.
- Updated screenshots.

## 5.9.0

- Improved the results of the **Find by Tag Value** feature of the **Unihan Data Finder** utility: display all values, with non-matching ones grayed out.
- Updated screenshot.
- Fixed incorrect build date in About dialog.
- Updated `Electron` to version `6.0.10`.
- Updated `Electron Packager` to version `14.0.6`.

## 5.8.3

- Improved the CJK typeface widget of the **Unihan Inspector** utility.
- Improved tooltips for Unihan characters and radicals.
- Improved the presentation of regex examples in the **Match Character** feature of the **Unicode Data Finder** utility.
- Updated screenshots.

## 5.8.2

- Updated minimum size of main window to more consistent values for width and height.
- Updated instructions of the **Unihan Inspector** utility, related to the lookup of radicals.
- Added Radical hint to the **Unihan Inspector** utility.
- Updated screenshots.

## 5.8.1

- Improved info layout and dynamic links of the **Unihan Inspector** utility.
- Refactored code of the **Unihan Inspector** utility.
- Increased font size of Unihan input fields consistently.
- Fixed syntax of `--asar` option of `electron-packager` in `package.json`.
- Updated screenshots.

## 5.8.0

- Improved dynamically generated links in the **Unihan Inspector** utility, matching combinations as well.
- Added basic radical info to the **Unihan Inspector** utility when looking up radicals.
- Fixed inconsistent font in the **Radical/Strokes** feature of the **Unihan Data Finder** utility.
- Increased font weight of emoji short names in the **Emoji Data Finder** utility.
- Added System Version to the system information copied to clipboard.
- Used promise-based versions of open/save file dialog functions.
- Combined `Array.from ()` with `map ()` where relevant.
- Updated `Electron` to version `6.0.7`.

## 5.7.0

- Improved the **Unihan Inspector** utility:
    - added dynamic links to Unihan characters and code points, making use of transitory buttons on hovering
    - allowed lookup of CJK and KangXi radicals in addition to Unihan characters
    - updated and reordered fields in the basic Unicode and Unihan information lists
    - allowed display of self-variants too
    - updated instructions
    - updated screenshot
- Updated `Electron` to version `6.0.5`.
- Updated `Electron Packager` to version `14.0.5`.

## 5.6.3

- Added alternate diff visualization feature (shift-click) in the **CJK Font Variants** utility.
- Updated instructions accordingly.
- Added new samples and regex examples.
- Updated `Electron` to version `6.0.4`.

## 5.6.2

- Fixed font loading issue and improved language tooltips in the **CJK Font Variants** utility.
- Prepared for a future Traditional Chinese (Macao) language font flavor.
- Added reference link to the CJK fonts repository.

## 5.6.1

- Improved CJK language names and tags for Traditional Chinese.
- Added samples (IVD sequence, Hiragana digraph, Hangul letters) to the **CJK Font Variants** utility.
- Added sample (confusables) to the **Unicode Inspector** utility.
- Updated screenshots.
- Updated documentation.

## 5.6.0

- Fixed issue when launching second instance of app on macOS.
- Updated `Electron` to version `6.0.0`, supporting Unicode 12.1 for normalization and regular expressions.
- Used `grapheme-splitter` module.
- Updated regex examples.
- Reorganized samples.
- Added font size tooltip to slider.
- Added radical code point and name as tooltip to radicals table.
- Added missing `--asar` option for `electron-packager`.

## 5.5.1

- Added code point as tooltip to each Unihan variant character in the **Unihan Inspector** utility.
- Refactored Unihan variants code.
- Updated reference links.
- Updated `Electron Packager` to version `14.0.1`.

## 5.5.0

- Added several classes of variant characters in the basic Unihan information panel of the **Unihan Inspector** utility.
- Updated instructions accordingly.
- Updated `Electron` to version `5.0.6`.

## 5.4.2

- Allowed all *enclosed ideographs* to be displayed in the **CJK Font Variants** utility, and added them as sample strings.
- Refactored code dealing with *offscreen canvas* in the **Emoji Picture Book** utility.
- Added new regex example in the **Match Sequence** feature of the **Emoji Data Finder** utility.

## 5.4.1

- Fixed layout of error message box for search input strings.
- Added new Unicode script: `Compare Whitespace Matches`.
- Added spaces sample.
- Updated `Electron` to version `5.0.5`.
- Updated `Electron Packager` to version `14.0.0`.

## 5.4.0

- Added new interactive feature to the **CJK Font Variants** utility: visual feedback on mouse click to spot differences in glyph variations.
- Fixed grapheme segmentation of input string and improved tooltips in the **CJK Font Variants** utility.
- Added line break property to the **Unicode Inspector** utility.
- Used standard bracketed comma-separated notation for sequences of code points.
- Added Unicode and ICU versions to the system information copied to clipboard.
- Fixed window icon in Linux.
- Updated samples.
- Updated screenshots.
- Updated `Electron` to version `5.0.3`.

## 5.3.0

- Added all name aliases to the **Unicode Inspector** utility, according to the *NameAliases.txt* data file.
- Used all name aliases for search and display in the **Unicode Data Finder** utility.
- Cleaned up code: used consistent string delimiters.
- Updated instructions.
- Updated screenshots.

## 5.2.0

- Replaced the `Filter` push-button with a three-action pop-up menu in the **Filter Text** feature of the **Emoji Data Finder** utility:
    - `Discard Non-Emoji`: strip out non-emoji characters
    - `Upgrade to RGI Emoji`: restore incomplete emoji to their **RGI** form
    - `Remove Duplicate Emoji`: delete emoji duplicates
- Removed systematic deletion of duplicates in emoji data list.
- Added ISO country code to the short name of emoji flags.
- Improved status tooltip in the emoji data lists.
- Updated emoji regex examples.
- Updated samples.
- Updated instructions.
- Updated `Electron` to version `5.0.2`.

## 5.1.1

- Truncated loaded file text longer than max length.
- Added tooltip to `Results` pop-up menu button.

## 5.1.0

- Replaced `Clear Results` button with `Results` pop-up menu used to perform basic actions: `Copy Results`, `Save Results...`, `Clear Results`.
- Improved pop-up menus: positioning, visual feedback.
- Added max length to text input and text area fields.
- Fixed use of proper current target in event listeners.
- Fixed layout visual glitches.
- Updated instructions.
- Updated samples.
- Cleaned up code.

## 5.0.1

- Moved duplicated Unicode regex building code to separate module function.
- Fixed potential bug in regex pattern when Whole Word option set.
- Doubled vertical root margin in IntersectionObserver instances.
- Fixed typo in sample name.
- Updated reference links.
- Updated instructions.

## 5.0.0

- Added support for **Unicode 12.1**.
- Updated the **CJK Font Variants** utility:
    - allowed more kinds of characters to get displayed,
    - added clone of language header as extra footer.
- Added the `Vertical Orientation` property to the **Unicode Inspector** utility.
- Improved the `Run Normalization Conformance Test` script.
- Updated samples and reference links.
- Refactored and cleaned up code.
- Updated all screenshots.
- Updated `Electron` to version `5.0.1`.

## 4.7.0

- Revamped the **CJK Font Variants** utility, adding a `Writing Mode` option: `Horizontal` or `Vertical`, together with a Japanese manuscript paper-like layout.
- Added `East Asian Width` and `Emoji` properties to the **Unicode Inspector** utility.
- Added preload of embedded fonts.
- Updated samples and reference links.
- Updated `Electron` to version `4.2.0`.
- Reorganized the Unicode-related data files.

## 4.6.0

- Added `Compact Layout` option to the **Radical/Strokes** feature of the **Unihan Data Finder** utility.
- Removed pointless codes info for lone surrogates in the **Unicode Inspector** utility.
- Renamed `Developer` category to `Common`.

## 4.5.5

- Improved layout and display of data in the **Unicode Inspector** and **Unihan Inspector** utilities.
- Used better names for planes 15 and 16.
- Cleaned up code.

## 4.5.0

- Renamed `Binary Properties` to `Extended Properties`.
- Used *Snake_Case* for all listed Unicode property names, consistent with their regex counterparts.
- Optimized the *Match Decomposition* search option of the **Match Character** feature of the **Unicode Data Finder** utility.
- Added Regex Examples for *Match Decomposition* toggled ON.
- Updated the Noto Sans CJK set of fonts to version 2.001.
- Updated CJK character samples of the **CJK Font Variants** utility.

## 4.4.0

- Extended the *Match Decomposition* search option of the **Match Character** feature of the **Unicode Data Finder** utility.
- Sorted in lexical order `Binary Properties`, `Core Properties` and `Script Extensions` in the **Unicode Inpector** utility.  

## 4.3.0

- Added Unicode sample script: `Write Parsed Numeric Values Data to File`.
- Added Unihan sample scripts: `Detect Misclassified Compatibility Ideographs` and `Write Unihan Compatibility Variants to File`.
- Improved layout of emoji data table in the **Emoji Data Finder** utility.
- Added numeric value field and CJK Numerals samples to the **Unicode Inspector** utility.
- Reordered normalization forms in the **Unicode Normalizer** utility.
- Added Unihan numeric value and compatibility variants infos to the **Unihan Inspector** utility.
- Updated `Electron` to version `4.1.4`.

## 4.2.0

- Enhanced the *Use Decomposition* search option of the **Match Character** feature of the **Unicode Data Finder** utility.

## 4.1.1

- Refactored code and added instructions for the *Use Decomposition* search option of the **Match Character** feature of the **Unicode Data Finder** utility.

## 4.1.0

- Added simple yet powerful *Use Decomposition* search option to the **Match Character** feature of the **Unicode Data Finder** utility.
- Added CJK font variant sample.
- Added normalization form samples.
- Updated emoji CLDR annotation file.
- Fixed vertical overflow of normalized strings.

## 4.0.0

- Added support for **Unicode 12.0**, including Unihan and emoji.
- Updated instructions accordingly.
- Updated **JavaScript Runner** sample scripts.
- Updated `Electron` to version `4.0.8`.
- Revamped display of MIT License.
- Cleaned up code.

## 3.1.0

- Added **Unicode Normalizer** utility.
- Added Unicode normalization-related reference links.

## 3.0.1

- Fixed `Electron Packager` high severity vulnerability warning on install.
- Filtered out non-Unihan characters in Yasuoka variants.
- Added new Unihan sample scripts.
- Reorganized reference links.
- Updated `README.md` file.
- Cleaned up code.

## 3.0.0

- Renamed application to **Unicopedia Plus**.
- Renamed two **Match Symbol** features to **Match Sequence** and **Match Character**, respectively.
- Added new command in Developer menu: `Copy System Info to Clipboard`.
- Added new sample scripts: `Run Normalization Conformance Test` and `Write Normalization Test Data to File`.
- Added Unicode age to each Unihan character tooltip in the **View by Grid** feature of the **Unihan Data Finder** utility.
