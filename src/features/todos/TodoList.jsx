import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient  } from 'react-query';
import { addTodo, deleteTodo, getTodos, updateTodo } from '../../api/todosApi';

const TodoList = () => {
  const [newTodo, setNewTodo] = useState('');
  const queryClient = useQueryClient(); 

  const { data: todos, isLoading, isError, error } = useQuery('todos', getTodos, {
    select: (data) => data.sort((a, b) => b.id - a.id)
  }); 

  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    }
  })

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    }
  })

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodoMutation.mutate({ userId: 1, title: newTodo, completed: false });

    setNewTodo('');
  }

  const newItemSection = (
    <form onSubmit={handleSubmit}>
        <label htmlFor="new-todo">Enter a new todo item</label>
        <div className="new-todo">
            <input
                type="text"
                id="new-todo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Enter new todo"
            />
        </div>
        <button className="submit">
            <FontAwesomeIcon icon={faUpload} />
        </button>
    </form>
  )

  let content;

  if (isLoading) {
    content = <div>is loading...</div>
  } else if (isError) {
    content = <div>{error.message}</div>
  } else {
    content = todos.map(todo => {
      return (
        <article key={todo.id}>
          <div className="todo">
            <input
              type="checkbox"
              checked={todo.completed}
              id={todo.id}
              onChange={() => {
                updateTodoMutation.mutate({...todo, completed: !todo.completed})
              }}
            />
            <label htmlFor={todo.id}>{todo.title}</label>
          </div>
          <button className="trash" onClick={() => deleteTodoMutation.mutate({ id: todo.id })}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </article>
      )
    })
  }

  return (
    <div>
      <h1>Todo list</h1>
      {newItemSection}
      {content}
    </div>
  );
};

export default TodoList;