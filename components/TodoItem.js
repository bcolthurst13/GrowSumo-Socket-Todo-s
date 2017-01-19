import React from 'react';

export default class TodoItem extends React.Component {
  handleCompleteTodo = () => {
    const { todo, completeTodo } = this.props;

    completeTodo(todo.id);
  }
  handleDeleteTodo = () => {
    const { todo, deleteTodo } = this.props;

    deleteTodo(todo.id);
  }
  render = () => {
    const { todo } = this.props;

    return <div className="todo-line-item">
      <p className="todo-line-item-title">{todo.title}</p>
      <span onClick={this.handleCompleteTodo} className="complete-todo fa fa-check fa-2x" style={todo.completed ? { color: 'green' } : {}}/>
      <span onClick={this.handleDeleteTodo} className="delete-todo fa fa-trash fa-2x" />
      {
        todo.completed &&
        <div className="strike-through" />
      }
    </div>;
  }
}
