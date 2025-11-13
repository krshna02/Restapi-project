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

        // Fill UI
        document.querySelector(".city").textContent = data.name;
        document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").textContent = data.main.humidity + "%";
        document.querySelector(".wind").textContent = data.wind.speed + " km/h";

        // Set the correct icon
        const weatherType = data.weather[0].main;
        weatherIcon.src = iconMap[weatherType] || "images/clear.png";

    } catch (error) {
        alert("Network error. Try again.");
        console.error(error);
    }
}

// Button click
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

const chatBtn = document.getElementById("chatbot-btn");
const chatBox = document.getElementById("chatbot-box");
const closeChat = document.getElementById("close-chat");
const sendChat = document.getElementById("send-chat");
const chatInput = document.getElementById("chat-input");
const chatContent = document.getElementById("chat-content");

// OpenAI API KEY
const OPENAI_KEY = "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";

// Show Chat
chatBtn.addEventListener("click", () => {
    chatBox.classList.remove("hidden");
});

// Close Chat
closeChat.addEventListener("click", () => {
    chatBox.classList.add("hidden");
});

// Add message in UI
function addChat(message, isUser) {
    const p = document.createElement("p");
    p.className = isUser
        ? "text-right text-blue-600 my-1"
        : "text-gray-700 my-1";
    p.textContent = message;
    chatContent.appendChild(p);
    chatContent.scrollTop = chatContent.scrollHeight;
}

// Send to OpenAI
async function sendToOpenAI(message) {
    addChat("Typing...", false);

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",   // you can change to gpt-4o or gpt-4.1
                messages: [
                    { role: "system", content: "You are a helpful AI assistant." },
                    { role: "user", content: message }
                ]
            })
        });

        // Remove "Typing..."
        chatContent.lastChild.remove();

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;
        addChat(aiMessage, false);

    } catch (error) {
        chatContent.lastChild.remove();
        addChat("Error: Could not connect to AI.", false);
        console.error(error);
    }
}

// Send Message on Button Click
sendChat.addEventListener("click", async () => {
    const msg = chatInput.value.trim();
    if (!msg) return;

    addChat(msg, true);
    chatInput.value = "";

    await sendToOpenAI(msg);
});

// Send with Enter Key
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendChat.click();
    }
});

