const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

let DB = [];

server.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db
    console.log("Someone connected!!");

    // We only want our initial data if we have no data to work with.
    if(DB.length === 0){
      DB = firstTodos.map((t) => {
          // Form new Todo objects
          return new Todo(t.title);
      });
    }

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', DB);
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

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);
