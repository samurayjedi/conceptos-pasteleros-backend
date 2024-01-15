<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Recipes;
use App\Models\Recipe;
use App\Models\Category;
use App\Models\Preparation;
use App\Models\Categories;



class RecipesController extends Controller
{
  private function piwiValidate() {
    request()->validate([
      'name' => 'required|string|max:255',
      'categories' => 'required|array',
      // 'setup' => 'required',
      'preparations' => 'required|array|min:1',
      'preparations.*.name' => 'required|string|max:255',
      'preparations.*.ingredients' => 'required|array|min:1',
      'preparations.*.ingredients.*.name' => 'required|string|max:255',
      'preparations.*.ingredients.*.weight' => 'required|numeric',
      'preparations.*.instructions' => 'required',
      'cost' => 'required_if:is_premium,==,true|numeric',
    ]);
  }

  public function table(int $page = 0, int $rows = 5) {
    $count = Recipes::count();
    // 
    $pages = intval($count / $rows);
    if ($count % $rows) {
      $pages++;
    }
    // 
    $cPage = $page;
    if ($cPage < 0) { 
      return redirect()->to(route('new-recipe'));
    } else if ($cPage > $pages - 1) {
      return redirect()->to(route('recipes', ['page' => $pages - 1, 'rows' => $rows]));
    }

    $recipes = Recipes::select()
      ->limit($rows)
      ->offset($cPage)
      ->get();
    $array = [];
    foreach ($recipes as $recipe) {
      $array[] = $recipe->toArray();
    }

    return Inertia::render('Recipes', [
      'recipes' => $array,
      'page' => $page,
      'count' => $count,
      'rows' => $rows,
    ]);
  }

  public function newForm() {
    $query = Categories::select()->get();
    $categories = [];
    foreach ($query as $data) {
      $category = new Category;
      $category->exchangeArray($data);
      $categories[] = $category->toArray();
    }

    return Inertia::render('Recipes/NewForm', [
      'categories' => $categories,
    ]);
  }

  public function updateForm(string $id) {
    $query = Recipes::select()
      ->where('id=?', [$id])
      ->get();
    if (!count($query)) {
      throw new \Exception("Recipe #$id not found!!!");
    }
    $recipe = $query[0];

    $queryCategories = Categories::select()->get();
    $categories = [];
    foreach ($queryCategories as $data) {
      $category = new Category;
      $category->exchangeArray($data);
      $categories[] = $category->toArray();
    }

    return Inertia::render('Recipes/UpdateForm', [
      'categories' => $categories,
      'recipe' => $recipe->toArray(),
    ]);
  }

  public function store(Request $request) {
    $this->piwiValidate();
    $request->validate([ 'cover' => 'required|mimes:pdf,jpg,bmp,png' ]);
    $cover = $request->file('cover');
    $filename = date('YmdHi').$cover->getClientOriginalName();
    $cover->move(public_path('storage/uploads'), $filename);
    $recipe = new Recipe;
    $recipe->cover = $filename;
    $recipe->name = $request->get('name');
    $recipe->setup = $request->get('setup');
    $recipe->premium = $request->get('is_premium') === 'true' ? 1 : 0;
    $recipe->cost = $request->get('cost');
    foreach ($request->get('categories') as $categoryId) {
      $category = new Category;
      $category->id = $categoryId;
      $recipe->categories[] = $category;
    }
    foreach ($request->get('preparations') as $preparationData) {
      $preparation = new Preparation;
      $preparation->name = $preparationData['name'];
      $preparation->ingredients = json_encode($preparationData['ingredients']);
      $preparation->instructions = $preparationData['instructions'];
      $recipe->preparations[] = $preparation;
    }
    $id = Recipes::insert($recipe);
    
    return Inertia::render('Dashboard', [
      'snackbar' => [
        'message' => 'The preparation has been saved whith the id ' . $id,
        'severity' => 'success',
      ],
    ]);
  }

  public function update(int $id) {
    $this->piwiValidate();
    $cover = request()->file('cover');
    if ($cover) {
      request()->validate([ 'cover' => 'mimes:pdf,jpg,bmp,png' ]);
      $filename = date('YmdHi').$cover->getClientOriginalName();
      $cover->move(public_path('storage/uploads'), $filename);
    }
    $query = Recipes::select()->where('id=?', [$id])->get();
    if (!count($query)) {
      throw new \Exception("Recipe #$id not found!!!");
    }
    $recipe = new Recipe;
    $recipe->exchangeArray($query[0]);
    $recipe->name = request()->get('name');
    if ($cover) {
      $recipe->cover = $filename;
    }
    $recipe->setup = request()->get('setup');
    $recipe->premium = request()->get('is_premium');
    $recipe->cost = request()->get('cost');
    $recipe->categories = [];
    foreach (request()->get('categories') as $categoryId) {
      $category = new Category;
      $category->id = $categoryId;
      $recipe->categories[] = $category;
    }
    $recipe->preparations = [];
    foreach (request()->get('preparations', []) as $data) {
      $preparation = new Preparation;
      $preparation->name = $data['name'];
      $preparation->ingredients = json_encode($data['ingredients']);
      $preparation->instructions = $data['instructions'];
      $preparation->id_recipe = $id;
      $recipe->preparations[] = $preparation;
    }
    Recipes::update($recipe);

    return Inertia::render('Dashboard', [
      'snackbar' => [
        'message' => 'The recipe has been updated.',
        'severity' => 'success',
      ],
    ]);
  }

  public function delete(int $id) {
    $query = Recipes::select()->where('id=?', [$id])->get();
    if (!count($query)) {
      throw new \Exception("Recipe #$id not found!!!");
    }
    $recipe = $query[0];
    Recipes::delete($recipe);

    return back();
  }
}
