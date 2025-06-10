<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Artisan;
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
}
