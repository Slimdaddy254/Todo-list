import '../css/styles.css';
import { ProjectService } from './services/ProjectService';
import { TodoService } from './services/TodoService';
import { formatDate } from './utils/dateUtils';

class App {
  constructor() {
    this.projectService = new ProjectService();
    this.todoService = new TodoService();
    this.currentProjectId = 'default';

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initialize());
    } else {
      this.initialize();
    }
  }

  initialize() {
    this.initializeElements();
    this.bindEvents();
    this.render();
  }

  initializeElements() {
    this.projectsList = document.getElementById('projectsList');
    this.todoList = document.getElementById('todoList');
    this.currentProjectTitle = document.getElementById('currentProject');
    this.addProjectBtn = document.getElementById('addProjectBtn');
    this.addTodoBtn = document.getElementById('addTodoBtn');
    this.projectModal = document.getElementById('projectModal');
    this.todoModal = document.getElementById('todoModal');
    this.deleteModal = document.getElementById('deleteModal');
    this.projectForm = document.getElementById('projectForm');
    this.todoForm = document.getElementById('todoForm');
    this.cancelProjectBtn = document.getElementById('cancelProject');
    this.cancelTodoBtn = document.getElementById('cancelTodo');
    this.cancelDeleteBtn = document.getElementById('cancelDelete');
    this.confirmDeleteBtn = document.getElementById('confirmDelete');
    this.deleteModalTitle = document.getElementById('deleteModalTitle');
    this.deleteModalMessage = document.getElementById('deleteModalMessage');
  }

  bindEvents() {
    // Project related events
    this.addProjectBtn.addEventListener('click', () => this.showProjectModal());
    this.cancelProjectBtn.addEventListener('click', () => this.closeProjectModal());
    this.projectForm.addEventListener('submit', (e) => this.handleProjectSubmit(e));

    // Todo related events
    this.addTodoBtn.addEventListener('click', () => this.showTodoModal());
    this.cancelTodoBtn.addEventListener('click', () => this.closeTodoModal());
    this.todoForm.addEventListener('submit', (e) => this.handleTodoSubmit(e));

    // Delete modal events
    this.cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
    this.confirmDeleteBtn.addEventListener('click', () => this.handleConfirmDelete());
  }

  handleProjectSubmit(e) {
    e.preventDefault();
    const projectName = document.getElementById('projectName').value.trim();
    if (projectName) {
      this.projectService.addProject(projectName);
      this.closeProjectModal();
      this.render();
    }
  }

  handleTodoSubmit(e) {
    e.preventDefault();
    const todo = {
      title: document.getElementById('todoTitle').value.trim(),
      description: document.getElementById('todoDescription').value.trim(),
      dueDate: document.getElementById('todoDueDate').value,
      priority: document.getElementById('todoPriority').value,
      projectId: this.currentProjectId
    };

    if (todo.title && todo.description && todo.dueDate) {
      this.todoService.addTodo(todo);
      this.closeTodoModal();
      this.render();
    }
  }

  render() {
    this.renderProjects();
    this.renderTodos();
  }

  renderProjects() {
    const projects = this.projectService.getProjects();
    this.projectsList.innerHTML = projects
      .map(project => this.createProjectElement(project))
      .join('');

    this.attachProjectEventListeners();
  }

  renderTodos() {
    const todos = this.todoService.getTodos(this.currentProjectId);
    this.todoList.innerHTML = todos
      .map(todo => this.createTodoElement(todo))
      .join('');

    this.attachTodoEventListeners();
  }

  createProjectElement(project) {
    return `
      <div class="project-item ${project.id === this.currentProjectId ? 'active' : ''}"
           data-project-id="${project.id}">
        ${project.name}
        ${project.id !== 'default' ? 
          `<button class="delete-btn" data-project-id="${project.id}">×</button>` : 
          ''}
      </div>
    `;
  }

  createTodoElement(todo) {
    return `
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
        <button class="delete-btn" data-todo-id="${todo.id}">×</button>
      </div>
    `;
  }

  attachProjectEventListeners() {
    this.projectsList.querySelectorAll('.project-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('delete-btn')) {
          this.switchProject(item.dataset.projectId);
        }
      });
    });

    this.projectsList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showDeleteConfirmation('project', btn.dataset.projectId);
      });
    });
  }

  attachTodoEventListeners() {
    this.todoList.querySelectorAll('.todo-checkbox').forEach(checkbox => {
      checkbox.addEventListener('click', () => {
        this.todoService.toggleTodo(checkbox.dataset.todoId);
        this.render();
      });
    });

    this.todoList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showDeleteConfirmation('todo', btn.dataset.todoId);
      });
    });
  }

  switchProject(projectId) {
    this.currentProjectId = projectId;
    const project = this.projectService.getProjects().find(p => p.id === projectId);
    this.currentProjectTitle.textContent = project.name;
    this.render();
  }

  showProjectModal() {
    this.projectModal.classList.add('active');
    const projectNameInput = document.getElementById('projectName');
    projectNameInput.value = '';
    projectNameInput.focus();
  }

  closeProjectModal() {
    this.projectModal.classList.remove('active');
    this.projectForm.reset();
  }

  showTodoModal() {
    this.todoModal.classList.add('active');
    const todoTitleInput = document.getElementById('todoTitle');
    todoTitleInput.value = '';
    document.getElementById('todoDescription').value = '';
    document.getElementById('todoDueDate').value = '';
    document.getElementById('todoPriority').value = 'medium';
    todoTitleInput.focus();
  }

  closeTodoModal() {
    this.todoModal.classList.remove('active');
    this.todoForm.reset();
  }

  showDeleteConfirmation(type, id) {
    this.pendingDeleteItem = { type, id };
    
    if (type === 'project') {
      this.deleteModalTitle.textContent = 'Delete Project';
      this.deleteModalMessage.textContent = 'Are you sure you want to delete this project? All associated tasks will be deleted.';
    } else {
      this.deleteModalTitle.textContent = 'Delete Task';
      this.deleteModalMessage.textContent = 'Are you sure you want to delete this task?';
    }
    
    this.deleteModal.classList.add('active');
  }

  closeDeleteModal() {
    this.deleteModal.classList.remove('active');
    this.pendingDeleteItem = null;
  }

  handleConfirmDelete() {
    if (!this.pendingDeleteItem) return;

    const { type, id } = this.pendingDeleteItem;

    if (type === 'project') {
      if (this.projectService.deleteProject(id)) {
        if (this.currentProjectId === id) {
          this.switchProject('default');
        } else {
          this.render();
        }
      }
    } else {
      this.todoService.deleteTodo(id);
      this.render();
    }

    this.closeDeleteModal();
  }
}

// Initialize the app
new App();