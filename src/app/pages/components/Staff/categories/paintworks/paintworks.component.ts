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
import Swal from 'sweetalert2';

import { CreateProjectComponent } from "../../../Admin/create-project/create-project.component";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Pipe, PipeTransform } from '@angular/core';
import { FilterPipe } from '../../../../../filter.pipe';
import { ArchiComponent } from "../../archi/archi.component";
import { StafftoolbarComponent } from "../../staff-dashboard/stafftoolbar/stafftoolbar.component";
import { StaffsidenavComponent } from "../../staff-dashboard/staffsidenav/staffsidenav.component";

@Component({
  selector: 'app-paintworks',
  standalone: true,
  imports: [FilterPipe, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, StaffsidenavComponent, StafftoolbarComponent, CreateProjectComponent, ArchiComponent],
  templateUrl: './paintworks.component.html',
  styleUrl: './paintworks.component.css'
})
export class PaintworksComponent {
  tasks: any[] = [];
  searchText:any;
  user: any;
  selectedTaskId: number | null = null;
  isCreateProjectModalOpen = false;
  private userUrl = 'http://127.0.0.1:8000/api/user/details';
  private taskUrl = 'http://127.0.0.1:8000/api/tasks/paint';


  sideBarOpen=true;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }

  openCreateProjectModal(taskId: number) {
    this.isCreateProjectModalOpen = true;
    
    this.selectedTaskId = taskId;
    console.log('Selected Task ID:', this.selectedTaskId);
  
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
    
    this.getLoggedInUserNameAndId(); //Fetch logged in user
    this.fetchTasks()
  }

  

  logout(): void {
    localStorage.removeItem('user'); // Remove user data from local storage
    this.router.navigateByUrl('/'); // Redirect to login page
  }
  

  fetchTasks(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we load the tasks.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    this.http.get<any[]>(this.taskUrl, { headers }).subscribe(
      (response: any) => {
        this.tasks = response.tasks ;
        Swal.close();
      }

    );
  
      
  
  }



  selectTask(taskId: number): void {
    this.selectedTaskId = taskId;
   
  }

  

  

  getLoggedInUserNameAndId(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(this.userUrl, { headers }).subscribe(
      (response: any) => {
        this.user = response;
       
      },
     
    );
  }

}
