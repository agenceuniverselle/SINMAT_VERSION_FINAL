<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->string('name');

            // 🔥 Relation correcte vers catégories
            $table->unsignedBigInteger('category_id');

            $table->decimal('purchase_price', 10, 2);
            $table->decimal('sale_price', 10, 2);
            $table->integer('quantity')->default(0);
            $table->text('description')->nullable();

            // Images
            $table->string('image')->nullable();
            $table->string('hover_image')->nullable();
            $table->json('images')->nullable();
            $table->json('additional_info')->nullable();
            $table->boolean('in_stock')->default(true);

            $table->timestamps();

            // 🔥 Foreign Key
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
