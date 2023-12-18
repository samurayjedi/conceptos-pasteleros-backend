<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class Categories extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'label' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
        ]);
    
        $category = new Category();
        $category->label = $request->get('label');
        $category->slug = $request->get('slug');
        $category->save();
        
        return back();
      }
}
