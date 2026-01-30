<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LatePrayer extends Model
{
    protected $fillable = [
        'user_id',
        'prayer_name',
        'count',
    ];

    protected $casts = [
        'count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
