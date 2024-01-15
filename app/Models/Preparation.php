<?php
namespace App\Models;

class Preparation {
    public $id, $name, $ingredients, $instructions, $id_recipe, $created_at, $updated_at;

    public function toArray() {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'ingredients' => json_decode($this->ingredients),
            'instructions' => $this->instructions,
            'id_recipe' => $this->id_recipe,
            'create_at' => $this->created_at,
            'update_at' => $this->updated_at,
        ];
    }
}