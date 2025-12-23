<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    /**
     * Liste toutes les permissions
     */
    public function index()
    {
        return response()->json(Permission::all());
    }

    /**
     * Crée une nouvelle permission
     */
 public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'code' => 'required|string|max:100|unique:permissions,code',
        'category' => 'nullable|string|max:100',
    ]);

    $categoryInput = trim($request->input('category', ''));
    $validated['category'] = $categoryInput !== '' ? $categoryInput : 'Autres';

    $permission = Permission::create($validated);

    return response()->json([
        'message' => 'Permission créée avec succès.',
        'data' => $permission
    ], 201);
}

    /**
     * Supprime une permission
     */
    public function destroy(Permission $permission)
    {
        $permission->delete();

        return response()->json([
            'message' => 'Permission supprimée avec succès.'
        ]);
    }
    /**
 * Met à jour une permission
 */
public function update(Request $request, Permission $permission)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'code' => 'required|string|max:100|unique:permissions,code,' . $permission->id,
        'category' => 'nullable|string|max:100',
    ]);

    $permission->update([
        'name' => $validated['name'],
        'code' => $validated['code'],
        'category' => $validated['category'] ?? 'Autres',
    ]);

    return response()->json([
        'message' => 'Permission mise à jour avec succès.',
        'data' => $permission,
    ]);
}

}
