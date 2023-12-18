<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Recipe;
use App\Models\RecipeCategoryXref;
use App\Models\Preparation;
use Illuminate\Support\Facades\DB;



class Recipes extends Controller
{
  private function recipe_data($recipe) {
    /** Select categories */
    $categoriesQuery = DB::select(
      'select * from recipe_categories_xref inner join categories on categories.id=recipe_categories_xref.id_category where recipe_categories_xref.id_recipe=?',
      [$recipe->id]
    );
    $categories = [];
    foreach ($categoriesQuery as $category) {
      $categories[] = [
        'id' => $category->id_category,
        'label' => $category->label,
        'slug' => $category->slug,
      ];
    }
    /** Select preparations */
    $preparationsQuery = DB::select('select * from preparations where id_recipe=?', [$recipe->id]);
    $preparations = [];
    foreach ($preparationsQuery as $preparation) {
      $preparations[] = [
        'id' => $preparation->id,
        'name' =>$preparation->name,
        'ingredients' => json_decode($preparation->ingredients),
        'instructions' => $preparation->instructions,
      ];
    }
    /** Finally, sort into a array */
    return [
      'id' => $recipe->id,
      'name' => $recipe->name,
      'cover' => $recipe->cover,
      'setup' => $recipe->setup,
      'premium' => $recipe->premium,
      'cost' => $recipe->cost,
      'created_at' => $recipe->created_at,
      'categories' => $categories,
      'preparations' => $preparations,
    ];
  }

  private function get_categories() {
    $categories = DB::select('select * from categories');
    $data = [];
    foreach ($categories as $category) {
      $data[$category->id] = $category->label;
    }

    return $data;
  }

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
    $query = DB::select('select count(id) as count from recipes');
    $count = array_shift($query)->count;
    // 
    $pages = intval($count / $rows);
    if ($count % $rows) {
      $pages++;
    }
    // 
    $cPage = $page;
    if ($cPage < 0) {
      return redirect()->to('recipes');
    } else if ($cPage > $pages - 1) {
      return redirect()->to(route('recipes', ['page' => $pages - 1, 'rows' => $rows]));
    }
    //
    $query = DB::select(
      'select * from recipes order by id desc limit ?,?',
      [$cPage * $rows, $rows]
    );
    $recipes = [];
    foreach ($query as $recipe) {
      $recipes[] = $this->recipe_data($recipe);
    }

    return Inertia::render('Recipes', [
      'recipes' => $recipes,
      'page' => $page,
      'count' => $count,
      'rows' => $rows,
    ]);
  }

  public function newForm() {
    return Inertia::render('Recipes/NewForm', [
      'categories' => $this->get_categories(),
    ]);
  }

  public function updateForm(string $id) {
    $query = DB::select('select * from recipes where id=:id', ['id' => $id]);
    if (!count($query)) {
      throw new \Exception("Recipe #$id not found!!!");
    }
    $recipe = array_shift($query);

    return Inertia::render('Recipes/UpdateForm', [
      'categories' => $this->get_categories(),
      'recipe' => $this->recipe_data($recipe)
    ]);
  }

  public function store(Request $request) {
    $this->piwiValidate();
    $request->validate([ 'cover' => 'required|mimes:pdf,jpg,bmp,png' ]);
    $cover = $request->file('cover');
    $filename = date('YmdHi').$cover->getClientOriginalName();
    $cover->move(public_path('storage/uploads'), $filename);
    $recipe = new Recipe();
    $recipe->cover = $filename;
    $recipe->name = $request->get('name');
    $recipe->setup = $request->get('setup');
    $recipe->premium = $request->get('is_premium') === 'true' ? 1 : 0;
    $recipe->cost = $request->get('cost');
    $recipe->save();

    foreach ($request->get('categories') as $categoryId) {
      $xref = new RecipeCategoryXref();
      $xref->id_recipe = $recipe->id;
      $xref->id_category = $categoryId;
      $xref->save();
    }

    foreach ($request->get('preparations') as $preparationData) {
      $preparation = new Preparation();
      $preparation->name = $preparationData['name'];
      $preparation->ingredients = json_encode($preparationData['ingredients']);
      $preparation->instructions = $preparationData['instructions'];
      $preparation->id_recipe = $recipe->id;
      $preparation->save();

    }
    
    return Inertia::render('Dashboard', [
      'snackbar' => [
        'message' => 'The preparation has been saved whith the id ' . $recipe->id,
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

    $recipe = Recipe::find($id);
    $recipe->name = request()->get('name');
    if ($cover) {
      $recipe->cover = $filename;
    }
    $recipe->setup = request()->get('setup');
    $recipe->premium = request()->get('is_premium');
    $recipe->cost = request()->get('cost');
    $recipe->save();
    foreach (request()->get('preparations', []) as $preparation) {
      $piwiPreparation = Preparation::find($preparation['id']);
      $piwiPreparation->name = $preparation['name'];
      $piwiPreparation->ingredients = $preparation['ingredients'];
      $piwiPreparation->instructions = $preparation['instructions'];
      $piwiPreparation->save();
    }
    DB::delete('delete from recipe_categories_xref where id_recipe=?', [$recipe->id]);
    foreach (request()->get('categories') as $categoryId) {
      $xref = new RecipeCategoryXref();
      $xref->id_recipe = $recipe->id;
      $xref->id_category = $categoryId;
      $xref->save();
    }

    return Inertia::render('Dashboard', [
      'snackbar' => [
        'message' => 'The preparation has been updated.',
        'severity' => 'success',
      ],
    ]);
  }

  public function delete(int $id) {
    $piwi = Recipe::find($id);
    $recipe = $this->recipe_data($piwi);
    DB::delete('delete from recipe_categories_xref where id_recipe=?', [$id]);
    foreach ($recipe['preparations'] as $preparation) {
      $piwiPreparation = Preparation::find($preparation['id']);
      $piwiPreparation->delete();
    }
    $piwi->delete();

    return back();
  }
}
