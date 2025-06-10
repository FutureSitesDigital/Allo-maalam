<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\ArtisanApproved;
use App\Mail\ArtisanRejected;
use App\Models\Artisan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class VerificationArtisanController extends Controller
{
public function pending()
{
    $artisans = Artisan::with(['user', 'images', 'diplomes'])
        ->whereHas('user', function($query) {
            $query->where('statut_verification', 'en_attente');
        })
        ->get();

    return $artisans->map(function($artisan) {
        return [
            'id' => $artisan->id,
            'user_id' => $artisan->user_id,
            'name' => $artisan->user->name,
            'email' => $artisan->user->email,
            'phone' => $artisan->user->phone,
            'ville' => $artisan->user->ville,
            'zone' => $artisan->user->zone,
            'profile_image' => $artisan->user->profile_image_url,
            'created_at' => $artisan->created_at,
            'categorie' => $artisan->categorie,
            'service' => $artisan->service,
            'description' => $artisan->description,
            'cin' => $artisan->cin ? asset('storage/'.$artisan->cin) : null,
            'societe' => $artisan->societe,
            'images' => $artisan->images->map(function($image) {
                return ['image_path' => asset('storage/'.$image->image_path)];
            }),
            'diplomes' => $artisan->diplomes->map(function($diplome) {
                return ['fichier' => asset('storage/'.$diplome->fichier)];
            })
        ];
    });
}
public function approve($id)
{
    $artisan = Artisan::findOrFail($id);

    // Mettre à jour le statut dans la table users
    $artisan->user()->update([
        'statut_verification' => 'approuve'
    ]);

    // Mettre à jour l'approbation dans la table artisans
    $artisan->update([
        'is_approved' => true
    ]);

    // Envoyer l'email avec l'utilisateur associé
    Mail::to($artisan->user->email)->send(new ArtisanApproved($artisan->user));

    return response()->json(['message' => 'Artisan approuvé']);
}

public function reject(Request $request, $id)
{
    $request->validate(['raison' => 'required|string']);

    $artisan = Artisan::findOrFail($id);

    // Mettre à jour le statut dans la table users
    $artisan->user()->update([
        'statut_verification' => 'rejete'
    ]);

    // Mettre à jour la raison dans la table artisans
    $artisan->update([
        'raison_rejet' => $request->raison
    ]);

    // Envoyer l'email avec l'utilisateur associé et la raison
    Mail::to($artisan->user->email)->send(new ArtisanRejected($artisan->user, $request->raison));

    return response()->json(['message' => 'Artisan rejeté']);

}
public function destroy($id)
{
    try {
        $artisan = Artisan::findOrFail($id);

        // Supprime les relations et fichiers associés si nécessaire
        // Exemple :
        // $artisan->diplomes()->delete();
        // $artisan->realisations()->delete();

        $artisan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Artisan supprimé avec succès'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la suppression de l\'artisan',
            'error' => $e->getMessage()
        ], 500);
    }

}
}
