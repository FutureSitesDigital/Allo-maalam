<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Artisan;
use App\Models\Category;
use App\Models\Ville;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getUsers()
{
    $clients = User::clients()->get(); // tous les clients

    $artisans = User::with('artisan')
        ->where('role', 'artisan')
        ->whereHas('artisan', function ($query) {
            $query->where('statut_verification', 'approuve');
        })
        ->get(); // les artisans approuvés seulement

    $users = $clients->merge($artisans); // merge client + artisan approuvé

    return response()->json($users);
}

    public function updateUserStatus(Request $request, User $user)
    {
        $request->validate([
            'status' => 'required|in:active,blocked'
        ]);

        $user->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Statut utilisateur mis à jour'
        ]);
    }

    public function deleteUser(User $user)
    {
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé'
        ]);
    }

    public function getArtisans()
    {
        $artisans = Artisan::with(['user', 'images'])
            ->get();

        return response()->json($artisans);
    }

    public function updateArtisanApproval(Request $request, Artisan $artisan)
    {
        $request->validate([
            'is_approved' => 'required|boolean'
        ]);

        $artisan->update(['is_approved' => $request->is_approved]);

        return response()->json([
            'success' => true,
            'message' => 'Statut artisan mis à jour'
        ]);
    }
// Dans AdminController.php
public function getDashboardStats()
{
    try {
        return response()->json([
            'users' => User::count(),
            'clients' => User::where('role', 'client')->count(),
            'artisans' => User::where('role', 'artisan')->count(),
            'categories' => Category::count(),
            'verification' => [
                'approved' => User::where('statut_verification', 'approuve')->count(),
                'pending' => User::where('statut_verification', 'en_attente')->count(),
                'rejected' => User::where('statut_verification', 'rejete')->count(),
            ],
            'cities' => Ville::count(),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTrace()
        ], 500);
    }
}


public function getUsersByMonth()
{
    $users = User::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
        ->whereYear('created_at', date('Y'))
        ->groupBy('month')
        ->orderBy('month')
        ->get();

    $labels = [];
    $data = [];

    for ($i = 1; $i <= 12; $i++) {
        $labels[] = date('F', mktime(0, 0, 0, $i, 1));
        $data[] = $users->firstWhere('month', $i)?->count ?? 0;
    }

    return response()->json([
        'labels' => $labels,
        'data' => $data
    ]);
}

public function getArtisansByCategory()
{
    $artisans = Artisan::selectRaw('categorie as category, COUNT(*) as count')
        ->groupBy('categorie')
        ->get();

    return response()->json([
        'labels' => $artisans->pluck('category'),
        'data' => $artisans->pluck('count')
    ]);
}

public function getArtisansByCity()
{
    $artisans = User::selectRaw('ville as city, COUNT(*) as count')
        ->where('role', 'artisan')
        ->groupBy('ville')
        ->get();

    return response()->json([
        'labels' => $artisans->pluck('city'),
        'data' => $artisans->pluck('count')
    ]);
}

}
