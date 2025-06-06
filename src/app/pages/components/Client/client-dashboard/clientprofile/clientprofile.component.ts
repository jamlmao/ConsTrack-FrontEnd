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
import { EditpassComponent } from "../../../Staff/editpass/editpass.component";
import { AppConfig } from '../../../../../app.config'; 
@Component({
  selector: 'app-clientprofile',
  standalone: true,
  imports: [MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, CreateStaffAcctComponent, ClientsidenavComponent, ClienttoolbarComponent, EditpassComponent],
  templateUrl: './clientprofile.component.html',
  styleUrl: './clientprofile.component.css'
})
export class ClientprofileComponent {
  
  private projectsUrl = AppConfig.baseUrl+ '/api/staff/projects';
  private userUrl = AppConfig.baseUrl+'/api/user/details';
  projects: any[] = [];
  selectedProject: any;
  user: any = {};
  isCreateStaffModalOpen = false;
  isCreateClientModalOpen = false;
  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      // If no user data is found, redirect to login
      this.router.navigateByUrl('/');
    }
    this.fetchProjects(); // Fetch projects when the component is initialized
    this.getLoggedInUserNameAndId(); //Fetch logged in user
  }

  logout(): void {
    localStorage.removeItem('user'); // Remove user data from local storage
    this.router.navigateByUrl('/'); // Redirect to login page
  }
  openCreateStaffModal() {
    this.isCreateStaffModalOpen = true;
  //  console.log('Opening Create Staff Modal');
   // console.log(this.isCreateStaffModalOpen);
  }

  closeCreateStaffModal() {
    this.isCreateStaffModalOpen = false;
  //  console.log('xd');
  }

  openCreateClientModal() {
    this.isCreateClientModalOpen = true;
  //  console.log('Opening Create Staff Modal');
  //  console.log(this.isCreateClientModalOpen);
  }

  closeCreateClientModal() {
    this.isCreateClientModalOpen = false;
  //  console.log('xd');
  }

  sideBarOpen=false;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }

  fetchProjects(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

   // console.log('Token:', token);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(this.projectsUrl, { headers }).subscribe(
      (response: any) => {
       // console.log('Full response:', response);
        this.projects = response;
       // console.log('Fetched projects:', this.projects);
      },
      error => { 
         console.clear();
        console.error('Error fetching projects', error);
      }
    );
  }

  selectProject(project: any): void {
    this.selectedProject = project;
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
      //  console.log('Logged in user:', this.user);
      },
      error => {
        console.clear();
        console.error('Error fetching user details', error);
      }
    );
  }

  isEditSubModalOpen = false;

  openEditSubModal(){
   
    this.isEditSubModalOpen = true;
    //console.log('Selected Category ID:');
    this.sideBarOpen = false;
  }
  
  closeEditSubModal() {
     this.isEditSubModalOpen = false;
      this.sideBarOpen = true; 
  }
}
