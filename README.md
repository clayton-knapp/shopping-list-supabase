## The Golden Rule: 

🦸 🦸‍♂️ `Stop starting and start finishing.` 🏁

If you work on more than one feature at a time, you are guaranteed to multiply your bugs and your anxiety.

## Making a plan

1) **Make a drawing of your app. Simple "wireframes"**
1) **Once you have a drawing, name the HTML elements you'll need to realize your vision**
1) **For each HTML element ask: Why do I need this?** 
1) **Once we know _why_ we need each element, think about how to implement the "Why" as a "How"**
1) **Find all the 'events' (user clicks, form submit, on load etc) in your app. Ask one by one, "What happens when" for each of these events. Does any state change?**
1) **Think about how to validate each of your features according to a Definition of Done**
1) **Consider what features _depend_ on what other features. Use this dependency logic to figure out what order to complete tasks.**

Additional considerations:
- Ask: which of your HTML elements need to be hard coded, and which need to be dynamically generated?
- Consider your data model. 
  - What kinds of objects (i.e., Dogs, Friends, Todos, etc) will you need? 
  - What are the key/value pairs? 
  - What arrays might you need? 
  - What needs to live in a persistence layer?
- Is there some state we need to initialize?
- Ask: should any of this work be abstracted into functions? (i.e., is the work complicated? can it be resused?)



HTML SETUP
- Form to input quantity and item
    - 2 input fields
    - submit button
- Delete all Items Button
- Empty Div to display list of returned items


EVENTS
- Submit of Item
    - Grabs user input quantity and item
    - calls createItem which inserts to Supabase
    - passes in values, inserts with bought = false (also set up by default in supabase)
    - fetches and displays new list

- Delete Shopping List click
    - calls deleteAllItems for that user (match done automatically with RLS and foreign key + user_id in supabase)
    - fetches and displays new list

- Click of item
    - calls buyItem and passes item id which updates in supabase with bought = true and matches with that item id
    - fetches and displays new list

- Window load
    - fetches and displays list


FUNCTIONS
- displayListItems
    - either makes a call with fetchItems or gets passed an object returned from an early server call
    - takes returned item array of objects
    - uses for loop to pass to renderItem function which returns DOM elements
    - appends DOM elements to listEl

- renderItem(item)
    - makes p tags
    - sets textcontent to quantity and item name
    - adds classlist of bought or unbought depending
    - adds classlist of item
    - returns DOM element