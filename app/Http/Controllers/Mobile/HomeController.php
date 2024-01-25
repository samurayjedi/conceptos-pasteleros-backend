<?php
namespace App\Http\Controllers\Mobile;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Recipes;

class HomeController extends Controller
{
    public function render(Request $request) {
        $isMobile = request()->header('X-Inertia-isMobile');
        if ($isMobile) {
            $basics = [];
            $classics = [];
            $gourmet = [];
            $recipes = Recipes::select()->get();
            foreach ($recipes as $recipe) {
                $categories = [];
                foreach ($recipe->categories as $category) {
                    $categories[] = $category->slug;
                }
                if (in_array('basics', $categories)) {
                    $basics[] = $recipe->toArray();
                }
                if (in_array('classics', $categories)) {
                    $classics[] = $recipe->toArray();
                }
                if (in_array('gourmet', $categories)) {
                    $gourmet[] = $recipe->toArray();
                }
            }

            return Inertia::render('Home', [
                'basics' => $basics,
                'classics' => $classics,
                'gourmet' => $gourmet,
            ]);
        }
    
        return redirect()->to('dashboard');
    }
}
