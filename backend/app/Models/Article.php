<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $table = 'articles';
    protected $primaryKey = 'id';

 
    public const UPDATED_AT = null;

   
    protected $fillable = [
        'title_ar',
        'title_en',
        'date',
        'content_ar',
        'content_en',
        'category',
        'image_url',
        'source_url',
        'status',
        'created_at',
    ];

   
    protected $casts = [
        'created_at' => 'datetime',
    ];
}
