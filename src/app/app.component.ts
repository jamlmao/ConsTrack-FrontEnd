import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router, NavigationEnd  } from '@angular/router';
import { MenuComponent } from "./pages/menu/menu.component";
import { AdminDashboardComponent } from "./pages/components/Admin/admin-dashboard/admin-dashboard.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { FilterPipe } from './filter.pipe';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FilterPipe,CommonModule, RouterOutlet, RouterModule, MenuComponent, AdminDashboardComponent, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'v1';
  
}
