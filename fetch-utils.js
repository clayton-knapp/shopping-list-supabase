const SUPABASE_URL = 'https://oyvsfhojsmxsetqtdhli.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTI0MjkxMiwiZXhwIjoxOTU2ODE4OTEyfQ._CbEmorU3mUqLWCBYLKqFX5z_mlXgc9dhhLfrkvqpcs';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// CREATE ITEM
export async function createItem(quantity, name) {
    const response = await client
        .from('shopping_list')
        .insert({
            quantity: quantity,
            name: name,
            bought: false
        });

    return checkError(response);
}

// FETCH ITEMS
export async function fetchItems(id) {
    const response = await client
        .from('shopping_list')
        .select()
        .match({ user_id: id })
        .order('bought');

    return checkError(response);
}

// DELETE ITEMS
export async function deleteAllItems() {
    const response = await client
        .from('shopping_list')
        .delete();

    return checkError(response);
}

//BUY ITEM
export async function toggleBuyItem(id, bool) {
    const response = await client
        .from('shopping_list')
        .update({ bought: bool })
        .match({ id: id });

    return checkError(response);
}

//DELETE ITEM
export async function deleteItem(id) {
    const response = await client
        .from('shopping_list')
        .delete()
        .match({ id: id });

    return checkError(response);
}

// STRETCH - CREATE USER TABLE
export async function createUser(email) {
    const response = await client
        .from('shopping_list_users')
        .insert({ user_email: email });

    return checkError(response);
}

// STRETCH - FETCH USERS
export async function fetchUsers() {
    const response = await client
        .from('shopping_list_users')
        .select();
    
    return checkError(response);
}

// SUPER STRETCH BUY BEFORE DATE
export async function addBuyBeforeDate(date, id) {
    const response = await client
        .from('shopping_list')
        .update({ buy_before: date })
        .match({ id: id });
    
    return checkError(response);
}

export async function fetchItemTimestamp(id) {
    const response = await client
        .from('shopping_list')
        .select()
        .match({ id: id })
        .single();

    return checkError(response);
}



// TEMPLATE AUTH FUNCTIONS
export async function getUser() {
    return client.auth.session();
}


export async function checkAuth() {
    const user = await getUser();

    if (!user) location.replace('../'); 
}

export async function redirectIfLoggedIn() {
    if (await getUser()) {
        location.replace('./other-page');
    }
}

export async function signupUser(email, password){
    const response = await client.auth.signUp({ email, password });
    
    return response.user;
}

export async function signInUser(email, password){
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return window.location.href = '../';
}

function checkError({ data, error }) {
    return error ? console.error(error) : data;
}
