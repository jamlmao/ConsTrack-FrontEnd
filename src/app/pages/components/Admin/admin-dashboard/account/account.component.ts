import { Component } from '@angular/core';


import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { HeaderComponent } from "../header/header.component";
import { SidenavComponent } from "../sidenav/sidenav.component";

import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient,  HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CreateStaffAcctComponent } from "../../create-staff-acct/create-staff-acct.component";
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";
import { EditprofileComponent } from "../../../Staff/editprofile/editprofile.component";




@Component({
  selector: 'app-account',
  standalone: true,
  imports: [MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CreateStaffAcctComponent, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, AccountComponent, HeaderComponent, SidenavComponent, EditprofileComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
 
  users: any[] = [];
  user: any;
  isCreateStaffModalOpen = false;
  isCreateClientModalOpen = false;
  isEditModalOpen = false;
  private baseUrl = 'http://127.0.0.1:8000';
  private fetchUserUrl = this.baseUrl + '/api/admin/users';

  constructor(private router: Router,private http: HttpClient) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      // If no user data is found, redirect to login
      this.router.navigateByUrl('/');
    }
    this.fetchUser(); // Fetch user when the component is initialized
  }

  paginatedUsers: any[] = []; // Holds the data for the current page
  currentPage = 1;
  rowsPerPage = 7; // Number of rows per page
  totalPages = 1;

  fetchUser(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get(this.fetchUserUrl, { headers })
      .subscribe((res: any) => {
        if (res && Array.isArray(res.users)) {
          this.users = res.users;
          console.log(this.users);
          this.totalPages = Math.ceil(this.users.length / this.rowsPerPage);
          this.updatePaginatedUsers();
        } else {
        }
      }, error => {
        console.error(error);
      });
  }




  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
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

  openEditModal() {
    this.isEditModalOpen = true;
    console.log('Opening Edit Modal');
    console.log(this.isEditModalOpen);
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    console.log('xd');
  }

  sideBarOpen=true;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }
}
