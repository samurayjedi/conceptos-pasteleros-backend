<?php
namespace App\Http\Controllers\Mobile;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Recipes;
use App\Models\Recipe;

class HomeController extends Controller
{
    public function render(Request $request) {
        $isMobile = request()->header('X-Inertia-isMobile');
        if ($isMobile) {
            $fn = function ($categoryId) {
                $queryIds = DB::select('SELECT id_recipe FROM recipe_categories_xref WHERE id_category=?', [$categoryId]);
                $ids = []; $aux = [];
                foreach ($queryIds as $piwi) {
                    $ids[] = $piwi->id_recipe;
                    $aux[] = '?';
                }
                array_pop($aux);
                $query = Recipes::select()
                    ->where('id=? OR '.implode(' OR id=',$aux), $ids)
                    ->get();
                $recipes = [];
                foreach ($query as $recipe) {
                    $recipes[] = $recipe->toArray();
                }

                return $recipes;
            };

            return Inertia::render('Home', [
                'basics' => $fn(1),
                'classics' => $fn(2),
                'gourmet' => $fn(3),
            ]);
        }
    
        return redirect()->to('dashboard');
    }
}
