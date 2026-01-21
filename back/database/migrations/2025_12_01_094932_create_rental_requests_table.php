<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('rental_requests', function (Blueprint $table) {
        $table->id();
        $table->foreignId('product_id')->constrained('location_products');
        $table->string('full_name');
        $table->string('phone');
        $table->string('city');
        $table->string('address');
        $table->text('notes')->nullable();
        $table->date('rental_start');
        $table->date('rental_end');
        $table->date('delivery_date');
        $table->string('delivery_time');
        $table->integer('days_count');
        $table->integer('price_per_day');
        $table->integer('delivery_fee')->default(0);
        $table->integer('total_price');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rental_requests');
    }
};
