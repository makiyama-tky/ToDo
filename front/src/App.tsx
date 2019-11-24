import React from 'react';
import ToDoItem from './ToDoItem';

export const Item: React.FC<{ todoItem: ToDoItem }> = props => {
  const { todoItem } = props;
  return (
    <li>
      <input type="checkbox" name="done" checked={todoItem.done} />
      {todoItem.name}
    </li>
  );
};

export const App: React.FC = props => {
  const todoItems: ToDoItem[] = [
    { _id: 'a12', name: '旅行', done: false },
    { _id: 'a23', name: '買い物', done: true },
    { _id: 'a34', name: '宿題', done: false }
  ];

  return (
    <main>
      <h1>やること</h1>
      <input type="text" />
      <button>入力</button>
      <ul>
        {todoItems.map(todoItem => (
          <Item key={todoItem._id} todoItem={todoItem} />
        ))}
      </ul>
    </main>
  );
};

export default App;
