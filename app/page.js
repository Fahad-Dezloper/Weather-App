"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Page = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState('Delhi'); 
  const apiKey = 'fdb7d984a95a30b9f889ba90fa6d2fe4';

  const getWeatherData = async (cityName) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
      setWeather(response.data);
      console.log('Current Weather Data:', response.data);
    } catch (error) {
      console.error('Error fetching current weather data:', error);
    }
  };

  const getForecastData = async (cityName) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`);
      setForecast(response.data);
      console.log('Forecast Data:', response.data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  useEffect(() => {
    getWeatherData(city);
    getForecastData(city);
  }, [city]); 

  const handleFormSubmit = (event) => {
    event.preventDefault();
    getWeatherData(city);
    getForecastData(city);
  };

  const getTime = (timezone, timestamp) => {
    const offset = timezone / 3600; // Convert seconds to hours
    const localTime = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const utc = localTime.getTime() + (localTime.getTimezoneOffset() * 60000); // Convert to UTC
    return new Date(utc + (3600000 * offset)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getDate = (timezone, timestamp) => {
    const offset = timezone / 3600; // Convert seconds to hours
    const localTime = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const utc = localTime.getTime() + (localTime.getTimezoneOffset() * 60000); // Convert to UTC
    return new Date(utc + (3600000 * offset)).toLocaleDateString();
  };

  const kelvinToCelsius = (kelvin) => {
    return Math.round(kelvin - 273.15);
  };

  const renderForecast = () => {
    if (!forecast) return null;

    const forecastItems = forecast.list.slice(0, 5).map((item, index) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const temperature = kelvinToCelsius(item.main.temp);
      const weatherIconUrl = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

      return (
        <div key={index} className='flex items-center gap-2'>
          <img src={weatherIconUrl} alt="weather icon" className='w-20 h-20' />
          <span className='text-white font-semibold'>{temperature}°C</span>
          <span className='text-[#728AAE]'>{date}</span>
          <span className='text-[#728AAE]'>{time}</span>
        </div>
      );
    });

    return <div className='flex flex-col items-center gap-6'>{forecastItems}</div>;
  };

  return (
    <div className='flex gap-6 m-8'>
      {/* Left Sidebar */}
      <div className='bg-[#202C3C] flex flex-col items-center justify-center gap-8 rounded-2xl h-[90vh] w-[15%]'>
        <div className='bg-[#3A465C] rounded-3xl p-[9px]'>
          <div className='wind h-[40px] w-[40px]'></div>
        </div>
        <div className='flex items-center flex-col gap-2'>
          <div className='cloudy h-[40px] w-[40px]'></div>
          <span className='text-white font-semibold'>Weather</span>
        </div>
      </div>

      {/* Main Content */}
      <div className='h-[90vh] w-[55%] flex flex-col items-center gap-8 rounded-2xl'>
        <form onSubmit={handleFormSubmit} className='w-full flex gap-5'>
          <input 
            type="text" 
            value={city} 
            placeholder='Enter your city' 
            onChange={(e) => setCity(e.target.value)}  
            className='bg-[#202C3C] w-[80%] rounded-xl px-4 py-2 text-[#dfdfdf] focus:outline-none' 
          />
          <button 
            type="submit" 
            className='px-5 py-3 bg-[#3A465C] w-[20%] rounded-xl text-white font-semibold tracking-wide'
          >
            Find ⛅
          </button>
        </form>

        <div className='flex justify-between items-center w-full px-12'>
          {weather && (
            <div className='flex justify-between items-center w-full px-12'>
              <div className='flex flex-col h-[23vh] justify-between'>
                <div>
                  <h1 className='text-white text-2xl'>{weather.name}</h1>
                  <div className='flex gap-1'>
                    <p className='text-[#728AAE]'>{getTime(weather.timezone, weather.dt)}</p>
                    <p className='text-[#728AAE]'><span className='font-bold text-white'>:</span> {getDate(weather.timezone, weather.dt)}</p>
                  </div>
                </div>
                <h1 className='text-white text-4xl font-semibold'>{kelvinToCelsius(weather.main.temp)}°C</h1>
              </div>
              <div>
                <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="weather icon" className='w-56 h-56' />
              </div>
            </div>
          )}
        </div>

        <div className='bg-[#202C3C] w-full h-full rounded-2xl py-4 px-6'>
          <h3 className='font-bold text-[#728AAE]'>AIR CONDITIONS</h3>
          <div className='flex gap-9 flex-col-reverse p-5'>
            <div className='flex justify-between items-center'>
              <div className='flex flex-col gap-2 items-start'>
                <span className=' text-lg font-semibold text-[#728AAE]'>Humidity</span>
                <span className='text-white font-semibold text-2xl'>{weather && weather.main.humidity}%</span>
              </div>
              <div className='flex flex-col gap-2 items-start'>
                <span className=' text-lg font-semibold text-[#728AAE]'>Pressure</span>
                <span className='text-white font-semibold text-2xl'>{weather && weather.main.pressure} hPa</span>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <div className='flex flex-col gap-2 items-start'>
                <span className=' text-lg font-semibold text-[#728AAE]'>💨 Wind</span>
                <span className='text-white font-semibold text-2xl'>{weather && weather.wind.speed} km/s</span>
              </div>
              {weather && (
                <div className='flex flex-col gap-2 items-start'>
                  <span className=' text-lg font-semibold text-[#728AAE]'>🌡️ Real Feel</span>
                  <span className='text-white font-semibold text-2xl'>{kelvinToCelsius(weather.main.temp)}°C</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className='bg-[#202C3C] h-[90vh] w-[30%] flex flex-col items-center justify-center gap-6 rounded-2xl'>
        <h3 className='font-bold text-[#728AAE]'>5-Day Forecast</h3>
        {renderForecast()}
      </div>
    </div>
  );
};

export default Page;
