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

// define URL for city request
const cityReq = function (cityName) {
  return `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIKey}`
}

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
  try {
    const response = await fetch(cityReq(cityName))
    const data = await response.json()
    if (data && data.length > 0) {
      let city = data[0]

      // city data object
      let cityObj = {
        city: city.name,
        lat: city.lat,
        lon: city.lon
      }

      // push city object to array
      updateLocalStorage(cityObj)

      // generate previous searches
      getSearchHistory()
      return city
    }
  } catch (err) {
    console.error(err)
  }
}

// display current weather
const getCurrent = async (lat, lon) => {

}

const getForecast = async (lat, lon) => {

}

// display search history
const getSearchHistory = () => {
  // retrieve cities array from localstorage
  $('#searchHistory').empty()
  const searchHistory = JSON.parse(localStorage.getItem(citiesArray)) || []

  // loop through array and create element for each city in the array
  for (const city of searchHistory) {
    const cityEl = $('<button>')
      .addClass(
        'btn-secondary'
      )
      .attr('data-city', city.city)
      .attr('data-action', 'searchCity')
      .text(city.city.toUpperCase())
    $('#searchHistory').append(cityEl)
  }
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

