import { Component,NgZone,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router, NavigationEnd  } from '@angular/router';
import { MenuComponent } from "./pages/menu/menu.component";
import { AdminDashboardComponent } from "./pages/components/Admin/admin-dashboard/admin-dashboard.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { FilterPipe } from './filter.pipe';
import { AuthService } from './pages/guard/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FilterPipe,CommonModule, RouterOutlet, RouterModule, MenuComponent, AdminDashboardComponent, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'v1';
  private logoutTimer: any;
  constructor(private router: Router, private ngZone: NgZone,private authService: AuthService) {}

  ngOnInit() {
    this.resetLogoutTimer();
    this.setupActivityListeners();
   
  }

  setupActivityListeners() {
    if (!this.authService.isAuthenticated()) {
      return;
    }
    const events = ['mousemove', 'keydown', 'click', 'visibilitychange'];

    events.forEach(event => {
      window.addEventListener(event, () => this.handleActivityEvent(event));
    });
  }


  handleActivityEvent(event: string) {
    if (event === 'visibilitychange') {
      if (document.hidden) {
        // console.log('Tab is not active');
      } else {
        this.resetLogoutTimer();
      }
    } else {
      this.resetLogoutTimer();
    }
  }

  resetLogoutTimer() {
    if (!this.authService.isAuthenticated()) {
      return;
    }
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.logoutTimer = setTimeout(() => this.logout(), 21600000); //6hours
   

 
  }

  logout() {
    this.ngZone.run(() => {
      this.authService.logout();
      Swal.fire({
        title: 'Logged Out',
        text: 'You have been logged out due to inactivity.',
        icon: 'warning',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/']);
      });
    });
  }
}



