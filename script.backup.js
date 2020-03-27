const apiUrl = "https://api.kawalcorona.com/";
let defaultRenderedElement, idRenderedElement, aboutRenderedElement;
let createdBerandaListElement = document.createElement("div");
let createdBerandaTableElement = document.createElement("div");

const Data = {
    global: {
        all: [],
        status : {
            confirmed: 0,
            deaths: 0,
            recovered: 0
        }
    },
    indonesia: {
        all : {},
        provinces: []
    }
}

const fetchData = async (url) => {
    const response = await fetch(url);
    const json = await response.json()
    return await json;
}


// Indonesia Data
async function setIndonesia(){
    const createdIndonesiaListElement = document.createElement("div");
    let createdIndonesiaTableElement = document.createElement("div");

    const ul = document.createElement("ul");
    ul.classList.add("global-wrapper");

    if (Object.keys(Data.indonesia.all).length == 0) {
        const urlIndonesia = `${apiUrl}indonesia/`;
        await fetchData(urlIndonesia)
            .then(res => {
                // Create Confirmed
                createdIndonesiaListElement.append(globalCreateListElement("Total Positif", res[0].positif, "bg-yellow"));
                // Create Recovered
                createdIndonesiaListElement.append(globalCreateListElement("Total Sembuh", res[0].sembuh, "bg-green"));
                // Create Deaths
                createdIndonesiaListElement.append(globalCreateListElement("Total Meninggal", res[0].meninggal, "bg-red"));

            });
    }

    if(Data.indonesia.provinces.length == 0) {
        const urlIndonesiaProv = `${apiUrl}indonesia/provinsi/`;
        await fetchData(urlIndonesiaProv)
            .then(res => {

                const tableCellTitle = ["No", "Provinsi", "Positif", "Sembuh", "Meninggal"];
                createdIndonesiaTableElement = globalCreateTableElement(res, tableCellTitle, "Data Perkembangan Covid19 Di Indonesia", false);
            });
    }

    app.innerHTML = "";
    ul.append(createdIndonesiaListElement);
    app.append(ul);
    app.append(createdIndonesiaTableElement);
    defaultRenderedElement = app.innerHTML;
}



// Bedanda Data
async function setBeranda() {
    // Create Status Element
    const ul = document.createElement("ul");
    ul.classList.add("global-wrapper")

    if (Data.global.status.confirmed == 0) {
        const urlPositif = `${apiUrl}positif/`;
        await fetchData(urlPositif)
            .then(res => {
                createdBerandaListElement.append(globalCreateListElement(res.name, res.value, "bg-yellow"));
            });
    }

    if (Data.global.status.recovered == 0) {
        const urlRecovered = `${apiUrl}sembuh/`;
        await fetchData(urlRecovered)
            .then(res => {
                createdBerandaListElement.append(globalCreateListElement(res.name, res.value, "bg-green"));
            });
    }

    if (Data.global.status.deaths == 0) {
        const urlDeaths = `${apiUrl}meninggal/`;
        await fetchData(urlDeaths)
            .then(res => {
                createdBerandaListElement.append(globalCreateListElement(res.name, res.value, "bg-red"));
            });
    }

    
    // Create Table Countries
    if(Data.global.all.length == 0) {
        await fetchData(apiUrl)
            .then(res => {
                const tableCellTitle = ["No", "Negara", "Positif", "Sembuh", "Meninggal"];
                createdBerandaTableElement = globalCreateTableElement(res, tableCellTitle, "Data Perkembangan Covid19 Di Dunia");
            });
    }

    app.innerHTML = "";
    ul.append(createdBerandaListElement);

    app.append(ul);
    app.append(createdBerandaTableElement);
    renderedElement = app.innerHTML;
}

function globalCreateListElement(title, data, classname) {

    let li, liValueEl, liTitleEl, liValue, liTitle;
    li = document.createElement("li");
    li.classList.add(classname);
    li.innerHTML = "";

    liTitleEl = document.createElement("div");
    liTitleEl.classList.add("title");

    liValueEl = document.createElement("div");
    liValueEl.classList.add("value");

    liTitle = document.createTextNode(title);
    liValue = document.createTextNode(data);

    liTitleEl.append(liTitle);
    liValueEl.append(liValue);
    li.append(liTitleEl);
    li.append(liValueEl);
    return li;
}

function globalCreateTableElement(data, tableTitle, tableCaption, world = true){
    let table, tableValue;

    table = document.createElement("table");
    table.classList.add("global-data");
    table.setAttribute("border", "1");
    
    const tableCaptionWrapper = table.createCaption();
    tableCaptionWrapper.innerHTML = tableCaption;

    let tableBody, tableBodyCell;

    if(world) {
        data.map((d, index) => {
            tableBody = table.insertRow();
            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = (index + 1);

            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = d.attributes.Country_Region;

            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = d.attributes.Confirmed;

            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = d.attributes.Recovered;

            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = d.attributes.Deaths;
        });
    }

    else {
        data.map((d, index) => {
            tableBody = table.insertRow();
            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = (index + 1);

            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = d.attributes.Provinsi;

            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = d.attributes.Kasus_Posi;

            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = d.attributes.Kasus_Semb;

            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = d.attributes.Kasus_Meni;
        });
    }

    

    const tableHeader = table.createTHead();
    const tableRow = tableHeader.insertRow(0);

    let tableCell;

    tableTitle.map(title => {
        tableCell = tableRow.insertCell();
        tableCell.innerHTML = title;
    });

    return table;
}

    
document.addEventListener('DOMContentLoaded', function(){ 
    const app = document.getElementById("app");
    setBeranda();
    
    const berandaTrigger = document.getElementById("nav-beranda-trigger");
    const indonesiaTrigger = document.getElementById("nav-indonesia-trigger");

    berandaTrigger.addEventListener("click", function(e) {
        if (typeof defaultRenderedElement == "undefined") {
            setBeranda();
        } else {

        }
    })

    indonesiaTrigger.addEventListener("click", function(e) {
        setIndonesia(); 
    })

}, false);




