<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLocationCategoriesTable extends Migration
{
    public function up()
    {
        Schema::create('location_categories', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('value')->unique(); // ex: excavation, drilling...
            $table->string('icon')->nullable(); // peut contenir 'Zap', 'Wrench', etc.
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('location_categories');
    }
}
