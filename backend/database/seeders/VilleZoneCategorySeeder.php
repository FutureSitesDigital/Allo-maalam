<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ville;
use App\Models\Zone;
use App\Models\Category;
use App\Models\Service;

class VilleZoneCategorySeeder extends Seeder
{
    public function run()
    {
        // Villes et Zones
        $villesZones = [
            'Casablanca' => ['Ain Diab', 'Maârif', 'Anfa', 'Sidi Bernoussi', 'Hay Hassani'],
            'Fès' => ['Fès Médina', 'Jnan El Ward', 'Atlas', 'Saiss', 'Zouagha'],
            'Marrakech'=> ['Gueliz', 'Medina', 'Hivernage', 'Sidi Youssef Ben Ali'],
            'Rabat'=>['Agdal', 'Hassan', 'Yacoub El Mansour', 'Souissi'],
            'Tanger'=>['Medina', 'Malabata', 'Beni Makada'],
            'Meknès'=> ['Hamria', 'Agdal', 'Boufekrane', 'Ouislane'],

            // ... autres villes comme dans votre objet
        ];

        foreach ($villesZones as $villeNom => $zones) {
            $ville = Ville::create(['name' => $villeNom]);

            foreach ($zones as $zoneNom) {
                Zone::create([
                    'ville_id' => $ville->id,
                    'name' => $zoneNom
                ]);
            }
        }

        // Catégories et Services
        $categoriesServices = [
            'Bâtiment' => ['Maçonnerie', 'Carrelage', 'Peinture', 'Plâtrerie'],
            'Plomberie' => ['Installation sanitaire', 'Dépannage', 'Chauffage', 'Rénovation'],
            'Électricité'=> ['Installation électrique', 'Dépannage', 'Éclairage', 'Domotique'],
            'Jardinage'=> ['Entretien', 'Paysagisme', 'Taille de haies', 'Tonte de gazon'],
            // ... autres catégories comme dans votre objet
        ];

        foreach ($categoriesServices as $categorieNom => $services) {
            $categorie = Category::create(['name' => $categorieNom]);

            foreach ($services as $serviceNom) {
                Service::create([
                    'category_id' => $categorie->id,
                    'name' => $serviceNom
                ]);
            }
        }
    }
}
