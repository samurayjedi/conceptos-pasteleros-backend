<?php

namespace App\Models;

class Category
{
    public $id, $label, $slug, $created_at, $updated_at;

    public function toArray() {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'slug' => $this->slug,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    public function exchangeArray($piwi) {
        $this->id = is_array($piwi) ? $piwi['id'] : $piwi->id;
        $this->label = is_array($piwi) ? $piwi['label'] : $piwi->label;
        $this->slug = is_array($piwi) ? $piwi['slug'] : $piwi->slug;
        $this->created_at = is_array($piwi) ? $piwi['created_at'] : $piwi->created_at;
        $this->updated_at = is_array($piwi) ? $piwi['updated_at'] : $piwi->updated_at;
    }
}
