<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        if (!$request->hasFile('image')) {
            return response()->json(['error' => 'Aucun fichier image reçu.'], 400);
        }

        $path = $request->file('image')->store('blog_images', 'public');

        return response()->json([
            'url' => asset('storage/' . $path),
        ]);
    }
}
