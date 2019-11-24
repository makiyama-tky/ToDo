import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import axios from 'axios';

export const Item: React.FC<{
  todoItem: TodoItem;
  onCheckClick: (id: string, done: boolean) => void;
  onDeleteClick: (id: string) => void;
}> = props => {
  const { todoItem, onCheckClick, onDeleteClick } = props;
  return (
    <li>
      <input
        type="checkbox"
        onChange={() => onCheckClick(todoItem._id, !todoItem.done)}
        checked={todoItem.done}
      />
      {todoItem.name}
      <button onClick={() => onDeleteClick(todoItem._id)}>削除</button>
    </li>
  );
};

export const App: React.FC = props => {
  const [newName, setNewName] = useState<string>('');
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

  const load = async () => {
    const items = await axios.get('/items');
    setTodoItems(items.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateClick = async () => {
    await axios.post('/items', newName, {
      headers: { 'content-type': 'text/plain' }
    });
    await load();
    setNewName('');
  };

  const handleCheckClick = async (itemId: string, done: boolean) => {
    await axios.patch('/items/' + itemId, { done });
    await load();
  };

  const handleDeleteClick = async (itemId: string) => {
    await axios.delete('/items/' + itemId);
    await load();
  };

  return (
    <main>
      <h1>やること</h1>
      <input
        type="text"
        value={newName}
        onChange={event => setNewName(event.target.value)}
      />
      <button onClick={handleCreateClick} disabled={newName === ''}>
        入力
      </button>
      <ul>
        {todoItems.map(todoItem => (
          <Item
            key={todoItem._id}
            onCheckClick={handleCheckClick}
            todoItem={todoItem}
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </ul>
    </main>
  );
};

export default App;
