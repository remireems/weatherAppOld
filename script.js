// local storage for searched cities
let cities = []
const savedCities = JSON.parse(localStorage.getItem('savedCities')) || []

// gets current date
const currentDate = moment().format('L')

// gets 

// click event for search btn
document.getElementById('searchBtn').addEventListener('click', event => {
  event.preventDefault()

  const search = document.getElementById('searchInput').value


  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${search}&units=imperial&appid=04a3de3d38e1f0efbd3cb73d312aa4b6`)
    .then(res => {
      let cities = res.data

      axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${cities.coord.lat}&lon=${cities.coord.lon}&units=imperial&exclude=minutely,hourly,alerts&appid=04a3de3d38e1f0efbd3cb73d312aa4b6`)
        .then(res => {
          let citiesInfo = res.data
          console.log(citiesInfo)

          document.getElementById('currentCityWeather').innerHTML = `
            <div>    
              <h1>${cities.name} (${currentDate}) <img src="https://openweathermap.org/img/w/${cities.weather[0].icon}.png" alt="${cities.weather[0].main}"/></h1>
              <h3>Temperature: ${cities.main.temp}°F</h3>
              <h3>Humidity: ${cities.main.humidity}%</h3>
              <h3>Wind Speed: ${cities.wind.speed} MPH</h3>
              <h3>UV Index: <div class="uviBox" id="uviBox">${citiesInfo.current.uvi}</div></h3>
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



          for (let i = 0; i < 5; i++) {

            const futureWeatherEl = document.createElement('div')
            futureWeatherEl.className = 'card col-sm-3 daysWea text-center'
            futureWeatherEl.innerHTML = `
             
                
                  <div class="card-body">
                    <h5 class="card-title">Yes</h5>
                    <img src="https://openweathermap.org/img/w/${citiesInfo.daily[i].weather[0].icon}.png" alt="${citiesInfo.daily[i].weather[0].description}"/>
                    <p class="card-text">Temp: ${citiesInfo.daily[i].temp.day}°F</p>
                    <p class="card-text">Humidity: ${citiesInfo.daily[i].humidity}%</p>
                  </div>
               
            
            `
            document.getElementById('futureWeather').append(futureWeatherEl)

          }


        })
        .catch(err => console.error(err))


      // need to save
      // localStorage.setItem('cities', JSON.stringify(cities))
    })

  axios.get(``)

})