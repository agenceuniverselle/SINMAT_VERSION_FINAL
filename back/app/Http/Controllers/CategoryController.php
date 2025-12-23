<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(
            Category::with('children')
                ->whereNull('parent_id')
              
                ->get()
        );
    }

    public function show(Category $category)
    {
        return response()->json($category->load('children'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:100|unique:categories,name',
            'description' => 'nullable|string|max:500',
            'icon'        => 'nullable|image|max:4096',
            'subcategories' => 'array',
            'subcategories.*' => 'string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 📌 Upload icon
        $iconPath = null;
        if ($request->hasFile('icon')) {
            $iconPath = $request->file('icon')->store('icons', 'public');
        }

        // 📌 Create main category
        $category = Category::create([
            'name'        => $request->name,
            'description' => $request->description,
            'icon'        => $iconPath,
            'parent_id'   => null,
        ]);

        // 📌 Create subcategories
        if ($request->has('subcategories')) {
            foreach ($request->subcategories as $sub) {
                Category::create([
                    'name'        => $sub,
                    'description' => null,
                    'icon'        => null,
                    'parent_id'   => $category->id,
                ]);
            }
        }

        return response()->json($category->load('children'), 201);
    }

    public function destroy(Category $category)
    {
        // delete icon
        if ($category->icon && Storage::disk('public')->exists($category->icon)) {
            Storage::disk('public')->delete($category->icon);
        }

        $category->delete();

        return response()->json(['message' => 'Catégorie supprimée']);
    }
}
