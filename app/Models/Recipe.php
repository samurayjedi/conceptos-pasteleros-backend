<?php
namespace App\Models;
use App\Models\Category;
use App\Models\Preparation;

class Recipe {
    public $id, $cover, $name, $setup, $premium, $cost, $created_at, $updated_at;
    /**
     * @var array<Category>
     */
    public $categories = [];
    /**
     * @var array<Preparation>
     */
    public $preparations = [];

    public function toArray() {
        $categories = $this->categories;
        $preparations = $this->preparations;
    
        return [
            'id' => $this->id,
            'name' => $this->name,
            'cover' => $this->cover,
            'setup' => $this->setup,
            'premium' => $this->premium,
            'cost' => $this->cost,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'categories' => (function () use($categories) {
                $piwi = [];
                foreach ($categories as $category) {
                    $piwi[] = $category->toArray();
                }

                return $piwi;
            })(),
            'preparations' => (function () use($preparations) {
                $piwi = [];
                foreach ($preparations as $preparation) {
                    $piwi[] = $preparation->toArray();
                }

                return $piwi;
            })(),
      ];
    }

    public function exchangeArray($piwi) {
        $this->id = is_array($piwi) ? $piwi['id'] : $piwi->id;
        $this->name = is_array($piwi) ? $piwi['name'] : $piwi->name;
        $this->cover = is_array($piwi) ? $piwi['cover'] : $piwi->cover;
        $this->setup = is_array($piwi) ? $piwi['setup'] : $piwi->setup;
        $this->premium = is_array($piwi) ? $piwi['premium'] : $piwi->premium;
        $this->cost = is_array($piwi) ? $piwi['cost'] : $piwi->cost;
        $this->created_at = is_array($piwi) ? $piwi['created_at'] : $piwi->created_at;
        $this->updated_at = is_array($piwi) ? $piwi['updated_at'] : $piwi->updated_at;
        $this->categories = [];
        $categories = is_array($piwi) ? $piwi['categories'] : $piwi->categories;
        foreach ($categories as $category) {
            $cat = new Category;
            $cat->id = is_array($category) ? $category['id'] : $category->id;
            $cat->label = is_array($category) ? $category['label'] : $category->label;
            $cat->slug = is_array($category) ? $category['slug'] : $category->slug;
            $cat->created_at = is_array($category) ? $category['created_at'] : $category->created_at;
            $cat->updated_at = is_array($category) ? $category['updated_at'] : $category->updated_at;
            $this->categories[] = $cat;
        }
        $this->preparations = [];
        $preparations = is_array($piwi) ? $piwi['preparations'] : $piwi->preparations;
        foreach ($preparations as $preparation) {
            $prep = new Preparation;
            $prep->id = is_array($preparation) ? $preparation['id'] : $preparation->id;
            $prep->name = is_array($preparation) ? $preparation['name'] : $preparation->name;
            $prep->ingredients = is_array($preparation) ? $preparation['ingredients'] : $preparation->ingredients;
            $prep->instructions = is_array($preparation) ? $preparation['instructions'] : $preparation->instructions;
            $prep->id_recipe = is_array($preparation) ? $preparation['id_recipe'] : $preparation->id_recipe;
            $prep->created_at = is_array($preparation) ? $preparation['created_at'] : $preparation->created_at;
            $prep->updated_at = is_array($preparation) ? $preparation['updated_at'] : $preparation->updated_at;
            $this->preparations[] = $prep;
        }
    }
}