// src/App.tsx

import { useState } from 'react';
import TreeView from './components/TreeView/TreeView';
import KanbanBoard from './components/Kanban/KanbanBoard';
import './App.css';

type View = 'tree' | 'kanban';

function App() {
  const [currentView, setCurrentView] = useState<View>('kanban');

  return (
    <div className="App">
      <nav className="app-nav">
        <div className="nav-container">
          <h1 className="app-title">Frontend Assessment</h1>
          <div className="nav-buttons">
            <button
              onClick={() => setCurrentView('tree')}
              className={`nav-btn ${currentView === 'tree' ? 'active' : ''}`}
            >
              🌲 Tree View
            </button>
            <button
              onClick={() => setCurrentView('kanban')}
              className={`nav-btn ${currentView === 'kanban' ? 'active' : ''}`}
            >
              📋 Kanban Board
            </button>
          </div>
        </div>
      </nav>

      <main className="app-main">
        {currentView === 'tree' ? <TreeView /> : <KanbanBoard />}
      </main>
    </div>
  );
}

export default App;