<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContactMessageController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => [
                'required',
                'email',
                'max:255',
                function ($attribute, $value, $fail) {
                    if (!str_ends_with(strtolower($value), '@gmail.com')) {
                        $fail('L’adresse email doit se terminer par @gmail.com.');
                    }
                }
            ],
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        ContactMessage::create($validated);

        return response()->json([
            'message' => 'Message envoyé avec succès !',
        ], 201);
    }
    public function statsParJour()
    {
    $data = ContactMessage::select(
        DB::raw("DAYNAME(created_at) as jour"),
        DB::raw("COUNT(*) as total")
    )
    ->groupBy(DB::raw("DAYNAME(created_at)"))
    ->orderBy(DB::raw("MIN(created_at)"))
    ->get();

    // Convertir en français si besoin (optionnel)
    $joursFrancais = [
        'Monday'    => 'Lun',
        'Tuesday'   => 'Mar',
        'Wednesday' => 'Mer',
        'Thursday'  => 'Jeu',
        'Friday'    => 'Ven',
        'Saturday'  => 'Sam',
        'Sunday'    => 'Dim',
    ];

    $formatted = $data->map(function ($item) use ($joursFrancais) {
        return [
            'name'     => $joursFrancais[$item->jour] ?? $item->jour,
            'messages' => $item->total,
        ];
    });

    return response()->json($formatted);
}
public function index()
{
    return response()->json(ContactMessage::latest()->get());
}

public function destroy($id)
{
    $message = ContactMessage::find($id);

    if (! $message) {
        return response()->json(['message' => 'Message introuvable'], 404);
    }

    $message->delete();

    return response()->json(['message' => 'Message supprimé avec succès'], 200);
}
public function update(Request $request, $id)
{
    $message = ContactMessage::find($id);
    if (! $message) {
        return response()->json(['message' => 'Message introuvable'], 404);
    }

    $request->validate([
        'name'    => 'required|string|max:255',
        'email'   => 'required|email|max:255',
        'subject' => 'nullable|string|max:255',
        'message' => 'required|string',
    ]);

    $message->update($request->all());

    return response()->json(['message' => 'Message mis à jour']);
}

}
