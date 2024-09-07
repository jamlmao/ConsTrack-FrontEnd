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
  clientId: number | null = null;
  projects: any[] = [];
  private baseUrl ='http://127.0.0.1:8000/'
  private userUrl = this.baseUrl+'api/user/details';
  private fetchUrl = this.baseUrl+'api/clients/';

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try{
        this.user = JSON.parse(userData);

        if (this.user.profile_id){
          this.clientId = this.user.profile_id;
          if (this.clientId !==null){
            this.fetchProject(this.clientId);
          }
        }

      }catch(e){

      }
  
    
    } else {
      // If no user data is found, redirect to login
      this.router.navigateByUrl('/');
    }
    this.getLoggedInUserNameAndId(); 
    // this.fetchProject(); 
  }



  getLoggedInUserNameAndId(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(this.userUrl, { headers }).subscribe(
      (response: any) => {
        this.user = response;
      
       
        console.log('Logged in user:', this.user);
      },
      error => {
        console.error('Error fetching user details', error);
      }
    );
  }
  

  fetchProject(clientId :number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });


    const url = `${this.fetchUrl}${clientId}/projects`;

    this.http.get(url, { headers }).subscribe(
      (response: any) => {
        if (response && Array.isArray(response.projects)) {
          this.projects = response.projects;
          console.log('Fetched projects:', this.projects);
        } else {
          console.error('Expected an array for projects');
        }
      },
      error => {
        console.error('Error fetching user details', error);
      }
    );
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
