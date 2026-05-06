const apiKey = "20da423906ccf27bec8c2d81c8f4a2eb";

const weatherDataEle = document.querySelector(".weather-data");
const cityInputEle = document.querySelector("#city-name");
const formEle = document.querySelector("form");
const locationBtn = document.querySelector("#location-btn");
const imgIcon = document.querySelector(".icon");

formEle.addEventListener("submit", (e) => {
  e.preventDefault();
  const cityValue = cityInputEle.value.trim();

  if (!cityValue) {
    showError("Please enter a city name.");
    return;
  }

  getWeatherData(cityValue);
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      getWeatherByCoords(latitude, longitude);
    },
    () => {
      showError("Could not get your location. Allow location access and try again.");
    },
  );
});

async function getWeatherData(cityValue) {
  try {
    const encodedCity = encodeURIComponent(cityValue);
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        encodedCity +
        "&appid=" +
        apiKey +
        "&units=metric",
    );
    if (!response.ok) {
      throw new Error("City not found. Check spelling or try another city.");
    }
    const data = await response.json();
    showWeather(data);
  } catch (error) {
    showError(error.message);
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKey +
        "&units=metric",
    );
    if (!response.ok) {
      throw new Error("Unable to fetch weather for your location.");
    }
    const data = await response.json();
    showWeather(data);
  } catch (error) {
    showError(error.message);
  }
}

function showWeather(data) {
  const temperature = Math.floor(data.main.temp);
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;
  const locationName = `${data.name}${data.sys && data.sys.country ? ", " + data.sys.country : ""}`;

  const details = [
    `Feel Like: ${Math.floor(data.main.feels_like)}°C`,
    `Humidity: ${data.main.humidity}%`,
    `Wind Speed: ${data.wind.speed} m/s`,
  ];

  weatherDataEle.querySelector(".temp").textContent = `${temperature}°C`;
  weatherDataEle.querySelector(".location").textContent = locationName;
  weatherDataEle.querySelector(".desc").textContent = `${description}`;
  imgIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">`;
  weatherDataEle.querySelector(".details").innerHTML = details
    .map((detail) => {
      return `<div>${detail}</div>`;
    })
    .join("");
}

function showError(message) {
  weatherDataEle.querySelector(".temp").textContent = "";
  weatherDataEle.querySelector(".desc").textContent = message;
  imgIcon.innerHTML = "";
  weatherDataEle.querySelector(".details").innerHTML = "";
}
