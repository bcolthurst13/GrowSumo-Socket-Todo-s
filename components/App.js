import React from 'react';
import TodoItem from './TodoItem';

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
  }

  handleKeyPress = (event) => {
    if(event.keyCode === 13){
      this.addItem();
    }
  }

  completeTodo = (id) => {
    const { server } = this.props;

    server.emit('update', id);
  }

  deleteTodo = (id) => {
    const { server } = this.props;

    server.emit('delete', id);
  }

  completeAll = () => {
    const { server } = this.props;

    server.emit('completeAll');
  }

  deleteAll = () => {
    const { server } = this.props;

    server.emit('deleteAll');
  }

  render = () => {
    const { input, todos } = this.state;

    return <div>
      <h2 className="page-title">the grand co-operative todo list.</h2>
      <div className="todo-options">
        <div className="top-container">
          <div className="input-container">
            <span onClick={this.addItem} className="add-todo fa fa-plus fa-2x"/>
            <input
              className="add-todo-input"
              value={input}
              type="text"
              placeholder="We need to..."
              onChange={this.inputChange}
              onKeyDown={this.handleKeyPress}
              ref={inputRef => inputRef && inputRef.focus()}
            />
          </div>
        </div>
      </div>
      <div className="todo-item-container">
        {
          todos.map(todo => {
            return <TodoItem todo={todo} completeTodo={this.completeTodo} deleteTodo={this.deleteTodo} />
          })
        }
      </div>
      {
        todos.length === 0 &&
        <h1 className="empty-list">You've got nothing to do! :D</h1>
      }
      {
        todos.length > 0 &&
        <div className="button-container">
          <div className="big-button" onClick={this.completeAll}><p>We've actually done all of these!</p></div>
          <div className="big-button" onClick={this.deleteAll}><p>$*!# this, delete 'em all</p></div>
        </div>
      }
    </div>;
  }
}
