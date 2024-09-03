import { Component } from '@angular/core';


import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";
import { CreateStaffAcctComponent } from "../../../Admin/create-staff-acct/create-staff-acct.component";
import { ClientsidenavComponent } from "../clientsidenav/clientsidenav.component";
import { ClienttoolbarComponent } from "../clienttoolbar/clienttoolbar.component";

@Component({
  selector: 'app-chome',
  standalone: true,
  imports: [MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, CreateStaffAcctComponent, ClientsidenavComponent, ClienttoolbarComponent],
  templateUrl: './chome.component.html',
  styleUrl: './chome.component.css'
})
export class ChomeComponent {
  
  user: any;
  isCreateStaffModalOpen = false;
  isCreateClientModalOpen = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      // If no user data is found, redirect to login
      this.router.navigateByUrl('/');
    }
  }

  logout(): void {
    localStorage.removeItem('user'); // Remove user data from local storage
    this.router.navigateByUrl('/'); // Redirect to login page
  }
  openCreateStaffModal() {
    this.isCreateStaffModalOpen = true;
    console.log('Opening Create Staff Modal');
    console.log(this.isCreateStaffModalOpen);
  }

  closeCreateStaffModal() {
    this.isCreateStaffModalOpen = false;
    console.log('xd');
  }

  openCreateClientModal() {
    this.isCreateClientModalOpen = true;
    console.log('Opening Create Staff Modal');
    console.log(this.isCreateClientModalOpen);
  }

  closeCreateClientModal() {
    this.isCreateClientModalOpen = false;
    console.log('xd');
  }

  sideBarOpen=false;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }
}
