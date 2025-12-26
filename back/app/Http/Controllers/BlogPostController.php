<?php
namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // ✅ Ajout ici

class BlogPostController extends Controller
{
    public function index()
    {
        return BlogPost::latest()->get();
    }


    public function store(Request $request)
{
    Log::info('Données reçues:', $request->all());

    $validated = $request->validate([
        'title'     => 'required|string|max:255',
        'excerpt'   => 'required|string',
        'content'   => 'required|string',
        'category'  => 'required|string|max:100',
        'author'    => 'required|string|max:100',
        'read_time' => 'required|string|max:50',
        'image'     => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
    ]);

    if ($request->hasFile('image')) {
        $validated['image'] = $request
            ->file('image')
            ->store('blog_images', 'public');
    }

    $validated['published_at'] = now();

    $post = BlogPost::create($validated);

    return response()->json($post, 201);
}

public function update(Request $request, BlogPost $blogPost)
{
    Log::info('Données reçues pour update:', $request->all());

    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'excerpt' => 'required|string',
        'content' => 'required|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        'category' => 'required|string|max:100',
        'author' => 'required|string|max:100',
        'read_time' => 'required|string|max:50', 
    ]);

    // ✅ Si nouvelle image, on remplace l’ancienne
    if ($request->hasFile('image')) {
        // Supprimer l'ancienne image s'il y en a une
        if ($blogPost->image) {
            \Storage::disk('public')->delete($blogPost->image);
        }

        $path = $request->file('image')->store('blog_images', 'public');
        $validated['image'] = $path;
    }

    // ✅ Si on a demandé de supprimer l’image
    if ($request->input('remove_image') === '1') {
        if ($blogPost->image) {
            \Storage::disk('public')->delete($blogPost->image);
        }
        $validated['image'] = null;
    }

    try {
        $blogPost->update($validated);
        return response()->json($blogPost, 200);
    } catch (\Exception $e) {
        Log::error('Erreur update article:', ['error' => $e->getMessage()]);
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    public function show(BlogPost $blogPost)
    {
        return $blogPost;
    }

    public function destroy(BlogPost $blogPost)
    {
        $blogPost->delete();
        return response()->json(null, 204);
    }
}
