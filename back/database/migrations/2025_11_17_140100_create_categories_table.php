<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();

            $table->string('name', 100)->unique();       // Nom de la catégorie
            $table->string('icon')->nullable();          // Image stockée dans storage
            $table->text('description')->nullable();     // Description optionnelle

            // 🔥 Sous-catégories
            $table->foreignId('parent_id')
                  ->nullable()
                  ->constrained('categories')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
