<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Artisan;
use App\Models\ArtisanImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Enregistrement d'un nouvel utilisateur
     */
    public function register(Request $request)
{
    // Validation modifiée pour les diplômes
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'phone' => 'required|digits:10|unique:users',
        'password' => 'required|string|min:6|confirmed',
        'ville' => 'required|string',
        'zone' => 'required|string',
        'role' => 'sometimes|string|in:client,artisan,admin',
        'profile_image' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
        'description' => 'required_if:role,artisan',
        'categorie' => 'required_if:role,artisan',
        'service' => 'required_if:role,artisan',
        'cin' => 'required_if:role,artisan|file|mimes:jpg,jpeg,png,pdf|max:2048',
        'annees_experience' => 'required_if:role,artisan|integer|min:0',
        'diplomes' => 'sometimes|array',
        'diplomes.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
        'societe' => 'nullable|string',
        'images' => 'sometimes|array',
        'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        'terms_accepted' => 'required|accepted'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        // Traitement des fichiers
        $profileImagePath = null;
        if ($request->hasFile('profile_image')) {
            $profileImagePath = $request->file('profile_image')->store('profile_images', 'public');
        }

        // Création de l'utilisateur
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'ville' => $request->ville,
            'zone' => $request->zone,
            'role' => $request->role ?? 'client',
            'profile_image' => $profileImagePath,
        ]);

        // Si artisan
        if ($user->role === 'artisan') {
            $cinPath = $request->file('cin')->store('cin', 'public');

            $artisanData = [
                'description' => $request->description,
                'categorie' => $request->categorie,
                'service' => $request->service,
                'cin' => $cinPath,
                'annees_experience' => $request->annees_experience,
                'statut_verification' => 'en_attente',
                'societe' => $request->societe,
                'is_approved' => false
            ];

            $artisan = $user->artisan()->create($artisanData);

            // Gestion des diplômes
            if ($request->has('diplomes')) {
                foreach ($request->file('diplomes') as $diploma) {
                    if ($diploma->isValid()) {
                        $path = $diploma->store('diplomas', 'public');
                        $artisan->diplomes()->create([
                            'fichier' => $path,
                            'type' => $diploma->getClientOriginalExtension()
                        ]);
                    }
                }
            }

            // Gestion des images
            if ($request->has('images')) {
                foreach ($request->file('images') as $image) {
                    if ($image->isValid()) {
                        $path = $image->store('artisan_images', 'public');
                        $artisan->images()->create(['image_path' => $path]);
                    }
                }
            }
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie',
            'user' => $user,
            'token' => $token,
            'redirect_to' => $this->getRedirectRoute($user->role),
            'statut' => $user->role === 'artisan' ? 'en_attente' : 'active'
        ], 201);

    } catch (\Exception $e) {
        Log::error('Erreur inscription: '.$e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de l\'inscription',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Connexion de l'utilisateur
     */
public function login(Request $request)
{
    // Validation des données
    $credentials = $request->only('email', 'password');

    $validator = Validator::make($credentials, [
        'email' => 'required|email',
        'password' => 'required|string|min:6'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        // Tentative de connexion
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'error' => 'Identifiants incorrects'
            ], 401);
        }

        // Récupération de l'utilisateur avec ses relations
        $user = User::with(['artisan'])->find(auth('api')->id());

        // Gestion spécifique pour les artisans
        if ($user->role === 'artisan') {
            $artisan = $user->artisan;

            switch ($artisan->statut_verification) {
                case Artisan::STATUS_REJECTED:
                    auth('api')->logout();
                    return response()->json([
                        'success' => false,
                        'error' => 'Votre compte a été rejeté',
                        'raison' => $artisan->raison_rejet ?? 'Raison non spécifiée',
                        'statut' => 'rejete'
                    ], 403);

                case Artisan::STATUS_PENDING:
                    return response()->json([
                        'success' => true,
                        'message' => 'Votre compte est en cours de vérification',
                        'statut' => 'en_attente',
                        'token' => $token,
                        'redirect_to' => '/pending-verification'
                    ]);

                case Artisan::STATUS_APPROVED:
                    // Continuer le processus normal de connexion
                    break;
            }
        }

        // Connexion réussie pour les autres cas
        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => $user,
            'redirect_to' => $this->getRedirectRoute($user->role)
        ]);

    } catch (JWTException $e) {
        return response()->json([
            'success' => false,
            'error' => 'Impossible de créer le token'
        ], 500);
    }
}

    /**
     * Déconnexion de l'utilisateur
     */
    public function logout()
    {
        try {
            auth('api')->logout();

            return response()->json([
                'success' => true,
                'message' => 'Déconnexion réussie'
            ]);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Échec de la déconnexion'
            ], 500);
        }
    }

    /**
     * Récupération du profil utilisateur
     */
    public function user()
    {
        try {
            $user = User::with('artisan.images')->find(auth('api')->id());

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Utilisateur non trouvé'
                ], 404);
            }

            // Charger la relation artisan + images si artisan
            if ($user->role === 'artisan') {
                $user->load('artisan.images');
            }

            return response()->json([
                'success' => true,
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erreur lors de la récupération du profil'
            ], 500);
        }
    }

    /**
     * Détermine la redirection selon le rôle
     */
    protected function getRedirectRoute($role)
    {
        return match($role) {
            'admin' => '/admin/dashboard',
            'artisan' => '/artisan/dashboard',
            default => '/client/dashboard',
        };
    }
}


