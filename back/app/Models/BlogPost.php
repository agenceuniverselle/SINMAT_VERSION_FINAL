<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $fillable = [
        'title',
        'excerpt',
        'content',
        'image',
        'category',
        'author',
        'read_time',
        'published_at',
    ];

    protected $dates = ['published_at'];
}
