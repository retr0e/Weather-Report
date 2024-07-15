/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import "./Widget.css";
import axios from "axios";
import { useState, useEffect } from "react";

const Widget = ({ definedLocation }) => {
  const [locationData, setLocationData] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);
  const [mode, setMode] = useState(true);

  const configTheMode = (fulfilledData) => {
    if (fulfilledData) {
      const localHour = parseInt(
        `${fulfilledData[1]["date"][11]}${fulfilledData[1]["date"][12]}`,
        10
      );
      const [time, period] = fulfilledData[1]["sunset"].split(" ");
      const [hours, minutes] = time.split(":");

      const [sunriseTime, sunrisePeriod] = fulfilledData[1]["sunrise"].split(" ");
      const [sunriseHours, sunriseMinutes] = sunriseTime.split(":");

      let fullClockTimeHour = parseInt(hours, 10);

      if (period === "PM" && fullClockTimeHour !== 12) {
        fullClockTimeHour += 12;
      } else if (period === "AM" && fullClockTimeHour === 12) {
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
        const ipResponse = await axios.get("https://ipapi.co/json/");
        setLocationData(ipResponse.data.city);

        const weatherResponse = await axios.get(
          `http://localhost:8000/weather/${ipResponse.data.city}`
        );
        const fetchedWeatherData = weatherResponse.data;
        setWeatherData(fetchedWeatherData);
        setFetchingData(false);
        configTheMode(fetchedWeatherData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (definedLocation && !fetchingData) {
      const fetchWeatherForDefinedLocation = async () => {
        try {
          const weatherResponse = await axios.get(
            `http://localhost:8000/weather/${definedLocation}`
          );
          const fetchedWeatherData = weatherResponse.data;
          setWeatherData(fetchedWeatherData);
          configTheMode(fetchedWeatherData);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };

      fetchWeatherForDefinedLocation();
      setLocationData(definedLocation);
    }
  }, [definedLocation, fetchingData]);

  return (
    <>
      <div className={mode ? "weather-widget-bright" : "weather-widget"}>
        <div className='location'>{locationData ? locationData : "Loading..."}</div>

        {weatherData ? (
          <img
            src={`https:${weatherData[1]["icon"]}`}
            alt='Weather Icon'
            className='moon'
          />
        ) : null}

        <div className='temperature'>
          {weatherData ? weatherData[1]["temperature"] : "Loading..."}°C
        </div>
        <div className='weather'>{weatherData ? weatherData.weather : "Loading..."}</div>
        <div className='condition'>
          {weatherData ? weatherData[1]["condition"] : "Loading..."}
        </div>
        <div className='windType'>
          {weatherData ? weatherData[1]["windType"] : "Loading..."}
        </div>
        <div className='windSpeed'>
          {weatherData ? weatherData[1]["windSpeed"] : "Loading..."} km/h
        </div>

        <div className='humidity'>
          {weatherData ? `Humidity ${weatherData[1]["humidity"]}%` : "Loading..."}
        </div>
      </div>
    </>
  );
};

export default Widget;
