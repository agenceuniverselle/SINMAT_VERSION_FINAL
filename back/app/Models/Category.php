<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'icon',
        'description',
        'parent_id',
    ];

    // parent
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // sous-catégories
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }
}
