/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import './Widget.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Map from './Map';

// For creating reasons
const fakeData = {
  weather: {
    icon: 'bad',
    temperature: 20.9,
    shorDescr: 'Cloudy with Sun',
    description: 'Feels warm',
    windType: 'NW',
    windSpeed: 8.3,
    humidity: 83,
    latitude: 50.4639,
    longitude: 17.0065,
  },
};

const Widget = ({ definedLocation }) => {
  const [locationData, setLocationData] = useState('');
  const [weatherData, setWeatherData] = useState(fakeData);
  const [fetchingData, setFetchingData] = useState(true);
  const [mode, setMode] = useState(true);

  const configTheMode = (fulfilledData) => {
    if (fulfilledData) {
      const localHour = parseInt(
        `${fulfilledData['weather']['time'][11]}${fulfilledData['weather']['time'][12]}`,
        10
      );
      const [time, period] = fulfilledData['weather']['time']['sunset'].split(' ');
      const [hours, minutes] = time.split(':');

      const [sunriseTime, sunrisePeriod] =
        fulfilledData['weather']['time']['sunrise'].split(' ');
      const [sunriseHours, sunriseMinutes] = sunriseTime.split(':');

      let fullClockTimeHour = parseInt(hours, 10);

      if (period === 'PM' && fullClockTimeHour !== 12) {
        fullClockTimeHour += 12;
      } else if (period === 'AM' && fullClockTimeHour === 12) {
        fullClockTimeHour = 0;
      }

      if (localHour > fullClockTimeHour || localHour < parseInt(sunriseHours, 10)) {
        setMode(false);
      } else {
        setMode(true);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ipResponse = await axios.get('https://ipapi.co/json/');
        setLocationData(ipResponse.data.city);

        const weatherResponse = await axios.get(
          `http://localhost:8000/weather?city=${ipResponse.data.city}&key=aa6a113ae504744aef66bb753e6df46b`
        );
        const fetchedWeatherData = weatherResponse.data;
        setWeatherData(fetchedWeatherData);
        setFetchingData(false);
        configTheMode(fetchedWeatherData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (definedLocation && !fetchingData) {
      const fetchWeatherForDefinedLocation = async () => {
        try {
          const weatherResponse = await axios.get(
            `http://localhost:8000/weather?city=${definedLocation}&key=aa6a113ae504744aef66bb753e6df46b`
          );
          const fetchedWeatherData = weatherResponse.data;
          setWeatherData(fetchedWeatherData);
          configTheMode(fetchedWeatherData);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      };

      fetchWeatherForDefinedLocation();
      setLocationData(definedLocation);
    }
  }, [definedLocation, fetchingData]);

  return (
    <div className='container'>
      {weatherData ? (
        <>
          <div className={mode ? 'weather-widget-bright' : 'weather-widget'}>
            <div className='location'>{locationData ? locationData : 'Loading...'}</div>

            <img
              src={`https:${weatherData['weather']['icon']}`}
              alt='Weather Icon'
              className='moon'
            />

            <div className='temperature'>{weatherData['weather']['temperature']}°C</div>
            <div className='weather'>{weatherData['weather']['shortDescr']}</div>
            <div className='condition'>{weatherData['weather']['description']}</div>

            <div className='windSection'>
              <span className='windDesc'>Wind type:</span>
              <div className='windType'>{weatherData['weather']['windType']}</div>
              <span className='windDesc'>Wind speed:</span>
              <div className='windSpeed'>{weatherData['weather']['windSpeed']} km/h</div>
            </div>

            <div className='humidity'>
              {`Humidity ${weatherData['weather']['humidity']}%`}
            </div>
          </div>

          <div className='map-container'>
            <Map
              latitude={weatherData.weather.latitude}
              longitude={weatherData.weather.longitude}
            />
          </div>
        </>
      ) : (
        <div className='waiting-widget'>
          <h1 className='waiting-message'>
            Please wait while we fetch all the necessary information... 😊
          </h1>
        </div>
      )}
    </div>
  );
};

export default Widget;
