'use client';

import { useState, useEffect } from 'react';
import { createTodo, getTodos, updateTodo, editTodo, deleteTodo } from '@/app/actions/todo';

export default function Home() {
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState<{ id: number | null; title: string; description?: string }>({
    id: null,
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const todos = await getTodos();
    setTodos(todos);
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() === '') return;
    await createTodo(newTodo);
    setNewTodo('');
    fetchTodos(); // 新しいTodoを追加後にリストを再取得
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    await updateTodo(id, !completed);
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTodo(id);
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (todo: { id: number; title: string; description?: string }) => {
    setEditingTodo({ id: todo.id, title: todo.title, description: todo.description });
  };

  const handleUpdateTodo = async () => {
    if (editingTodo.id !== null && editingTodo.title.trim() !== '') {
      await editTodo(editingTodo.id, editingTodo.title, editingTodo.description);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editingTodo.id
            ? { ...todo, title: editingTodo.title, description: editingTodo.description }
            : todo
        )
      );
      setEditingTodo({ id: null, title: '', description: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Todo List</h1>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="New Todo"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Todo
          </button>
        </div>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="mb-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id, todo.completed)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  {editingTodo.id === todo.id ? (
                    <div className="flex-1">
                      <input
                        type="text"
                        value={editingTodo.title}
                        onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={editingTodo.description || ''}
                        onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                        className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Description (optional)"
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <span className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {todo.title}
                      </span>
                      {todo.description && (
                        <p className="text-sm text-gray-600">{todo.description}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingTodo.id === todo.id ? (
                    <button
                      onClick={handleUpdateTodo}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditTodo(todo)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}