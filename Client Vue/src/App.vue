<script setup>
const fakeData = {
  location: {
    city: 'London',
    longitude: '-0.128',
    latitude: '51.507',
  },
  weather: {
    time: {
      date: '2024-07-17 10:08:16',
      sunrise: '4:03 AM',
      sunset: '8:09 PM',
    },
    temperature: 20.57,
    humidity: 62,
    icon: 'https://openweathermap.org/img/wn/02d@2x.png',
    shortDescr: 'Clouds',
    description: 'few clouds',
    windType: 'NW',
    windSpeed: 3.09,
  },
};

import { ref, watch } from 'vue';
import axios from 'axios';
const weatherInformation = ref(fakeData);
const inputLocation = ref('');
const location = ref('Nysa');
const isLoading = ref(true);
const nightMode = ref(false);
const errorMessage = ref('');

const configTheMode = () => {
  if (weatherInformation) {
    const localHour = parseInt(
      `${weatherInformation['weather']['time'][11]}${weatherInformation['weather']['time'][12]}`,
      10
    );
    const [time, period] = weatherInformation['weather']['time']['sunset'].split(' ');
    const [hours, minutes] = time.split(':');

    const [sunriseTime, sunrisePeriod] =
      weatherInformation['weather']['time']['sunrise'].split(' ');
    const [sunriseHours, sunriseMinutes] = sunriseTime.split(':');

    let fullClockTimeHour = parseInt(hours, 10);

    if (period === 'PM' && fullClockTimeHour !== 12) {
      fullClockTimeHour += 12;
    } else if (period === 'AM' && fullClockTimeHour === 12) {
      fullClockTimeHour = 0;
    }

    if (localHour > fullClockTimeHour || localHour < parseInt(sunriseHours, 10)) {
      nightMode.value = false;
    } else {
      nightMode.value = true;
    }
  }
};

function handleFormSubmit(e) {
  e.preventDefault();
  location.value = inputLocation.value;
}

async function collectWeatherData() {
  try {
    isLoading.value = true;

    const response = await axios.get(`http://localhost:8000/weather?city=${location}`, {
      headers: {
        Authorization: 'aa6a113ae504744aef66bb753e6df46b',
      },
    });
    const responseData = await response.json();
    weatherInformation.value = responseData;
  } catch (e) {
    console.error('Error Occured!');
  } finally {
    isLoading.value = false;
  }
}

watch(location, () => {
  weatherInformation.value = undefined;
  collectWeatherData();
});

watch(weatherInformation, () => {
  if (weatherInformation['weather']) {
    configTheMode();
  } else if (weatherInformation['message']) {
    errorMessage.value = weatherInformation['message'];
  }
});
</script>

<template>
  <main>
    <form @submit="handleFormSubmit">
      <input type="text" v-model="inputLocation" />
      <button type="submit">Submit</button>
    </form>

    <div class="container">
      <div
        v-if="weatherInformation"
        :class="{ 'weather-widget-bright': !nightMode, 'weather-widget': nightMode }"
      >
        <div class="location">{{ location }}</div>

        <img
          :src="weatherInformation['weather']['icon']"
          alt="Weather Icon"
          className="sun"
        />

        <div class="weather">{{ weatherInformation['weather']['shortDescr'] }}</div>
        <div class="temperature">
          {{ weatherInformation['weather']['temperature'] }}°C
        </div>
        <div class="condition">{{ weatherInformation['weather']['description'] }}</div>

        <div class="windSection">
          <span class="windDesc">Wind type</span>
          <div class="windType">{{ weatherInformation['weather']['windType'] }}</div>
          <span class="windDesc">Wind speed</span>
          <div class="windSpeed">
            {{ weatherInformation['weather']['windSpeed'] }} km/h
          </div>
        </div>

        <div class="humidity">
          Humidity {{ weatherInformation['weather']['humidity'] }} %
        </div>
      </div>

      <div v-else className="waiting-widget">
        <h1 className="waiting-message">
          Please wait while we fetch all the necessary information... 😊
        </h1>
      </div>

      <!-- <div className='map-container'>
            <Map
              latitude={weatherData['location']['latitude']}
              longitude={weatherData['location']['longitude']}
            />
          </div> -->
    </div>
  </main>
</template>

<style scoped>
main {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.weather-widget {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 250px;
  border-radius: 35px;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 5px;
  background: linear-gradient(to bottom, #0e1626, #2a454b, #294861);
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.weather-widget-bright {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 250px;
  border-radius: 35px;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 5px;
  background: linear-gradient(to bottom, #ffffff, #ffe57f, #b5d7ff);
  color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.moon {
  fill: white;
  filter: drop-shadow(0 0 20px rgba(252, 252, 252, 0.8));
  width: 80px;
  height: 80px;
}

.sun {
  fill: white;
  filter: drop-shadow(0 0 20px rgba(222, 227, 73, 0.8));
  width: 80px;
  height: 80px;
}

.weather {
  font-size: 14px;
  font-weight: bold;
}

.condition {
  font-size: 20px;
  text-align: center;
}

.temperature {
  margin-top: 25px;
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
}

.windSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

.windDesc {
  font-size: 12px;
  font-weight: bold;
}

.windType {
  font-size: 1rem;
  margin-bottom: 10px;
}

.windSpeed {
  font-size: 1rem;
}

.location {
  margin-top: 5px;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.humidity {
  font-size: 12px;
}

.waiting-widget {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 290px;
  height: 450px;
  border-radius: 35px;
  background: linear-gradient(to bottom, #ffffff, #919090, #96b1cf);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  color: white;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 8px;
}

.waiting-message {
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.map-container {
  width: 250px;
  height: 320px;
  border-radius: 35px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.map-container {
  width: 250px;
  height: 320px;
  border-radius: 35px;
  overflow: hidden;
}

form {
  margin-top: 30px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  flex: 1;
}
</style>
