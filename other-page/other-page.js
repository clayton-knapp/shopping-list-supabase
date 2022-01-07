import { 
    checkAuth, 
    logout,
    createItem,
    fetchItems, 
} from '../fetch-utils.js';

import { renderItem } from '../render-utils.js';

checkAuth();

// DOM ELEMENTS
const logoutButton = document.getElementById('logout');
const addItemForm = document.querySelector('#add-item-form');
const deleteButton = document.querySelector('#delete-button');
const listEl = document.querySelector('#list');


//EVENT LISTENERS

// ADD ITEM
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
    displayList(items);

    addItemForm.reset();

});

// LOAD
window.addEventListener('load', async() => {
    // - fetches and displays list
    const items = await fetchItems();
    displayList(items);
});


logoutButton.addEventListener('click', () => {
    logout();
});

// FUNCTIONS

function displayList(items) {
    // - either makes a call with fetchItems or gets passed an object returned from an early server call - but is passed object just the single and not the whole array of objects?!

    //clears DOM
    listEl.textContent = '';

    // - uses for loop to pass renderItem function objects which returns DOM elements
    for (let item of items) {
        const itemEl = renderItem(item);

        // - appends DOM elements to listEl
        listEl.append(itemEl);
    }

}