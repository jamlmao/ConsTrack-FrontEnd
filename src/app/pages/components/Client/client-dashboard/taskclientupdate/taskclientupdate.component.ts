import { Component } from '@angular/core';


import { ActivatedRoute,Router, RouterModule, RouterOutlet } from '@angular/router';
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
import { ClientsidenavComponent } from "../clientsidenav/clientsidenav.component";
import { ClienttoolbarComponent } from "../clienttoolbar/clienttoolbar.component";
import { AppConfig } from '../../../../../app.config'; 
@Component({
  selector: 'app-taskclientupdate',
  standalone: true,
  imports: [FilterPipe, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, CreateProjectComponent, ClientsidenavComponent, ClienttoolbarComponent],
  templateUrl: './taskclientupdate.component.html',
  styleUrl: './taskclientupdate.component.css'
})
export class TaskclientupdateComponent {
  

  events: any[] = [];
  tasks: any = {};
  resources: any[] = [];

  alltask: any[] = [];
  currentUserId: number = 0;
  categoryName: string = '';

  taskId :string = '';
  task_image: any= {};
  imageUrl = AppConfig.imageUrl;
  private url =AppConfig.baseUrl;
  private allTask = `${this.url}`+'/api/tasks';
  private ImagesUrl = `${this.url}`+'/api/taskImages/';
  



  ngOnInit(){
   

    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('taskId')|| '';
      const taskIdNumber = Number(this.taskId);
     // console.log('Task ID:', this.taskId);
      if (!isNaN(taskIdNumber)) {
        this.fetchAllTask(taskIdNumber);
        this.fetchTaskImages(taskIdNumber);
      } else {
        console.error('Project ID is not set or is not a number');
      }
    });

    
  
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
    // console.log('Selected task ID:', this.selectedTaskId);
    this.isTaskOpen = true;
    // console.log('Opening Task Modal');
    // console.log(this.isTaskOpen);
  }

  closeTaskModal() {
    this.selectedTaskId = null;
    this.isTaskOpen = false;
     //console.log('xd');
  }

  
  fetchAllTask(taskId: number) { 
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.error('No token found in local storage');
      return;
    }
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});

    const url = `${this.allTask}/${taskId}/resources`;

  //   console.log('URL:', url);

    this.http.get(this.allTask + `/${taskId}/resources`, { headers }).subscribe(
      (response: any) => {
       this.tasks = response.tasks;
       this.categoryName = response.category_name;  
     //   console.log('Category Name:', this.categoryName);
      //  console.log('Tasks:', this.tasks);
       this.resources = response.resources;
      //  console.log('Resources:', this.resources);
      }
    );

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
      }
    )

  }


}
