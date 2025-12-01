import { Component, inject } from '@angular/core';
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

  private api = inject(ApiService);
  private router = inject(Router);

  // Get User from Session
  currentUser = this.api.getCurrentUser();

  project = {
    title: '',
    objective: '',
    budget: 0,
    hardware: '',
    licenses: '',
    creator_id: this.currentUser ? this.currentUser.id : 0,
    file_path: ''
  };

  tasks: any[] = [
    { title: '', description: '', duration: 1, deadline: '' }
  ];

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
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
    // Safety check
    if (!this.currentUser) {
      alert("Session expirée, veuillez vous reconnecter.");
      this.router.navigate(['/login']);
      return;
    }

    this.api.createProject(this.project).subscribe({
      next: (res: any) => {
        const projectId = res.id;

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