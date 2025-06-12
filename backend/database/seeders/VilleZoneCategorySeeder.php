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
            'Rabat' => ['Agdal', 'Hassan', 'Yacoub El Mansour', 'Souissi'],
            'Fès' => ['Fès Médina', 'Jnan El Ward', 'Atlas', 'Saiss', 'Zouagha'],
            'Marrakech' => ['Gueliz', 'Medina', 'Hivernage', 'Sidi Youssef Ben Ali'],
            'Tanger' => ['Medina', 'Malabata', 'Beni Makada'],
            'Meknès' => ['Hamria', 'Agdal', 'Boufekrane', 'Ouislane'],
            'Agadir' => ['Talborjt', 'Dakhla', 'Founty', 'Hay Mohammadi'],
            'Oujda' => ['Ville Nouvelle', 'Sidi Yahya', 'Beni Oukil'],
            'Kénitra' => ['Mehdia', 'Bir Rami', 'Oulad Oujih'],
            'Tétouan' => ['Medina', 'Martil', 'Sania Rmel'],
            'Safi' => ['Quartier Industriel', 'Hay Salam', 'Jrifat'],
            'Mohammedia' => ['Palmier', 'Beauséjour', 'Al Alia'],
            'El Jadida' => ['Centre Ville', 'Hay Essalam', 'Sidi Bouzid'],
            'Béni Mellal' => ['Hay El Fath', 'Oulad M Barek', 'Tizi'],
            'Nador' => ['Centre Ville', 'Al Aroui', 'Beni Ensar'],
            'Témara' => ['Wifaq', 'Hay Nahda', 'Massira'],
            'Khouribga' => ['Hay Essalam', 'Hay Al Qods', 'Oued Zem'],
            'Settat' => ['Hay El Baraka', 'El Massira', 'Douar Lhaj'],
            'Larache' => ['Hay Salam', 'Nouvelle Ville', 'Ksar El Kebir'],
            'Berrechid' => ['Hay Al Amal', 'Hay Essalam', 'Al Wifaq']
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
            'Plomberie' => ['Installation sanitaire', 'Dépannage plomberie', 'Chauffage', 'Rénovation salle de bain'],
            'Électricité' => ['Installation électrique', 'Réparation panne', 'Éclairage LED', 'Domotique'],
            'Jardinage' => ['Entretien de jardin', 'Création de pelouse', 'Taille d’arbres', 'Arrosage automatique'],
            'Nettoyage' => ['Nettoyage domestique', 'Vitres & façades', 'Moquettes & tapis', 'Nettoyage fin de chantier'],
            'Informatique' => ['Réparation PC', 'Installation logiciels', 'Configuration réseau', 'Assistance à distance'],
            'Transport' => ['Déménagement', 'Livraison express', 'Transport marchandises', 'Taxi personnel'],
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
