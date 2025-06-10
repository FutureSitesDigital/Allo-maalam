<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

//use Illuminate\Support\Facades\Artisan;
use App\Models\Artisan;

use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'phone', 'password', 'ville', 'zone', 'profile_image','statut_verification',
    'role'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function updateProfileImage($image)
{
    // Supprime l'ancienne image si elle existe
    if ($this->profile_image) {
        Storage::disk('public')->delete($this->profile_image);
    }

    // Stocke la nouvelle image
    $path = $image->store('profile_images', 'public');
    $this->update(['profile_image' => $path]);

    return $path;
}

// Accesseur pour l'URL complète
public function getProfileImageUrlAttribute()
{
    if (!$this->profile_image) {
        return asset('images/default-avatar.jpg');
    }

    return Storage::disk('public')->exists($this->profile_image)
        ? asset('storage/'.$this->profile_image)
        : asset('images/default-avatar.jpg');
}

public function artisan()
{
    return $this->hasOne(Artisan::class)->withDefault();
}

// Ajoutez ces méthodes
public function isActive()
{
    return $this->status === 'active';
}

public function isBlocked()
{
    return $this->status === 'blocked';
}

// Ajoutez ces scopes
public function scopeClients($query)
{
    return $query->where('role', 'client');
}

public function scopeArtisans($query)
{
    return $query->where('role', 'artisan');
}

public function scopePendingVerification($query)
{
     return $query->whereHas('artisan', function($q) {
        $q->where('statut_verification', 'en_attente');
    });
}

public function scopeApprovedArtisans($query)
{
    return $query->where('role', 'artisan')
        ->whereHas('artisan', function($q) {
            $q->where('statut_verification', 'approuve');
        });
}

}
