<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artisan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'description', 'categorie', 'service', 'societe', 'cin',
        'annees_experience', 'is_approved'
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(ArtisanImage::class);
    }

    public function diplomes()
    {
        return $this->hasMany(Diplome::class);
    }

    // Scopes
    public function scopeEnAttente($query)
    {
        return $query->where('statut_verification', 'en_attente');
    }

    public function scopeComplement($query)
    {
        return $query->where('statut_verification', 'complement');
    }

    public function scopeRejete($query)
    {
        return $query->where('statut_verification', 'rejete');
    }

    public function scopeApprouve($query)
    {
        return $query->where('statut_verification', 'approuve');
    }

    // Statuts possibles
    public static function statuts()
    {
        return [
            'en_attente' => 'En attente',
            'complement' => 'Demande de complément',
            'rejete' => 'Refusé',
            'approuve' => 'Approuvé'
        ];
    }

    // Types de complément possibles
    public static function typesComplement()
    {
        return [
            'photo_manquante' => 'Photo manquante',
            'info_incomplete' => 'Information incomplète',
            'document_manquant' => 'Document manquant',
            'autre' => 'Autre'
        ];
    }

    // Raisons de refus possibles
    public static function raisonsRejet()
    {
        return [
            'faux_documents' => 'Documents falsifiés',
            'incomplet' => 'Dossier incomplet',
            'non_eligible' => 'Non éligible',
            'autre' => 'Autre raison'
        ];
    }


    // Ajouter ces constantes
    const STATUS_PENDING = 'en_attente';
    const STATUS_APPROVED = 'approuve';
    const STATUS_REJECTED = 'rejete';

}
