import route from 'ziggy-js';
import RecipeForm from './RecipeForm';

export default function NewForm() {
  return <RecipeForm action={route('new-recipe.store')} />;
}
