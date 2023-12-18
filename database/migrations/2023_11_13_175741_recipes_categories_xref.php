<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RecipesCategoriesXref extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('recipe_categories_xref', function (Blueprint $table) {
            $table->id();
            $table->integer('id_recipe')->unsigned();
            $table->integer('id_category')->unsigned();
            $table->timestamps();

            // $table->foreign('id_recipe')->references('id')->on('recipes');
            // $table->foreign('id_category')->references('id')->on('categories');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('personal_access_tokens');
    }
}
