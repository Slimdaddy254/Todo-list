export class ProjectService {
  constructor() {
    this.projects = JSON.parse(localStorage.getItem('projects')) || [
      { id: 'default', name: 'My Tasks' }
    ];
  }

  getProjects() {
    return this.projects;
  }

  addProject(name) {
    const project = {
      id: Date.now().toString(),
      name
    };
    this.projects.push(project);
    this.saveProjects();
    return project;
  }

  deleteProject(id) {
    if (id === 'default') return false;
    this.projects = this.projects.filter(project => project.id !== id);
    this.saveProjects();
    return true;
  }

  saveProjects() {
    localStorage.setItem('projects', JSON.stringify(this.projects));
  }
}