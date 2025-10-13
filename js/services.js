const mealdb_base = "https://www.themealdb.com/api/json/v1/1";
const nutrition_api_url = "https://api.api-ninjas.com/v1/nutrition";

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
        `${nutrition_api_url}?query=${encodeURIComponent(query)}`, {
        headers: {
            "X-Api-Key": "ydgVSR/ecbUft+FsTHyvSw==B3z7IAqKgkl2LgiQ"
        }
    }
    );
    if (!response.ok) throw new Error("Failed to fetch nutrition data");
    return response.json();
}
