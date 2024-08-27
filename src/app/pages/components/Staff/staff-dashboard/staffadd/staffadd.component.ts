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
import { ProjectComponent } from '../../../Admin/project/project.component';
import { StaffsidenavComponent } from "../staffsidenav/staffsidenav.component";
import { StafftoolbarComponent } from "../stafftoolbar/stafftoolbar.component";
import { CreateProjectComponent } from "../../../Admin/create-project/create-project.component";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Pipe, PipeTransform } from '@angular/core';
import { FilterPipe } from '../../../../../filter.pipe';

@Component({
  selector: 'app-staffadd',
  standalone: true,
  imports: [FilterPipe,MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, StaffsidenavComponent, StafftoolbarComponent, CreateProjectComponent],
  templateUrl: './staffadd.component.html',
  styleUrl: './staffadd.component.css'
})

export class StaffaddComponent {
  
  searchText:any;
  user: any;
  isCreateStaffModalOpen = false;
  isCreateClientModalOpen = false;
  
  isCreateProjectModalOpen = false;

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
 

  constructor(private router: Router , public dialog: MatDialog,private fb: FormBuilder, private http: HttpClient) { }


  ngOnInit(): void {
    
    this.fetchClients(); // Fetch clients when the component is initialized
    
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
  
  openProjectForm(): void {
    const dialogRef = this.dialog.open(ProjectComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
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


  private apiUrl = 'http://127.0.0.1:8000/api/addproject';
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
    console.log('Token:', token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Add the Bearer token to the headers
    });

    this.http.get(this.clientsUrl, { headers }).subscribe(
      (response: any) => {
        console.log('Full response:', response);
        this.clients = response;
        console.log('Fetched clients:', this.clients); // Assuming the response has a 'clients' field
      },
      error => {
        console.error('Error fetching clients', error);
      }
    );
  }
 
 
  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
        console.log(`File selected: ${file.name}, size: ${file.size}, type: ${file.type}`);
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === FileReader.DONE) {
                console.log(`File read successfully: ${file.name}`);
                const base64String = reader.result as string;
                if (base64String.startsWith('data:')) {
                    const base64Content = base64String.split(',')[1];
                    console.log(`Base64 Encoded String: ${base64Content}`);
                    this.project[field] = base64Content;
                } else {
                    console.error('The file content is not a valid base64 encoded string.');
                }
            }
        };
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
        };
        reader.onabort = () => {
            console.warn('File reading was aborted');
        };
        reader.onloadend = () => {
            if (reader.error) {
                console.error('Error occurred during file reading:', reader.error);
            }
        };
        try {
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error starting file read:', error);
        }
    } else {
        console.warn('No file selected or file is not accessible');
    }
}
 

  onSubmit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };

    const formData = new FormData();
    for (const key in this.project) {
      if (this.project.hasOwnProperty(key)) {
        formData.append(key, this.project[key]);
      }
    }

    this.http.post('http://127.0.0.1:8000/api/addproject', formData, { headers }).subscribe(
      response => {
        console.log('Project added successfully', response);
      },
      error => {
        console.error('Error adding project', error);
      }
    );
  }
  


  openCreateProjectModal() {
    this.isCreateProjectModalOpen = true;
    console.log('Opening Create Staff Modal');
    console.log(this.isCreateProjectModalOpen);
  }

  closeCreateProjectModal() {
    this.isCreateProjectModalOpen = false;
    console.log('xd');
  }

  sideBarOpen=true;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }


  
  private projectsUrl = 'http://127.0.0.1:8000/api/staff/projects';
  private userUrl = 'http://127.0.0.1:8000/api/user/details';
  projects: any[] = [];
  selectedProject: any;
  userS: any = {};

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

