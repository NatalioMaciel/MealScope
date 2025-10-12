import { recipeCardTemplate } from './templates.js';
import { saveFavorite } from './storage.js';

export function renderRecipeList(recipes, container) {
  container.innerHTML = '';
  if (recipes.length === 0) {
    container.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');
    card.innerHTML = recipeCardTemplate(recipe);

    card.querySelector('.view-btn').addEventListener('click', () => showModal(recipe));
    card.querySelector('.fav-btn').addEventListener('click', () => saveFavorite(recipe));

    container.appendChild(card);
  });
}

export function showModal(recipe) {
  const modal = document.getElementById('recipeModal');
  const modalDetails = document.getElementById('modalDetails');

  modalDetails.innerHTML = `
    <h2>${recipe.strMeal}</h2>
    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
    <p><strong>Category:</strong> ${recipe.strCategory}</p>
    <p><strong>Instructions:</strong> ${recipe.strInstructions}</p>
  `;

  modal.style.display = 'flex';
  document.getElementById('closeModal').addEventListener('click', () => {
    modal.style.display = 'none';
  });
}
