export class ProjectService {
    constructor() {
      this.projects = JSON.parse(localStorage.getItem('projects')) || [
        { id: 'default', name: 'My Tasks' }
      ];
    }
  
    addProject(project) {
      this.projects.push(project);
      this._save();
      return project;
    }
  
    getProjects() {
      return this.projects;
    }
  
    deleteProject(id) {
      if (id === 'default') return false;
      this.projects = this.projects.filter(project => project.id !== id);
      this._save();
      return true;
    }
  
    _save() {
      localStorage.setItem('projects', JSON.stringify(this.projects));
    }
  }