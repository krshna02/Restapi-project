const apikey = "c072140358c2d30fce7f5d3a164a316b";
const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".backdrop-blur-md img");

// Weather icon mapping
const iconMap = {
    Clouds: "images/clouds.png",
    Clear: "images/clear.png",
    Rain: "images/rain.png",
    Drizzle: "images/drizzle.png",
    Mist: "images/mist.png"
};

async function checkWeather(city) {
    if (!city.trim()) {
        alert("Enter a city name");
        return;
    }

    try {
        const response = await fetch(apiurl + city + `&appid=${apikey}`);

        if (!response.ok) {
            alert("City not found!");
            return;
        }

        const data = await response.json();

        document.querySelector(".city").textContent = data.name;
        document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").textContent = data.main.humidity + "%";
        document.querySelector(".wind").textContent = data.wind.speed + " km/h";

        const weatherType = data.weather[0].main;
        weatherIcon.src = iconMap[weatherType] || "images/clear.png";

        // 🚀 ADD PRECAUTION QUOTES BELOW
        const precautionText = document.querySelector(".precaution");

        const quotes = {
            Clear: "It's sunny! Stay hydrated and wear sunscreen.",
            Clouds: "Cloudy skies. Good day to be outside but keep a light jacket.",
            Rain: "It's raining! Carry an umbrella and avoid slippery areas.",
            Drizzle: "Light rain outside. Drive safely and carry a raincoat.",
            Mist: "Low visibility due to mist. Drive slow and use fog lights.",
            Snow: "Snowy weather! Wear warm clothes and be cautious on roads.",
            Thunderstorm: "Thunderstorms expected! Stay indoors and avoid open areas."
        };

        precautionText.textContent = quotes[weatherType] || "Stay safe and check local weather updates.";

    } catch (error) {
        alert("Network error. Try again.");
        console.error(error);
    }
}


// Button click
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});
// user location
// Auto detect user location on load
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                try {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`
                    );

                    if (!response.ok) {
                        console.error("Failed to fetch location-based weather");
                        return;
                    }

                    const data = await response.json();

                    // Fill UI
                    document.querySelector(".city").textContent = data.name;
                    document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°c";
                    document.querySelector(".humidity").textContent = data.main.humidity + "%";
                    document.querySelector(".wind").textContent = data.wind.speed + " km/h";

                    const weatherType = data.weather[0].main;
                    weatherIcon.src = iconMap[weatherType] || "images/clear.png";

                    // Precautions
                    const precautionText = document.querySelector(".precaution");
                    const quotes = {
                        Clear: "It's sunny! Stay hydrated and wear sunscreen.",
                        Clouds: "Cloudy skies. Carry a light jacket.",
                        Rain: "It's raining! Carry an umbrella and avoid slippery areas.",
                        Drizzle: "Light rain outside. Drive safely.",
                        Mist: "Low visibility. Drive slow and use fog lights.",
                        Snow: "Wear warm clothes and be careful of icy roads.",
                        Thunderstorm: "Stay indoors! Avoid open areas."
                    };
                    precautionText.textContent = quotes[weatherType] || "Stay safe and check local updates.";

                } catch (error) {
                    console.error(error);
                }
            },

            (error) => {
                console.warn("Location permission denied. Defaulting to manual entry.");
            }
        );
    } else {
        alert("Geolocation not supported in this browser.");
    }
}
// Auto-run location weather on page load
getUserLocation();
