import { fetchRecipes, fetchCategories, fetchByCategory, fetchRandomRecipe } from "./services.js";
import { renderRecipeList } from "./ui.js";


document.addEventListener("DOMContentLoaded", async () => {
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const recipesContainer = document.getElementById("recipesContainer");
    const categorySelect = document.getElementById("categorySelect");
    const recipeContainer = document.getElementById("recipesContainer");

    try {
        const categories = await fetchCategories();
        categories.forEach(({ strCategory }) => {
            const option = document.createElement("option");
            option.value = strCategory;
            option.textContent = strCategory;
            categorySelect.appendChild(option);
        });
    } catch (err) {
        console.error("Error loading categories:", err);
    }

    await loadRandomRecipes();


    categorySelect.addEventListener("change", async (e) => {
        const category = e.target.value;
        recipesContainer.innerHTML = `<p>Loading...</p>`;
        if (category) {
            const categoriesRecipes = await fetchByCategory(category);
            renderRecipeList(categoriesRecipes, recipesContainer);
        } else {
            await loadRandomRecipes();
        }
    });

    async function loadRandomRecipes() {
        recipeContainer.innerHTML = "<p>Loading random recipes...</p>";

        try {
            const randomRecipes = [];
            for (let i = 0; i < 4; i++) {
                const recipe = await fetchRandomRecipe();
                randomRecipes.push(recipe);
            }

            renderRecipeList(randomRecipes, recipeContainer);
        } catch (error) {
            console.error("Error loading random recipes:", error);
            recipeContainer.innerHTML = "<p>Could not load random recipes.</p>";
        }
    }

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
