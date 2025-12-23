<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLocationProductsTable extends Migration
{
    public function up()
    {
       Schema::create('location_products', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('description')->nullable();
    $table->decimal('price_per_day', 8, 2);
    $table->string('image')->nullable();
    $table->foreignId('location_category_id')->constrained()->onDelete('cascade');
    $table->enum('status', ['disponible', 'sur_commande', 'non_disponible'])->default('disponible');
    $table->timestamps();
});

    }

    public function down()
    {
        Schema::dropIfExists('location_products');
    }
} 