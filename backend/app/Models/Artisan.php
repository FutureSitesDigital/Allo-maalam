<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artisan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'description', 'categorie', 'service', 'societe', 'is_approved'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(ArtisanImage::class);
    }
    
    // Ajoutez ces accesseurs/mutateurs
protected $appends = ['approved_status'];

public function getApprovedStatusAttribute()
{
    return $this->is_approved ? 'Approved' : 'Pending';
}

public function scopeApproved($query)
{
    return $query->where('is_approved', true);
}
}
