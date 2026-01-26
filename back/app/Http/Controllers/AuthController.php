<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // ================= REGISTER =================
    public function register(Request $request)
    {
        $request->validate(
            [
                'username' => 'required|string|max:255|unique:users,name',
                'phone'    => 'required|string|max:20|unique:users,phone',
                'email'    => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
            ],
            [
                'username.unique' => 'Ce nom est déjà utilisé.',
                'email.unique'    => 'Cet email est déjà utilisé.',
                'phone.unique'    => 'Ce numéro de téléphone est déjà utilisé.',
            ]
        );

        try {
            $user = User::create([
                'name'     => $request->username,
                'email'    => $request->email,
                'phone'    => $request->phone,
                'password' => Hash::make($request->password),
            ]);

            // 🔥 Auto login après inscription
            $token = $user->createToken('api-token')->plainTextToken;

            // Admin ou client
            $isAdmin = $user->email === 'contact@sinmat.ma';

            return response()->json([
                'token'    => $token,
                'redirect' => $isAdmin ? '/dashboard-admin' : '/dashboard-client',
                'user'     => $user,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur lors de la création du compte',
                'error'   => $e->getMessage(),   // 🔥 DEBUG
            ], 500);
        }
    }

    // ================= LOGIN (EMAIL OU PHONE) =================
    public function login(Request $request)
    {
        $request->validate([
            'password' => 'required',
        ]);

        // 🔥 Détecter email ou téléphone
        if ($request->filled('email')) {
            $user = User::where('email', $request->email)->first();
        } elseif ($request->filled('phone')) {
            $user = User::where('phone', $request->phone)->first();
        } else {
            return response()->json([
                'message' => 'Veuillez entrer un email ou un numéro de téléphone'
            ], 422);
        }

        // Vérification mot de passe
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email / téléphone ou mot de passe incorrect'
            ], 401);
        }

        // Générer token
        $token = $user->createToken('api-token')->plainTextToken;

        // Vérifie admin
        $isAdmin = $user->email === 'contact@sinmat.ma';

        return response()->json([
            'token'    => $token,
            'redirect' => $isAdmin ? '/dashboard-admin' : '/dashboard-client',
            'user'     => $user,
        ], 200);
    }

    // ================= USERS =================
    public function index()
    {
        return response()->json(User::latest()->get());
    }

    public function show(User $user)
    {
        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update($request->only(['name', 'email', 'phone']));

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
    }

    // ================= PERMISSIONS =================
    public function permissions(User $user)
    {
        return response()->json($user->permissions);
    }

    public function attachPermission(Request $request, User $user)
    {
        $user->permissions()->attach($request->permission_id);
        return response()->json(['message' => 'Permission ajoutée']);
    }

    public function detachPermission(Request $request, User $user)
    {
        $user->permissions()->detach($request->permission_id);
        return response()->json(['message' => 'Permission retirée']);
    }

    // ================= CREATE USER ADMIN =================
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            ...$validated,
            'password' => Hash::make(Str::random(8)),
        ]);

        return response()->json($user, 201);
    }

    // ================= LOGOUT =================
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }
}
