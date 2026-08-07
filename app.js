// =========================================
// MiniMeteo - app.js
// =========================================

// ---------- Eléments HTML ----------

const city = document.getElementById("city");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const icon = document.getElementById("icon");

const feelsLike = document.getElementById("feelsLike");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");

const refresh = document.getElementById("refresh");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// ---------- Codes météo ----------

const weatherCodes = {

    0:{text:"Ciel dégagé",icon:"☀️"},
    1:{text:"Principalement dégagé",icon:"🌤️"},
    2:{text:"Partiellement nuageux",icon:"⛅"},
    3:{text:"Nuageux",icon:"☁️"},
    45:{text:"Brouillard",icon:"🌫️"},
    48:{text:"Brouillard",icon:"🌫️"},
    51:{text:"Bruine",icon:"🌦️"},
    53:{text:"Bruine",icon:"🌦️"},
    55:{text:"Bruine",icon:"🌧️"},
    61:{text:"Pluie",icon:"🌧️"},
    63:{text:"Pluie",icon:"🌧️"},
    65:{text:"Forte pluie",icon:"🌧️"},
    71:{text:"Neige",icon:"❄️"},
    73:{text:"Neige",icon:"❄️"},
    75:{text:"Forte neige",icon:"❄️"},
    80:{text:"Averses",icon:"🌦️"},
    81:{text:"Averses",icon:"🌦️"},
    82:{text:"Fortes averses",icon:"⛈️"},
    95:{text:"Orage",icon:"⛈️"}

};

// =========================================
// Démarrage
// =========================================

init();

refresh.addEventListener("click", getCurrentLocation);

searchBtn.addEventListener("click", search);

searchInput.addEventListener("keydown", e=>{

    if(e.key==="Enter"){

        search();

    }

});

// =========================================
// Initialisation
// =========================================

function init(){

    const lastCity = localStorage.getItem("city");

    if(lastCity){

        searchInput.value = lastCity;

        search();

    }

    else{

        getCurrentLocation();

    }

}

// =========================================
// Géolocalisation
// =========================================

function getCurrentLocation(){

    city.textContent = "Recherche de votre position...";

    navigator.geolocation.getCurrentPosition(

        position=>{

            updateWeather(

                position.coords.latitude,

                position.coords.longitude,

                null

            );

        },

        ()=>{

            city.textContent="Position refusée";

        }

    );

}

// =========================================
// Recherche
// =========================================

async function search(){

    const name = searchInput.value.trim();

    if(name==="") return;

    const result = await searchCity(name);

    if(!result){

        alert("Ville introuvable");

        return;

    }

    localStorage.setItem("city",result.name);

    updateWeather(

        result.latitude,

        result.longitude,

        result.name

    );

}

// =========================================
// Mise à jour météo
// =========================================

async function updateWeather(lat,lon,cityName){

    const data = await fetchWeather(lat,lon);

    if(cityName){

        city.textContent = cityName;

    }

    temp.textContent =
        Math.round(data.current.temperature_2m)+" °C";

    feelsLike.textContent =
        Math.round(data.current.apparent_temperature)+" °C";

    wind.textContent =
        Math.round(data.current.wind_speed_10m)+" km/h";

    humidity.textContent =
        data.current.relative_humidity_2m+" %";

    const weather =
        weatherCodes[data.current.weather_code] ||
        {text:"Inconnu",icon:"❓"};

    description.textContent = weather.text;

    icon.textContent = weather.icon;

    changeBackground(data.current.weather_code);

}

// =========================================
// Couleur du fond
// =========================================

function changeBackground(code){

    let color="#87ceeb";

    if(code===0){

        color="#49b8ff";

    }

    else if(code<=3){

        color="#9ec6d9";

    }

    else if(code<=48){

        color="#b5b5b5";

    }

    else if(code<=82){

        color="#6a8fb4";

    }

    else{

        color="#4b4b70";

    }

    document.body.style.background=
        `linear-gradient(${color},white)`;

}

// =========================================
// Service Worker
// =========================================

if("serviceWorker" in navigator){

    window.addEventListener("load",()=>{

        navigator.serviceWorker.register("sw.js");

    });

}