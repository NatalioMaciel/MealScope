import { loadFavorites, removeFavorite } from "./utils.js";
import { showModal } from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
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
            showModal(recipe.idMeal)
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
