<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diplome extends Model
{
    use HasFactory;

    protected $fillable = ['artisan_id', 'fichier', 'type'];

    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }

    public function getUrlAttribute()
    {
        return asset('storage/'.$this->fichier);
    }
}
