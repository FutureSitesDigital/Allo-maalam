<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ArtisanRejected extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $raison;

    public function __construct(User $user, string $raison)
    {
        $this->user = $user;
        $this->raison = $raison;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '❌ Votre inscription artisan a été refusée',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.Rejete',
            with: [
                'name' => $this->user->name,
                'raison' => $this->raison
            ]
        );
    }
}
