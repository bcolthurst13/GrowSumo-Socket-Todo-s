import React from 'react';

export default class App extends React.Component {
  constructor(props){
    super();
    // Some defualt state
    this.state = {
      input: '',
      todos: [],
    }
    // On a load event from the server, sync up the todos from the server to
    // the application state.
    props.server.on('load', (todos) => this.handleUpdateTodos(todos));
  }

  handleUpdateTodos = (todos) => {
    if(todos === this.state.todos){
      // The state is unchanged
      return;
    } else {
      this.setState({
        todos: todos,
      });
    }
  }

  // Handle changes to the state of the inut field
  inputChange = (event) => {
    this.setState({
      input: event.target.value,
    })
  }

  // Function to add a new item to the list from the input
  addItem = () => {
    const {
      props: {
        server,
      },
      state: {
        input,
      },
    } = this;

    server.emit('make', {
        title : input
    });

    this.setState({
      input: '',
    });
    // TODO: refocus the element
  }
  render = () => {
    const { input, todos } = this.state;

    return <div>
      <input value={input} type="text" placeholder="Feed the cat" onChange={this.inputChange} autoFocus />
      <button type="button" onClick={this.addItem}>Make</button>
      {
        todos.map(todo => {
          return <li>{todo.title}</li>
        })
      }
    </div>;
  }
}
