import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-project.html',
  styleUrls: ['./create-project.css']
})
export class CreateProjectComponent {

  project = {
    title: '',
    objective: '',
    budget: 0,
    hardware: '',
    licenses: '',
    creator_id: 2, // Hardcoded for demo
    file_path: ''  // <--- NEW: To store the file name
  };

  tasks: any[] = [
    { title: '', description: '', duration: 1, deadline: '' }
  ];

  constructor(private api: ApiService, private router: Router) { }

  // <--- NEW: Handle File Selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you would upload this to a server.
      // For this prototype, we just save the fake path/name to satisfy the DB.
      this.project.file_path = '/uploads/' + file.name;
    }
  }

  addTask() {
    this.tasks.push({ title: '', description: '', duration: 1, deadline: '' });
  }

  removeTask(index: number) {
    this.tasks.splice(index, 1);
  }

  onSubmit() {
    this.api.createProject(this.project).subscribe({
      next: (res: any) => {
        // FIX: Ensure we grab 'res.id' (which we just added to the backend)
        const projectId = res.id;
        console.log('New Project ID:', projectId);

        if (!projectId) {
          alert('Erreur: ID du projet manquant');
          return;
        }

        // Loop and Save Tasks with the correct Project ID
        this.tasks.forEach(task => {
          const taskData = { ...task, project_id: projectId };
          this.api.addTask(taskData).subscribe();
        });

        alert('Projet et Tâches créés avec succès !');
        this.router.navigate(['/employee/tasks']);
      },
      error: (err) => alert('Erreur lors de la création du projet')
    });
  }
}