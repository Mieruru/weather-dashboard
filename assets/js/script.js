// define page elements
const cityInputEl = document.getElementById('cityInput')
const submitBtnEl = document.getElementById('cityInputBtn')
const searchHistoryEl = document.getElementById('searchHistory')
const currentWeatherCardEl = document.getElementById('currentWeather')
const forecastFieldEl = document.getElementById('forecastField')

// define API key
const apiKey = '2301593fc1c038267904bbec75062ee9'

// define array for cities
let citiesArray = JSON.parse(localStorage.getItem('citiesArray') || '[]')

// define URL for weather request
const currentWeatherReq = function (lat, lon) {
  return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`
}

// define URL for forecast request
const forecastReq = function (lat, lon) {
  return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&appid=${APIkey}`
}

// manage localstorage
const updateLocalStorage = (cityObj) => {
  // set lat and lon of city
  let lat = cityObj.lat
  let lon = cityObj.lon

  // push city to array
  let cityName = cityObj.city
  let city = citiesArray.find((obj) => obj.city === cityName)
  if (!city) {
    citiesArray.push(cityObj)
    localStorage.setItem('citiesArray', JSON.stringify(citiesArray))
  }
}

// search city to retrieve data
const reqCity = async (cityName) => {

}

// display current weather
const getCurrent = async (lat, lon) => {

}

const getForecast = async (lat, lon) => {

}

// form submission
const handleFormSubmit = (event) => {
  event.preventDefault()
  const cityInput = cityInputEl.value.trim()

  // retrieve data from submitted city
  if (cityInput) {
    reqCity(cityInput).then((cityData) => {
      if (cityData) {
        getCurrent(cityData.lat, cityData.lon)
        getForecast(cityData.lat, cityData.lon)
      }
    })
  }

  // clear input field
  cityInputEl.value = ''
}
