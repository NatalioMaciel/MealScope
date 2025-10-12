
const mealdb_base = 'https://www.themealdb.com/api/json/v1/1';
const nutrition_url = 'https://api.api-ninjas.com/v1/nutrition';

// Fetch recipes by search
export async function fetchRecipes(query) {
    try {
        const res = await fetch(`${mealdb_base}/search.php?s=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Failed to fetch recipes');
        const data = await res.json();
        return data.meals || [];
    } catch (error) {
        console.error('fetchRecipes:', error);
        throw error;
    }
}

// Fetch full recipe by ID
export async function fetchRecipeById(id) {
    try {
        const res = await fetch(`${mealdb_base}/lookup.php?i=${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error('Failed to fetch recipe details');
        const data = await res.json();
        return (data.meals && data.meals[0]) || null;
    } catch (error) {
        console.error('fetchRecipeById:', error);
        throw error;
    }
}

// Fetch nutrition data (requires API key from https://api-ninjas.com)
export async function fetchNutrition(query) {
    try {
        const res = await fetch(`${nutrition_url}?query=${encodeURIComponent(query)}`, {
            headers: {
                'X-Api-Key': 'ydgVSR/ecbUft+FsTHyvSw==B3z7IAqKgkl2LgiQ'
            }
        });
        if (!res.ok) throw new Error('Failed to fetch nutrition info');
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('fetchNutrition:', error);
        return null;
    }
}

