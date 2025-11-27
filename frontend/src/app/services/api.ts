import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api'; // Your Node.js URL

  constructor(private http: HttpClient) { }

  // --- PROJECTS ---
  getAllProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/projects`);
  }

  createProject(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/projects`, data);
  }

  validateProject(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/projects/${id}/validate`, { status });
  }

  // --- TASKS ---
  addTask(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tasks`, data);
  }

  // Peer review (Validation by colleague)
  reviewTask(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tasks/review`, data);
  }

  // --- STATS & NOTIFICATIONS ---
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`);
  }

  getNotifications(): Observable<any> {
    return this.http.get(`${this.baseUrl}/notifications`);
  }

  getAllTasks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tasks`);
  }

  addComment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/comments`, data);
  }

  getTaskDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tasks/details`);
  }

  updateTaskStatus(taskId: number, newStatus: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/tasks/${taskId}/status`, { status: newStatus });
  }
}