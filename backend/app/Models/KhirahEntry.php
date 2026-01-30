<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KhirahEntry extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'description',
        'category',
        'completed',
        'date',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
