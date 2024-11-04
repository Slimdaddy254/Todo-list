import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, Project } from '../types/todo';

interface TodoStore {
  todos: Todo[];
  projects: Project[];
  selectedProjectId: string;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  addProject: (name: string, color: string) => void;
  deleteProject: (id: string) => void;
  setSelectedProject: (id: string) => void;
}

const DEFAULT_PROJECT: Project = {
  id: 'default',
  name: 'My Tasks',
  color: '#6366f1'
};

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],
      projects: [DEFAULT_PROJECT],
      selectedProjectId: DEFAULT_PROJECT.id,
      addTodo: (todo) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              ...todo,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString()
            }
          ],
        })),
      updateTodo: (id, updatedTodo) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updatedTodo } : todo
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      addProject: (name, color) =>
        set((state) => ({
          projects: [...state.projects, { id: crypto.randomUUID(), name, color }],
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          todos: state.todos.filter((todo) => todo.projectId !== id),
        })),
      setSelectedProject: (id) =>
        set({ selectedProjectId: id }),
    }),
    {
      name: 'todo-storage',
    }
  )
);