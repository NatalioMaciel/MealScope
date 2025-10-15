import { loadFavorites } from "./utils.js";

const mealPlanKey = "mealscope_mealplan";

document.addEventListener("DOMContentLoaded", () => {
    const plannerContainer = document.getElementById("plannerContainer");
    const clearBtn = document.getElementById("clearPlannerBtn");
    const favorites = loadFavorites();
    let plan = loadMealPlan();

    renderPlanner(plan, plannerContainer, favorites);

    // 🧹 Clear all planner button
    clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all planned meals?")) {
            plan = createEmptyPlan();
            saveMealPlan(plan);
            renderPlanner(plan, plannerContainer, favorites);
        }
    });
});

function createEmptyPlan() {
    return {
        Monday: [], Tuesday: [], Wednesday: [],
        Thursday: [], Friday: [], Saturday: [], Sunday: []
    };
}

function loadMealPlan() {
    const data = localStorage.getItem(mealPlanKey);
    if (data) return JSON.parse(data);
    const empty = createEmptyPlan();
    saveMealPlan(empty);
    return empty;
}

function saveMealPlan(plan) {
    localStorage.setItem(mealPlanKey, JSON.stringify(plan));
}

function renderPlanner(plan, container, favorites) {
    container.innerHTML = "";

    Object.keys(plan).forEach(day => {
        const section = document.createElement("div");
        section.classList.add("day-section");

        section.innerHTML = `
      <h3>${day}</h3>
      <div class="meal-list" id="${day}-list">
        ${plan[day].length
                ? plan[day].map(r => `
              <div class="meal-item">
                <div class="meal-info">
                  <img src="${r.strMealThumb}" alt="${r.strMeal}">
                </div>
                <div class="meal-actions">
                  <button class="planner-btn" data-id="${r.idMeal}">${r.strMeal}</button>
                  <button class="remove-btn" data-id="${r.idMeal}" data-day="${day}">✖</button>
                </div>
              </div>
            `).join("")
                : `<p class="empty">No meal planned yet.</p>`
            }
      </div>
      <select class="meal-select" id="${day}-select">
        <option value="">Add from favorites...</option>
        ${favorites.map(f => `<option value="${f.idMeal}">${f.strMeal}</option>`).join("")}
      </select>
      <button class="add-btn" data-day="${day}">Add</button>
    `;

        container.appendChild(section);
    });

    // Add button listeners
    document.querySelectorAll(".add-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const day = e.target.dataset.day;
            const select = document.getElementById(`${day}-select`);
            const idMeal = select.value;
            if (!idMeal) return alert("Please select a recipe first!");

            const selectedRecipe = favorites.find(f => f.idMeal === idMeal);
            plan[day].push(selectedRecipe);
            saveMealPlan(plan);
            renderPlanner(plan, container, favorites);
        });
    });

    // Remove recipe
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const { id, day } = e.target.dataset;
            plan[day] = plan[day].filter(r => r.idMeal !== id);
            saveMealPlan(plan);
            renderPlanner(plan, container, favorites);
        });
    });

    // 🔗 View recipe button
    document.querySelectorAll(".planner-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = e.target.dataset.id;
            // Redirect to your existing recipe details page
            window.location.href = `recipe.html?id=${id}`;
        });
    });
}
