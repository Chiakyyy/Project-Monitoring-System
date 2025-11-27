import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- Import FormsModule
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-project-validation',
  standalone: true,
  imports: [CommonModule, FormsModule], // <--- Add FormsModule here
  templateUrl: './project-validation.html',
  styleUrls: ['./project-validation.css']
})
export class ProjectValidationComponent implements OnInit {

  // Data Sources
  allProjects: any[] = []; // Master list (backup)
  projects: any[] = [];    // Displayed list (filtered)

  // Filter UI State
  showFilters = false;
  filters = {
    status: '',       // '' means All
    date: '',         // YYYY-MM-DD
    minBudget: null   // Number
  };

  private api = inject(ApiService);
  private cd = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.api.getAllProjects().subscribe({
      next: (data) => {
        // Store everything in the master list
        this.allProjects = data.sort((a: any, b: any) =>
          (a.status === 'PENDING' ? -1 : 1)
        );
        // Initialize displayed list
        this.projects = [...this.allProjects];
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // Toggle the filter panel
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  // The Filtering Logic (Source 29: Options stats/filters)
  applyFilters() {
    this.projects = this.allProjects.filter(p => {
      // 1. Status Filter
      const statusMatch = this.filters.status ? p.status === this.filters.status : true;

      // 2. Budget Filter (Projects with budget >= input)
      const budgetMatch = this.filters.minBudget ? p.budget_estimated >= this.filters.minBudget : true;

      // 3. Date Filter (Projects created on or after this date)
      // Note: We strip time for simple comparison
      let dateMatch = true;
      if (this.filters.date) {
        const pDate = new Date(p.created_at).toISOString().split('T')[0]; // "2024-11-27"
        dateMatch = pDate >= this.filters.date;
      }

      return statusMatch && budgetMatch && dateMatch;
    });
  }

  resetFilters() {
    this.filters = { status: '', date: '', minBudget: null };
    this.projects = [...this.allProjects];
  }

  updateStatus(project: any, newStatus: string) {
    if (!confirm(`Passer ce projet en ${newStatus} ?`)) return;

    this.api.validateProject(project.id, newStatus).subscribe({
      next: () => {
        project.status = newStatus;
        alert(`Projet marqué comme ${newStatus}`);
        this.cd.detectChanges();
      },
      error: () => alert('Erreur lors de la mise à jour')
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACCEPTED': return 'success';
      case 'INVALID': return 'danger';
      case 'PENDING': return 'warning';
      default: return 'secondary';
    }
  }
}