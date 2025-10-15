import { fetchRecipeById, fetchNutrition } from "./services.js";
import { saveFavorite } from "./utils.js";

// Render recipe list
export function renderRecipeList(recipes, container) {
    container.innerHTML = "";

    if (!recipes.length) {
        container.innerHTML = `<p>No recipes found. Try another search.</p>`;
        return;
    }

    recipes.forEach((recipe) => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");
        card.innerHTML = recipeCardTemplate(recipe);

        // View button
        card.querySelector(".view-btn").addEventListener("click", () =>
            showModal(recipe.idMeal)
        );

        // details button
        const detailButtons = document.querySelectorAll(".recipe");
        detailButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                // redirect to recipe.html passing the id in the URL
                window.location.href = `recipe.html?id=${id}`;
            });
        });

        container.appendChild(card);
    });
}

//tampleta for the recipes
export function recipeCardTemplate(recipe) {
    return `
  <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy">
  <h3>${recipe.strMeal}</h3>
  <p><strong>Category:</strong> ${recipe.strCategory}</p>
  <div class="card-actions">
    <button class="view-btn">View</button>
    <button class="recipe" data-id="${recipe.idMeal}">Details</button>
  </div>
  `;
}

// Show recipe modal
export async function showModal(recipeId) {
    const modal = document.getElementById("recipeModal");
    const modalDetails = document.getElementById("modalDetails");
    const spinner = document.getElementById("loadingSpinner")

    modal.style.display = "flex";
    modalDetails.innerHTML = "";
    spinner.classList.remove("hidden");

    try {
        const recipe = await fetchRecipeById(recipeId);
        if (!recipe) throw new Error("Recipe not found");

        // Prepare ingredient list for nutrition query
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push(`${measure} ${ingredient}`);
            }
        }

        // Fetch nutrition info
        const nutrition = await fetchNutrition(ingredients.slice(0, 7));


        spinner.classList.add("hidden");

        modalDetails.innerHTML = `
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" width="300" height="300">
        <p><strong>Category:</strong> ${recipe.strCategory}</p>
        <p><strong>Area:</strong> ${recipe.strArea}</p>
        <p>${ingredients}</p>
        <h3>Nutrition Info</h3>
        ${nutrition && nutrition.length
                ? `<ul>${nutrition.map(n => `
                    <li>${n.name}: ${n.calories} kcal, Protein: ${n.protein_g}g, Carbs: ${n.carbohydrates_total_g}g</li>`
                ).join("")}</ul>`
                : `<p>Nutrition information not available.</p>`
            }
        `;
        console.log("Ingredients sent:", ingredients.slice(0, 7).join(", "));
    } catch (error) {
        spinner.classList.add("hidden");
        modalDetails.innerHTML = `<p>Error loading recipe details. ${error}</p>`;
    }

    document.getElementById("closeModal").addEventListener("click", () => {
        modal.style.display = "none";
    });
}