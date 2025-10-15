import { fetchRecipeById, fetchNutrition } from "./services.js";
import { loadFavorites, saveFavorite, removeFavorite } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const recipeContainer = document.getElementById("recipeContainer");

    if (!id) {
        recipeContainer.innerHTML = "<p>Recipe ID not found.</p>";
        return;
    }

    try {
        const recipe = await fetchRecipeById(id);
        if (!recipe) throw new Error("Recipe not found");

        renderRecipe(recipe);
        await renderNutrition(recipe); 

        const favoriteBtn = document.getElementById("favoriteBtn");
        if (!favoriteBtn) {
            console.warn("favoriteBtn no encontrado en el DOM");
            return;
        }

        
        let favorites = loadFavorites();
        let isFavorite = favorites.some((f) => f.idMeal === recipe.idMeal);
        updateFavoriteButton(isFavorite);

        
        favoriteBtn.addEventListener("click", () => {
            
            favorites = loadFavorites();
            isFavorite = favorites.some((f) => f.idMeal === recipe.idMeal);

            if (isFavorite) {
                
                removeFavorite(recipe.idMeal);
                updateFavoriteButton(false);
            } else {
                
                saveFavorite(recipe);
                updateFavoriteButton(true);
            }
        });
    } catch (error) {
        console.error("Error loading recipe:", error);
        recipeContainer.innerHTML = `<p>Error loading recipe details.</p>`;
    }
});

function renderRecipe(recipe) {
    document.getElementById("recipeTitle").textContent = recipe.strMeal;
    document.getElementById("recipeImage").src = recipe.strMealThumb;
    document.getElementById("recipeCategory").textContent = `${recipe.strArea} | ${recipe.strCategory}`;
    document.getElementById("recipeInstructions").textContent = recipe.strInstructions;

    const ingredientsList = document.getElementById("ingredientsList");
    ingredientsList.innerHTML = "";

    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            const li = document.createElement("li");
            li.textContent = `${measure || ""} ${ingredient}`;
            ingredientsList.appendChild(li);
        }
    }

    const youtubeLink = document.getElementById("youtubeLink");
    const sourceLink = document.getElementById("sourceLink");

    if (recipe.strYoutube) {
        youtubeLink.href = recipe.strYoutube;
        youtubeLink.style.display = "";
    } else {
        youtubeLink.style.display = "none";
    }

    if (recipe.strSource) {
        sourceLink.href = recipe.strSource;
        sourceLink.style.display = "";
    } else {
        sourceLink.style.display = "none";
    }
}

async function renderNutrition(recipe) {
    const nutritionDiv = document.getElementById("nutritionInfo");
    if (!nutritionDiv) return;

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ing = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ing && ing.trim() !== "") {
            ingredients.push(`${measure || ""} ${ing}`.trim());
        }
    }

    const queryList = ingredients.slice(0, 7);

    try {
        const nutrition = await fetchNutrition(queryList);
        if (!nutrition) {
            nutritionDiv.innerHTML = `<p>Nutrition information not available.</p>`;
            return;
        }
        if (Array.isArray(nutrition)) {
            const totals = nutrition.reduce(
                (acc, n) => {
                    acc.calories += n.calories || 0;
                    acc.protein += n.protein_g || 0;
                    acc.carbs += n.carbohydrates_total_g || 0;
                    acc.fat += (n.fat_total_g || n.fat || 0);
                    return acc;
                },
                { calories: 0, protein: 0, carbs: 0, fat: 0 }
            );

            nutritionDiv.innerHTML = `
        <ul>
          <li><strong>Calories:</strong> ${Math.round(totals.calories)} kcal</li>
          <li><strong>Protein:</strong> ${Math.round(totals.protein * 10) / 10} g</li>
          <li><strong>Carbs:</strong> ${Math.round(totals.carbs * 10) / 10} g</li>
          <li><strong>Fat:</strong> ${Math.round(totals.fat * 10) / 10} g</li>
        </ul>
      `;
            return;
        }

        if (nutrition.calories !== undefined) {
            nutritionDiv.innerHTML = `
        <ul>
          <li><strong>Calories:</strong> ${nutrition.calories} kcal</li>
          <li><strong>Protein:</strong> ${nutrition.protein || 0} g</li>
          <li><strong>Carbs:</strong> ${nutrition.carbs || 0} g</li>
          <li><strong>Fat:</strong> ${nutrition.fat || 0} g</li>
        </ul>
      `;
            return;
        }

        nutritionDiv.innerHTML = `<p>Nutrition information not available.</p>`;
    } catch (err) {
        console.error("Error fetching nutrition data:", err);
        nutritionDiv.innerHTML = `<p>Nutrition information not available.</p>`;
    }
}

function updateFavoriteButton(isFavorite) {
    const btn = document.getElementById("favoriteBtn");
    if (!btn) return;
    if (isFavorite) {
        btn.textContent = "❤️ Remove from Favorites";
        btn.classList.add("active");
    } else {
        btn.textContent = "♡ Add to Favorites";
        btn.classList.remove("active");
    }
}
