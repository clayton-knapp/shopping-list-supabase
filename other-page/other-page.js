import { 
    checkAuth, 
    logout,
    createItem,
    fetchItems, 
    deleteAllItems,
    toggleBuyItem,
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
    await createItem(quantity, name);

    //     - fetches and displays new list
    displayList();

    addItemForm.reset();

});

// LOAD
window.addEventListener('load', async() => {
    // - fetches and displays list
    await displayList();
});

// DELETE BUTTON
deleteButton.addEventListener('click', async()=> {
    // - calls deleteAllItems for that user (match done automatically with RLS and foreign key + user_id in supabase)
    await deleteAllItems();

    // - fetches and displays new list
    displayList();
});


logoutButton.addEventListener('click', () => {
    logout();
});

// FUNCTIONS

async function displayList() {
    // - either makes a call with fetchItems or gets passed an object returned from an early server call - but is passed object just the single and not the whole array of objects?!
    const items = await fetchItems();

    //clears DOM
    listEl.textContent = '';

    // - uses for loop to pass renderItem function objects which returns DOM elements
    for (let item of items) {
        const itemEl = renderItem(item);

        itemEl.addEventListener('click', async()=> {
            // - calls buyItem and passes item id which updates in supabase with bought = true and matches with that item id
            if (item.bought === false) {
                await toggleBuyItem(item.id, true);
            } else {
                await toggleBuyItem(item.id, false);
            }

            // - fetches and displays new list
            displayList();
        });


        // - appends DOM elements to listEl
        listEl.append(itemEl);
    }

}