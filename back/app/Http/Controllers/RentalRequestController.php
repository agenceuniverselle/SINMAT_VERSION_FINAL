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
        'product_id' => 'required|exists:produits_location,id',
        'full_name' => 'required|string',
        'phone' => 'required|string',
        'city' => 'required|string',
        'address' => 'required|string',
        'notes' => 'nullable|string',
        'rental_start' => 'required|date',
        'rental_end' => 'required|date',
        'delivery_date' => 'required|date',
        'delivery_time' => 'required|string',
        'days_count' => 'required|integer',
        'price_per_day' => 'required|numeric',
        'delivery_fee' => 'required|numeric',
        'total_price' => 'required|numeric',
    ]);

    // 🔥 Est-ce que tu fais bien ça ?
    $rental = \App\Models\RentalRequest::create($data);

    return response()->json([
        'success' => true,
        'message' => 'Demande enregistrée',
        'data' => $rental
    ]);
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
