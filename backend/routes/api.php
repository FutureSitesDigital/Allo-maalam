<?php

use App\Http\Controllers\Admin\VerificationArtisanController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\VilleController;
use App\Http\Controllers\ZoneController;

// Routes publiques
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});



// Routes pour les données publiques
Route::get('/villes', [VilleController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);


// Routes protégées par auth:api et rôle admin
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    // Users
    Route::get('/admin/users', [AdminController::class, 'getUsers']);
    Route::put('/admin/users/{user}/status', [AdminController::class, 'updateUserStatus']);

    // Vérification des artisans (version simplifiée)
    Route::prefix('admin/artisans')->group(function () {
        // Liste des artisans en attente
        Route::get('/pending', [VerificationArtisanController::class, 'pending']);
        Route::post('/{id}/approve', [VerificationArtisanController::class, 'approve']);
        Route::post('/{id}/reject', [VerificationArtisanController::class, 'reject']);
        Route::delete('/{id}', [VerificationArtisanController::class, 'destroy']);
        // Gestion existante
        Route::get('/', [AdminController::class, 'getArtisans']);
        Route::put('/{artisan}/approval', [AdminController::class, 'updateArtisanApproval']);
    });

    // Categories
    Route::apiResource('/admin/categories', CategoryController::class);

    // Services
    Route::apiResource('/admin/services', ServiceController::class);

    // Locations
    Route::apiResource('/admin/villes', VilleController::class);
    Route::apiResource('/admin/zones', ZoneController::class);

    // Ajoutez la route pour les zones par ville
    Route::get('/admin/villes/{ville}/zones', [ZoneController::class, 'getByVille']);

});

// Routes pour les artisans (complément d'infos)
Route::middleware(['auth:api', 'role:artisan'])->group(function () {
    Route::prefix('artisan')->group(function () {
    //Route::put('/complement/{artisan}', [VerificationArtisanController::class, 'submitComplement']);
    });
});

// Routes protégées pour utilisateur connecté
Route::middleware(['auth:api'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
});
