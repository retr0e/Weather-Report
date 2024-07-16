<?php

use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;

class Time {
    public $timeData;

    public function setTime($time) {
        $this->timeData['date'] = date("Y-m-d H:i:s", $time['date']);
        $this->timeData['sunrise'] = date("g:i A", $time['sunrise']);
        $this->timeData['sunset'] = date("g:i A", $time['sunset']);
    }

    public function getTime() {
        return $this->timeData;
    }
}