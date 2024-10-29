import '../css/styles.css';
import { TodoService } from './services/TodoService';
import { ProjectService } from './services/ProjectService';
import { Todo } from './models/Todo';
import { Project } from './models/Project';
import { formatDate } from './utils/dateUtils';

class App {
  constructor() {
    this.todoService = new TodoService();
    this.projectService = new ProjectService();
    this.currentProjectId = 'default';

    this.initializeElements();
    this.bindEvents();
    this.renderProjects();
    this.renderTodos();
  }

  initializeElements() {
    // Projects
    this.projectsList = document.getElementById('projectsList');
    this.addProjectBtn = document.getElementById('addProjectBtn');
    this.currentProjectTitle = document.getElementById('currentProject');

    // Todos
    this.todoList = document.getElementById('todoList');
    this.addTodoBtn = document.getElementById('addTodoBtn');
    this.todoModal = document.getElementById('todoModal');
    this.todoForm = document.getElementById('todoForm');
    this.cancelTodoBtn = document.getElementById('cancelTodo');
  }

  bindEvents() {
    this.addProjectBtn.addEventListener('click', () => this.handleAddProject());
    this.addTodoBtn.addEventListener('click', () => this.openTodoModal());
    this.todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
    this.cancelTodoBtn.addEventListener('click', () => this.closeTodoModal());
  }

  renderProjects() {
    const projects = this.projectService.getProjects();
    this.projectsList.innerHTML = projects
      .map(project => `
        <div class="project-item ${project.id === this.currentProjectId ? 'active' : ''}"
             data-project-id="${project.id}">
          ${project.name}
          ${project.id !== 'default' ? 
            `<button class="delete-project" data-project-id="${project.id}">×</button>` : 
            ''}
        </div>
      `)
      .join('');

    // Add click events to project items
    this.projectsList.querySelectorAll('.project-item').forEach(item => {
      item.addEventListener('click', () => this.switchProject(item.dataset.projectId));
    });

    // Add click events to delete buttons
    this.projectsList.querySelectorAll('.delete-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleDeleteProject(btn.dataset.projectId);
      });
    });
  }

  renderTodos() {
    const todos = this.todoService.getTodos(this.currentProjectId);
    this.todoList.innerHTML = todos
      .map(todo => `
        <div class="todo-item">
          <div class="todo-checkbox ${todo.completed ? 'checked' : ''}"
               data-todo-id="${todo.id}"></div>
          <div class="todo-content">
            <h3 class="todo-title">${todo.title}</h3>
            <p class="todo-description">${todo.description}</p>
            <div class="todo-meta">
              <span class="todo-priority priority-${todo.priority}">${todo.priority}</span>
              <span class="todo-date">${formatDate(todo.dueDate)}</span>
            </div>
          </div>
          <button class="delete-todo" data-todo-id="${todo.id}">×</button>
        </div>
      `)
      .join('');

    // Add click events to checkboxes
    this.todoList.querySelectorAll('.todo-checkbox').forEach(checkbox => {
      checkbox.addEventListener('click', () => this.toggleTodo(checkbox.dataset.todoId));
    });

    // Add click events to delete buttons
    this.todoList.querySelectorAll('.delete-todo').forEach(btn => {
      btn.addEventListener('click', () => this.handleDeleteTodo(btn.dataset.todoId));
    });
  }

  handleAddProject() {
    const name = prompt('Enter project name:');
    if (name) {
      const project = new Project(name);
      this.projectService.addProject(project);
      this.renderProjects();
    }
  }

  handleDeleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
      if (this.projectService.deleteProject(projectId)) {
        if (this.currentProjectId === projectId) {
          this.switchProject('default');
        } else {
          this.renderProjects();
        }
      }
    }
  }

  switchProject(projectId) {
    this.currentProjectId = projectId;
    const project = this.projectService.getProjects().find(p => p.id === projectId);
    this.currentProjectTitle.textContent = project.name;
    this.renderProjects();
    this.renderTodos();
  }

  openTodoModal() {
    this.todoModal.classList.add('active');
    this.todoForm.reset();
  }

  closeTodoModal() {
    this.todoModal.classList.remove('active');
  }

  handleAddTodo(e) {
    e.preventDefault();
    const formData = new FormData(this.todoForm);
    const todo = new Todo(
      formData.get('title'),
      formData.get('description'),
      formData.get('dueDate'),
      formData.get('priority'),
      this.currentProjectId
    );
    this.todoService.addTodo(todo);
    this.closeTodoModal();
    this.renderTodos();
  }

  toggleTodo(todoId) {
    this.todoService.toggleTodo(todoId);
    this.renderTodos();
  }

  handleDeleteTodo(todoId) {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoService.deleteTodo(todoId);
      this.renderTodos();
    }
  }
}

// Initialize the app
new App();