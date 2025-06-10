<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
{
    $query = User::with(['artisan'])
                ->orderBy('created_at', 'desc');

    if ($request->has('role')) {
        $query->where('role', $request->role);
    }

    if ($request->has('status')) {
        $query->where('status', $request->status);
    }

    return $query->paginate(10);
}

    public function updateStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:active,suspended,pending'
        ]);

        $user->update(['status' => $validated['status']]);

        return response()->json(['message' => 'Statut utilisateur mis à jour']);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé']);
    }
}
