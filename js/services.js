const mealdb_base = "https://www.themealdb.com/api/json/v1/1";
const apiNutritionKey = import.meta.env.VITE_NUTRITION_API_KEY;

export async function fetchRecipes(query) {
    try {
        const res = await fetch(
            `${mealdb_base}/search.php?s=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Failed to fetch recipes");
        const data = await res.json();
        return data.meals || [];
    } catch (error) {
        console.error("fetchRecipes:", error);
        throw error;
    }
}

export async function fetchRecipeById(id) {
    try {
        const res = await fetch(
            `${mealdb_base}/lookup.php?i=${encodeURIComponent(id)}`
        );
        if (!res.ok) throw new Error("Failed to fetch recipe details");
        const data = await res.json();
        return (data.meals && data.meals[0]) || null;
    } catch (error) {
        console.error("fetchRecipeById:", error);
        throw error;
    }
}

export async function fetchNutrition(ingredient) {
    const response = await fetch(
        `https://api.api-ninjas.com/v1/nutrition?query=${ingredient}`,
        {
            headers: { "X-Api-Key": apiNutritionKey },
        }
    );
    if (!response.ok) throw new Error("Failed to fetch nutrition data");
    return response.json();
}
