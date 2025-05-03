<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;



Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

});
// Routes pour les données
Route::get('/villes', function () {
    return \App\Models\Ville::all();
});
Route::get('/zones', function (Request $request) {
    $villeName = $request->query('ville');

    if ($villeName) {
        $ville = \App\Models\Ville::where('name', $villeName)->first();
        if ($ville) {
            return $ville->zones;
        }
    }

    return response()->json([]);
});

Route::get('/categories', function () {
    return \App\Models\Category::with('services')->get();
});
