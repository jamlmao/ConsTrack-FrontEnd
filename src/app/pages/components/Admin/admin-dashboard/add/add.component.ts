import { Component } from '@angular/core';


import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";

import { CreateProjectComponent } from "../../../Admin/create-project/create-project.component";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Pipe, PipeTransform } from '@angular/core';
import { FilterPipe } from '../../../../../filter.pipe';
import { SidenavComponent } from "../sidenav/sidenav.component";
import { HeaderComponent } from "../header/header.component";
import { AppConfig } from '../../../../../app.config'; 

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FilterPipe, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, CreateProjectComponent, SidenavComponent, HeaderComponent],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {

  projects: any[] = [];
  company: any[] = [];
  searchText:any;
  user: any;

 
  private projectsUrl :string;
  private userUrl :string;
  isCreateProjectModalOpen = false;
  


  openCreateProjectModal() {
    this.isCreateProjectModalOpen = true;
    console.log('Opening Create Staff Project');
    console.log(this.isCreateProjectModalOpen);
  }

  closeCreateProjectModal() {
    this.isCreateProjectModalOpen = false;
    console.log('xd');
  }
 

  constructor(private router: Router , public dialog: MatDialog,private fb: FormBuilder, private http: HttpClient) { 
    this.projectsUrl = AppConfig.baseUrl + '/api/admin/projects';
    this.userUrl = AppConfig.baseUrl +'/api/user/details';
    
  }


  

  ngOnInit(): void {
    
    // this.fetchClients(); // Fetch clients when the component is initialized
    
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
  




  project: any = {
    site_location: '',
    client_id: '',
    completion_date: '',
    starting_date: '',
    totalBudget: 0,
    pj_image: null,
    pj_pdf: null
  };

  

  showForm = false;
  clients: any[] = [];



 
  
  

  openForm(): void {
    this.showForm = true;
  }

  // fetchClients(): void {
  //   const token = localStorage.getItem('token'); // Retrieve the token from local storage
  //   if (!token) {
  //     // console.error('No token found in local storage');
  //     return;
  //   }

  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}` // Add the Bearer token to the headers
  //   });

  //   this.http.get(this.clientsUrl, { headers }).subscribe(
  //     (response: any) => {
  //       this.clients = response;
  //       // console.log('Fetched clients:', this.clients); // Assuming the response has a 'clients' field
  //     },
  //     error => {
  //       // console.error('Error fetching clients', error);
  //     }
  //   );
  // }
 
  
  
  
  
  



  sideBarOpen=true;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }


  
 

  selectedProject: any;
  userS: any = {};
  paginatedUsers: any[] = []; // Holds the data for the current page
  currentPage = 1;
  rowsPerPage = 7; // Number of rows per page
  totalPages = 1;

  fetchProjects(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(this.projectsUrl, { headers }).subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.projects = response;
          console.log('Fetched projects:', this.projects);
        } else if (response && Array.isArray(response.projects)) {
          this.projects = response.projects;
          this.totalPages = Math.ceil(this.projects.length / this.rowsPerPage);
          this.updatePaginatedUsers();
          console.log('Fetched projects:', this.projects);
        } else {
          console.error('Expected an array for projects');
        }
      },
      error => {
        console.error('Error fetching projects', error);
      }
    );
  }

  
  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginatedUsers = this.projects.slice(startIndex, endIndex);
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

  selectProject(project: any) {
    this.router.navigate(['/project-details', project.id]);
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

}
