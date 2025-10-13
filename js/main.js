import { fetchRecipes } from "./js/services.js";
import { renderRecipeList } from "./js/ui.js";
import { loadFavorites } from "./js/utils.js";

document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const recipesContainer = document.getElementById("recipesContainer");

    // Load favorites on start
    loadFavorites();

    // Handle search
    searchBtn.addEventListener("click", async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        recipesContainer.innerHTML = `<p>Loading...</p>`;
        try {
            const recipes = await fetchRecipes(query);
            renderRecipeList(recipes, recipesContainer);
        } catch (err) {
            recipesContainer.innerHTML = `<p class="error">Failed to load recipes. Try again. ${err}</p>`;
        }
    });
});
