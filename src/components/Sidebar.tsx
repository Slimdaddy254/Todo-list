import React from 'react';
import { FolderKanban, Plus } from 'lucide-react';
import { useTodoStore } from '../store/todoStore';

export const Sidebar = () => {
  const { projects, selectedProjectId, setSelectedProject, addProject } = useTodoStore();
  
  const handleAddProject = () => {
    const name = prompt('Enter project name:');
    if (name) {
      const colors = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      addProject(name, randomColor);
    }
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Projects</h1>
        <button
          onClick={handleAddProject}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Plus size={20} className="text-gray-600" />
        </button>
      </div>
      <div className="space-y-2">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => setSelectedProject(project.id)}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              selectedProjectId === project.id
                ? 'bg-gray-100'
                : 'hover:bg-gray-50'
            }`}
          >
            <FolderKanban
              size={20}
              style={{ color: project.color }}
            />
            <span className="text-gray-700">{project.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};