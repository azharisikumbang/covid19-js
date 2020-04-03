let defaultRenderedElement, idRenderedElement, mapRenderedElement, aboutRenderedElement, tableCellTitle, ul;

const config = {
    provinceDataDefault : [
        {
          "FID": 11,
          "name": "DKI Jakarta",
          "ObjID": 1023
        },
        {
          "FID": 12,
          "name": "Jawa Barat",
          "ObjID": 1022
        },
        {
          "FID": 16,
          "name": "Banten",
          "ObjID": 1021
        },
        {
          "FID": 15,
          "name": "Jawa Timur",
          "ObjID": 1017
        },
        {
          "FID": 13,
          "name": "Jawa Tengah",
          "ObjID": 1019
        },
        {
          "FID": 14,
          "name": "Daerah Istimewa Yogyakarta",
          "ObjID": 116
        },
        {
          "FID": 23,
          "name": "Kalimantan Timur",
          "ObjID": 1079
        },
        {
          "FID": 17,
          "name": "Bali",
          "ObjID": 1015
        },
        {
          "FID": 2,
          "name": "Sumatera Utara",
          "ObjID": 561
        },
        {
          "FID": 21,
          "name": "Kalimantan Tengah",
          "ObjID": 1691
        },
        {
          "FID": 33,
          "name": "Papua",
          "ObjID": 557
        },
        {
          "FID": 3,
          "name": "Sumatera Barat",
          "ObjID": 117
        },
        {
          "FID": 10,
          "name": "Kepulauan Riau",
          "ObjID": 1671
        },
        {
          "FID": 1,
          "name": "Aceh",
          "ObjID": 563
        },
        {
          "FID": 9,
          "name": "Lampung",
          "ObjID": 1024
        },
        {
          "FID": 20,
          "name": "Kalimantan Barat",
          "ObjID": 1044
        },
        {
          "FID": 28,
          "name": "Sulawesi Tenggara",
          "ObjID": 523
        },
        {
          "FID": 18,
          "name": "Nusa Tenggara Barat",
          "ObjID": 556
        },
        {
          "FID": 24,
          "name": "Kalimantan Utara",
          "ObjID": 3700
        },
        {
          "FID": 25,
          "name": "Sulawesi Utara",
          "ObjID": 150
        },
        {
          "FID": 26,
          "name": "Sulawesi Tengah",
          "ObjID": 559
        },
        {
          "FID": 34,
          "name": "Papua Barat",
          "ObjID": 1670
        },
        {
          "FID": 4,
          "name": "Riau",
          "ObjID": 136
        },
        {
          "FID": 5,
          "name": "Jambi",
          "ObjID": 1700
        },
        {
          "FID": 22,
          "name": "Kalimantan Selatan",
          "ObjID": 940
        },
        {
          "FID": 31,
          "name": "Maluku",
          "ObjID": 104
        },
        {
          "FID": 32,
          "name": "Maluku Utara",
          "ObjID": 133
        },
        {
          "FID": 6,
          "name": "Sumatera Selatan",
          "ObjID": 1103
        },
        {
          "FID": 27,
          "name": "Sulawesi Selatan",
          "ObjID": 1020
        },
        {
          "FID": 7,
          "name": "Bengkulu",
          "ObjID": 1026
        },
        {
          "FID": 8,
          "name": "Kepulauan Bangka Belitung",
          "ObjID": 1029
        },
        {
          "FID": 30,
          "name": "Sulawesi Barat",
          "ObjID": 1078
        },
    ],
    data : {
        indonesia : {
            provinces : [],
            all : {}
        }
    },
    style : {
        color : {
            normal : "#31a354",
            waspada : "#addd8e",
            siaga : "#fc9272",
            awas : "#de2d26" 
        },
        width : 960,
        height: 430
    },
    url : {
        geoJSON : "https://raw.githubusercontent.com/azharisikumbang/covid19-js/master/data/indonesia.json",
        idProvince : "https://api.kawalcorona.com/indonesia/provinsi/",
        mainAPIUrl : "https://api.kawalcorona.com/"
    } 
}

async function request(url = null){
    const response = await fetch(config.url.mainAPIUrl + url);
    const json = await response.json()
    return await json;
}

async function renderDefaultElement(){
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

    await setProvinces();
    
    tableCellTitle = ["No", "Provinsi", "Positif", "Sembuh", "Meninggal"];
    idRenderedElement.append(creteTable(config.data.indonesia.provinces, tableCellTitle, "Data Perkembangan Covid19 Di Indonesia", false));

    idRenderedElement.prepend(ul);
    // Load to document
    app.innerHTML = idRenderedElement.innerHTML;
}

async function renderMapElement(){

    mapRenderedElement = document.createElement("div");

    const mapTitle = document.createElement("h3");
    mapTitle.innerHTML = "Peta Sebaran Positif Corona Per Provinsi Di Indonesia";

    await setProvinces();

    await fetch(config.url.geoJSON)
        .then(res => res.json())
        .then(async data => {
            await config.data.indonesia.provinces.map(y => {
            for (let i = 0; i < data.objects.states_provinces.geometries.length; i++) {
                if(data.objects.states_provinces.geometries[i].properties.OBJECTID_1 === y.ObjID) {
                    data.objects.states_provinces.geometries[i].properties = {...data.objects.states_provinces.geometries[i].properties, ...y}
                }
            }
        })

        const svg = d3.select("#app").append("svg")
            .attr("width", config.style.width)
            .attr("height", config.style.height)


        const projection = d3.geoMercator()
                            .center([118.25, -5])
                            .scale(config.style.width * 1.2)
                            .translate([config.style.width / 2, config.style.height / 2])

        const path = d3.geoPath().projection(projection)

        svg.append("rect")
            .attr("class", "background")
            .attr("width", config.style.width)
            .attr("height", config.style.height)

        const g = svg.append("g")

        g.append("g")
            .attr("id", "subunits")
            .selectAll("path")
            .data(topojson.feature(data, data.objects.states_provinces).features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "#000")
            .attr("stroke-width", "0.4")
            .attr("fill", function(d) {
                if(d.properties.Kasus_Posi <= 10) {
                    return config.style.color.waspada; // Kasus 0 - 10
                }
                else if(d.properties.Kasus_Posi <= 100) {
                    return config.style.color.siaga; // Kasus 10 - 100
                }
                else if(typeof d.properties.Kasus_Posi == "undefined") {
                    return config.style.color.normal; // Tidak Ada kasus Terdata
                }
                else {
                    return config.style.color.awas; // Kasus diatas 300
                }
            })

        console.log(data.objects.states_provinces)
        data.objects.states_provinces.geometries.map((s, index) => console.log(index + "-" + s.properties.name + " - " + s.properties.OBJECTID_1)) 

        g.append("path")
            .datum(topojson.mesh(data, data.objects.states_provinces, function(a, b) {
                return a !== b;
            }))
            .attr("id", "state-borders")
            .attr("d", path)

        // Map status
        const mapStatus = document.createElement("div");
        mapStatus.classList.add("map-status-display");

        const statusText = ["normal", "waspada", "siaga", "awas"];
        let statusIndicator;

        statusText.map(e => {
            let span = document.createElement("span")
            span.classList.add(e);
            switch(e) {
                case 'normal':
                  statusIndicator = " 0 atau tidak terdata";
                  break;
                case 'waspada':
                  statusIndicator = " <= 10 Kasus";
                  break;
                case 'siaga':
                  statusIndicator = " <= 100 Kasus";
                  break;
                case 'awas':
                  statusIndicator = " >= 100 Kasus";
                  break;
            }

            let spanChild = document.createElement("span");
            span.append(spanChild);
            span.append(statusIndicator);
            mapStatus.append(span);

        });


        mapRenderedElement.append(mapTitle)
        mapRenderedElement.append(svg._groups[0][0])
        mapRenderedElement.append(mapStatus)

        app.innerHTML = mapRenderedElement.innerHTML;

    });
}

function renderAboutElement(){
  aboutRenderedElement = document.createElement("div");

  const title = document.createElement("h3");
  title.innerHTML = "Tentang Aplikasi Monitoring Covid19 Coronavirus";

  const p = document.createElement("p");
  p.innerHTML = "Halaman ini dibuat dengan tujuan mempermudah dalam penyajian informasi tentang covid19 coronavirus di dunia, utamanya Indonesia. <br> Data didapatkan berdasarkan API dari https://kawalcorona.com <br> <br>Data Source : <a href=https://api.kawalcorona.com/ target=_blank>https://api.kawalcorona.com</a> <br>Source Code : <a href=https://github.com/azharisikumbang/covid19-js>https://github.com/azharisikumbang/covid19-js</a><br>Info Update Covid : <a href=https://www.covid19.go.id/ target=_blank>https://www.covid19.go.id/</a><br><br>Made with &hearts; by <a href=https://coretanit.com/author/azhari/ target=_blank>Azhari</a>";

  aboutRenderedElement.append(title)
  aboutRenderedElement.append(p)

  app.innerHTML = aboutRenderedElement.innerHTML
}

async function setProvinces(){
    if(config.data.indonesia.provinces.length == 0) {
        await request("indonesia/provinsi/")
        .then(res => {
            res.map(d => {
                config.provinceDataDefault.map(e => {
                    if(e.FID === d.attributes.FID) {
                        config.data.indonesia.provinces.push({...d.attributes, ...e})
                    } 
                })
            })
        })
    }
}

function numberWithCommas(num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(",", ".").replace(",", ".");
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
    liValue = document.createTextNode(numberWithCommas(data));

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
            tableBodyCell.innerHTML = numberWithCommas(d.attributes.Confirmed);

            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = numberWithCommas(d.attributes.Recovered);

            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = numberWithCommas(d.attributes.Deaths);
        });
    }

    else {
        data.map((d, index) => {
            tableBody = table.insertRow();
            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = (index + 1);

            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = d.Provinsi;

            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = numberWithCommas(d.Kasus_Posi);

            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = numberWithCommas(d.Kasus_Semb);

            tableBodyCell = tableBody.insertCell();
            tableBodyCell.innerHTML = numberWithCommas(d.Kasus_Meni);
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
    const mapTrigger = document.getElementById("nav-peta-trigger");
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

    mapTrigger.addEventListener("click", function() {
         if (typeof mapRenderedElement == "undefined") {
            app.innerHTML = "<div style='text-align:center'>Loading data..</div>";
            renderMapElement();
        } else {
            app.innerHTML = mapRenderedElement.innerHTML;
        }
    })

    tentangTrigger.addEventListener("click", renderAboutElement)

}, false);
