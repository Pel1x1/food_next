export const AppRoutePaths = {
  home: "/",
  recipe: (id?: string) => (id ? `/recipe/${id}` : "/recipe"),
  recipeById:(id?: string) => (id ? `/recipe/${id}` : "/recipe"),
  category: '/category', 
  categoryById: (id: number) => `/category/${id}`,
  categories: "/categories",
  favourites: "/favourites",
  cart: "/cart",
  profile: "/profile",
  randomRecipe: "/random-recipe",
  mealPlanning: "/meal-planning",
} as const;