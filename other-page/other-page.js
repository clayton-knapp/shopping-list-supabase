import { 
    checkAuth, 
    logout,
    createItem,
    fetchItems, 
    deleteAllItems,
    toggleBuyItem,
    deleteItem,
    fetchUsers,
    getUser,
    addBuyBeforeDate
} from '../fetch-utils.js';

import { renderItem, renderDeleteButton } from '../render-utils.js';

checkAuth();

// DOM ELEMENTS
const logoutButton = document.getElementById('logout');
const addItemForm = document.querySelector('#add-item-form');
const deleteButton = document.querySelector('#delete-button');
const listEl = document.querySelector('#list');

// STRETCH - list of users
const selectedUsersListEl = document.getElementById('selected-users-list');
const usersDropdown = document.getElementById('users-dropdown');

const currentUserEl = document.getElementById('current-user');



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
    const item = await createItem(quantity, name);
 
    // SUPER STRETCH TIME STUFF
    const createdTimestamp = item[0].created_at;
    const createdDate = new Date(createdTimestamp);
    const timeSince1970InMs = createdDate.getTime();
    const buyBeforeTime = timeSince1970InMs + 60000; //adds 60k ms or 1min
    const buyBeforeDate = new Date(buyBeforeTime);
    await addBuyBeforeDate(buyBeforeDate, item[0].id);

    //     - fetches and displays new list
    displayList();

    addItemForm.reset();

});

// LOAD
window.addEventListener('load', async() => {
    // - fetches and displays list
    await displayList();

    // STRETCH - other users
    // - fetch list of users
    // - display list of users
    await displayUsers();

    //display signed in user email
    const session = await getUser();
    currentUserEl.textContent = session.user.email;

});

// DELETE BUTTON
deleteButton.addEventListener('click', async()=> {
    // - calls deleteAllItems for that user (match done automatically with RLS and foreign key + user_id in supabase)
    await deleteAllItems();

    // - fetches and displays new list
    displayList();
});

//STRETCH USER DROPDOWN
usersDropdown.addEventListener('change', async() => {
    //on change calls the display and fetch users list passing in user id
    await displaySelectedUsersList(usersDropdown.value);

});



logoutButton.addEventListener('click', () => {
    logout();
});

// FUNCTIONS

async function displayList() {
    // - makes a call with fetchItems 
    const user = await getUser(); // actually gets session
    const items = await fetchItems(user.user.id);

    //clears DOM
    listEl.textContent = '';

    // - uses for loop to pass renderItem function objects which returns DOM elements
    for (let item of items) {
        const itemEl = renderItem(item);

        // itemEl.addEventListener('click', async()=> {
        //     // - calls buyItem and passes item id which updates in supabase with bought = true and matches with that item id
        //     // STRETCH: toggle buy/unbuy
        //     if (item.bought === false) {
        //         await toggleBuyItem(item.id, true);
        //     } else {
        //         await toggleBuyItem(item.id, false);
        //     }

        //     // - fetches and displays new list
        //     await displayList();
        // });

        //STRETCH: deleteItemButton
        const deleteItemButton = renderDeleteButton();

        deleteItemButton.addEventListener('click', async() =>{
            await deleteItem(item.id);
            
            await displayList();
        });

        const itemAndButtonEl = document.createElement('div');

        //SUPER STRETCH TIME STUFF
        const buyBeforeTimestamp = item.buy_before;
        const buyBeforeDate = new Date(buyBeforeTimestamp); //is this an object?
        const buyBeforeMsSince1970 = buyBeforeDate.getTime();
        
        const currentDate = new Date();
        const currentDateMsSince1970 = currentDate.getTime();
        const timeLeftInMs = buyBeforeMsSince1970 - currentDateMsSince1970;

        const timeLeftEl = document.createElement('p');

        if (timeLeftInMs > 0 && item.bought === false) {
            timeLeftEl.textContent = (timeLeftInMs / 1000) + ' seconds left to buy item';
        } else if (timeLeftInMs < 0 && item.bought === false) {
            timeLeftEl.textContent = 'Time is up to buy item!';
            itemAndButtonEl.classList.add('time-up');
        } else if (item.bought === true) {
            timeLeftEl.textContent = 'Good job, you bought the item in time.';
        }

        itemEl.addEventListener('click', async()=> {
            // - calls buyItem and passes item id which updates in supabase with bought = true and matches with that item id
            // STRETCH: toggle buy/unbuy
            if (item.bought === false) {
                await toggleBuyItem(item.id, true);
            } else {
                await toggleBuyItem(item.id, false);
            }

            // - fetches and displays new list
            await displayList();
        });

        itemAndButtonEl.append(itemEl, deleteItemButton, timeLeftEl);
        itemAndButtonEl.classList.add('list-item');

        // - appends DOM elements to listEl
        listEl.append(itemAndButtonEl);
    }
}

// STRETCH - display other users
export async function displayUsers() {
    const users = await fetchUsers();
    
    // get current users id
    const currentSession = await getUser();
    const currentUserId = currentSession.user.id;

    for (let user of users) {
        //exclude current signed in user from this list
        if (user.user_id !== currentUserId) {
            // create optionEl
            const userOptionEl = document.createElement('option');
            //set text content to user email to display
            userOptionEl.textContent = user.user_email;
            //set the value to the user id to pass to fetch function
            userOptionEl.value = user.user_id;

            //append the optionEl to the dropdown
            usersDropdown.append(userOptionEl);        
        }
    }
}

async function displaySelectedUsersList(id) {
    // - fetch that specific users list matching with their id
    const items = await fetchItems(id);

    selectedUsersListEl.textContent = '';
    for (let item of items) {
        const itemEl = renderItem(item);

        selectedUsersListEl.append(itemEl);
    }
}
