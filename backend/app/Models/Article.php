<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $table = 'articles';

    // Disabling Laravel's default timestamps since the scraper adds 'created_at' directly/via MySQL default
    // We set up TIMESTAMP DEFAULT CURRENT_TIMESTAMP in migration
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'url',
        'title',
        'content',
        'image',
        'category',
        'created_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * The attributes to append.
     */
    protected $appends = ['likes_count', 'comments_count', 'is_liked'];

    public function comments()
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id')->orderBy('created_at', 'desc');
    }

    public function allComments()
    {
        return $this->hasMany(Comment::class);
    }

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    public function getLikesCountAttribute()
    {
        return $this->likes()->count();
    }

    public function getCommentsCountAttribute()
    {
        return $this->allComments()->count();
    }

    public function getIsLikedAttribute()
    {
        $user = auth('sanctum')->user();
        if ($user) {
            return $this->likes()->where('user_id', $user->id)->exists();
        }
        
        $ip = request()->ip();
        return $this->likes()->where('ip_address', $ip)->whereNull('user_id')->exists();
    }
}
