<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'address','status'];

    public function produits()
    {
        return $this->belongsToMany(Produit::class, 'commande_produits')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
