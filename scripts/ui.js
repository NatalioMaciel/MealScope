import { recipeCardTemplate } from './utils.js';
import { fetchRecipeById, fetchNutrition } from './services.js';
import { saveFavorite } from './utils.js';

// Render recipe list
export function renderRecipeList(recipes, container) {
    container.innerHTML = '';

    if (!recipes.length) {
        container.innerHTML = `<p>No recipes found. Try another search.</p>`;
        return;
    }

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.classList.add('recipe-card');
        card.innerHTML = recipeCardTemplate(recipe);

        // View button
        card.querySelector('.view-btn').addEventListener('click', () => showModal(recipe.idMeal));

        // Favorite button
        card.querySelector('.fav-btn').addEventListener('click', () => saveFavorite(recipe));

        container.appendChild(card);
    });
}

// Show recipe modal
export async function showModal(recipeId) {
    const modal = document.getElementById('recipeModal');
    const modalDetails = document.getElementById('modalDetails');
    modal.style.display = 'flex';
    modalDetails.innerHTML = `<p>Loading recipe...</p>`;

    try {
        const recipe = await fetchRecipeById(recipeId);
        if (!recipe) throw new Error('Recipe not found');

        // Prepare ingredient list for nutrition query
        const ingredients = [];
        for (let i = 1; i <= 10; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) ingredients.push(`${measure} ${ingredient}`);
        }

        // Fetch nutrition info
        const nutrition = await fetchNutrition(ingredients.join(', '));

        modalDetails.innerHTML = `
      <h2>${recipe.strMeal}</h2>
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
      <p><strong>Category:</strong> ${recipe.strCategory}</p>
      <p><strong>Area:</strong> ${recipe.strArea}</p>
      <p>${recipe.strInstructions}</p>
      <h3>Nutrition Info</h3>
      ${nutrition && nutrition.length
                ? `<ul>${nutrition
                    .map(
                        n =>
                            `<li>${n.name}: ${n.calories} kcal, Protein: ${n.protein_g}g, Carbs: ${n.carbohydrates_total_g}g</li>`
                    )
                    .join('')}</ul>`
                : `<p>Nutrition information not available.</p>`
            }
    `;
    } catch (error) {
        modalDetails.innerHTML = `<p>Error loading recipe details.</p>`;
    }

    document.getElementById('closeModal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}
