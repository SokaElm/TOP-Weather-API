const input = document.querySelector("input");
const searchBtn = document.querySelector(".search");
const resultContainer = document.querySelector(".resultContainer");

let filteredData = {};

async function getWeatherData(city) {
  let capitalisedCity = city[0].toUpperCase() + city.slice(1).toLowerCase();
  let APIkey = "fe71379b926544b5a6f92018242208";
  let finalUrl = `http://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${capitalisedCity}&aqi=no`;

  try {
    const response = await fetch(finalUrl, { mode: "cors" });
    const weatherData = await response.json();
    console.log(weatherData);
    console.log(weatherData.current.condition.text);

    filteredData = {
      tempc: weatherData.current.temp_c,
      tempf: weatherData.current.temp_f,
      description: weatherData.current.condition.text,
    };

    console.log(filteredData);
    return filteredData;
  } catch (error) {
    console.log("invalid");
  }
}

async function search() {
  resultContainer.innerHTML = "";
  const loader = document.createElement("div");
  loader.id = "loading";
  resultContainer.appendChild(loader);
  displayLoading(loader);

  await new Promise((resolve) => setTimeout(resolve, 3000));

  let city = input.value;
  filteredData = await getWeatherData(city);
  hideLoading(loader);
  console.log(filteredData);
  showResult();
}

async function showResult() {
  const tempContainer = document.createElement("div");
  tempContainer.classList.add("tempContainer");

  let temp = document.createElement("p");
  let unitBtn = document.createElement("button");
  unitBtn.classList.add("unitBtn");
  let img = document.createElement("img");

  temp.textContent = `${filteredData.tempc}°C`;
  unitBtn.textContent = "Show in °F";
  img.src = await showGif();

  resultContainer.appendChild(tempContainer);
  tempContainer.appendChild(temp);
  tempContainer.appendChild(unitBtn);
  resultContainer.appendChild(img);
}

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    search();
  }
});

searchBtn.addEventListener("click", search);

document.addEventListener("click", (event) => {
  console.log(event);
  if (event.target.classList.contains("unitBtn")) {
    showTempF();
  }
});

function showTempF() {
  const temp = document.querySelector("p");
  const unitBtn = document.querySelector(".unitBtn");

  if (temp.textContent.includes("°C")) {
    temp.textContent = `${filteredData.tempf}°F`;
    unitBtn.textContent = "Show in °C";
  } else {
    temp.textContent = `${filteredData.tempc}°C`;
    unitBtn.textContent = "Show in °F";
  }
}

async function showGif() {
  let url =
    "https://api.giphy.com/v1/gifs/translate?api_key=hEMUjjtkPevnhSjM3J2MZOHKmVXBk4m7&s=";
  let description = filteredData.description;
  let finalURL = url + description;

  try {
    const response = await fetch(finalURL, { mode: "cors" });
    const result = await response.json();

    return result.data.images.original.url;
  } catch (error) {
    console.log("invalid");
  }
}

function displayLoading(loader) {
  loader.style.display = "block";
}

function hideLoading(loader) {
  loader.style.display = "none";
}
