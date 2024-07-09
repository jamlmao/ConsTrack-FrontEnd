import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router, NavigationEnd  } from '@angular/router';
import { AdminLComponent } from "./pages/admin-l/admin-l.component";
import { ClientLComponent } from "./pages/client-l/client-l.component";
import { StaffLComponent } from "./pages/staff-l/staff-l.component";
import { MenuComponent } from "./pages/menu/menu.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, AdminLComponent, ClientLComponent, StaffLComponent, MenuComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'v1';
  
}
