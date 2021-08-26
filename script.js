// local storage for searched cities
const cityList = JSON.parse(localStorage.getItem('cityList')) || []

// gets current date
const currentDate = moment().format('L')

// renders & creates search history card list
const renderCityList = () => {
  document.getElementById('searchList').innerHTML = ''

  for (let i = 0; i < cityList.length; i++) {

    const searchEl = document.createElement('div')
    searchEl.className = 'card'
    searchEl.innerHTML = `
      <ul class="list-group list-group-flush">
        <button class="cityLiBtn"><li class="list-group-item">${cityList[i].search}</li></button>
      </ul>
    `
    document.getElementById('searchList').prepend(searchEl)
  }
}

// click event for search btn
document.getElementById('searchBtn').addEventListener('click', event => {
  event.preventDefault()

  const search = document.getElementById('searchInput').value

  // puts searched city into array of objects
  cityList.push({ search })

  // saves searched city into local storage
  localStorage.setItem('cityList', JSON.stringify(cityList))

  // calls renderCityList function
  renderCityList()

  // gets weather api data
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${search}&units=imperial&appid=04a3de3d38e1f0efbd3cb73d312aa4b6`)
    .then(res => {
      let cities = res.data

      // gets 2nd weather api data
      axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${cities.coord.lat}&lon=${cities.coord.lon}&units=imperial&exclude=minutely,hourly,alerts&appid=04a3de3d38e1f0efbd3cb73d312aa4b6`)
        .then(res => {
          let citiesInfo = res.data
          console.log(citiesInfo)

          // creates a div and displays current city's weather and other info
          document.getElementById('currentCityWeather').innerHTML = `
            <div>    
              <h1>${cities.name} (${currentDate}) <img src="https://openweathermap.org/img/w/${cities.weather[0].icon}.png" alt="${cities.weather[0].main}"/></h1>
              <h5>Temperature: ${cities.main.temp}°F</h5>
              <h5>Humidity: ${cities.main.humidity}%</h5>
              <h5>Wind Speed: ${cities.wind.speed} MPH</h5>
              <h5>UV Index: <div class="uviBox" id="uviBox">${citiesInfo.current.uvi}</div></h5>
            </div>
          `

          // variable that contains city's uvi value
          let cityUVI = citiesInfo.current.uvi

          // highlights uvi textbox depending on city's uvi
          if (cityUVI < 3) {
            document.getElementById('uviBox').classList.add('lowUVI')
          } else if (cityUVI < 6) {
            document.getElementById('uviBox').classList.add('medUVI')
          } else if (cityUVI < 8) {
            document.getElementById('uviBox').classList.add('highUVI')
          } else {
            document.getElementById('uviBox').classList.add('veryHighUVI')
          }

          // loop to iterate 5 day forecast
          for (let i = 1; i < 6; i++) {

            // variables to get future dates
            const addDay = parseInt(moment().format('D')) + i
            const futureDate = moment().format(`MM/${addDay}/YYYY`)

            // create 5 day forecast cards
            const futureWeatherEl = document.createElement('div')
            futureWeatherEl.className = 'card col-sm-2 daysWea text-center'
            futureWeatherEl.innerHTML = `             
              <div class="card-body">
                <h5 class="card-title">${futureDate}</h5>
                <img src="https://openweathermap.org/img/w/${citiesInfo.daily[i].weather[0].icon}.png" alt="${citiesInfo.daily[i].weather[0].description}"/>
                <p class="card-text">Temp: ${citiesInfo.daily[i].temp.day}°F</p>
                <p class="card-text">Humidity: ${citiesInfo.daily[i].humidity}%</p>
              </div>          
            `
            // appends to display all 5 day forecast cards
            document.getElementById('futureWeather').append(futureWeatherEl)
          }
        })
        .catch(err => console.error(err))
    })
  // resets search input and 5 day forecast
  document.getElementById('searchInput').value = ''
  document.getElementById('futureWeather').innerHTML = ''
})

document.addEventListener('click', event => {
  if (event.target.classList.contains('cityLiBtn')) {
    localStorage.setItem('savedCities', JSON.stringify(savedCities))
  }
})

renderCityList()