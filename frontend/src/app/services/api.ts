import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api'; // Your Node.js URL

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  // --- AUTHENTICATION ---
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  saveSession(user: any) {
    // Only save if we are in the browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  getCurrentUser() {
    // Only access localStorage if in the browser
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    }
    // If on the server, return null
    return null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
  }

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