const dataJSONUrl = "https://gist.githubusercontent.com/tvalentius/10ef8cbefbacaecada45161b1f3810ce/raw/e5275d5a6ca90b4f0193d2ff151107cbfa0f89bc/indonesia.json";

const config = [
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
      "ObjID": 1079
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
    }
];

const statusWarna = {
    normal : "#31a354",
    waspada : "#addd8e",
    siaga : "#fc9272",
    awas : "#de2d26"  
}

let provinces = [];

// let provincesData = [];

let width = 960, height = 440, centered;

fetch("https://api.kawalcorona.com/indonesia/provinsi/")
    .then(res => res.json())
    .then(async data => {
        await data.map(d => {
            config.map(e => {
                if(e.FID == d.attributes.FID) {
                    provinces.push({...d.attributes, ...e})
                }
            })
        })
    })

fetch(dataJSONUrl)
    .then(res => res.json())
    .then(data => {
        console.log(data.objects.states_provinces)
        provinces.map(y => {
            for (let i = 0; i < data.objects.states_provinces.geometries.length; i++) {
                if(data.objects.states_provinces.geometries[i].properties.OBJECTID_1 === y.ObjID) {
                    data.objects.states_provinces.geometries[i].properties = {...data.objects.states_provinces.geometries[i].properties, ...y}
                }
            }
        })

        console.log(data.objects.states_provinces.geometries)

        const svg = d3.select("#map")
            .attr("width", width)
            .attr("height", height)


        const projection = d3.geoMercator()
                                .center([118.25, -5])
                                .scale(width * 1.2)
                                .translate([width / 2, height / 2])

        const path = d3.geoPath().projection(projection)

        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)

        const g = svg.append("g")

        g.append("g")
            .attr("id", "subunits")
            .selectAll("path")
            .data(topojson.feature(data, data.objects.states_provinces).features)
            .enter()
            .append("path")
            .attr("d", path)
            .on("click", mapClicked)
            .attr("stroke", "#000")
            .attr("stroke-width", "0.4")
            .transition().duration(2000)
            .delay(function(d, i) { return i * 5; })
            .ease(d3.easeLinear)
            .attr("fill", function(d) {
                if(d.properties.Kasus_Posi <= 10) {
                    return statusWarna.waspada; // Kasus 0 - 10
                }
                else if(d.properties.Kasus_Posi <= 100) {
                    return statusWarna.siaga; // Kasus 10 - 100
                }
                else if(typeof d.properties.Kasus_Posi == "undefined") {
                    return statusWarna.normal; // Tidak Ada kasus Terdata
                }
                else {
                    return statusWarna.awas; // Kasus diatas 300
                }
            })



        g.append("path")
            .datum(topojson.mesh(data, data.objects.states_provinces, function(a, b) {
                return a !== b;
            }))
            .attr("id", "state-borders")
            .attr("d", path)
    })


function mapClicked(d){
    const provinceObjID = d.properties.OBJECTID_1;
    
    const provinceName = document.querySelector(".map-status-display .lokasi span");
    const provincePositif = document.querySelector(".map-status-display .positif span");
    const provinceSembuh = document.querySelector(".map-status-display .sembuh span");
    const provinceMeninggal = document.querySelector(".map-status-display .meninggal span");

    provinceName.innerHTML = (typeof d.properties.name == "undefined") ? "Lokasi Tidak Ditemukan" : d.properties.name ;
    provincePositif.innerHTML =(typeof d.properties.Kasus_Posi == "undefined") ? "0" : d.properties.Kasus_Posi;
    provinceSembuh.innerHTML = (typeof d.properties.Kasus_Semb == "undefined") ? "0" : d.properties.Kasus_Semb;
    provinceMeninggal.innerHTML = (typeof d.properties.Kasus_Meni == "undefined") ? "0" : d.properties.Kasus_Meni;

}