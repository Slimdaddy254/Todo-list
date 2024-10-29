export class TodoService {
    constructor() {
      this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    }
  
    addTodo(todo) {
      this.todos.push(todo);
      this._save();
      return todo;
    }
  
    getTodos(projectId) {
      return this.todos.filter(todo => todo.projectId === projectId);
    }
  
    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        this._save();
      }
      return todo;
    }
  
    deleteTodo(id) {
      this.todos = this.todos.filter(todo => todo.id !== id);
      this._save();
    }
  
    _save() {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    }
  }