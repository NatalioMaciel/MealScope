const mealdb_base = "https://www.themealdb.com/api/json/v1/1/";
const nutrition_api_url = "https://api.api-ninjas.com/v1/nutrition";

//Search recipes by name
export async function fetchRecipes(query) {
    try {
        const res = await fetch(`${mealdb_base}search.php?s=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Failed to fetch recipes");
        const data = await res.json();
        return data.meals || [];
    } catch (error) {
        console.error("fetchRecipes:", error);
        throw error;
    }
}

//Get recipe details by ID
export async function fetchRecipeById(id) {
    try {
        const res = await fetch(`${mealdb_base}lookup.php?i=${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error("Failed to fetch recipe details");
        const data = await res.json();
        return (data.meals && data.meals[0]) || null;
    } catch (error) {
        console.error("fetchRecipeById:", error);
        throw error;
    }
}

//Get nutrition info for ingredients
export async function fetchNutrition(ingredientList) {
    try {
        const query = ingredientList; // expected to be a short string like "1 cup rice, 2 eggs"
        const response = await fetch(
            `${nutrition_api_url}?query=${encodeURIComponent(query)}`,
            {
                headers: {
                    "X-Api-Key": "ydgVSR/ecbUft+FsTHyvSw==B3z7IAqKgkl2LgiQ",
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Nutrition API error: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("fetchNutrition:", error);
        throw new Error("Failed to fetch nutrition data");
    }
}

//Fetch list of categories
export async function fetchCategories() {
    try {
        const res = await fetch(`${mealdb_base}list.php?c=list`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        return data.meals;
    } catch (error) {
        console.error("fetchCategories:", error);
        throw error;
    }
}

//Fetch recipes by category
export async function fetchByCategory(category) {
    try {
        const res = await fetch(`${mealdb_base}filter.php?c=${encodeURIComponent(category)}`);
        if (!res.ok) throw new Error("Failed to fetch category recipes");
        const data = await res.json();
        return data.meals;
    } catch (error) {
        console.error("fetchByCategory:", error);
        throw error;
    }
}

//Fetch a random recipe
export async function fetchRandomRecipe() {
    try {
        const res = await fetch(`${mealdb_base}random.php`);
        if (!res.ok) throw new Error("Failed to fetch random recipe");
        const data = await res.json();
        return data.meals[0];
    } catch (error) {
        console.error("fetchRandomRecipe:", error);
        throw error;
    }
}
