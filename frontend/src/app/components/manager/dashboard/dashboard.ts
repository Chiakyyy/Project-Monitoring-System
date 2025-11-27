import { Component, OnInit, ChangeDetectorRef, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api';
import { HttpClientModule } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  stats: any = null;
  notifications: any[] = [];
  isLoading = true;
  errorMessage = '';
  detailedTasks: any[] = [];


  // Chart Data Variables
  public pieChartData: any = null;
  public barChartData: any = null;
  public lineChartData: any = null;

  private api = inject(ApiService);
  private cd = inject(ChangeDetectorRef);

  private platformId = inject(PLATFORM_ID);
  
  // Create a flag to check if we are in the browser
  isBrowser = isPlatformBrowser(this.platformId);

  ngOnInit() {
    if (this.isBrowser) {
      this.loadData();
    }
  }

  loadData() {
    // 1. Get Stats
    this.api.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.setupCharts(data); // <--- Build Charts here
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Stats Error:', err);
        this.errorMessage = 'Erreur chargement statistiques.';
        this.checkLoadingComplete();
      }
    });

    // 2. Get Notifications
    this.api.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.checkLoadingComplete();
      },
      error: (err) => {
        this.checkLoadingComplete();
      }
    });

    // 3. Fetch Task Details
    this.api.getTaskDetails().subscribe({
      next: (data) => {
        this.detailedTasks = data;
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  checkLoadingComplete() {
    this.isLoading = false;
    this.cd.detectChanges(); // Force the screen to update
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACCEPTED': return 'success';
      case 'INVALID': return 'danger';
      case 'PENDING': return 'warning';
      default: return 'secondary';
    }
  }

  getProjectCount(statusName: string): number {
    if (!this.stats || !this.stats.projects_by_status) return 0;

    // Find the item in the list that matches the status (e.g., 'PENDING')
    const found = this.stats.projects_by_status.find((s: any) => s.status === statusName);

    // Return the count if found, otherwise return 0
    return found ? found.count : 0;
  }

  managerValidateTask(task: any, newStatus: string) {
    // Optional: Confirm with the user
    if (!confirm(`Confirmer le changement de statut en "${newStatus}" ?`)) return;

    this.api.updateTaskStatus(task.id, newStatus).subscribe({
      next: () => {
        // 1. Update the UI locally so it turns Green/Red instantly
        task.status = newStatus;

        // 2. Force screen refresh
        this.cd.detectChanges();

        // 3. Optional: Re-fetch stats if you want the "Charts" to update too
        // this.loadData(); 
      },
      error: (err) => alert('Erreur lors de la mise à jour')
    });
  }

  setupCharts(data: any) {
    // --- Chart 1: Projects by Status (Pie) ---
    const statusLabels = data.projects_by_status.map((x: any) => x.status);
    const statusCounts = data.projects_by_status.map((x: any) => x.count);

    this.pieChartData = {
      labels: statusLabels,
      datasets: [{
        data: statusCounts,
        backgroundColor: ['#ffc107', '#198754', '#dc3545'], // Green, Red, Yellow
        hoverBackgroundColor: ['#ffc107', '#198754', '#dc3545']
      }]
    };

    // --- Chart 2: Projects by User (Bar) ---
    const userLabels = data.projects_by_user.map((x: any) => x.full_name);
    const userCounts = data.projects_by_user.map((x: any) => x.count);

    this.barChartData = {
      labels: userLabels,
      datasets: [{
        label: 'Projets par Personne',
        data: userCounts,
        backgroundColor: '#0d6efd' // Blue
      }]
    };

    // --- Chart 3: Evolution by Date (Line) ---
    const dateLabels = data.projects_by_date.map((x: any) => x.month);
    const dateCounts = data.projects_by_date.map((x: any) => x.count);

    this.lineChartData = {
      labels: dateLabels,
      datasets: [{
        label: 'Évolution des Projets',
        data: dateCounts,
        fill: true,
        borderColor: '#6610f2', // Purple
        tension: 0.4
      }]
    };
  }
}