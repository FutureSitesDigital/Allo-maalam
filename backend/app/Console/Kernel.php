<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Définir les commandes Artisan planifiées.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('artisans:clean')->daily(); // <-- الأمر ديالك هنا
    }

    /**
     * Enregistrer les commandes Artisan disponibles.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
