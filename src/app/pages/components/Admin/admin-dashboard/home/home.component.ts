import { Component, OnInit } from '@angular/core';


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
import { HttpClient, HttpHeaders, HttpClientModule} from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CreateStaffAcctComponent } from "../../create-staff-acct/create-staff-acct.component";
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";
import { CreateComponent } from "../create/create.component";



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CreateStaffAcctComponent, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, SidenavComponent, CreateComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {


  private projectsUrl = 'http://127.0.0.1:8000/api/staff/projects';
  
  projects: any[] = [];
  selectedProject: any;
  user: any;
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

  sideBarOpen=true;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }

  fetchProjects(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    console.log('Token:', token);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(this.projectsUrl, { headers }).subscribe(
      (response: any) => {
        console.log('Full response:', response);
        this.projects = response;
        console.log('Fetched projects:', this.projects);
      },
      error => {
        console.error('Error fetching projects', error);
      }
    );
  }

  selectProject(project: any): void {
    this.selectedProject = project;
  }

}
