async function fetchRecipes() {
    try {
        const response = await fetch('/.netlify/functions/reseptit');
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        // Handle error
    }
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = ''; // Clear previous content
    recipes.forEach(recipe => {
        if (recipe.visibility === 'public') { // Check if visibility is set to "public"
            // Create Bootstrap card element
            const card = document.createElement('div');
            card.classList.add('col');

            card.innerHTML = `
                <div class="card h-100">
                    <img src="${recipe.image_url}" class="card-img-top" alt="Recipe Image">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">Ingredients: ${recipe.ingredients}</p>
                        <a href="#" class="btn btn-primary">View Recipe</a>
                    </div>
                </div>
            `;

            // Append the card to the recipeList
            recipeList.appendChild(card);
        }
    });
}

// Fetch recipes when the page loads
fetchRecipes();
