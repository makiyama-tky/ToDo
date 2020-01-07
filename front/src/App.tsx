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
      <label>
        <input
          type="checkbox"
          className="checkbox"
          onChange={() => onCheckClick(todoItem._id, !todoItem.done)}
          checked={todoItem.done}
        />
        {todoItem.name}
      </label>
      <button className="delButton" onClick={() => onDeleteClick(todoItem._id)}>
        <i className="fas fa-trash-alt"></i>
      </button>
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
      <div>
        <h1>ToDo</h1>
      </div>
      <input
        type="text"
        className="textbox"
        value={newName}
        onChange={event => setNewName(event.target.value)}
      />
      <button onClick={handleCreateClick} className="addButton">
        Add ToDo
      </button>
      <div className="container">
        <ul className="item">
          {todoItems.map(todoItem => (
            <Item
              key={todoItem._id}
              onCheckClick={handleCheckClick}
              todoItem={todoItem}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </ul>
      </div>
    </main>
  );
};

export default App;
