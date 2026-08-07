// ======================================================
// SKYFLOW - APP.JS
// Version 1.1
// ======================================================

// -----------------------------
// Récupération des éléments HTML
// -----------------------------
const city = document.getElementById("city");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const icon = document.getElementById("icon");

const feelsLike = document.getElementById("feelsLike");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");

const refresh = document.getElementById("refresh");

// -----------------------------
// Correspondance des codes météo
// -----------------------------
const weatherCodes = {

    0: { text: "Ciel dégagé", icon: "☀️" },

    1: { text: "Principalement dégagé", icon: "🌤️" },

    2: { text: "Partiellement nuageux", icon: "⛅" },

    3: { text: "Nuageux", icon: "☁️" },

    45: { text: "Brouillard", icon: "🌫️" },

    48: { text: "Brouillard givrant", icon: "🌫️" },

    51: { text: "Bruine", icon: "🌦️" },

    53: { text: "Bruine", icon: "🌦️" },

    55: { text: "Bruine forte", icon: "🌧️" },

    61: { text: "Pluie", icon: "🌧️" },

    63: { text: "Pluie", icon: "🌧️" },

    65: { text: "Forte pluie", icon: "🌧️" },

    71: { text: "Neige", icon: "❄️" },

    73: { text: "Neige", icon: "❄️" },

    75: { text: "Forte neige", icon: "❄️" },

    80: { text: "Averses", icon: "🌦️" },

    81: { text: "Averses", icon: "🌦️" },

    82: { text: "Fortes averses", icon: "⛈️" },

    95: { text: "Orage", icon: "⛈️" }

};

// ======================================================
// Démarrage
// ======================================================

getWeather();

refresh.addEventListener("click", getWeather);

// ======================================================
// Géolocalisation
// ======================================================

function getWeather() {

    city.textContent = "Recherche de votre position...";

    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            getCity(latitude, longitude);
            getForecast(latitude, longitude);

        },

        () => {

            city.textContent = "Position refusée";

        }

    );

}

// ======================================================
// Nom de la ville
// ======================================================

async function getCity(lat, lon) {

    try {

        const response = await fetch(

            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`

        );

        const data = await response.json();

        city.textContent =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.municipality ||
            "Ville inconnue";

    }

    catch (error) {

        city.textContent = "Ville inconnue";

    }

}

// ======================================================
// Changement de couleur du fond
// ======================================================

function changeBackground(code) {

    let color = "#87ceeb";

    if (code === 0) {

        color = "#4fc3ff";

    }

    else if (code <= 3) {

        color = "#9ec6d9";

    }

    else if (code >= 45 && code <= 48) {

        color = "#b0b0b0";

    }

    else if (code >= 51 && code <= 82) {

        color = "#5b7fa6";

    }

    else if (code >= 95) {

        color = "#47476a";

    }

    document.body.style.background = `linear-gradient(${color}, white)`;

}

// ======================================================
// Météo
// ======================================================

async function getForecast(lat, lon) {

    try {

        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`;

        const response = await fetch(url);

        const data = await response.json();

        temp.textContent =
            `${Math.round(data.current.temperature_2m)} °C`;

        feelsLike.textContent =
            `${Math.round(data.current.apparent_temperature)} °C`;

        wind.textContent =
            `${Math.round(data.current.wind_speed_10m)} km/h`;

        humidity.textContent =
            `${data.current.relative_humidity_2m} %`;

        const weather =
            weatherCodes[data.current.weather_code] || {

                text: "Inconnu",

                icon: "❓"

            };

        description.textContent = weather.text;

        icon.textContent = weather.icon;

        changeBackground(data.current.weather_code);

    }

    catch (error) {

        description.textContent = "Impossible de récupérer la météo.";

    }

}

// ======================================================
// Service Worker
// ======================================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("sw.js")
            .then(() => console.log("Service Worker installé"))
            .catch(error => console.error(error));

    });

}