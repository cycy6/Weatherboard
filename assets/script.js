// input click
document.getElementById("searchButton").onclick = function () {
    var enteredCity = document.getElementById("cityInput").value
    if (enteredCity) {
        // clearing input field
        document.getElementById("cityInput").value = ""
        searchCity(enteredCity)
    }
}

// search appears from bar
function makeList() {
    var savedCities = JSON.parse(localStorage.getItem("cities")) || []
    for (let i = 0; i < savedCities.length; i++) {
        createList(savedCities[i])
    }
}
makeList()

// City Search
async function searchCity(city) {
    var cities = JSON.parse(localStorage.getItem("cities")) || []
    if (cities.indexOf(city) === -1) {
        cities.push(city)
        localStorage.setItem("cities", JSON.stringify(cities))
        createList(city)
    }
     // WEATHER URL 
     var urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`;

     var time = moment().format('MMMM Do YYYY, h:mm:ss a');

         // location info
    fetch(urlWeather).then(response => response.json())
    .then(json => {
        console.log(json)
        // Weather into HTML
        document.getElementById("cityTitle").innerHTML = json.name
        document.getElementById("currentDate").innerHTML = "Current Date: " + `${time}`            
        document.getElementById("temperature").innerHTML = "Temperature: " + json.main.temp
        document.getElementById("humidity").innerHTML = "Humidity: " + json.main.humidity
        document.getElementById("wind").innerHTML = "Wind Speed: " + json.wind.speed
        document.getElementById("weatherIcon").src = "https://openweathermap.org/img/w/" + json.weather[0].icon + ".png"
        // lat & lon to get the UV index 
        var lat = json.coord.lat
        var lon = json.coord.lon
        forecast(city)
        uv(lat, lon)
    })
    .catch(err => console.log('Request failed', err))
}

// Global Variable
var APIkey = "91cefc20ce7f76578ed634d35fc73212";

// function 5 day forecast into the HTML
function forecast(city) {
    // 5 day forecast fetch
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey + "&units=metric";
    fetch(forecastURL).then(response => response.json())
        .then(json => {
            console.log(json)
            // reset html to not repeat 5 day forecast over and over again
            document.getElementById("fiveDay").innerHTML = ""
            for (let i = 0; i < json.list.length; i++) {
                if (json.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    // card with 5 day forecast
                    let col = `
            <div class="card forecast">
            <div class="card-body">
              <h5 class="card-title">${new Date(
                        json.list[i].dt_txt
                    ).toLocaleDateString()}</h5>
              <img src='${"https://openweathermap.org/img/w/" + json.list[i].weather[0].icon + ".png"}'/>
              <p class="card-text">${"Temperature: " + json.list[i].main.temp_max +
                        " °C"}</p>
              <p class="card-text">${"Humidity: " + json.list[i].main.humidity + "%"}</p>
            </div>
          </div> `
                    // insert
                    document.getElementById("fiveDay").innerHTML += col
                }
        }
     })
}

// UV index
function uv(lat, lon) {
    let uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + lat + "&lon=" + lon;
    fetch(uvURL).then(response => response.json())
        .then(json => {
            console.log(json)
            document.getElementById("uvin").innerHTML = "UV Index: " + json.value
        })
}

// save search
function createList(city) {
    var cityList = document.getElementById("searchedCities")
    var list = `<button>${city}</button>`
    cityList.innerHTML += list
}

// save buttons clickable
document.getElementById("searchedCities").addEventListener("click", function (event) {
    if (!event.target.classList.contains("something")) {
        searchCity(event.target.textContent)
    }
})