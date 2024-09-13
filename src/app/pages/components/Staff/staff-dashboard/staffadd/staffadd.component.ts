import { Component, ViewChild, AfterViewInit } from '@angular/core';


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

import { StaffsidenavComponent } from "../staffsidenav/staffsidenav.component";
import { StafftoolbarComponent } from "../stafftoolbar/stafftoolbar.component";
import { CreateProjectComponent } from "../../../Admin/create-project/create-project.component";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Pipe, PipeTransform } from '@angular/core';
import { FilterPipe } from '../../../../../filter.pipe';

import { take, tap } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-staffadd',
  standalone: true,
  imports: [MatPaginator,MatPaginatorModule,FilterPipe,MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, StaffsidenavComponent, StafftoolbarComponent, CreateProjectComponent],
  templateUrl: './staffadd.component.html',
  styleUrl: './staffadd.component.css'
})

export class StaffaddComponent {
  projects: any[] = [];
  searchText:any;
  user: any;

  isCreateProjectModalOpen = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  
  clients: any[] = [];
  isCreateClientModalOpen = false;
  
  isEditModalOpen = false;

  

  
  dataSource = new MatTableDataSource<any>();
  


  openCreateProjectModal() {
    this.isCreateProjectModalOpen = true;
    console.log('Opening Create Staff Project');
    console.log(this.isCreateProjectModalOpen);
  }

  closeCreateProjectModal() {
    this.isCreateProjectModalOpen = false;
    console.log('xd');
  }
 

  constructor(private router: Router , public dialog: MatDialog,private fb: FormBuilder, private http: HttpClient) { }


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



  private clientsUrl = 'http://127.0.0.1:8000/api/clients';
  
  

  openForm(): void {
    this.showForm = true;
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


  
  private projectsUrl = 'http://127.0.0.1:8000/api/staff/projects';
  private userUrl = 'http://127.0.0.1:8000/api/user/details';

  selectedProject: any;
  userS: any = {};
  paginatedUsers: any[] = []; // Holds the data for the current page
  currentPage = 1;
  rowsPerPage = 1; // Number of rows per page
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
        this.projects = response;
        console.log('Fetched projects:', this.projects);
        this.project.paginator = this.paginator;
        this.totalPages = Math.ceil(this.projects.length / this.rowsPerPage);
      this.updatePaginatedUsers();
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

  // Go to the previous page
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

