<?php
use Dotenv\Dotenv;
use Slim\Factory\AppFactory;
use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Server\RequestHandlerInterface as Handler;

use App\Middleware\CorsMiddleware;

require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

require 'config/Weather.php';
require 'config/UserIp.php';
require 'config/UserLocation.php';
require 'Database.php';
require '../doctrine-config.php';

$twig = Twig::create('templates/', ['cache' => false]);
$app = AppFactory::create();
$app->add(TwigMiddleware::create($app, $twig));

$app->add(function (Request $request, Handler $handler) use ($app): Response {
    if ($request->getMethod() === 'OPTIONS') {
        $response = $app->getResponseFactory()->createResponse();
    } else {
        $response = $handler->handle($request);
    }

    $response = $response
        ->withHeader('Access-Control-Allow-Credentials', 'true')
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->withHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        ->withHeader('Pragma', 'no-cache');

    if (ob_get_contents()) {
        ob_clean();
    }

    return $response;
});

$app->options('*', function (Request $request, Response $response, $args) use ($app) {
    return $response;
});

$app->get('/weather', function (Request $request, Response $response, $args) use ($twig, $app, $entityManager) {
    $headers = getallheaders();
    $key = '';
    
    if (isset($headers['Authorization'])) {
        $key = $headers['Authorization'];
    }

    $city = $request->getQueryParams()['city'] ?? null;

    $database = new Database($entityManager);
    $user = $database->findUserByToken($key);

    if (!$user) {
        $data = [
            'message' => "Incorrect key"
        ];

        $response->getBody()->write(json_encode($data));
        return $response;
    }

    $location = new UserLocation();
    $weather = new Weather();

    $location->setUserLocationByCity($city);
    $weather->setWeatherReport($location->getUserLocation());

    if ($location->getUserLocation()) {
        $data = [
            'location' => $location->getUserLocation(),
            'weather' => $weather->getWeatherReport()
        ];

        $database->saveRecordToDatabase($data);
    }
    else {
        $data = $weather->getWeatherReport();
    }
    
    $response->getBody()->write(json_encode($data));
    return $response;
});

$app->get('/register', function (Request $request, Response $response, $args) use ($twig, $app) {
    $view = Twig::fromRequest($request);
    return $view->render($response, 'register.html', []);
});

$app->post('/register', function (Request $request, Response $response, $args) use ($twig, $app, $entityManager) {
    $data = $request->getParsedBody();

    $login = $data['login'];
    $password = $data['password'];
    $passwordRepeat = $data['passwordRepeat'];
    $view = Twig::fromRequest($request);

    if ($password != $passwordRepeat) {
        return $view->render($response, 'register.html', [
            'errors' => 'Passwords must repeat'
        ]);
    }

    $database = new Database($entityManager);
    $user = $database->findUserByLogin($login);
    
    if ($user) {
        return $view->render($response, 'register.html', [
            'errors' => 'User already exists'
        ]);
    }
    
    $database->createUser($data);
    return $view->render($response, 'register.html', []);
});

$app->get('/login', function (Request $request, Response $response, $args) use ($twig, $app) {
    $view = Twig::fromRequest($request);
    return $view->render($response, 'login.html', []);
});

$app->post('/login', function (Request $request, Response $response, $args) use ($twig, $app, $entityManager) {
    $view = Twig::fromRequest($request);
    $data = $request->getParsedBody();
    $database = new Database($entityManager);

    $user = $database->findUserByLogin($data['login']);

    if (!$user) {
        return $view->render($response, 'login.html', [
            'errors' => 'Incorrect login or password'
        ]);
    }

    $password = $user->getPassword();
    if (!password_verify($data['password'], $password)) {
        return $view->render($response, 'login.html', [
            'errors' => 'Incorrect login or password'
        ]);
    }
    else {
        return $view->render($response, 'userData.html', [
            'login' => $data['login'],
            'key' => $user->getToken()
        ]);
    }
});

return $app;