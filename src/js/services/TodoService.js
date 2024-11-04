export class TodoService {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem('todos')) || [];
  }

  getTodos(projectId) {
    return this.todos.filter(todo => todo.projectId === projectId);
  }

  addTodo({ title, description, dueDate, priority, projectId }) {
    const todo = {
      id: Date.now().toString(),
      title,
      description,
      dueDate,
      priority,
      projectId,
      completed: false
    };
    this.todos.push(todo);
    this.saveTodos();
    return todo;
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
  }

  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}