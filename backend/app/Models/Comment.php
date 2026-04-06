<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'article_id',
        'parent_id',
        'content',
    ];

    /**
     * Include relationships by default.
     */
    protected $with = ['user', 'likes'];

    /**
     * The attributes to append.
     */
    protected $appends = ['likes_count', 'is_liked'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')->orderBy('created_at', 'asc');
    }

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    public function getLikesCountAttribute()
    {
        return $this->likes->count();
    }

    public function getIsLikedAttribute()
    {
        $user = auth('sanctum')->user();
        if ($user) {
            return $this->likes->where('user_id', $user->id)->isNotEmpty();
        }
        
        $ip = request()->ip();
        return $this->likes->where('ip_address', $ip)->whereNull('user_id')->isNotEmpty();
    }
}
