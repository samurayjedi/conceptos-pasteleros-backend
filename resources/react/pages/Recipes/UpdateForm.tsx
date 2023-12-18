import { usePage } from '@inertiajs/react';
import route from 'ziggy-js';
import type { Recipe } from './index';
import RecipeForm from './RecipeForm';

export default function UpdateForm() {
  const recipe = usePage().props.recipe as Recipe;

  return (
    <RecipeForm
      action={route('update-recipe.store', { id: recipe.id })}
      values={{
        ...recipe,
        categories: recipe.categories.map((cat) => `${cat.id}`),
        is_premium: recipe.premium,
      }}
    />
  );
}
