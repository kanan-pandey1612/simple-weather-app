# Simple Weather App 🌦️

A clean and simple single-page application built with HTML, CSS, and vanilla JavaScript that displays the current weather and a 5-day forecast for any city using the OpenWeatherMap API.

## Core Features

* **City Search:** Search for the weather in any city around the world.
* **Current Weather:** Displays temperature, humidity, and weather conditions.
* **5-Day Forecast:** Shows a summarized forecast for the next five days.
* **Responsive Design:** User-friendly interface that works on both desktop and mobile devices.
* **State Management:** Includes loading indicators and clear error messages.
* **Persistence:** Remembers and loads the last searched city using `localStorage`.

---

## Setup and Running Locally

To set up and run this project on your local machine, follow these simple steps.

### Prerequisites

* A modern web browser (e.g., Chrome, Firefox, Safari).
* A free API key from [OpenWeatherMap](https://openweathermap.org/api).

### Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kanan-pandey1612/simple-weather-app
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd YOUR_REPOSITORY_NAME
    ```

3.  **Add your API Key:**
    * Open the `script.js` file.
    * Find the line: `const apiKey = 'YOUR_API_KEY';`
    * Replace `'YOUR_API_KEY'` with your actual OpenWeatherMap API key.

4.  **Run the application:**
    * Simply open the `index.html` file in your web browser.

---

## Running Test Cases

This project does not include an automated test suite (e.g., Jest, Mocha). However, you can perform the following manual tests to verify its functionality:

1.  **Successful City Search:**
    * Enter a valid city name (e.g., "Kanpur") and click "Search."
    * **Expected Result:** The current weather and 5-day forecast for Kanpur should be displayed.

2.  **Invalid City Search:**
    * Enter a nonsensical city name (e.g., "asdfghjkl") and click "Search."
    * **Expected Result:** An error message "City not found..." should be displayed.

3.  **Empty Search Input:**
    * Click the "Search" button without entering a city name.
    * **Expected Result:** The browser's default validation should prevent the form from submitting.

4.  **Local Storage Persistence:**
    * Successfully search for a city (e.g., "Tokyo").
    * Refresh the page.
    * **Expected Result:** The weather for "Tokyo" should automatically load.

---

## Assumptions and Design Choices

* **API:** **OpenWeatherMap** was chosen for its comprehensive free tier, which includes current weather and 5-day forecast data.
* **State Management:** A simple JavaScript object (`appState`) is used to manage the application's state (loading, error, data). This approach was chosen to keep the project lightweight and free of external dependencies, as a complex library like Redux or Vuex would be overkill.
* **Styling:** The project uses **vanilla CSS** with Flexbox to ensure a clean, modern, and responsive layout without relying on external CSS frameworks like Bootstrap.
* **Forecast Display:** The 5-day forecast displays one weather snapshot per day. The logic processes the 3-hour interval data from the API and picks the first available forecast for each of the next five days.
* **Error Handling:** Error handling is managed within the `fetchWeatherData` function's `try...catch` block, focusing on user-facing errors like "City not found" or network issues.