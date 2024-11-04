import React from 'react';
import { Sidebar } from './components/Sidebar';
import { TodoList } from './components/TodoList';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <TodoList />
      </main>
    </div>
  );
}

export default App;