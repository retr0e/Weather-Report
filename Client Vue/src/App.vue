<script setup>
import { ref } from 'vue';
</script>

<template>
  <div class="container">
    <div class="weather-widget-bright">
      <div class="location">LocationData</div>

      <img
        src="https://as2.ftcdn.net/v2/jpg/01/17/28/51/1000_F_117285131_W2qjuUEEBPP2nPJHxosDk62mj4B6KvIg.jpg"
        alt="Weather Icon"
        className="moon"
      />

      <div class="temperature">Temperatura°C</div>
      <div class="weather">Opis</div>
      <div class="condition">Warunki atmo</div>

      <div class="windSection">
        <span class="windDesc">Wind type</span>
        <div class="windType">Wind Type Value</div>
        <span class="windDesc">Wind speed</span>
        <div class="windSpeed">Wind Speed Value km/h</div>
      </div>

      <div class="humidity">Humidity %</div>
    </div>

    <!-- <div className='map-container'>
            <Map
              latitude={weatherData['location']['latitude']}
              longitude={weatherData['location']['longitude']}
            />
          </div> -->

    <!-- <div className="waiting-widget">
      <h1 className="waiting-message">
        Please wait while we fetch all the necessary information... 😊
      </h1>
    </div> -->
  </div>
</template>

<style scoped>
body {
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

.condition {
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
  height: 404px;
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
</style>
