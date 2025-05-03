<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtisanImage extends Model
{
    use HasFactory;

    protected $fillable = ['artisan_id', 'image_path'];

    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }
    // Ajoutez un accesseur pour l'URL complète
public function getImageUrlAttribute()
{
    return asset('storage/' . $this->image_path);
}
}
