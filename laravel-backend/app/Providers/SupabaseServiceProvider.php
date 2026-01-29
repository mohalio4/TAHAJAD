<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Http;

class SupabaseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton('supabase', function ($app) {
            return new class {
                private $url;
                private $key;
                
                public function __construct()
                {
                    $this->url = config('supabase.url');
                    $this->key = config('supabase.key');
                }
                
                public function from(string $table)
                {
                    return Http::withHeaders([
                        'apikey' => $this->key,
                        'Authorization' => 'Bearer ' . $this->key,
                        'Content-Type' => 'application/json',
                        'Prefer' => 'return=representation',
                    ])->baseUrl($this->url . '/rest/v1');
                }
            };
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}

