<?php

use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;

class Weather {
    public $weatherReport;
    public $errors;

    public function setWeatherReport($location = null) { 
        if ($location) {
            $lon = $location['longitude'];
            $lat = $location['latitude'];

            $url = htmlspecialchars_decode("{$_ENV['weather_api_url']}?lat={$lat}&lon={$lon}&cnt=1&appid={$_ENV['weather_api_key']}&units=metric");
        }
        else {
            $this->errors = [
                'message' => "No location detected"
            ];

            return;
        }

        $weatherData = file_get_contents($url);
        $weatherData = json_decode($weatherData, true);

        require('Time.php');
        $time = new Time();
        $time->setTime([
            'date' => $weatherData['dt'],
            'sunrise' => $weatherData['sys']['sunrise'],
            'sunset' => $weatherData['sys']['sunset']
        ]);

        $iconUrl = $_ENV['weather_api_icons'] . $weatherData['weather'][0]['icon'] . "@2x.png";

        $this->weatherReport = [
            'time' => $time->getTime(),
            'temperature' => $weatherData['main']['temp'],
            'humidity' => $weatherData['main']['humidity'],
            'icon' => $iconUrl,
            'shortDescr' => $weatherData['weather'][0]['main'],
            'description' => $weatherData['weather'][0]['description'],
            'windType' => $weatherData['wind']['deg'],
            'windSpeed' => $weatherData['wind']['speed']
        ];
    }

    public function getWeatherReport() {
        if ($this->weatherReport) {
            return $this->weatherReport;
        }
        else {
            return $this->errors;
        }
    }

    public function getErrors() {
        return $this->errors;
    }
};