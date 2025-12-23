<?php

namespace App\Http\Controllers;

use App\Models\LocationCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class LocationCategoryController extends Controller
{
    /**
     * Liste de toutes les catégories
     */
    public function index()
    {
        return response()->json(LocationCategory::orderBy('label')->get());
    }

    /**
     * Création d'une nouvelle catégorie
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'label' => 'required|string|max:100|unique:location_categories,label',
            'value' => 'required|string|max:100|unique:location_categories,value',
            'icon'  => 'nullable|image|max:4096', // max 4MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $iconPath = null;
        if ($request->hasFile('icon')) {
            $iconPath = $request->file('icon')->store('location_icons', 'public');
        }

        $category = LocationCategory::create([
            'label' => $request->label,
            'value' => $request->value,
            'icon'  => $iconPath,
        ]);

        return response()->json($category, 201);
    }

    /**
     * Détails d'une catégorie
     */
    public function show($id)
    {
        $category = LocationCategory::find($id);

        if (!$category) {
            return response()->json(['message' => 'Catégorie non trouvée'], 404);
        }

        return response()->json($category);
    }

    /**
     * Mise à jour
     */
    public function update(Request $request, $id)
    {
        $category = LocationCategory::find($id);

        if (!$category) {
            return response()->json(['message' => 'Catégorie non trouvée'], 404);
        }

        $validator = Validator::make($request->all(), [
            'label' => 'sometimes|required|string|max:100|unique:location_categories,label,' . $id,
            'value' => 'sometimes|required|string|max:100|unique:location_categories,value,' . $id,
            'icon'  => 'nullable|image|max:4096',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 🔥 Supprimer l'icône existante si demandé
        if ($request->has('remove_icon') && $request->boolean('remove_icon')) {
            if ($category->icon && Storage::disk('public')->exists($category->icon)) {
                Storage::disk('public')->delete($category->icon);
            }
            $category->icon = null;
        }

        // 🔁 Remplacer l'icône si une nouvelle est fournie
        if ($request->hasFile('icon')) {
            if ($category->icon && Storage::disk('public')->exists($category->icon)) {
                Storage::disk('public')->delete($category->icon);
            }

            $iconPath = $request->file('icon')->store('location_icons', 'public');
            $category->icon = $iconPath;
        }

        $category->fill($request->except(['icon', 'remove_icon']))->save();

        return response()->json($category);
    }

    /**
     * Suppression
     */
    public function destroy($id)
    {
        $category = LocationCategory::find($id);

        if (!$category) {
            return response()->json(['message' => 'Catégorie non trouvée'], 404);
        }

        // Supprimer l'image associée si elle existe
        if ($category->icon && Storage::disk('public')->exists($category->icon)) {
            Storage::disk('public')->delete($category->icon);
        }

        $category->delete();

        return response()->json(['message' => 'Catégorie supprimée']);
    }
}
