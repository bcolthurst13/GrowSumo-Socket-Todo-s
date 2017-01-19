const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

// A flag to make sure we don't reload data when the client is refreshed so long
// as the server is running.
let isTheServerRunning = false;
// Our fake 'database' connection / data
let DB = [];
// A quick backup cache
let cache = [];

server.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    // We only want our initial data if the server has just been restarted
    if(!isTheServerRunning){
      DB = firstTodos.map((t) => {
          // Form new Todo objects
          return new Todo(t.title);
      });

      // The server should be running now...
      isTheServerRunning = true;
    }

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
      if(DB === undefined){
        server.emit('load', cache);
      } else {
        server.emit('load', DB);
        cache = DB;
      }
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(title=t.title);

        // Push this newly created todo to our database
        DB.push(newTodo);

        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        reloadTodos();
    });

    // Accepts when a client updates a todo (at the moment just todo completion)
    client.on('update', (id) => {

      // This feels a little inefficient, but essentially we want to find the
      // correct object inside the array and change the 'completed' param to true
      DB.forEach(todo => {
        if(todo.id === id){
          todo.completed = true
        }
      })

      reloadTodos();
    });

    // Accepts when a client deletes a todo
    client.on('delete', (id) => {
      // Get the array of todo objects with the selected id filtered out / removed
      const updatedDB = DB.filter(todo => { return todo.id !== id });

      // Update our 'DB'
      DB = updatedDB;

      reloadTodos();
    });

    // Accepts when a client completes all remaining todo's
    client.on('completeAll', () => {

      // Update any item that isn't marked as 'complete', to be completed
      DB.forEach(todo => {
        if(todo.completed === false){
          todo.completed = true
        }
      })

      reloadTodos();
    });

    // Accepts when a client completes all remaining todo's
    client.on('deleteAll', () => {

      // Set the DB to an empty array.
      DB = [];

      reloadTodos();
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);
