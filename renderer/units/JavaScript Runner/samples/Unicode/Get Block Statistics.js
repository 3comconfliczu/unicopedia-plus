// Get Block Statistics
const { blocks } = require ('./lib/unicode/parsed-extra-data.js');
let allBlocks = blocks.map
(
    block =>
    {
        return { name: block.name, size: parseInt (block.last, 16) - parseInt (block.first, 16) + 1 };
    }
);
allBlocks.sort ((a, b) => a.name.localeCompare (b.name)).sort ((a, b) => b.size - a.size);
$.writeln (`Number of blocks: ${allBlocks.length}`);
allBlocks.forEach
(
    blockData =>
    {
        $.writeln (`${blockData.name}: ${blockData.size} (${blockData.size / 16} × 16)`);
    }
);
