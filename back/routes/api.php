<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ✅ Contrôleurs
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\LocationCategoryController;
use App\Http\Controllers\LocationProductController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\RentalRequestController;

/*
|--------------------------------------------------------------------------
| 🔗 ROUTES API PRINCIPALES
|--------------------------------------------------------------------------
| Toutes les routes de l’API passent par ici (/api/*)
| Regroupe les routes par entité : Produits, Catégories, Blog, Auth, etc.
*/

/*
|--------------------------------------------------------------------------
| 🧪 TEST DE CONNEXION À L’API
|--------------------------------------------------------------------------
*/
Route::get('/ping', fn () => response()->json(['status' => 'API OK']));

/*
|--------------------------------------------------------------------------
| 🔐 UTILISATEUR AUTHENTIFIÉ (si Sanctum activé)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->get('/user', fn (Request $request) => $request->user());

/*
|--------------------------------------------------------------------------
| 🛍️ PRODUITS
|--------------------------------------------------------------------------
*/
Route::get('/produits/latest', [ProduitController::class, 'latest']);
Route::get('/produits/stats/categorie', [ProduitController::class, 'statsParCategoriePrincipale']);
Route::apiResource('produits', ProduitController::class);

/*
|--------------------------------------------------------------------------
| 📦 CATÉGORIES PRODUITS
|--------------------------------------------------------------------------
*/
Route::apiResource('categories', CategoryController::class)->only([
    'index', 'store', 'show', 'update', 'destroy'
]);

/*
|--------------------------------------------------------------------------
| 📦 CATÉGORIES LOCATION (Locations de produits)
|--------------------------------------------------------------------------
*/
Route::apiResource('categories_location', LocationCategoryController::class)->only([
    'index', 'store', 'show', 'update', 'destroy'
]);

/*
|--------------------------------------------------------------------------
| 🏷️ PRODUITS LOCATION (Produits à louer)
|--------------------------------------------------------------------------
*/
Route::apiResource('produits_location', LocationProductController::class)->only([
    'index', 'store', 'show', 'update', 'destroy'
]);

/*
|--------------------------------------------------------------------------
| 📰 BLOG
|--------------------------------------------------------------------------
*/
Route::apiResource('blog-posts', BlogPostController::class)->only([
    'index', 'store', 'show', 'update', 'destroy'
]);

/*
|--------------------------------------------------------------------------
| ☁️ UPLOAD (images, fichiers)
|--------------------------------------------------------------------------
*/
Route::post('/upload', [UploadController::class, 'store']);

/*
|--------------------------------------------------------------------------
| 📨 NEWSLETTER
|--------------------------------------------------------------------------
*/
Route::post('/newsletter', [NewsletterController::class, 'store']);
Route::get('/newsletter/stats', [NewsletterController::class, 'statsMensuelles']);
Route::get('/newsletter-subscribers', [NewsletterController::class, 'index']);
Route::put('/newsletter-subscribers/{id}', [NewsletterController::class, 'update']);
Route::delete('/newsletter-subscribers/{id}', [NewsletterController::class, 'destroy']);
Route::middleware('auth:sanctum')->get('/newsletter/is-subscribed', [NewsletterController::class, 'isSubscribed']);

/*
|--------------------------------------------------------------------------
| 💬 MESSAGES DE CONTACT
|--------------------------------------------------------------------------
*/
Route::post('/contact', [ContactMessageController::class, 'store']);
Route::get('/messages/stats', [ContactMessageController::class, 'statsParJour']);
Route::get('/contact-messages', [ContactMessageController::class, 'index']);
Route::put('/contact-messages/{id}', [ContactMessageController::class, 'update']);
Route::delete('/contact-messages/{id}', [ContactMessageController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 👤 AUTHENTIFICATION
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/users', [AuthController::class, 'index']); 
Route::get('/users/{user}/permissions', [AuthController::class, 'permissions']);
Route::post('/users/{user}/permissions', [AuthController::class, 'attachPermission']);
Route::delete('/users/{user}/permissions', [AuthController::class, 'detachPermission']);
Route::get('/users/{user}', [AuthController::class, 'show']);
Route::put('/users/{user}', [AuthController::class, 'update']);
Route::delete('/users/{user}', [AuthController::class, 'destroy']);
Route::post('/users', [AuthController::class, 'store']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

/*
|--------------------------------------------------------------------------
| 👥 UTILISATEURS & RÔLES
|--------------------------------------------------------------------------
*/
Route::get('/permissions', [PermissionController::class, 'index']);
Route::post('/permissions', [PermissionController::class, 'store']);
Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy']);
Route::put('/permissions/{permission}', [PermissionController::class, 'update']);

Route::get('/commandes', [CommandeController::class, 'index']);
Route::post('/commandes', [CommandeController::class, 'store']);
Route::put('/commandes/{id}', [CommandeController::class, 'update']);
Route::delete('/commandes/{id}', [CommandeController::class, 'destroy']);
Route::middleware('auth:sanctum')->get('/mes-commandes', [CommandeController::class, 'mesCommandes']);

Route::post('/rental-requests', [RentalRequestController::class, 'store']);
Route::get('/rental-requests', [RentalRequestController::class, 'index']);
Route::put('/rental-requests/{id}', [RentalRequestController::class, 'update']);
Route::delete('/rental-requests/{id}', [RentalRequestController::class, 'destroy']);