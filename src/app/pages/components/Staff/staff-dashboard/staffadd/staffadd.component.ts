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
import { EditprojectComponent } from "../../editproject/editproject.component";
import Swal from 'sweetalert2';
import { AppConfig } from '../../../../../app.config';


@Component({
  selector: 'app-staffadd',
  standalone: true,
  imports: [MatPaginator, MatPaginatorModule, FilterPipe, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, StaffsidenavComponent, StafftoolbarComponent, CreateProjectComponent, EditprojectComponent],
  templateUrl: './staffadd.component.html',
  styleUrl: './staffadd.component.css'
})

export class StaffaddComponent {
  projects: any[] = [];
  user: any;
  fromDate: string = '';
  toDate: string = '';

  isCreateProjectModalOpen = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private baseUrl = AppConfig.baseUrl;
  private projectsUrl = `${this.baseUrl}/api/staff/projects`;
  private userUrl = `${this.baseUrl}/api/user/details`;
  
  clients: any[] = [];
  isCreateClientModalOpen = false;
  
  isEditModalOpen = false;

  getStatusText(status: string): string {
    switch (status) {
      case 'C':
        return 'Complete';
      case 'OG':
        return 'Ongoing';
      case 'D':
        return 'Due';
      default:
        return status;
    }
  }

  onDateFilterChange() {
    this.filterProjects();
  }

  filterProjects() {
    const filteredProjects = this.projects.filter(project => {
      const projectDate = new Date(project.starting_date);
      const from = this.fromDate ? new Date(this.fromDate) : null;
      const to = this.toDate ? new Date(this.toDate) : null;
      
      // Check if the project date falls within the date range
      const isWithinDateRange = (!from || projectDate >= from) && (!to || projectDate <= to);

      // Check if the search text matches any field (like project type, client name, etc.)
      const matchesSearchText = this.searchText
        ? project.client.first_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
          project.client.last_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
          project.project_type.toLowerCase().includes(this.searchText.toLowerCase())
        : true;

      return isWithinDateRange && matchesSearchText;
    });

    return filteredProjects;
  }

  

  
  dataSource = new MatTableDataSource<any>();
  


  openCreateProjectModal() {
    this.isCreateProjectModalOpen = true;
   // console.log('Opening Create Staff Project');
  //  console.log(this.isCreateProjectModalOpen);
    this.sideBarOpen = false;
  }

  closeCreateProjectModal() {
    this.isCreateProjectModalOpen = false;
   // console.log('xd');
    this.sideBarOpen = true;
  }
 

  constructor(private router: Router , public dialog: MatDialog,private fb: FormBuilder, private http: HttpClient) { }


  ngOnInit(): void {
      
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we load the tasks.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

  
    
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





  project: any = {
    site_location: '',
    client_id: '',
    completion_date: '',
    starting_date: '',
    totalBudget: 0,
    pj_image: null,
    pj_pdf: null,
    project_type: '',
  };

  

  showForm = false;




  

  openForm(): void {
    this.showForm = true;
  }

  
 


  
  

  


  openEditModal() {
    this.isEditModalOpen = true;
  //  console.log('Opening Edit Modal');
  //  console.log(this.isEditModalOpen);
    this.sideBarOpen = false; 
  }

  closeEditModal() {
    this.isEditModalOpen = false;
 //   console.log('xd');
    this.sideBarOpen = true; 
  }

  sideBarOpen=true;
  

 
  
  
  

  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }


  


  selectedProject: any;
  userS: any = {};
  paginatedUsers: any[] = []; // Holds the data for the current page
  currentPage = 1;
  rowsPerPage = 10; // Number of rows per page
  totalPages = 1;
  filteredProjects: any[] = [];
  searchText: string = ''; 
  
pageSize: number = 1; // Example page siz
  

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
        Swal.close();
        this.projects = response;
        this.project.paginator = this.paginator;
        this.totalPages = Math.ceil(this.projects.length / this.rowsPerPage);
        this.filteredProjects = this.projects;
      this.updatePaginatedUsers();
      },
      error => {
        console.error('Error fetching projects', error);
      }
    );
  }

  // Filter the entire dataset based on search text
  filterData() {
    this.filteredProjects = this.projects.filter(project =>
      project.client.first_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      project.client.last_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      project.project_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      project.project_type.toLowerCase().includes(this.searchText.toLowerCase()) ||
      project.starting_date.toLowerCase().includes(this.searchText.toLowerCase()) ||
      project.completion_date.toLowerCase().includes(this.searchText.toLowerCase()) ||
      project.status.toLowerCase().includes(this.searchText.toLowerCase()) ||
      project.staff_in_charge.staff_first_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      project.staff_in_charge.staff_last_name.toLowerCase().includes(this.searchText.toLowerCase())
    );

    // Reset to the first page after filtering
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredProjects.length / this.rowsPerPage);
    this.updatePaginatedUsers();
  }

  // Update the paginated users to be displayed for the current page
  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginatedUsers = this.filteredProjects.slice(startIndex, endIndex);
  }

  getRowsWithEmptySpaces() {
    // Step 1: Filter the projects first
    const filteredProjects = this.filterProjects();
  
    // Step 2: Apply pagination to the filtered projects
    const paginatedProjects = filteredProjects.slice(
      (this.currentPage - 1) * this.rowsPerPage,
      this.currentPage * this.rowsPerPage
    );
  
    // Step 3: Add empty rows if necessary
    const rows = [...paginatedProjects];
    while (rows.length < this.rowsPerPage) {
      rows.push(null); // Add null rows if not enough data
    }
  
    return rows;
  }

  // Go to the next page
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

  // Function to handle changes in the search text input
  onSearchTextChange() {
    this.filterData(); // Call filterData whenever the search input changes
  }

  selectProject(project: any) {
    this.router.navigate(['/project-details'], { queryParams: { projectId: project.id } });
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
     //   console.log('Logged in user:', this.user);
      },
      error => {
        console.clear();
        console.error('Error fetching user details', error);
      }
    );
  }


}

