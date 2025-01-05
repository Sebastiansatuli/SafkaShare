/*async function fetchUsers() {
    try {
        const response = await fetch('/.netlify/functions/kirjaudu');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        checkLoginAttempt(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        // Handle error
    }
}

function checkLoginAttempt(users) {
    users.forEach(user => {
        if (user.email === document.getElementById('email') && user.password === document.getElementById('password')) {
            window.alert('Login succesful');
            //localStorage.setItem('email', user.email);
            //localStorage.setItem('password', user.password);
            localStorage.setItem('name', user.name);
            localStorage.setItem('full_name', user.full_name);
            localStorage.setItem('loggedIn', true);
            localStorage.setItem('user_type', user.user_type)
        }
    });
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

// Fetch users
fetchUsers();*/