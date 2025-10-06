// Replace 'YOUR_API_KEY' with the key you got from OpenWeatherMap
const apiKey = '0c1f2ffa07287146b77e78687c64a572';

// --- DOM Element References ---
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const loader = document.getElementById('loader');
const weatherDisplay = document.getElementById('weather-display');
const forecastDisplay = document.getElementById('forecast-display');

// --- State Management ---
// We use a simple object to manage the state of our application.
const appState = {
    isLoading: false,
    error: null,
    currentWeather: null,
    forecast: null,
};

// --- API Fetching Functions ---

/**
 * Fetches current weather and 5-day forecast for a given city.
 * @param {string} city - The name of the city to search for.
 */
async function fetchWeatherData(city) {
    // 1. Set loading state and render UI
    appState.isLoading = true;
    appState.error = null;
    render();

    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        // 2. Fetch both current weather and forecast data in parallel
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherURL),
            fetch(forecastURL),
        ]);

        if (!currentWeatherResponse.ok || !forecastResponse.ok) {
            throw new Error('City not found. Please check the spelling and try again.');
        }

        const currentWeatherData = await currentWeatherResponse.json();
        const forecastData = await forecastResponse.json();
        
        // 3. Update state with fetched data
        appState.currentWeather = currentWeatherData;
        appState.forecast = filterDailyForecast(forecastData.list);
        
        // Bonus: Save the last searched city to localStorage
        localStorage.setItem('lastSearchedCity', city);

    } catch (error) {
        // 4. Update state with the error message
        appState.error = error.message;
        appState.currentWeather = null;
        appState.forecast = null;
    } finally {
        // 5. Turn off loading state and re-render the UI
        appState.isLoading = false;
        render();
    }
}

/**
 * Processes the 5-day/3-hour forecast data to get one forecast per day.
 * It picks the forecast closest to noon for each day.
 * @param {Array} forecastList - The list of forecasts from the API.
 * @returns {Array} - A filtered list containing one forecast per day.
 */
function filterDailyForecast(forecastList) {
    const dailyForecasts = {};
    forecastList.forEach(forecast => {
        const date = forecast.dt_txt.split(' ')[0]; // Get the date part
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = forecast; // Store the first forecast for that day
        }
    });
    return Object.values(dailyForecasts).slice(0, 5); // Return up to 5 days
}

// --- UI Rendering Functions ---

/**
 * Renders the entire application UI based on the current appState.
 */
function render() {
    // Clear previous content
    weatherDisplay.innerHTML = '';
    forecastDisplay.innerHTML = '';

    // Show or hide the loader
    loader.style.display = appState.isLoading ? 'block' : 'none';

    // Display error message if there is one
    if (appState.error) {
        weatherDisplay.innerHTML = `<p class="error-message">${appState.error}</p>`;
        return;
    }

    // Render current weather if data is available
    if (appState.currentWeather) {
        renderCurrentWeather(appState.currentWeather);
    }
    
    // Render forecast if data is available
    if (appState.forecast) {
        renderForecast(appState.forecast);
    }
}

/**
 * Renders the current weather component.
 * @param {object} data - The current weather data object.
 */
function renderCurrentWeather(data) {
    const { name, main, weather } = data;
    const weatherHTML = `
        <div class="weather-card">
            <h2>${name}</h2>
            <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}" class="weather-icon">
            <p class="temperature">${Math.round(main.temp)}°C</p>
            <p>${weather[0].description}</p>
            <p>Humidity: ${main.humidity}%</p>
        </div>
    `;
    weatherDisplay.innerHTML = weatherHTML;
}

/**
 * Renders the 5-day forecast component.
 * @param {Array} forecastData - The filtered list of daily forecasts.
 */
function renderForecast(forecastData) {
    let forecastHTML = '<h2>5-Day Forecast</h2>';
    const forecastCardsHTML = forecastData.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        return `
            <div class="forecast-card">
                <p><strong>${dayName}</strong></p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                <p>${Math.round(day.main.temp)}°C</p>
            </div>
        `;
    }).join('');
    
    forecastDisplay.innerHTML = forecastHTML + `<div class="forecast-container">${forecastCardsHTML}</div>`;
}

// --- Event Listeners and Initialization ---

/**
 * Handles the search form submission.
 */
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
        cityInput.value = ''; // Clear the input after search
    }
});

/**
 * Initializes the app by loading the last searched city from localStorage.
 */
document.addEventListener('DOMContentLoaded', () => {
    const lastSearchedCity = localStorage.getItem('lastSearchedCity');
    if (lastSearchedCity) {
        fetchWeatherData(lastSearchedCity);
    }
});