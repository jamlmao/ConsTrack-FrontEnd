import { Component,Directive, ElementRef, Input, OnInit } from '@angular/core';


import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";

import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { StaffsidenavComponent } from "../staffsidenav/staffsidenav.component";
import { StafftoolbarComponent } from "../stafftoolbar/stafftoolbar.component";
import { ArchiComponent } from "../../archi/archi.component";
import { EditresourceComponent } from "../../editresource/editresource.component";

@Component({
  selector: 'app-taskdetails',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatProgressBarModule, MatTableModule, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, MatTooltipModule, StaffsidenavComponent, StafftoolbarComponent, ArchiComponent, EditresourceComponent],
  templateUrl: './taskdetails.component.html',
  styleUrl: './taskdetails.component.css'
})
export class TaskdetailsComponent {
  

  events: any[] = [];
  tasks: any = {};
  resources: any[] = [];
  selectedResource:number | null = null;
  alltask: any[] = [];
  currentUserId: number = 0;
  categoryName: string = '';
  used_resources:any[] = [];
  taskId :string = '';
  task_image: any= {};
  private url ="http://127.0.0.1:8000";
  private allTask = `${this.url}`+'/api/tasks';
  private ImagesUrl = `${this.url}`+'/api/taskImages/';
  private usedResourcesUrl = `${this.url}`+'/api/tasks/';
  



  ngOnInit(){
    this.showLoading(); 

    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('taskId')|| '';
      const taskIdNumber = Number(this.taskId);
      console.log('Task ID:', this.taskId);
      if (!isNaN(taskIdNumber)) {
        this.fetchAllTask(taskIdNumber);
        this.fetchTaskImages(taskIdNumber);
        this.fetchUsedResources(taskIdNumber);
      } else {
        console.error('Project ID is not set or is not a number');
      }
    });

    
  
  }

  showLoading(){
    Swal.fire({
      title: 'Loading',
      html: 'Please wait...',
      didOpen: () => {
        Swal.showLoading()
      }
    });
  }


  hideLoading(){
    Swal.close();
  }
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


  
 

  constructor(
        private router: Router, 
        private route: ActivatedRoute,
        private http: HttpClient,) { }
      
  isCreateClientModalOpen = false;
  selectedTaskId: number | null = null;
  isTaskOpen = false;

  

  sideBarOpen=true;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }

  
 

  openTaskModal(taskId: number) {
    this.selectedTaskId = taskId;
    console.log('Selected task ID:', this.selectedTaskId);
    this.isTaskOpen = true;
    console.log('Opening Task Modal');
    console.log(this.isTaskOpen);
    this.sideBarOpen = false;
  }

  closeTaskModal() {
    this.selectedTaskId = null;
    this.isTaskOpen = false;
    console.log('xd');
    this.sideBarOpen = true;
  }

  
  fetchAllTask(taskId: number) { 
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.error('No token found in local storage');
      return;
    }
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});

    const url = `${this.allTask}/${taskId}/resources`;

    console.log('URL:', url);

    this.http.get(this.allTask + `/${taskId}/resources`, { headers }).subscribe(
      (response: any) => {
        this.hideLoading();
       this.tasks = response.tasks;
       this.categoryName = response.category_name;  
       console.log('Category Name:', this.categoryName);
       console.log('Tasks:', this.tasks);
       this.resources = response.resources;
       console.log('Resources:', this.resources);
      }
    );

  }

 
  fetchUsedResources(taskId: number) {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`});
  
     this.http.get(this.usedResourcesUrl + `${taskId}/used-resources`, {headers}).subscribe((response : any) => {
      this.used_resources = response.used_resources;
      console.log('Used Resources:', this.used_resources);
     });
      
}







  fetchTaskImages(taskId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(this.ImagesUrl+ `${taskId}`, {headers}).subscribe(
      (response:any) =>{
        
        this.task_image = response.images; 
        console.log('Task Image:', this.task_image);
      }
    )

  }

  
isEditSubModalOpen = false;

  openEditSubModal(resourceId: number) {
    this.selectedResource = resourceId;
    console.log('Selected Resource ID:', this.selectedResource);
    this.isEditSubModalOpen = true;
  
    this.sideBarOpen = false;
  }
  
  closeEditSubModal() {
     this.isEditSubModalOpen = false;
      this.sideBarOpen = true; 
  }



 
}
