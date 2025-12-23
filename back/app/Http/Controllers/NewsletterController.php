<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NewsletterController extends Controller
{
     public function store(Request $request)
    {
        $request->validate([
            'email' => 'nullable|email|unique:newsletter_subscribers,email',
            'phone' => 'nullable|string|max:20|unique:newsletter_subscribers,phone',
        ]);

        if (!$request->email && !$request->phone) {
            return response()->json([
                'message' => 'Email ou numéro de téléphone requis.'
            ], 422);
        }

        $subscriber = NewsletterSubscriber::create([
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'message' => 'Inscription réussie',
            'data' => $subscriber
        ], 201);
    }
    public function statsMensuelles()
{
    $data = NewsletterSubscriber::select(
        DB::raw("DATE_FORMAT(created_at, '%b') as mois"),
        DB::raw("COUNT(*) as total")
    )
    ->groupBy(DB::raw("DATE_FORMAT(created_at, '%b')"))
    ->orderBy(DB::raw("MIN(created_at)"))
    ->get();

    return response()->json($data);
}
public function index()
{
    return response()->json(NewsletterSubscriber::latest()->get());
}
public function destroy($id)
{
    $subscriber = NewsletterSubscriber::find($id);

    if (! $subscriber) {
        return response()->json(['message' => 'Abonné introuvable'], 404);
    }

    $subscriber->delete();

    return response()->json(['message' => 'Abonné supprimé avec succès'], 200);
}
public function update(Request $request, $id)
{
    $subscriber = NewsletterSubscriber::find($id);
    if (! $subscriber) {
        return response()->json(['message' => 'Abonné introuvable'], 404);
    }

    $request->validate([
        'email' => 'nullable|email|unique:newsletter_subscribers,email,' . $id,
        'phone' => 'nullable|string|max:20|unique:newsletter_subscribers,phone,' . $id,
    ]);

    $subscriber->update($request->all());

    return response()->json(['message' => 'Abonné mis à jour']);
}
public function isSubscribed(Request $request)
{
    $email = $request->user()->email;

    $exists = NewsletterSubscriber::where('email', $email)->exists();

    return response()->json([
        'subscribed' => $exists
    ]);
}

}

