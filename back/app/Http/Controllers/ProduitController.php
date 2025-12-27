<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProduitController extends Controller
{
    // LISTE PRODUITS
    public function index()
    {
        return Produit::with('category')->get();
    }

    // DETAILS PRODUIT
  public function show($id)
{
    $p = Produit::with('category')->find($id);

    if (!$p) {
        return response()->json(['message' => 'Produit introuvable'], 404);
    }

    $decoded = $p->images ? json_decode($p->images, true) : [];

    $p->images = array_map(fn($img) => asset('storage/' . $img), $decoded);

    $p->image = $p->images[0] ?? null;
    $p->hover_image = $p->images[1] ?? $p->image;

    return response()->json($p);
}


    // AJOUT PRODUIT
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'category_id' => 'required|integer|exists:categories,id',
            'purchase_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'description' => 'nullable|string|max:500',
            'status' => 'nullable|in:promotion,nouveaute',
            'images.*' => 'nullable|image|max:4096',
        ]);

        $images = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $img) {
                $images[] = $img->store('products', 'public');
            }
        }

        $produit = Produit::create([
            'name' => $data['name'],
            'category_id' => $data['category_id'],
            'purchase_price' => $data['purchase_price'],
            'sale_price' => $data['sale_price'],
            'quantity' => $data['quantity'],
            'description' => $data['description'] ?? null,
            'status' => $request->input('status'),
            'images' => json_encode($images),
        ]);

        return response()->json($produit->load('category'), 201);
    }
  public function latest()
{
    $produits = Produit::with('category')
        ->orderBy('id', 'desc')
        ->take(8)
        ->get();

    foreach ($produits as $p) {
        $p->images = $p->images ? json_decode($p->images, true) : [];
    }

    return $produits;
}


    // UPDATE PRODUIT
    // UPDATE PRODUIT
public function update(Request $request, $id)
{
    $produit = Produit::find($id);

    if (!$produit) {
        return response()->json(['message' => 'Produit non trouvé'], 404);
    }

    $data = $request->validate([
        'name' => 'required|string|max:100',
        'category_id' => 'required|integer|exists:categories,id',
        'purchase_price' => 'required|numeric|min:0',
        'sale_price' => 'required|numeric|min:0',
        'quantity' => 'required|integer|min:0',
        'description' => 'nullable|string|max:500',
        'status' => 'nullable|in:promotion,nouveaute',
        'images.*' => 'nullable|image|max:4096',
        'gallery' => 'nullable|array',
        'gallery.*' => 'string',
    ]);

    // Anciennes images dans la DB
    $currentImages = json_decode($produit->images, true) ?? [];

    // 🔵 Si galerie envoyée (liste images existantes)
    if ($request->has('gallery')) {

        $currentImages = [];

        foreach ($request->gallery as $img) {

            // 🔥 SI URL COMPLÈTE → on enlève http://localhost:8000/storage/
          if (strpos($img, 'http') === 0) {
    $img = str_replace(asset('storage') . '/', '', $img);
}


            $currentImages[] = $img;
        }
    }

    // 🔵 Ajouter nouvelles images
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $file) {
            $currentImages[] = $file->store('products', 'public');
        }
    }

    // Mise à jour du produit
    $produit->update([
        'name' => $data['name'],
        'category_id' => $data['category_id'],
        'purchase_price' => $data['purchase_price'],
        'sale_price' => $data['sale_price'],
        'quantity' => $data['quantity'],
        'description' => $data['description'] ?? null,
        'status' => $data['status'],
        'images' => json_encode($currentImages),
    ]);

    return response()->json($produit->load('category'));
}

    // DELETE PRODUIT
    public function destroy($id)
    {
        $produit = Produit::find($id);

        if (!$produit) {
            return response()->json(['message' => 'Produit non trouvé'], 404);
        }

        $images = json_decode($produit->images, true) ?? [];

        foreach ($images as $img) {
            if (Storage::disk('public')->exists($img)) {
                Storage::disk('public')->delete($img);
            }
        }

        $produit->delete();

        return response()->json(['message' => 'Produit supprimé']);
    }

 public function statsParCategoriePrincipale()
{
    $categories = DB::table('categories')
        ->whereNull('parent_id')
        ->get();

    $stats = [];

    foreach ($categories as $cat) {
        // Récupérer les ID des sous-catégories + catégorie principale
        $subIds = DB::table('categories')
            ->where('parent_id', $cat->id)
            ->pluck('id')
            ->toArray();

        $allIds = array_merge([$cat->id], $subIds);

        // Compter les produits liés à cette catégorie principale (et ses sous-catégories)
        $count = DB::table('produits')
            ->whereIn('category_id', $allIds)
            ->count();

        $stats[] = [
            'categorie' => $cat->name,
            'total'     => $count,
        ];
    }

    return response()->json($stats);
}

}
