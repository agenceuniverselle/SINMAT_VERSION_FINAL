<?php

namespace App\Http\Controllers;

use App\Models\LocationProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class LocationProductController extends Controller
{
    public function index()
    {
        return response()->json(LocationProduct::with('category')->latest()->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'price_per_day' => 'required|numeric|min:0',
            'location_category_id' => 'required|exists:location_categories,id',
            'status' => 'required|in:disponible,sur_commande,non_disponible',
            'image' => 'nullable|image|max:4096',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('location_products', 'public');
        }

        $product = LocationProduct::create([
            ...$validator->validated(),
            'image' => $imagePath,
        ]);

        return response()->json($product, 201);
    }

    public function show($id)
    {
        $product = LocationProduct::with('category')->find($id);

        if (!$product) {
            return response()->json(['message' => 'Produit non trouvé'], 404);
        }

        return response()->json($product);
    }

  public function update(Request $request, $id)
{
    $product = LocationProduct::find($id);

    if (!$product) {
        return response()->json(['message' => 'Produit non trouvé'], 404);
    }

    $validator = Validator::make($request->all(), [
        'title' => 'sometimes|required|string|max:200',
        'description' => 'nullable|string',
        'price_per_day' => 'sometimes|required|numeric|min:0',
        'location_category_id' => 'sometimes|required|exists:location_categories,id',
        'status' => 'sometimes|required|in:disponible,sur_commande,non_disponible',
        'image' => 'nullable|image|max:4096',
        'remove_image' => 'sometimes|boolean',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $data = $validator->validated();

    // Supprimer image actuelle si demandé
    if ($request->boolean('remove_image') && $product->image) {
        Storage::disk('public')->delete($product->image);
        $product->image = null;
    }

    // Nouvelle image
    if ($request->hasFile('image')) {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->image = $request->file('image')->store('location_products', 'public');
    }

    // Appliquer manuellement les autres champs
    if (isset($data['title'])) $product->title = $data['title'];
    if (array_key_exists('description', $data)) $product->description = $data['description'];
    if (isset($data['price_per_day'])) $product->price_per_day = $data['price_per_day'];
    if (isset($data['location_category_id'])) $product->location_category_id = $data['location_category_id'];
    if (isset($data['status'])) $product->status = $data['status'];

    $product->save();

    return response()->json($product);
}
   public function destroy($id)
{
    $product = LocationProduct::find($id);
    
    if (!$product) {
        return response()->json(['message' => 'Produit non trouvé'], 404);
    }

    // ✅ Supprime d'abord les demandes de location liées
    \App\Models\RentalRequest::where('product_id', $id)->delete();

    // Supprime l'image
    if ($product->image) {
        Storage::disk('public')->delete($product->image);
    }

    $product->delete();

    return response()->json(['message' => 'Produit supprimé']);
}
}
