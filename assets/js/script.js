// define page elements
const cityInputEl = document.getElementById('cityInput')
const searchForm = document.getElementById('searchForm')
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
  return `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`
}

// define URL for weather request
const currentWeatherReq = function (lat, lon) {
  return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=1&appid=${apiKey}&units=imperial`
}

// define URL for forecast request
const forecastReq = function (lat, lon) {
  return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
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
  try {
    const response = await fetch(currentWeatherReq(lat, lon))
    console.log(response)
    const weatherJSON = await response.json()
    if (weatherJSON !== null) {
      console.log(weatherJSON)
      $('#dateToday').html(dayjs(weatherJSON.dt_txt).format('MM-DD-YYYY'))
      $('#city').html(weatherJSON.city.name.toUpperCase())
      // $('#weatherIcon').html(weatherJSON.list[0].weather[0].icon + '.png')
      $('#weatherIcon').html(`<img src="https://openweathermap.org/img/wn/${weatherJSON.list[0].weather[0].icon}@2x.png" /> ${weatherJSON.list[0].weather[0].description}`)
      $('#temp').html(`${Math.floor(weatherJSON.list[0].main.temp)}&deg;`)
      $('#wind').html(`WIND: ${weatherJSON.list[0].wind.speed.toFixed(1)} mph`)
      $('#humidity').html(`${weatherJSON.list[0].main.humidity} %`)
    }
  } catch (err) {
    console.error(err)
  }
}

// display 5 day forecast
const getForecast = async (lat, lon) => {
  try {
    const response = await fetch(forecastReq(lat, lon))
    const forecastJSON = await response.json()

    if (forecastJSON.list && forecastJSON.list.length > 0) {
      const list = forecastJSON.list
      let forecastArray = []
      for (const days of list) {
        if (dayjs(days.dt_txt).format('HH:mm:ss') === '12:00:00') {
          const forecastObj = {
            dayOfWeek: dayjs(days.dt_txt).format('MM-DD-YYYY'),
            tempHigh: Math.floor(days.main.temp_max),
            icon: days.weather[0].icon,
            description: days.weather[0].description,
            humidity: days.main.humidity,
            wind: days.wind.speed.toFixed(1),
          }
          forecastArray.push(forecastObj)
          console.log(forecastArray)
        }
      }

      $('#forecastField').empty()
      for (const day of forecastArray) {
        const forecastDiv = $('<div>').addClass('bg-secondary-subtle d-flex flex-column justify-content-center align-items-center forecast__card m-2 p-2');
        const dayOfWeek = $('<span>').text(day.dayOfWeek);
        const iconContainer = $('<div>').addClass('forecast-icon-container').html(`<img src="https://openweathermap.org/img/wn/${day.icon}.png" /> ${day.description}`);
        const tempHigh = $('<span>').html(`${day.tempHigh}&deg;`);
        const humidity = $('<div>').html(`HUMIDITY: ${day.humidity} %`);
        const wind = $('<div>').html(`WIND: ${day.wind} mph`);
        forecastDiv.append(dayOfWeek, iconContainer, tempHigh, wind, humidity);
        $('#forecastField').append(forecastDiv);
      }
    }
  } catch (err) {
    console.error(err)
  }
}

// display search history
const getSearchHistory = () => {
  // retrieve cities array from localstorage
  $('#searchHistory').empty()
  const searchHistory = JSON.parse(localStorage.getItem('citiesArray')) || []

  // loop through array and create element for each city in the array
  for (const city of searchHistory) {
    const cityEl = $('<button>')
      .addClass(
        'btn btn-secondary search-city'
      )
      .attr('data-city', city.city)
      .attr('data-action', 'reqCity')
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

// page load function to display search history
$(document).ready(function () {
  getSearchHistory()
})

// search button event listener
document.addEventListener('click', function () {
  $(submitBtnEl).on('click', handleFormSubmit)
})

// history buttons event listener
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('search-city')) {
    const city = event.target.getAttribute('data-city');
    const action = event.target.getAttribute('data-action');

    if (action === 'reqCity') {
      reqCity(city).then((cityData) => {
        if (cityData) {
          getCurrent(cityData.lat, cityData.lon);
          getForecast(cityData.lat, cityData.lon);
        }
      });
    }
  }
});