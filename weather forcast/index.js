const api = {
    key: "2fa73590fd8b5a4c6e68098ad5625395",
    base: "https://api.openweathermap.org/data/2.5/"
};

const searchbox = document.querySelector(".search-box");
searchbox.addEventListener("keypress", function (evt) {
    if (evt.key === "Enter") {
        getResults(searchbox.value.trim());
        getForecast(searchbox.value.trim());
    }
});

// Current weather function
function getResults(query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(response => response.json())
        .then(displayResults)
        .catch(error => console.error("Error fetching data:", error));
}

// 5 Day Forecast function
function getForecast(query) {
    fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
        .then(response => response.json())
        .then(displayForecast)
        .catch(error => console.error("Error fetching forecast:", error));
}

// Display current weather
function displayResults(weather) {
    if (weather.cod !== 200) {
        alert("City not found!");
        return;
    }

    document.querySelector(".location .city").innerText = `${weather.name}, ${weather.sys.country}`;
    document.querySelector(".location .date").innerText = dateBuilder(new Date());
    document.querySelector(".current .temp").innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;
    document.querySelector(".current .weather").innerText = weather.weather[0].main;
    document.querySelector(".hi-low").innerText = `${weather.main.temp_min}°C / ${weather.main.temp_max}°C`;
}

// Display 5 days forecast
function displayForecast(forecast) {
    let forecastContainer = document.querySelector(".forecast");
    forecastContainer.innerHTML = ""; 

    // Filter for only 12:00 PM entries
    const dailyForecast = forecast.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyForecast.slice(0, 5).forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const temp = Math.round(day.main.temp);
        const weatherIcon = day.weather[0].icon;
        const weatherDesc = day.weather[0].main;

        forecastContainer.innerHTML += `
            <div class="forecast-day">
                <div class="day">${dayName}</div>
                <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weatherDesc}">
                <div class="temp">${temp}°C</div>
                <div class="desc">${weatherDesc}</div>
            </div>
        `;
    });
}

function dateBuilder(d) {
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
