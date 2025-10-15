const favorites_key = "mealscope_favorites";

export function saveFavorite(recipe) {
    const favorites = loadFavorites();
    if (!favorites.find((r) => r.idMeal === recipe.idMeal)) {
        favorites.push(recipe);
        localStorage.setItem(favorites_key, JSON.stringify(favorites));
    }
}

export function loadFavorites() {
    const data = localStorage.getItem(favorites_key);
    return data ? JSON.parse(data) : [];
}

export function removeFavorite(idMeal) {
    let favorites = loadFavorites();
    favorites = favorites.filter((r) => r.idMeal !== idMeal);
    localStorage.setItem(favorites_key, JSON.stringify(favorites));
}

export function clearFavorites() {
    localStorage.removeItem(favorites_key);
}