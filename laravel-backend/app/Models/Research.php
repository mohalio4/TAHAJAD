<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Research extends Model
{
    protected $table = 'researches';

    protected $fillable = [
        'title',
        'content_plain',
        'content_html',
        'published_at',
        'writer',
        'publisher',
        'keywords',
        'views',
        'created_by',
    ];

    protected $casts = [
        'published_at' => 'date',
        'keywords' => 'array',
        'views' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the profile that created this research
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'created_by', 'id');
    }

    /**
     * Increment views count
     */
    public function incrementViews(): void
    {
        $this->increment('views');
    }

    /**
     * Scope for published researches
     */
    public function scopePublished($query)
    {
        return $query->where('published_at', '<=', now());
    }

    /**
     * Scope for searching by keywords
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'ilike', "%{$search}%")
              ->orWhere('content_plain', 'ilike', "%{$search}%")
              ->orWhere('writer', 'ilike', "%{$search}%")
              ->orWhere('publisher', 'ilike', "%{$search}%")
              ->orWhereJsonContains('keywords', $search);
        });
    }
}

