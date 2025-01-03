import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CreateStaffAcctComponent } from "../create-staff-acct/create-staff-acct.component";
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CreateClientAcctComponent } from "../../Staff/create-client-acct/create-client-acct.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { AccountComponent } from "./account/account.component";
import { HeaderComponent } from "./header/header.component";

import { MatListModule } from "@angular/material/list";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatListModule,MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CreateStaffAcctComponent, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, AccountComponent, HeaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit  {
  faYoutube = faYoutube;
  faSearch = faSearch;
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
  

}
