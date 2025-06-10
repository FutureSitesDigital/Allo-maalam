<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Artisan;


class CheckArtisanStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
{
    $user = $request->user();

    if ($user->role === 'artisan') {
        switch($user->statut_verification) {
            case 'rejete':
                auth('api')->logout();
                return response()->json([
                    'error' => 'Votre compte a été rejeté',
                    'statut' => 'rejete'
                ], 403);

            case 'en_attente':
                return response()->json([
                    'message' => 'Votre compte est en vérification',
                    'statut' => 'en_attente'
                ], 403);
        }
    }

    return $next($request);
    }
}
