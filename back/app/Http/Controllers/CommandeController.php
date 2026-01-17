<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Support\Facades\Storage;

class CommandeController extends Controller
{
    /**
     * 📌 Afficher toutes les commandes avec détails des produits
     */
public function index()
{
    $commandes = Commande::with('produits')->orderBy('id', 'desc')->get();

    $commandes = $commandes->map(function ($commande) {
        $total = $commande->produits->sum(function ($produit) {
            return $produit->sale_price * $produit->pivot->quantity;
        });

        return [
            'id'         => $commande->id,
            'name'       => $commande->name,
            'email'      => $commande->email,
            'phone'      => $commande->phone,
            'address'    => $commande->address,
            'status'     => $commande->status,
            'created_at' => $commande->created_at,

        'produits' => $commande->produits->map(function ($produit) {
    $images = is_array($produit->images) ? $produit->images : [];

    $mainImage = !empty($images)
        ? $images[0] // 🔥 déjà une URL grâce à l'accessor
        : asset('storage/products/default.jpg');

    return [
        'id'         => $produit->id,
        'name'       => $produit->name,
        'sale_price' => $produit->sale_price,
        'quantity'   => $produit->pivot->quantity ?? 0,
        'main_image' => $mainImage,
        'images'     => $images, // URLs déjà prêtes
    ];
}),


            'total' => $total,
        ];
    });

    return response()->json($commandes);
}


    /**
     * 📌 Créer une nouvelle commande
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'                => 'required|string',
            'email'               => 'nullable|email', 
            'phone'               => 'required|string',
            'address'             => 'nullable|string',
            'produits'            => 'required|array|min:1',
            'produits.*.id'       => 'required|integer|exists:produits,id',
            'produits.*.quantity' => 'required|integer|min:1',
        ]);

        // 🧮 Calcul du total
        $total = 0;
        foreach ($data['produits'] as $item) {
            $produit = Produit::find($item['id']);
            if ($produit) {
                $total += $produit->sale_price * $item['quantity'];
            }
        }

        // 📝 Création de la commande
        $commande = Commande::create([
            'name'    => $data['name'],
            'email'   => $data['email'] ?? null,
            'phone'   => $data['phone'],
            'address' => $data['address'],
            'status'  => 'en attente',
        ]);

        // 🛒 Associer les produits avec quantité
        foreach ($data['produits'] as $item) {
            $commande->produits()->attach($item['id'], [
                'quantity' => $item['quantity'],
            ]);
        }

        return response()->json([
            'message'  => 'Commande enregistrée avec succès.',
            'commande' => $commande->load('produits'),
        ], 201);
    }

    /**
     * 📌 Modifier le statut d'une commande
     */
    public function update(Request $request, $id)
{
    $commande = Commande::findOrFail($id);

    $data = $request->validate([
        'name'                => 'required|string',
        'email'               => 'nullable|email',
        'phone'               => 'required|string',
        'address'             => 'nullable|string',
        'status'              => 'required|string|in:en attente,en cours,expédiée,livrée,annulée',
        'produits'            => 'required|array|min:1',
        'produits.*.id'       => 'required|integer|exists:produits,id',
        'produits.*.quantity' => 'required|integer|min:1',
    ]);

    // 📝 Mettre à jour la commande
    $commande->update([
        'name'    => $data['name'],
        'email'   => $data['email'] ?? null,
        'phone'   => $data['phone'],
        'address' => $data['address'],
        'status'  => $data['status'],
    ]);

    // 🔁 Mise à jour des produits liés
    $commande->produits()->detach();
    foreach ($data['produits'] as $item) {
        $commande->produits()->attach($item['id'], [
            'quantity' => $item['quantity'],
        ]);
    }

    return response()->json([
        'message' => 'Commande mise à jour avec succès',
    ]);
}


    /**
     * 📌 Supprimer une commande
     */
    public function destroy($id)
    {
        $commande = Commande::findOrFail($id);

        $commande->produits()->detach();
        $commande->delete();

        return response()->json(['message' => 'Commande supprimée avec succès']);
    }
    /**
 * 📌 Commandes du client connecté (filtrées par email)
 */
public function mesCommandes(Request $request)
{
    $email = $request->user()->email;

    $commandes = Commande::with('produits')->where('email', $email)->orderByDesc('id')->get();

    $commandes = $commandes->map(function ($commande) {
        $total = $commande->produits->sum(function ($produit) {
            return $produit->sale_price * $produit->pivot->quantity;
        });

        return [
            'id'         => $commande->id,
            'status'     => $commande->status,
            'created_at' => $commande->created_at->format('Y-m-d'),
            'address'    => $commande->address,
            'total'      => $total,
            'phone' => $commande->phone, 
            'items' => $commande->produits->map(function ($produit) {
                return [
                    'name'     => $produit->name,
                    'quantity' => $produit->pivot->quantity ?? 0,
                    'price'    => $produit->sale_price,
                    
                ];
            }),
        ];
    });

    return response()->json($commandes);
}

}
