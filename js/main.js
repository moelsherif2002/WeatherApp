const apiKey = '7563700e9cae4c738b6140538241312';
const apiUrl = 'https://api.weatherapi.com/v1/forecast.json';

const locationInput = document.querySelector('.find-location');
const day1Container = document.querySelector('.day1');
const day2Container = document.querySelector('.day2');
const day3Container = document.querySelector('.day3');

async function fetchWeather(location) {
    try {
        const response = await fetch(`${apiUrl}?key=${apiKey}&q=${location}&days=3`);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateWeatherUI(data) {
    const { location, forecast: { forecastday } } = data;

    day1Container.innerHTML = '';
    day2Container.innerHTML = '';
    day3Container.innerHTML = '';

    [day1Container, day2Container, day3Container].forEach((container, index) => {
        const day = forecastday[index];
        const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });
        container.innerHTML = `
            <div class="weather-card p-5 text-center rounded-3 text-white">
                <h5>${dayName}</h5>
                <h6>${day.date}</h6>
                <h2>${location.name}</h2>
                <h1>${day.day.avgtemp_c}°C</h1>
                <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
                <p>${day.day.condition.text}</p>
                <div class="d-flex justify-content-between">
                    <span><img class="mx-2" src="imgs/icon-umberella.png">${day.day.daily_chance_of_rain}%</span>
                    <span><img class="mx-2" src="imgs/icon-wind.png">${day.day.maxwind_kph} km/h</span>
                </div>
            </div>
        `;
    });
}

async function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(`${latitude},${longitude}`);
            },
            (error) => {
                console.warn('Geolocation failed, using default location:', error);
                fetchWeather('Cairo');
            }
        );
    } else {
        console.warn('Geolocation not supported, using default location.');
        fetchWeather('Cairo');
    }
}

locationInput.addEventListener('input', () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeather(location);
    }
});

getUserLocation();