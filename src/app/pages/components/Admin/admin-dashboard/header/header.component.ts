import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router'; 
import { MatIconModule } from "@angular/material/icon";
import { AdminDashboardComponent } from "../admin-dashboard.component";
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, RouterModule, RouterLink, RouterLinkActive, RouterOutlet, MatIconModule, AdminDashboardComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  drawer: any;
  constructor(private adminDashboard: AdminDashboardComponent) {}
  logout(): void {
    this.adminDashboard.logout();
  }
}
