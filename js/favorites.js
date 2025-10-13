import { loadFavorites, removeFavorite } from "./utils.js";
import { fetchRecipeById } from "./services.js";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("favoritesContainer");
    const favorites = loadFavorites();

    if (!favorites.length) {
        container.innerHTML = `<p>You don't have any favorites yet. Go find some recipes!</p>`;
        return;
    }

    renderFavorites(favorites, container);
});

function renderFavorites(favorites, container) {
    container.innerHTML = "";
    favorites.forEach((recipe) => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");
        card.innerHTML = `
      ${favoriteCardTemplate(recipe)}
      <div class="card-actions">
        <button class="view-btn">View</button>
        <button class="remove-btn">Remove</button>
      </div>
    `;

        // View details
        card.querySelector(".view-btn").addEventListener("click", () =>
            showFavoriteModal(recipe.idMeal)
        );

        // Remove from favorites
        card.querySelector(".remove-btn").addEventListener("click", () => {
            removeFavorite(recipe.idMeal);
            card.remove();
            if (!loadFavorites().length) {
                container.innerHTML = `<p>You don't have any favorites yet.</p>`;
            }
        });

        container.appendChild(card);
    });
}

function favoriteCardTemplate(recipe) {
    return `
  <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
  <h3>${recipe.strMeal}</h3>
  <div class="card-actions">
  </div>
  `;
}

async function showFavoriteModal(id) {
    const modal = document.getElementById("recipeModal");
    const modalDetails = document.getElementById("modalDetails");
    modal.style.display = "flex";
    modalDetails.innerHTML = "<p>Loading recipe...</p>";

    try {
        const recipe = await fetchRecipeById(id);
        if (!recipe) throw new Error("Recipe not found");
        modalDetails.innerHTML = `
      <h2>${recipe.strMeal}</h2>
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" width="300" hight="300">
      <p><strong>Category:</strong> ${recipe.strCategory}</p>
      <p><strong>Area:</strong> ${recipe.strArea}</p>
      <p>${recipe.strInstructions}</p>
    `;
    } catch (error) {
        modalDetails.innerHTML = `<p>Error loading recipe details ${error}.</p>`;
    }

    document.getElementById("closeModal").addEventListener("click", () => {
        modal.style.display = "none";
    });
}
