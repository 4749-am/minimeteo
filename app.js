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

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const effectsContainer = document.getElementById("effects-container");
const forecastContainer = document.getElementById("forecastContainer");

// ---------- Codes météo ----------

const weatherCodes = {

    0:{text:"Ciel dégagé",icon:"☀️",anim:"anim-spin",effect:"sun"},
    1:{text:"Principalement dégagé",icon:"🌤️",anim:"anim-float",effect:"sun"},
    2:{text:"Partiellement nuageux",icon:"⛅",anim:"anim-float",effect:"clouds"},
    3:{text:"Nuageux",icon:"☁️",anim:"anim-float",effect:"clouds"},
    45:{text:"Brouillard",icon:"🌫️",anim:"anim-float",effect:"clouds"},
    48:{text:"Brouillard",icon:"🌫️",anim:"anim-float",effect:"clouds"},
    51:{text:"Bruine",icon:"🌦️",anim:"anim-float",effect:"rain"},
    53:{text:"Bruine",icon:"🌦️",anim:"anim-float",effect:"rain"},
    55:{text:"Bruine",icon:"🌧️",anim:"anim-float",effect:"rain"},
    61:{text:"Pluie",icon:"🌧️",anim:"anim-float",effect:"rain"},
    63:{text:"Pluie",icon:"🌧️",anim:"anim-float",effect:"rain"},
    65:{text:"Forte pluie",icon:"🌧️",anim:"anim-float",effect:"rain"},
    71:{text:"Neige",icon:"❄️",anim:"anim-float",effect:"snow"},
    73:{text:"Neige",icon:"❄️",anim:"anim-float",effect:"snow"},
    75:{text:"Forte neige",icon:"❄️",anim:"anim-float",effect:"snow"},
    80:{text:"Averses",icon:"🌦️",anim:"anim-float",effect:"rain"},
    81:{text:"Averses",icon:"🌦️",anim:"anim-float",effect:"rain"},
    82:{text:"Fortes averses",icon:"⛈️",anim:"anim-float",effect:"storm"},
    95:{text:"Orage",icon:"⛈️",anim:"anim-float",effect:"storm"}

};

// =========================================
// Démarrage
// =========================================

init();

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
        {text:"Inconnu",icon:"❓",anim:"",effect:"none"};

    description.textContent = weather.text;

    icon.textContent = weather.icon;

    // Gestion des animations de l'icône
    icon.className = "";
    if (weather.anim) {
        icon.classList.add(weather.anim);
    }

    // Gestion des effets visuels globaux traversant toute la page
    renderWeatherEffects(weather.effect);

    changeBackground(data.current.weather_code);

    // Génération des prévisions sur 5 jours
    renderForecast(data.daily);

}

// =========================================
// Générateur d'effets visuels traversant toute la page
// =========================================

function renderWeatherEffects(type) {
    effectsContainer.innerHTML = ""; // Nettoyer les anciens effets

    if (type === "sun") {
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement("div");
            particle.classList.add("sun-particle");
            const size = (20 + Math.random() * 35) + "px";
            particle.style.width = size;
            particle.style.height = size;
            particle.style.left = Math.random() * 100 + "vw";
            particle.style.top = (Math.random() * -50) + "px";
            particle.style.animationDuration = (5 + Math.random() * 5) + "s";
            particle.style.animationDelay = (Math.random() * 5) + "s";
            effectsContainer.appendChild(particle);
        }
    }
    else if (type === "rain") {
        for (let i = 0; i < 60; i++) {
            const drop = document.createElement("div");
            drop.classList.add("rain-drop");
            drop.style.left = Math.random() * 100 + "vw";
            drop.style.top = (Math.random() * -50) + "px";
            drop.style.animationDuration = (0.4 + Math.random() * 0.5) + "s";
            drop.style.animationDelay = (Math.random() * 2) + "s";
            effectsContainer.appendChild(drop);
        }
    } 
    else if (type === "snow") {
        for (let i = 0; i < 40; i++) {
            const flake = document.createElement("div");
            flake.classList.add("snow-flake");
            const size = (5 + Math.random() * 7) + "px";
            flake.style.width = size;
            flake.style.height = size;
            flake.style.left = Math.random() * 100 + "vw";
            flake.style.top = (Math.random() * -50) + "px";
            flake.style.animationDuration = (3 + Math.random() * 3) + "s";
            flake.style.animationDelay = (Math.random() * 3) + "s";
            effectsContainer.appendChild(flake);
        }
    } 
    else if (type === "clouds") {
        for (let i = 0; i < 4; i++) {
            const cloud = document.createElement("div");
            cloud.classList.add("real-cloud-elem");
            cloud.textContent = "☁️";
            cloud.style.top = (8 + i * 22) + "vh";
            cloud.style.animationDuration = (16 + i * 6) + "s";
            cloud.style.animationDelay = (i * -4) + "s";
            effectsContainer.appendChild(cloud);
        }
    } 
    else if (type === "storm") {
        for (let i = 0; i < 70; i++) {
            const drop = document.createElement("div");
            drop.classList.add("rain-drop");
            drop.style.left = Math.random() * 100 + "vw";
            drop.style.top = (Math.random() * -50) + "px";
            drop.style.animationDuration = (0.35 + Math.random() * 0.35) + "s";
            drop.style.animationDelay = (Math.random() * 2) + "s";
            effectsContainer.appendChild(drop);
        }
        const overlay = document.createElement("div");
        overlay.classList.add("storm-overlay");
        effectsContainer.appendChild(overlay);
    }
}

// =========================================
// Affichage des prévisions (5 jours) - Sécurisé mobile
// =========================================

function renderForecast(daily) {
    forecastContainer.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        const dateStr = daily.time[i]; // ex: "2026-08-10"
        const code = daily.weather_code[i];
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);

        // Sécurité mobile : ajout de "T00:00:00" pour éviter les bugs de fuseau horaire/Safari
        const dateObj = new Date(dateStr + "T00:00:00");
        const dayName = dateObj.toLocaleDateString("fr-FR", { weekday: 'short' });

        const dayWeather = weatherCodes[code] || { icon: "❓" };

        const dayDiv = document.createElement("div");
        dayDiv.classList.add("forecast-day");
        dayDiv.innerHTML = `
            <div class="f-day-name">${dayName}</div>
            <div class="f-icon">${dayWeather.icon}</div>
            <div class="f-temp">${maxTemp}° <span style="font-weight:normal;opacity:0.7;">${minTemp}°</span></div>
        `;

        forecastContainer.appendChild(dayDiv);
    }
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