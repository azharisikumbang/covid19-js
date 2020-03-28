let defaultRenderedElement, idRenderedElement, aboutRenderedElement, createdElement, tableCellTitle, ul;
const apiUrl = "https://api.kawalcorona.com/";

async function request(url = null){
    const response = await fetch(apiUrl + url);
    const json = await response.json()
    return await json;
}

async function renderDefaultElement(){
    console.log("default");

    // Set created Element
    defaultRenderedElement = document.createElement("div");

    // Set Element
    ul = document.createElement("ul");
    ul.classList.add("global-wrapper");

    // Request Data Positif
    await request("positif/")
        .then(res => {
            ul.append(createList(res.name, res.value, "bg-yellow"))
        });

    // Request Data Recovered
    await request("sembuh/")
        .then(res => {
            ul.append(createList(res.name, res.value, "bg-green"))
        });

    // Request Data Deaths
    await request("meninggal/")
        .then(res => {
            ul.append(createList(res.name, res.value, "bg-red"))
        });

    // Request Data All
    await request()
        .then(res => {
            tableCellTitle = ["No", "Negara", "Positif", "Sembuh", "Meninggal"];
            defaultRenderedElement.append(creteTable(res, tableCellTitle, "Data Perkembangan Covid19 Di Dunia"))
        });


    defaultRenderedElement.prepend(ul);
    // Load to document
    app.innerHTML = defaultRenderedElement.innerHTML;
}

async function renderIndonesiaElement(){
    console.log("indonesia");

    // set created Element
    idRenderedElement = document.createElement("div");

    // Set Element
    ul = document.createElement("ul");
    ul.classList.add("global-wrapper");

    // Request Id Data
    await request("indonesia/")
        .then(res => {
            // Create Confirmed
            ul.append(createList("Total Positif", res[0].positif, "bg-yellow"));
            // Create Recovered
            ul.append(createList("Total Sembuh", res[0].sembuh, "bg-green"));
            // Create Deaths
            ul.append(createList("Total Meninggal", res[0].meninggal, "bg-red"));
        });

    // Request Provinces Data 
    await request("indonesia/provinsi/")
        .then(res => {
            tableCellTitle = ["No", "Provinsi", "Positif", "Sembuh", "Meninggal"];
            idRenderedElement.append(creteTable(res, tableCellTitle, "Data Perkembangan Covid19 Di Indonesia", false));
        })


    idRenderedElement.prepend(ul);
    // Load to document
    app.innerHTML = idRenderedElement.innerHTML;
}

function renderAboutElement(){
    alert("Halaman ini dibuat berdasarkan data dari https://kawalcorona.com");
}

function createList(title, data, classname) {

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


function creteTable(data, tableTitle, tableCaption, world = true){
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

    renderDefaultElement();
    
    const berandaTrigger = document.getElementById("nav-beranda-trigger");
    const indonesiaTrigger = document.getElementById("nav-indonesia-trigger");
    const tentangTrigger = document.getElementById("nav-tentang-trigger");

    berandaTrigger.addEventListener("click", function() {
        if (typeof defaultRenderedElement == "undefined") {
            renderDefaultElement();
        } else {
            app.innerHTML = defaultRenderedElement.innerHTML;
        }
    })

    indonesiaTrigger.addEventListener("click", function() {
         if (typeof idRenderedElement == "undefined") {
            app.innerHTML = "<div style='text-align:center'>Loading data..</div>";
            renderIndonesiaElement();
        } else {
            app.innerHTML = idRenderedElement.innerHTML;
        }
    })

    tentangTrigger.addEventListener("click", renderAboutElement)

}, false);




