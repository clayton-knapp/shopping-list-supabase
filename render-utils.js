export function renderItem(item){
    // - makes p tags
    const p = document.createElement('p');

    // - sets textcontent to quantity and item name
    p.textContent = `${item.quantity} ${item.name}`;

    // - adds classlist of bought or unbought depending
    if (item.bought === true) {
        p.classList.add('bought');
    } else {
        p.classList.add('unbought');
    }

    // - adds classlist of item
    p.classList.add('item');

    // - returns DOM element
    return p;

}