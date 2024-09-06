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
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";
import { CreateStaffAcctComponent } from "../../../Admin/create-staff-acct/create-staff-acct.component";
import { StaffsidenavComponent } from "../staffsidenav/staffsidenav.component";
import { StafftoolbarComponent } from "../stafftoolbar/stafftoolbar.component";
import { EditprofileComponent } from "../../editprofile/editprofile.component";
import { AdddetailsComponent } from "../../adddetails/adddetails.component";
import { AddtaskComponent } from "../../addtask/addtask.component";
import { GeneralComponent } from "../../general/general.component";
import { SiteComponent } from "../../site/site.component";
import { ArchiComponent } from "../../archi/archi.component";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import Swal from 'sweetalert2';



@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [MatProgressSpinnerModule,MatProgressBarModule,MatTableModule, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, CreateStaffAcctComponent, StaffsidenavComponent, StafftoolbarComponent, EditprofileComponent, AdddetailsComponent, AddtaskComponent, GeneralComponent, SiteComponent, ArchiComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})


export class ProjectDetailsComponent {

  progress = 75;

  events: any[] = [];
  tasks: any[] = [];
  sortedTask: any[] = [];
  
  totalAllocatedBudgetPerCategory:any[] = [];
  totalAllocatedBudget: number = 0;
  percentage: number = 0;
  previousCost: number = 0;
  thisperiodCost: number = 0;
  toDateCost: number = 0;
  projectId: string ="";
  taskImages: { [taskId: number]: string } = {};
  private TaskUrl = 'http://127.0.0.1:8000/api/projectsTasks/'; 
  private SortedUrl ='http://127.0.0.1:8000/api/sortedTask/'
  private ImageUrl = 'http://127.0.0.1:8000/api/PtImages/';
  private taskByCategoryUrl = 'http://127.0.0.1:8000/api/tasksBycategory/';
  private projectDetailsUrl = 'http://127.0.0.1:8000/api/projectD/';

  projectDetails: any = {};


  

  categories: string[] = [
    'GENERAL REQUIREMENTS',
    'SITE WORKS',
    'CONCRETE & MASONRY WORKS',
    'METAL REINFORCEMENT WORKS',
    'FORMS & SCAFFOLDINGS',
    'STEEL FRAMING WORK',
    'TINSMITHRY WORKS',
    'PLASTERING WORKS',
    'PAINTS WORKS',
    'PLUMBING WORKS',
    'ELECTRICAL WORKS',
    'CEILING WORKS',
    'ARCHITECTURAL'
  ];
  categorizedTasks: { [key: string]: any[] } = {};
  SortedTask: any = {};


  ngOnInit(){
   

    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId') || ''; // Assuming 'projectId' is the parameter name
      const projectIdNumber = Number(this.projectId);
      console.log('Project ID:', projectIdNumber);
      if (!isNaN(projectIdNumber)) {
        this.fetchProjectTasks(projectIdNumber);
        this.fetchSortedTask(projectIdNumber);
        this.fetchTaskByCategory(projectIdNumber);
        this.fetchProjectDetails(projectIdNumber);
      } else {
        console.error('Project ID is not set or is not a number');
      }
    });



    
  
  }
  
  constructor(
        private router: Router, 
        private route: ActivatedRoute,
        private http: HttpClient,) { }
      
  isCreateClientModalOpen = false;
  
  isTaskOpen = false;
  isGeneralOpen = false;
  isSiteOpen = false;
  isArchiOpen = false;
  

  sideBarOpen=true;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }

  
 

  openTaskModal() {
    this.isTaskOpen = true;
    console.log('Opening Task Modal');
    console.log(this.isTaskOpen);
  }

  closeTaskModal() {
    this.isTaskOpen = false;
    console.log('xd');
  }

  
  openGeneralModal() {
    this.isGeneralOpen = true;
    console.log('Opening Task Modal');
    console.log(this.isGeneralOpen);
  }

  closeGeneralModal() {
    this.isGeneralOpen = false;
    console.log('xd');
  }
  openSiteModal() {
    this.isSiteOpen = true;
    console.log('Opening Task Modal');
    console.log(this.isSiteOpen);
  }

  closeSiteModal() {
    this.isSiteOpen = false;
    console.log('xd');
  }
  openArchiModal() {
    this.isArchiOpen = true;
    console.log('Opening Task Modal');
    console.log(this.isArchiOpen);
  }

  closeArchiModal() {
    this.isArchiOpen = false;
    console.log('xd');
  }
  
  


  selectProject(project: any) {
    this.router.navigate(['/timeline', project.id]);
  }

  fetchProjectDetails(projectId: number) {
    const token = localStorage.getItem('token');

    if (!token){
      console.error('No token found in local Storage');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(this.projectDetailsUrl + `${projectId}`, { headers }).subscribe(
      (response: any) => {
        this.projectDetails = response.project;
        console.log('Project Details:', this.projectDetails);
      },
      (error) => {
        console.error('Failed to fetch project details', error);
      }
    );
  }

  fetchProjectTasks(projectId: number) {
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

    this.http.get(this.TaskUrl + `${projectId}`,{headers}).subscribe(
      (response: any) => {
        this.tasks = response.tasks;
        Swal.close();
        console.log('Project tasks:', this.tasks);
        this.totalAllocatedBudget = response.totalAllocatedBudget;
        console.log('Total Allocated Budget:', this.totalAllocatedBudget);
       
       
      },
      (error) => {
        console.error('Failed to fetch project tasks', error);
      }
    );
  }

  

    

  fetchTaskByCategory(projectId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(this.taskByCategoryUrl + `${projectId}`, { headers }).subscribe(
    (response: any) => {
      if (response && response.totalAllocatedBudgetPerCategory) {
        this.SortedTask = response.totalAllocatedBudgetPerCategory;
        console.log('Budget:', this.SortedTask);
      
        
        
      } else {
        console.error('tasks not found in the response');
      }
    }
    );
  }
  
 

  fetchSortedTask(projectId: number) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found in local storage');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });


    this.http.get(this.SortedUrl + `${projectId}`, { headers }).subscribe(
      (response: any) => {
        if (response && response.tasks) {
          this.sortedTask = response.tasks;
       
          this.categorizeTasks();
          console.log('Sorted tasks:', this.sortedTask);
        } else {
          console.error('tasks not found in the response');
        }
      },
      (error) => {
        console.error('Failed to fetch Sorted tasks', error);
      }
    );
  }


  categorizeTasks() {
    this.categories.forEach(category => {
      this.categorizedTasks[category] = this.sortedTask.filter(task => task.pt_task_desc === category);
    });
  }

  toRoman(num: number): string {
    const romanNumerals: [string, number][] = [
      ["M", 1000],
      ["CM", 900],
      ["D", 500],
      ["CD", 400],
      ["C", 100],
      ["XC", 90],
      ["L", 50],
      ["XL", 40],
      ["X", 10],
      ["IX", 9],
      ["V", 5],
      ["IV", 4],
      ["I", 1]
    ];
    let result = '';
    for (const [roman, value] of romanNumerals) {
      while (num >= value) {
        result += roman;
        num -= value;
      }
    }
    return result;
  }

  generateSubItemLabel(index: number): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (index < 26) {
      return letters[index];
    } else {
      return (index + 1).toString();
    }
  }
  
  selecttask(task: any) {
    this.router.navigate(['/task-details', task.id]);
  }
 
}
