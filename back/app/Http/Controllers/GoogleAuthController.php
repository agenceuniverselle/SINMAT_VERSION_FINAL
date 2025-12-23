<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Hash;

class GoogleAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }


public function handleGoogleCallback()
{
    $googleUser = Socialite::driver('google')->stateless()->user();

    $user = User::updateOrCreate(
        ['email' => $googleUser->getEmail()],
        [
            'name' => $googleUser->getName(),
            'google_id' => $googleUser->getId(),
            'email' => $googleUser->getEmail(),
            'password' => Hash::make(Str::random(16)), // ✅ mot de passe factice hashé
            'remember_token' => Str::random(60),
        ]
    );

    $token = $user->createToken('api-token')->plainTextToken;

    // ✅ Redirige vers le frontend avec le token
    return redirect("http://localhost:8080?token={$token}");
}

}
