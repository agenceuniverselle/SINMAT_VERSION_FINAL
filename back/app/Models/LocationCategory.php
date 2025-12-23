<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocationCategory extends Model
{
    protected $fillable = [
        'label',
        'value',
        'icon',
    ];
}
