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
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Pipe, PipeTransform } from '@angular/core';
@Component({
  selector: 'app-websiteportfolio',
  standalone: true,
  imports: [MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule],
  templateUrl: './websiteportfolio.component.html',
  styleUrl: './websiteportfolio.component.css'
})
export class WebsiteportfolioComponent {
  projects: any[] = [];
  searchText:any;
  user: any;

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
 

  constructor(private router: Router , public dialog: MatDialog,private fb: FormBuilder, private http: HttpClient) { }


  ngOnInit(): void {
    
    this.fetchClients(); // Fetch clients when the component is initialized
    this.fetchProjects(); // Fetch projects when the component is initialized
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



  private clientsUrl = 'http://127.0.0.1:8000/api/clients';
  
  

  openForm(): void {
    this.showForm = true;
  }

  fetchClients(): void {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Add the Bearer token to the headers
    });

    this.http.get(this.clientsUrl, { headers }).subscribe(
      (response: any) => {
        this.clients = response;
        console.log('Fetched clients:', this.clients); // Assuming the response has a 'clients' field
      },
      error => {
        console.error('Error fetching clients', error);
      }
    );
  }
 
 
  
  
  



 


  
  private projectsUrl = 'http://127.0.0.1:8000/api/staff/projects';
  private userUrl = 'http://127.0.0.1:8000/api/user/details';

  selectedProject: any;
  userS: any = {};

  fetchProjects(): void {
   


   

    this.http.get(this.projectsUrl).subscribe(
      (response: any) => {
        this.projects = response;
        console.log('Fetched projects:', this.projects);
        
      },
      error => {
        console.error('Error fetching projects', error);
      }
    );
  }

  get completeItems() {
    return this.projects.filter(projects => projects.status === 'Complete');
  }

 


  
 
}