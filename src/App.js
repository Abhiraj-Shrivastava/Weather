import './App.css';
import { Search, MapPin, Wind, Droplet, X } from 'react-feather'; // Import X icon
import getWeather from './api/api';
import { useState } from 'react';
import dateFormat from 'dateformat';

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getWeatherbyCity = async () => {
    try {
      const weather = await getWeather(city);
      setWeatherData([...weatherData, weather]);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
    setCity("");
  }

  const renderDate = () => {
    let now = new Date();
    return dateFormat(now, "dddd, mmmm dS, h:MM TT");
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  }

  const removeCity = (index) => {
    setWeatherData(weatherData.filter((_, i) => i !== index));
  }

  return (
    <div className={ `app ${isDarkMode ? 'dark-mode' : ''}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      <h1>Weather App</h1>
      <div className="input-wrapper">
        <input 
          type="text" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          placeholder='Enter City Name' 
        />
        <button onClick={getWeatherbyCity}>
          <Search />
        </button>
      </div>

      {weatherData.length > 0 ? weatherData.map((weather, index) => (
        <div className="content" key={index}>
          <button className="remove-city" onClick={() => removeCity(index)}>
              <X />
            </button>
          <div className="location d-flex">
            <MapPin />
            <h2>{weather.name} <span>({weather.sys.country})</span></h2>
            </div>
          <p className="datetext">{renderDate()}</p>

          <div className="weatherdesc d-flex flex-c">
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
            <h3>{weather.weather[0].description}</h3>
          </div>

          <div className="tempstats d-flex flex-c">
            <h1>{weather.main.temp} <span>&deg;C</span></h1>
            <h3>Feels Like {weather.main.feels_like} <span>&deg;C</span></h3>
          </div>

          <div className="windstats d-flex">
            <Wind />
            <h3>Wind is {weather.wind.speed} Knots in {weather.wind.deg}&deg;</h3>
          </div>
          <div className="windstats d-flex">
            <Droplet />
            <h3>Humidity is {Math.round(weather.main.humidity)}%</h3>
          </div>
        </div>
      )) : (
        <div className="content">
          <h4>No Data found!</h4>
        </div>
      )}
    </div>
  );
}

export default App;