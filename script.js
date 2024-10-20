// Get all necessary elements from the DOM
const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

// Default city when the page loads
let cityInput = "London";

// Add click event for each city in the panel
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        // Change from default city to the clicked one
        cityInput = e.target.innerHTML;
        // Fetch the data
        fetchWeatherData();
        // Fade out the app 
        app.style.opacity = "0";
    });
});

// Add submit event to the form
form.addEventListener('submit', (e) => {
    if (search.value.length === 0) {
        alert('Please type a city name');
    } else {
        cityInput = search.value;
        // Fetch the data
        fetchWeatherData();
        // Remove all text from the input field
        search.value = "";
        // Fade out the app 
        app.style.opacity = "0";
    }
    // Prevent the default behaviour of the form
    e.preventDefault();
});

// Function to return the day of the week
function dayOfTheWeek(day, month, year) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}

function fetchWeatherData() {
    // Fetch the data and dynamically add the city name
    fetch(`https://api.weatherapi.com/v1/current.json?key=da8d4b13eef746c09b3143809242207&q=${cityInput}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Adding temprature and weather condition
            temp.innerHTML = data.current.temp_c + "&#176;";
            conditionOutput.innerHTML = data.current.condition.text;

            // Get date and time
            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4));
            const m = parseInt(date.substr(5, 2));
            const d = parseInt(date.substr(8, 2));
            const time = date.substr(11);
            console.log(date);

            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)}, ${d} ${m} ${y}`;
            timeOutput.innerHTML = time;

            // Add the name of the city
            nameOutput.innerHTML = data.location.name;

            // Corresponding icon url
            // const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
            // icon.src = "./icons/" + iconId;

            // Add the weather details to the page
            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + " km/h";

            // Set default time of day
            let timeOfDay = "day";
            if (!data.current.is_day) {
                timeOfDay = "night";
            }

            // Change background and button color based on weather condition
            const code = data.current.condition.code;

            if (code === 1000) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
                btn.style.background = timeOfDay === "night" ? "#181e27" : "#e5ba92";
            } else if (
                [1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282].includes(code)
            ) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
                btn.style.background = timeOfDay === "night" ? "#181e27" : "#fa6d1b";
            } else if (
                [1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(code)
            ) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
                btn.style.background = timeOfDay === "night" ? "#325c80" : "#647d75";
            } else {
                app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
                btn.style.background = timeOfDay === "night" ? "#1b1b1b" : "#4d72aa";

            }

            // Fade in the page once all is done
            app.style.opacity = "1";
        })
        // If the user types a city that does not exist, throw an alert
        .catch((error) => {
            console.error('Error fetching weather data:', error);
            alert('City not found, please try again');
            app.style.opacity = "1";
        });
}

// Fetch weather data for the default city
fetchWeatherData();

// Fade in the page
app.style.opacity = "1";