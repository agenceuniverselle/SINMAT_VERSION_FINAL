<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommandeProduit extends Model
{
    protected $fillable = ['commande_id', 'produit_id', 'quantity'];

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
    public function produits()
{
    return $this->belongsToMany(Produit::class, 'commande_produit')
        ->withPivot('quantity')
        ->withTimestamps();
}

}

