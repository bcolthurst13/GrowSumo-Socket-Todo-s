import React from 'react';

export default class TodoItem extends React.Component {
  handleCompleteTodo = () => {
    const { todo, completeTodo } = this.props;

    completeTodo(todo.id);
  }
  render = () => {
    const { todo } = this.props;

    return <div>
      <p>{todo.title}</p>
      <span>{todo.timestamp}</span>
      <button onClick={this.handleCompleteTodo}>Complete</button>
      {
        todo.completed &&
        <div>Completed!!</div>
      }
    </div>;
  }
}
