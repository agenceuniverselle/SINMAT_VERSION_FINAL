<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $fillable = [
        'title',
        'excerpt',
        'content',
        'category',
        'author',
        'read_time',
        'image',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image
            ? asset('storage/' . $this->image)
            : null;
    }
}
