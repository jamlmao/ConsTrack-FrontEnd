import { Component } from '@angular/core';


import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";
import { CreateStaffAcctComponent } from "../../../Admin/create-staff-acct/create-staff-acct.component";
import { StaffsidenavComponent } from "../staffsidenav/staffsidenav.component";
import { StafftoolbarComponent } from "../stafftoolbar/stafftoolbar.component";
import { EditprofileComponent } from "../../editprofile/editprofile.component";

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-staffclientacc',
  standalone: true,
  imports: [SweetAlert2Module,MatTableModule, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, CreateStaffAcctComponent, StaffsidenavComponent, StafftoolbarComponent, EditprofileComponent],
  templateUrl: './staffclientacc.component.html',
  styleUrl: './staffclientacc.component.css'
})
export class StaffclientaccComponent {

  
  private fetchClientUrl = 'http://127.0.0.1:8000/api/clients';
  user: any;
  clients: any[] = [];
  isCreateClientModalOpen = false;
  
  isEditModalOpen = false;
  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      // If no user data is found, redirect to login
      this.router.navigateByUrl('/');
    }
    this.fetchClients(); // Fetch projects when the component is initialized
  }


  
  fetchClients(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    this.http.get<any>(this.fetchClientUrl, { headers })
    .pipe(
      tap(response => {
        console.log('Full response:', response);
        if (response && Array.isArray(response.clients)) {
          // Filter out duplicate clients based on the 'id' property
          const uniqueClients = response.clients.filter((client: any, index: number, self: any[]) =>
            index === self.findIndex((c) => c.id === client.id)
          );
          this.clients = uniqueClients;
        } else {
          console.error('Unexpected response format:', response);
          this.clients = [];
        }
        console.log('Fetched clients:', this.clients);
      }),
      take(1) // This will ensure the observable completes after the first emission
    )
    .subscribe(
      () => {},
      error => {
        console.error('Error fetching clients:', error);
      }
    );
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
