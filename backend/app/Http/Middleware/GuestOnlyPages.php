<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class GuestOnlyPages extends Middleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // If trying to access login/register and already authenticated, redirect to home
        if ($request->user() && in_array($request->path(), ['login', 'register'])) {
            return redirect()->route('home');
        }
        
        return $next($request);
    }
}
