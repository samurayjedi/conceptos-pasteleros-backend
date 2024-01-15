<?php

namespace App\Models;
use Illuminate\Support\Facades\DB;
use App\Models\Recipe;
use Illuminate\Database\QueryException;
use PiwiLibs\PiwiDB;

class Recipes extends PiwiDB
{
    protected $table = 'recipes';

    /**
     * @return int
     */
    public static function insert(Recipe $recipe) {
        $id = 0;
        try {
            DB::beginTransaction();
            DB::insert('INSERT INTO recipes (cover,name,setup,premium,cost,created_at,updated_at) VALUES(?,?,?,?,?,?,?)', [
                $recipe->cover,
                $recipe->name,
                $recipe->setup,
                $recipe->premium,
                $recipe->cost,
                date('Y-m-d H:i:s'),
                date('Y-m-d H:i:s'),
            ]);
            $id = DB::getPdo()->lastInsertId();
            foreach ($recipe->categories as $category) {
                DB::insert('INSERT INTO recipe_categories_xref(id_recipe,id_category,created_at,updated_at) VALUES(?,?,?,?)', [
                    $id,
                    $category->id,
                    date('Y-m-d H:i:s'),
                    date('Y-m-d H:i:s'),
                ]);
            }
            foreach ($recipe->preparations as $preparation) {
                DB::insert('INSERT INTO preparations(name, ingredients, instructions, id_recipe,created_at,updated_at) VALUES(?,?,?,?,?,?)', [
                    $preparation->name,
                    $preparation->ingredients,
                    $preparation->instructions,
                    $id,
                    date('Y-m-d H:i:s'),
                    date('Y-m-d H:i:s'),
                ]);
            }
            DB::commit();
        } catch(QueryException $e) {
            DB::rollBack();
            throw new \Exception('Ooops, a error has ocurred while inserting the new recipe: ' . $e->getMessage());
        }

        return $id;
    }

    public static function update(Recipe $recipe) {
        try {
            DB::beginTransaction();
            DB::update('UPDATE recipes SET cover=?,name=?,setup=?,premium=?,cost=?,updated_at=? WHERE id=?', [
                $recipe->cover,
                $recipe->name,
                $recipe->setup,
                $recipe->premium,
                $recipe->cost,
                date('Y-m-d H:i:s'),
                $recipe->id,
            ]);
            DB::delete('delete from recipe_categories_xref where id_recipe=?', [$recipe->id]);
            foreach ($recipe->categories as $category) {
                DB::insert('INSERT INTO recipe_categories_xref(id_recipe,id_category,created_at,updated_at) VALUES(?,?,?,?)', [
                    $recipe->id,
                    $category->id,
                    $recipe->created_at,
                    date('Y-m-d H:i:s'),
                ]);
            }
            DB::delete('delete from preparations where id_recipe=?', [$recipe->id]);
            foreach ($recipe->preparations as $preparation) {
                DB::update('INSERT INTO preparations (name,ingredients,instructions,id_recipe,created_at,updated_at) VALUES(?,?,?,?,?,?)', [
                    $preparation->name,
                    $preparation->ingredients,
                    $preparation->instructions,
                    $preparation->id_recipe,
                    $recipe->created_at,
                    date('Y-m-d H:i:s'),
                ]);
            }
            DB::commit();
        } catch(QueryException $e) {
            DB::rollBack();
            throw new \Exception('Ooops, a error has ocurred while updating the recipe: ' . $e->getMessage());
        }
    }

    public static function delete(Recipe $recipe) {
        try {
            DB::beginTransaction();
            DB::delete('delete from recipe_categories_xref where id_recipe=?', [$recipe->id]);
            foreach ($recipe->preparations as $preparation) {
              DB::delete('DELETE FROM preparations WHERE id_recipe=?', [$recipe->id]);
            }
            DB::delete('DELETE FROM recipes WHERE id=?', [$recipe->id]);
            DB::commit();
        } catch(QueryException $e) {
            DB::rollBack();
            throw new \Exception('Ooops, a error has ocurred while deleting the recipe: ' . $e->getMessage());
        }
    }


    /**
     * @return int
     */
    public static function count() {
        $query = DB::select('select count(id) as count from recipes');
        $count = array_shift($query)->count;

        return $count;
    }

    /**
     * @return Recipes
     */
    public static function select() {
        return new Recipes;
    }

    /**
     * @return array<Recipe>
     */
    public function get() {
        $query = parent::get();
        $recipes = [];
        foreach ($query as $recipe) {
            $recipe->categories = DB::select(
                'select * from recipe_categories_xref inner join categories on categories.id=recipe_categories_xref.id_category where recipe_categories_xref.id_recipe=?',
                [$recipe->id]
            );
            $recipe->preparations = DB::select('select * from preparations where id_recipe=?', [$recipe->id]);
            $recipeModel = new Recipe;
            $recipeModel->exchangeArray($recipe);
            $recipes[] = $recipeModel;
        }

        return $recipes;
    }
}
