<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Profile extends Model
{
    protected $table = 'profiles';

    protected $primaryKey = 'id';
    
    public $incrementing = false;
    
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'role',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Get researches created by this profile
     */
    public function researches(): HasMany
    {
        return $this->hasMany(Research::class, 'created_by', 'id');
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is publisher
     */
    public function isPublisher(): bool
    {
        return in_array($this->role, ['publisher', 'admin']);
    }
}

