import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Add it here
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  credentials = {
    email: '',
    password: ''
  };

  errorMessage = '';

  private api = inject(ApiService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  onLogin() {
    this.api.login(this.credentials).subscribe({
      next: (res: any) => {
        // 1. Save Session
        this.api.saveSession(res.user);

        // 2. Redirect based on Role
        if (res.user.role === 'CHEF_SERVICE') {
          this.router.navigate(['/manager/dashboard']);
        } else {
          this.router.navigate(['/employee/tasks']);
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Email ou mot de passe incorrect.';
        this.cd.detectChanges();
      }
    });
  }
}