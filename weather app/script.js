const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const displayCurrentCard = document.querySelector(".current-weather");
const displayCard = document.querySelector(".weather-cards");
const APIkey = "your API key here";

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) {
        return `<div class="current-weather">
            <div class="details">
            <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
            <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
            <h4>Wind: ${weatherItem.wind.speed}m/s</h4>
            <h4>Humidity:${weatherItem.main.humidity}%</h4>
            </div>
            <div class="icon">
            <img src="http://openweathermap.org/img/w/${weatherItem.weather[0].icon}.png">
            <h4>${weatherItem.weather[0].description}</h4>
        </div>`;
    } else 
    return `<li class="card">
    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
    <img src="http://openweathermap.org/img/w/${weatherItem.weather[0].icon}.png">
    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
    <h4>Wind: ${weatherItem.wind.speed}m/s</h4>
    <h4>Humidity:${weatherItem.main.humidity}%</h4>
            </li>`;
    } 

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`;
    fetch(WEATHER_API_URL).then(res=> res.json()).then(data=> {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter (forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });
        cityInput.value = "";
        displayCurrentCard.innerHTML = "";
        displayCard.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
            if (index === 0) {
            displayCurrentCard.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
            displayCard.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });
    }).catch(() => {
        alert("An error occured while fetching weather forecast.");
    });
}


const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const geoCodingApi = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIkey}`;
    fetch(geoCodingApi).then(res => res.json()).then(data => {
        if(!data.length) {
           alert (`No coordinates found for ${cityName}.`) 
        } else {
            const coordinates = data[0];
            console.log(coordinates);
        }
        const {name, lat, lon}= data[0];
        getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
        alert("An error occured while fetching coordinates.");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const reverseGeocodingUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${APIkey}`;
          ///
          fetch(reverseGeocodingUrl).then(res => res.json()).then(data => {
            const {name} = data[0];
            getWeatherDetails(name,latitude,longitude);
        })
        .catch(() => {
            alert("An error occured while fetching city coordinates.");
        });
        },
        error => {
            if(error.code===error.PERMISSION_DENIED) {
                alert("Request denied. Please provide location permission.")
            }
        }
    );
}

searchButton.addEventListener("click", getCityCoordinates);
locationButton.addEventListener("click", getUserCoordinates);

//enter fires city coordinates//
cityInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      getCityCoordinates();
    }
  });            




