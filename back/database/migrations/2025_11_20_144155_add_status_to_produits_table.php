<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('produits', function (Blueprint $table) {
            $table->enum('status', ['promotion', 'nouveaute'])
                  ->nullable()
                  ->after('quantity');
        });
    }

    public function down()
    {
        Schema::table('produits', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
