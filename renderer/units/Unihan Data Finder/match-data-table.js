//
const regexp = require ('../../lib/unicode/regexp.js');
const unicode = require ('../../lib/unicode/unicode.js');
const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
//
const deferredSymbols = (process.platform === 'darwin');
//
module.exports.create = function (characters, regex, params)
{
    function updateDataPage (dataPage)
    {
        // Update pagination bar
        firstPageButton.disabled = (params.pageIndex === 0);
        firstPageButton.title = `First page: ${0 + 1}`;
        prevPageButton.disabled = (params.pageIndex === 0);
        prevPageButton.title = `Previous page: ${params.pageIndex - 1 + 1}`;
        if (pageSelect.value !== (params.pageIndex + 1))
        {
            pageSelect.value = params.pageIndex + 1;
        }
        pageSelect.disabled = (pages.length === 1);
        pageSelect.title = `Current page: ${params.pageIndex + 1}`;
        nextPageButton.disabled = (params.pageIndex === (pages.length - 1));
        nextPageButton.title = `Next page: ${params.pageIndex + 1 + 1}`;
        lastPageButton.disabled = (params.pageIndex === (pages.length - 1));
        lastPageButton.title = `Last page: ${pages.length}`;
        //
        let characters = pages[params.pageIndex];
        while (dataPage.firstChild)
        {
            dataPage.firstChild.remove ();
        }
        if (deferredSymbols)
        {
            params.observer = new IntersectionObserver
            (
                (entries, observer) =>
                {
                    entries.forEach
                    (
                        entry =>
                        {
                            if (entry.isIntersecting)
                            {
                                let symbol = entry.target;
                                if (symbol.textContent !== symbol.dataset.character)
                                {
                                    symbol.textContent = symbol.dataset.character;
                                    observer.unobserve (symbol);
                                }
                            }
                        }
                    );
                },
                { root: params.root, rootMargin: '100% 0%' }
            );
        }
        let table = document.createElement ('table');
        table.className = 'data-table';
        //
        let headerRow = document.createElement ('tr');
        headerRow.className = 'header-row';
        let symbolHeader = document.createElement ('th');
        symbolHeader.className = 'symbol-header';
        symbolHeader.textContent = "Char.";
        headerRow.appendChild (symbolHeader);
        let codePointHeader = document.createElement ('th');
        codePointHeader.className = 'code-point-header';
        codePointHeader.textContent = "Code\xA0Point";
        headerRow.appendChild (codePointHeader);
        let ageHeader = document.createElement ('th');
        ageHeader.className = 'age-header';
        ageHeader.textContent = "Age";
        headerRow.appendChild (ageHeader);
        let setHeader = document.createElement ('th');
        setHeader.className = 'set-header';
        setHeader.textContent = "Set";
        headerRow.appendChild (setHeader);
        let statusHeader = document.createElement ('th');
        statusHeader.className = 'status-header';
        statusHeader.textContent = "Status";
        headerRow.appendChild (statusHeader);
        let blockNameHeader = document.createElement ('th');
        blockNameHeader.className = 'block-name-header';
        blockNameHeader.textContent = "Block";
        headerRow.appendChild (blockNameHeader);
        table.appendChild (headerRow);
        //
        for (let character of characters)
        {
            let data = unicode.getCharacterBasicData (character);
            let set = "Full Set";
            let setTooltip = "Full Unihan";
            let tags = unihanData.codePoints[data.codePoint];
            if ("kIICore" in tags)
            {
                set = "IICore";
                setTooltip = "International Ideographs Core";
            }
            else if ("kUnihanCore2020" in tags)
            {
                set = "UCore";
                setTooltip = "Unihan Core (2020)";
            }
            let dataRow = document.createElement ('tr');
            dataRow.className = 'data-row';
            if (regex && (!regex.test (character)))
            {
                dataRow.classList.add ('variant');
            }
            let symbolData = document.createElement ('td');
            symbolData.className = 'symbol-data';
            if (deferredSymbols)
            {
                symbolData.textContent = "\xA0";
                symbolData.dataset.character = data.character;
                params.observer.observe (symbolData);
            }
            else
            {
                symbolData.textContent = data.character;
            }
            dataRow.appendChild (symbolData);
            let codePointData = document.createElement ('td');
            codePointData.className = 'code-point-data';
            codePointData.textContent = data.codePoint;
            dataRow.appendChild (codePointData);
            let ageData = document.createElement ('td');
            ageData.className = 'age-data';
            // ageData.appendChild (document.createTextNode (`Unicode\xA0${data.age}`));
            // ageData.appendChild (document.createElement ('br'));
            // ageData.appendChild (document.createTextNode (`(${data.ageDate.replace (" ", "\xA0")})`));
            ageData.textContent = `Unicode\xA0${data.age} (${data.ageDate.replace (" ", "\xA0")})`;
            dataRow.appendChild (ageData);
            let setData = document.createElement ('td');
            setData.className = 'set-data';
            setData.textContent = set;
            setData.title = setTooltip;
            dataRow.appendChild (setData);
            let statusData = document.createElement ('td');
            statusData.className = 'status-data';
            statusData.textContent = regexp.isUnified (character) ? "Unified Ideograph" : "Compatibility Ideograph";
            dataRow.appendChild (statusData);
            let blockNameData = document.createElement ('td');
            blockNameData.className = 'block-name-data';
            if (data.blockName)
            {
                blockNameData.title = data.blockRange;
                blockNameData.innerHTML = data.blockName.replace (/ (.)$/, "\u00A0$1").replace (/(\b\w+-\w\b)/g, '<span style="white-space: nowrap;">$1</span>');
            }
            else
            {
                blockNameData.textContent = "<none>";   // "<no block>"
            }
            dataRow.appendChild (blockNameData);
            table.appendChild (dataRow);
        }
        //
        dataPage.appendChild (table);
    }
    //
    let pages;
    //
    let dataTable = document.createElement ('div');
    //
    let paginationBar = document.createElement ('div');
    paginationBar.className = 'pagination-bar';
    //
    let navigationGroup = document.createElement ('div');
    navigationGroup.className = 'pagination-group';
    //
    let firstPageButton = document.createElement ('button');
    firstPageButton.type = 'button';
    firstPageButton.className = 'page-nav-button first-page-button';
    firstPageButton.innerHTML = '<svg class="page-nav-icon" viewBox="0 0 10 10"><polygon points="0,5 4,1 5,2 2,5 5,8 4,9" /><polygon points="4,5 8,1 9,2 6,5 9,8 8,9" /></svg>';
    firstPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (params.pageIndex > 0)
            {
                params.pageIndex = 0;
                updateDataPage (dataPage);
            }
        }
    );
    navigationGroup.appendChild (firstPageButton);
    //
    let prevPageButton = document.createElement ('button');
    prevPageButton.type = 'button';
    prevPageButton.className = 'page-nav-button prev-page-button';
    prevPageButton.innerHTML = '<svg class="page-nav-icon" viewBox="0 0 10 10"><polygon points="2,5 6,1 7,2 4,5 7,8 6,9" /></svg>';
    prevPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (params.pageIndex > 0)
            {
                params.pageIndex = params.pageIndex - 1;
                updateDataPage (dataPage);
            }
        }
    );
    navigationGroup.appendChild (prevPageButton);
    //
    let pageSelect = document.createElement ('input');
    pageSelect.type = 'number';
    pageSelect.className = 'page-select';
    pageSelect.addEventListener
    (
        'input',
        (event) =>
        {
            if (event.currentTarget.value !== "")
            {
                if (event.currentTarget.value < 1)
                {
                    event.currentTarget.value = 1;
                }
                else if (event.currentTarget.value > pages.length)
                {
                    event.currentTarget.value = pages.length;
                }
                params.pageIndex = event.currentTarget.value - 1;
                updateDataPage (dataPage);
            }
        }
    );
    pageSelect.addEventListener
    (
        'blur',
        (event) =>
        {
            if (event.currentTarget.value === "")
            {
                event.currentTarget.value = params.pageIndex + 1;
            }
        }
    );
    navigationGroup.appendChild (pageSelect);
    //
    let nextPageButton = document.createElement ('button');
    nextPageButton.type = 'button';
    nextPageButton.className = 'page-nav-button next-page-button';
    nextPageButton.innerHTML = '<svg class="page-nav-icon" viewBox="0 0 10 10"><polygon points="6,5 3,2 4,1 8,5 4,9 3,8" /></svg>';
    nextPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (params.pageIndex < (pages.length - 1))
            {
                params.pageIndex = params.pageIndex + 1;
                updateDataPage (dataPage);
            }
        }
    );
    navigationGroup.appendChild (nextPageButton);
    //
    let lastPageButton = document.createElement ('button');
    lastPageButton.type = 'button';
    lastPageButton.className = 'page-nav-button last-page-button';
    lastPageButton.innerHTML = '<svg class="page-nav-icon" viewBox="0 0 10 10"><polygon points="4,5 1,2 2,1 6,5 2,9 1,8" /><polygon points="8,5 5,2 6,1 10,5 6,9 5,8" /></svg>';
    lastPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (params.pageIndex < (pages.length - 1))
            {
                params.pageIndex = pages.length - 1;
                updateDataPage (dataPage);
            }
        }
    );
    navigationGroup.appendChild (lastPageButton);
    //
    paginationBar.appendChild (navigationGroup);
    //
    let pageInfoGroup = document.createElement ('div');
    pageInfoGroup.className = 'pagination-group';
    //
    let pageInfo = document.createElement ('div');
    pageInfo.className = 'page-info';
    //
    pageInfoGroup.appendChild (pageInfo);
    //
    paginationBar.appendChild (pageInfoGroup);
    //
    const pageSizes = [ 4, 8, 16, 32, 64, 128, 256, 512, 1024 ];
    //
    let pageSizeGroup = document.createElement ('div');
    pageSizeGroup.className = 'pagination-group';
    //
    let pageSizeLabel = document.createElement ('label');
    let pageSizeSelect = document.createElement ('select');
    pageSizeSelect.className = 'page-size-select';
    pageSizes.forEach
    (
        (pageSize) =>
        {
            let pageSizeOption = document.createElement ('option');
            pageSizeOption.textContent = pageSize;
            pageSizeSelect.appendChild (pageSizeOption);
        }
    );
    //
    pageSizeLabel.appendChild (pageSizeSelect);
    let pageSizeText = document.createTextNode ("\xA0\xA0per page");
    pageSizeLabel.appendChild (pageSizeText);
    pageSizeGroup.appendChild (pageSizeLabel);
    //
    pageSizeSelect.value = params.pageSize;
    if (pageSizeSelect.selectedIndex < 0) // -1: no element is selected
    {
        pageSizeSelect.selectedIndex = 0;
    }
    //
    function paginate ()
    {
        pages = [ ];
        for (let startIndex = 0; startIndex < characters.length; startIndex += params.pageSize)
        {
            pages.push (characters.slice (startIndex, startIndex + params.pageSize));
        }
        let pageCount = pages.length;
        pageSelect.min = 1;
        pageSelect.max = pageCount;
        pageSelect.value = params.pageIndex + 1;
        pageInfo.innerHTML = (pageCount > 1) ? `<strong>${pageCount}</strong>&nbsp;pages` : "";
        updateDataPage (dataPage);
    }
    //
    pageSizeSelect.addEventListener
    (
        'input',
        (event) =>
        {
            params.pageSize = parseInt (event.currentTarget.value);
            params.pageIndex = 0;
            paginate ();
        }
    );
    //
    paginationBar.appendChild (pageSizeGroup);
    //
    dataTable.appendChild (paginationBar);
    let dataPage = document.createElement ('div');
    dataTable.appendChild (dataPage);
    //
    if (( 0 > params.pageIndex) || (params.pageIndex > Math.trunc ((characters.length - 1) / params.pageSize)))
    {
        params.pageIndex = 0;
    }
    paginate ();
    //
    return dataTable;
}
//
