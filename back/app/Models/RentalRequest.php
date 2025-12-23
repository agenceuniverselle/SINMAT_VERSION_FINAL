<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Produit;

class RentalRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'full_name',
        'phone',
        'city',
        'address',
        'notes',
        'rental_start',
        'rental_end',
        'delivery_date',
        'delivery_time',
        'days_count',
        'price_per_day',
        'delivery_fee',
        'total_price',
    ];

    // 🔗 Relation avec produit
    public function produit()
{
    return $this->belongsTo(LocationProduct::class, 'product_id');
}

    
}
