// =========================================
// MiniMeteo - weather.js
// =========================================

// Recherche d'une ville
async function searchCity(cityName) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=fr&format=json`;

    const response = await fetch(url);

    const data = await response.json();

    if (!data.results || data.results.length === 0) {

        return null;

    }

    return data.results[0];

}

// Récupération de la météo (actuelle + prévisions journalières)
async function fetchWeather(lat, lon) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const response = await fetch(url);

    return await response.json();

}