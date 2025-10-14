import { fetchRecipes, fetchCategories, fetchByCategory, fetchRandomRecipe } from "./services.js";
import { renderRecipeList } from "./ui.js";
import { recipeCardTemplate } from "./utils.js"


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
        if (category) {
            const recipes = await fetchByCategory(category);
            renderRecipes(recipes);
        } else {
            await loadRandomRecipes();
        }
    });

    async function loadRandomRecipes() {
        recipeContainer.innerHTML = "<p>Loading random recipes...</p>";
        const randoms = [];
        for (let i = 0; i < 4; i++) {
            const recipe = await fetchRandomRecipe();
            randoms.push(recipe);
        }
        renderRecipes(randoms);
    }

    function renderRecipes(recipes) {
        recipeContainer.innerHTML = "";
        recipes.forEach((recipe) => {
            const card = document.createElement("div");
            card.classList.add("recipe-card");
            card.innerHTML = recipeCardTemplate(recipe);
            recipeContainer.appendChild(card);
        });
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
