<?php

namespace App\Http\Controllers;

use App\Models\RentalRequest;
use Illuminate\Http\Request;

class RentalRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index()
{
    return RentalRequest::with('produit')->latest()->get();
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
public function store(Request $request)
{
    $data = $request->validate([
        'product_id'     => 'required|exists:produits_location,id',   // 🔥 CORRIGÉ
        'full_name'      => 'required|string|max:255',
        'phone'          => ['required', 'regex:/^(06|07)\d{8}$/'],
        'city'           => 'required|string|max:255',
        'address'        => 'required|string|max:500',
        'notes'          => 'nullable|string',

        'rental_start'   => 'required|date',
        'rental_end'     => 'required|date|after_or_equal:rental_start',

        'delivery_date' => 'required|date|after_or_equal:rental_start',
        'delivery_time' => 'required|in:matin,apres-midi,soir',

        'days_count'     => 'required|integer|min:1',
        'price_per_day' => 'required|numeric|min:0',
        'delivery_fee'  => 'required|numeric|min:0',
        'total_price'   => 'required|numeric|min:0',
    ]);

    $rental = RentalRequest::create($data);

    return response()->json([
        'success' => true,
        'message' => 'Demande de location enregistrée avec succès',
        'data' => $rental
    ], 201);
}



    /**
     * Display the specified resource.
     */
    public function show(RentalRequest $rentalRequest)
    {
        //
    }

   

    /**
     * Update the specified resource in storage.
     */
 public function update(Request $request, $id)
{
    $rentalRequest = RentalRequest::findOrFail($id); // ✅ on le récupère manuellement

    $data = $request->validate([
        'full_name' => 'required|string',
        'phone' => 'required|string',
        'city' => 'required|string',
        'address' => 'required|string',
        'notes' => 'nullable|string',
        'delivery_date' => 'required|date',
        'delivery_time' => 'required|string',
        'rental_start' => 'sometimes|date',
        'rental_end' => 'sometimes|date',
        'price_per_day' => 'sometimes|numeric',
        'delivery_fee' => 'sometimes|numeric',
        'days_count' => 'sometimes|numeric',
        'total_price' => 'sometimes|numeric',
    ]);

    $rentalRequest->update($data);

    return response()->json([
        'success' => true,
        'message' => 'Demande mise à jour.',
        'data' => $rentalRequest,
    ]);
}

    /**
     * Remove the specified resource from storage.
     */
   public function destroy($id)
{
    $rental = RentalRequest::findOrFail($id);
    $rental->delete();

    return response()->json([
        'success' => true,
        'message' => 'Demande supprimée'
    ]);
}


}
