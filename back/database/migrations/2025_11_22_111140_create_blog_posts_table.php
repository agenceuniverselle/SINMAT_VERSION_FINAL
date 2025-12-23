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
    Schema::create('blog_posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->longText('excerpt');
        $table->longText('content');
        $table->string('image')->nullable(); // URL ou path
        $table->string('category');
        $table->string('author');
        $table->string('read_time');
        $table->timestamp('published_at')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
