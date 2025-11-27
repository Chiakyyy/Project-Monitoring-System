import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/manager/dashboard/dashboard';
import { CreateProjectComponent } from './components/employee/create-project/create-project';
import { TaskListComponent } from './components/employee/task-list/task-list';
import { ProjectValidationComponent } from './components/manager/project-validation/project-validation';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },

    // Manager Routes
    { path: 'manager/dashboard', component: DashboardComponent },
    { path: 'manager/validation', component: ProjectValidationComponent },

    // Employee Routes
    { path: 'employee/create', component: CreateProjectComponent },
    { path: 'employee/tasks', component: TaskListComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }