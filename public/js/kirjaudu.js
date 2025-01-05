async function fetchUsers() {
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

// Fetch users
fetchUsers();