<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocationProduct extends Model
{
    protected $fillable = [
        'title',
        'description',
        'price_per_day',
        'status',
        'image',
        'location_category_id',
    ];

    public function category()
    {
        return $this->belongsTo(LocationCategory::class, 'location_category_id');
    }
}
