<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Produit extends Model
{
    protected $fillable = [
        'name',
        'category_id',
        'purchase_price',
        'sale_price',
        'quantity',
        'description',
         'status',
        'image',
        'hover_image',
        'images',
        'additional_info',
        'in_stock',
    ];

    protected $casts = [
        'images' => 'array',
        'additional_info' => 'array',
        'in_stock' => 'boolean',
    ];

    // 🔥 Relation vers catégorie
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
  public function commandes()
    {
        return $this->belongsToMany(Commande::class, 'commande_produits')
            ->withPivot('quantity')
            ->withTimestamps();
    }
    protected $appends = ['images_array'];

public function getImagesArrayAttribute()
{
    if (is_array($this->images)) {
        return $this->images;
    }

    if (is_string($this->images)) {
        return json_decode($this->images, true) ?? [];
    }

    return [];
}



}
