<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuranSavedPage extends Model
{
    protected $fillable = [
        'user_id',
        'page',
        'notes',
    ];

    protected $casts = [
        'page' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
