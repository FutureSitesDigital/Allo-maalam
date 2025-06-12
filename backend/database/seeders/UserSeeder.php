<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Artisan;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // --- Clients ---
        for ($i = 1; $i <= 5; $i++) {
            User::create([
                'name' => "Client $i",
                'email' => "client$i@example.com",
                'phone' => "06000000$i",
                'password' => Hash::make('password'),
                'ville' => 'Casablanca',
                'zone' => 'Maârif',
                'role' => 'client',
                'statut_verification' => 'approuve',
            ]);
        }

        // --- Artisans avec relation + fichiers (cin & diplôme) ---
        for ($i = 1; $i <= 5; $i++) {
            // Création de l'utilisateur artisan
            $user = User::create([
                'name' => "Artisan $i",
                'email' => "artisan$i@example.com",
                'phone' => "07000000$i",
                'password' => Hash::make('password'),
                'ville' => 'Fès',
                'zone' => 'Atlas',
                'role' => 'artisan',
                'statut_verification' => 'en_attente',
            ]);

            // Artisan lié à l'utilisateur
            $user->artisan()->create([
                'description' => "Artisan spécialisé n°$i",
                'categorie' => 'Plomberie',
                'service' => 'Dépannage',
                'cin' => "cin/LlMRV8L3SJe8H1riYWDMms5q12eGygn5UM90MIqS.png",
                'annees_experience' => 2,
                'fichier' => "diplomas/bNIfxxediqlPzjx7Z1Ks9kva5MVKgdNWFlxqTFpH.png",
                'societe' => "Société Artisan $i",
                'is_approved' => false,
            ]);
        }
    }
}
