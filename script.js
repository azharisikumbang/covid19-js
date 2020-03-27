
let craetedElement;
const apiUrl = "https://api.kawalcorona.com/";
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

const setGlobalData = () => {
    fetchData(apiUrl)
        .then(res => {
            Data.global.all = res;
        })
    }

const setGlobalConfirmedData = async () => {
    const url = `${apiUrl}positif/`;
    const fetch = await fetchData(url);
    return fetch;
        // .then(res => {
        //     Data.global.status.confirmed = res.value;
        // })
}

let data = setGlobalConfirmedData();
// setGlobalConfirmedData()
//     .then(res => console.log(res));
console.log(data);

const setGlobalRecoveredData = () => {
    const url = `${apiUrl}sembuh/`;
    fetchData(url)
        .then(res => {
            Data.global.status.recovered = res.value;
        })
}

const setGlobalDeathData = () => {
    const url = `${apiUrl}meninggal/`;
    fetchData(url)
        .then(res => {
            Data.global.status.deaths = res.value;
        })
}

const setIdData = () => {
     const url = `${apiUrl}indonesia/`;
     fetchData(url)
         .then(res => {
             Data.indonesia.all = res[0];
         })
}

const setIdProvincesData = () => {
     const url = `${apiUrl}indonesia/provinsi/`;
     fetchData(url)
         .then(res => {
             Data.indonesia.provinces = res;
         })
}

function setBeranda() {

    const ul = document.createElement("ul");
        
    let li, liText;
    for (s in Data.global.status){
        console.log(s);
        li = document.createElement("li");
        liText = document.createTextNode(Data.global.status.confirmed);
        li.append(liText);
        ul.append(li);
    }
    
    craetedElement = ul.outerHTML;
}

    
document.addEventListener('DOMContentLoaded', async function(){ 
    await setGlobalConfirmedData();
    const app = document.getElementById("app");
    await setBeranda();
    app.innerHTML = craetedElement;

}, false);




