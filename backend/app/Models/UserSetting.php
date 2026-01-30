<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSetting extends Model
{
    protected $fillable = [
        'user_id',
        'prayer_adjustments',
        'hijri_adjustment',
        'theme',
        'notifications',
    ];

    protected $casts = [
        'prayer_adjustments' => 'array',
        'hijri_adjustment' => 'integer',
        'notifications' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
