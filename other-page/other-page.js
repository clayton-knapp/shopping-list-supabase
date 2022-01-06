import { checkAuth, logout } from '../fetch-utils.js';

checkAuth();

// DOM ELEMENTS
const logoutButton = document.getElementById('logout');


//EVENT LISTENERS


logoutButton.addEventListener('click', () => {
    logout();
});

// FUNCTIONS
