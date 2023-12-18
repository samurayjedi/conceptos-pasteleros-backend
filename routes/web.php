<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Recipes;
use App\Http\Controllers\Categories;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () { return redirect()->to('dashboard'); })
    ->name('home');

Route::get('/dashboard', function () { return Inertia::render('Dashboard'); })
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::controller(Recipes::class)->group(function () {
    Route::get('/dashboard/recipes/new-recipe', 'newForm')
        ->middleware(['auth', 'verified'])
        ->name('new-recipe');

    Route::get('/dashboard/recipes/update-recipe/id/{id}', 'updateForm')
        ->middleware(['auth', 'verified'])
        ->name('update-recipe');

    Route::post('/dashboard/recipes/new-recipe', 'store')
        ->middleware(['auth', 'verified'])
        ->name('new-recipe.store');

    Route::post('/dashboard/recipes/update-recipe/id/{id}', 'update')
        ->middleware(['auth', 'verified'])
        ->name('update-recipe.store');

    Route::get('/dashboard/recipes/delete-recipe/id/{id}', 'delete')
        ->middleware(['auth', 'verified'])
        ->name('delete-recipe');

    Route::get('/dashboard/recipes/{page?}/{rows?}', 'table')
        ->middleware(['auth', 'verified'])
        ->name('recipes');
});

Route::post('/dashboard/categories', [Categories::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('categories.store');

require __DIR__.'/auth.php';
