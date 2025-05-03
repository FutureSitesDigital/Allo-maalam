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
        'name', 'email', 'phone', 'password', 'ville', 'zone', 'profile_image', 'role'
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



    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isArtisan()
    {
        return $this->role === 'artisan';
    }

    public function isClient()
    {
        return $this->role === 'client';
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

}
