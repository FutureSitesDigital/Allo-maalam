<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Configuration unique des middlewares
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
            'auth.jwt' => \App\Http\Middleware\AuthenticateJWT::class, // Nouveau middleware personnalisé
            'admin' => \App\Http\Middleware\CheckRole::class.':admin', // Alias spécifique
            'artisan' => \App\Http\Middleware\CheckRole::class.':artisan',
            'client' => \App\Http\Middleware\CheckRole::class.':client',
        ]);

        // Configuration des groupes middleware si nécessaire
        $middleware->group('api', [
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
