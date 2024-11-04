export class Project {
  constructor(name, color = '#6366f1') {
    this.id = crypto.randomUUID();
    this.name = name;
    this.color = color;
  }
}