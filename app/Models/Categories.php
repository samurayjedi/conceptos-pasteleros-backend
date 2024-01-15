<?php
namespace App\Models;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use PiwiLibs\PiwiDB;
use App\Models\Category;

class Categories extends PiwiDB {
    protected $table = 'categories';

    /**
     * @return int
     */
    public static function insert(Category $category) {
        $id = 0;
        try {
            DB::insert('INSERT INTO categories (label,slug) VALUES(?,?)', [
                $category->label,
                $category->slug,
            ]);
            $id = DB::getPdo()->lastInsertId();
        } catch(QueryException $e) {
            throw new \Exception('Ooops, a error has ocurred while inserting the new category: ' . $e->getMessage());
        }

        return $id;
    }

    public static function update(Category $category) {
        try {
            DB::update('UPDATE categories SET label=?,slug=? WHERE id=?', [
                $category->label,
                $category->slug,
                $category->id,
            ]);
        } catch(QueryException $e) {
            throw new \Exception('Ooops, a error has ocurred while updating the category: ' . $e->getMessage());
        }
    }

    public static function delete(Category $category) {
        try {
            DB::delete('DELETE FROM categories WHERE id=?', [$category->id]);
        } catch(QueryException $e) {
            throw new \Exception('Ooops, a error has ocurred while deleting the category: ' . $e->getMessage());
        }
    }

    /**
     * @return Categories
     */
    public static function select() {
        return new Categories;
    }
    
    /**
     * @return array<Category>
     */
    public function get() {
        $query = parent::get();

        $categories = [];
        foreach ($query as $data) {
            $category = new Category;
            $category->exchangeArray($data);
            $categories[] = $category;
        }

        return $categories;
    }
}