import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core'; // <--- 1. Import inject
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskListComponent implements OnInit {

  tasks: any[] = [];
  selectedTask: any = null;
  newComment = { content: '', type: 'INFORMATIVE' };

  private api = inject(ApiService);
  private cd = inject(ChangeDetectorRef);
  private router = inject(Router);

  // Get Current User
  currentUser = this.api.getCurrentUser();

  ngOnInit() {
    // Safety redirect if not logged in
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadTasks();
  }

  loadTasks() {
    this.api.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  voteTask(task: any, isApproved: boolean) {
    const payload = {
      task_id: task.id,
      user_id: this.currentUser.id,
      is_approved: isApproved ? 1 : 0
    };

    this.api.reviewTask(payload).subscribe({
      next: () => {
        // Update local state
        task.userVote = isApproved;
        // Force button color update immediately
        this.cd.detectChanges();
      },
      error: () => alert('Erreur lors du vote')
    });
  }

  openCommentModal(task: any) {
    this.selectedTask = task;
    this.newComment = { content: '', type: 'INFORMATIVE' };
  }

  submitComment() {
    if (!this.selectedTask) return;

    const payload = {
      task_id: this.selectedTask.id,
      user_id: this.currentUser.id,
      content: this.newComment.content,
      type: this.newComment.type
    };

    this.api.addComment(payload).subscribe({
      next: () => {
        alert('Commentaire ajouté !');
        this.selectedTask = null;
        this.cd.detectChanges();
      },
      error: () => alert('Erreur envoi commentaire')
    });
  }
}