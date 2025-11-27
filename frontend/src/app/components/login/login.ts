import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add it here
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  constructor(private router: Router) { }

  login(role: string) {
    if (role === 'CHEF') {
      this.router.navigate(['/manager/dashboard']);
    } else {
      this.router.navigate(['/employee/tasks']);
    }
  }
}