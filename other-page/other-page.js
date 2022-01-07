import { 
    checkAuth, 
    logout,
    createItem 
} from '../fetch-utils.js';

checkAuth();

// DOM ELEMENTS
const logoutButton = document.getElementById('logout');
const addItemForm = document.querySelector('#add-item-form');
const deleteButton = document.querySelector('#delete-button');
const listEl = document.querySelector('#list');


//EVENT LISTENERS

// SUBMIT ITEM
addItemForm.addEventListener('submit', async(e)=> {
    e.preventDefault();
    //     - Grabs user input quantity and item
    const data = new FormData(addItemForm);
    const name = data.get('name');
    const quantity = data.get('quantity');

    //     - calls createItem which inserts to Supabase
    //     - passes in values, inserts with bought = false (also set up by default in supabase)
    const items = await createItem(quantity, name);
    console.log(items);

    //     - fetches and displays new list

});


logoutButton.addEventListener('click', () => {
    logout();
});

// FUNCTIONS
