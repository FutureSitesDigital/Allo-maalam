<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Carbon\Carbon;

class CleanRejectedArtisans extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'artisans:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Supprime les artisans rejetés après 48h';



    /**
     * Execute the console command.
     */
    public function handle()
    {
        User::where('statut_verification', 'rejete')
            ->where('created_at', '<', Carbon::now()->subHours(48))
            ->delete();

        $this->info('Artisans rejetés nettoyés avec succès');
    }
}
