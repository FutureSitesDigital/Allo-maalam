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
        // Validation des données
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
            'societe' => 'nullable|string',
            'images.*' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Gestion de l'image de profil
            $profileImagePath = null;
            if ($request->hasFile('profile_image')) {
                $profileImage = $request->file('profile_image');
                $profileImageName = time().'_'.$profileImage->getClientOriginalName();
                $profileImagePath = $profileImage->storeAs('profile_images', $profileImageName, 'public');
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
                'profile_image' => $profileImagePath
            ]);

            // Si c'est un artisan, créer le profil associé
            if ($user->role === 'artisan') {
                $artisan = $user->artisan()->create([
                    'description' => $request->description,
                    'categorie' => $request->categorie,
                    'service' => $request->service,
                    'societe' => $request->societe ?? null,
                    'is_approved' => false
                ]);

                // Gestion des images de réalisations
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $imageName = time().'_'.$image->getClientOriginalName();
                        $path = $image->storeAs('artisan_images', $imageName, 'public');
                        $artisan->images()->create(['image_path' => $path]);
                    }
                }
            }

            // Génération du token JWT
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur enregistré avec succès',
                'user' => $user,
                'token' => $token,
                'redirect_to' => $this->getRedirectRoute($user->role)
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
        $credentials = $request->only('email', 'password');

        // Validation
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

            // Récupération de l'utilisateur
            //$user = auth('api')->user();
            $user = User::with('artisan.images')->find(auth('api')->id());

            $user->load('artisan.images');

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
