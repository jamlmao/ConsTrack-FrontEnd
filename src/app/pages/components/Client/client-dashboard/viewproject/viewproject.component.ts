import { Component } from '@angular/core';


import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ClientsidenavComponent } from "../clientsidenav/clientsidenav.component";
import { ClienttoolbarComponent } from "../clienttoolbar/clienttoolbar.component";

import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewproject',
  standalone: true,
  imports: [MatProgressBarModule, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, ClientsidenavComponent, ClienttoolbarComponent],
  templateUrl: './viewproject.component.html',
  styleUrl: './viewproject.component.css'
})
export class ViewprojectComponent {
  


  events: any[] = [];
  tasks: any[] = [];
  sortedTask: any[] = [];
  categories: { name: string, path: string }[] = [];
  totalAllocatedBudgetPerCategory:any[] = [];
  totalAllocatedBudget: number = 0;
  percentage: number = 0;
  previousCost: number = 0;
  thisperiodCost: number = 0;
  toDateCost: number = 0;
  projectId: string ="";
  taskImages: { [taskId: number]: string } = {};
  alltask: any[] = [];
  currentUserId: number = 0;
  projectIdNumber2: number = 0;

  private url ="http://127.0.0.1:8000";
  private TaskUrl = `${this.url}`+'/api/projectsTasks/'; 


  private updateProjectUrl = `${this.url}`+'/api/projects/';


  projectDetails: any = {};


  

  categorizedTasks: { [key: string]: any[] } = {};
  SortedTask: any = {};


  ngOnInit(){
   

    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId') || ''; 
      const projectIdNumber = Number(this.projectId);
      this.projectIdNumber2 = Number(this.projectId);
      console.log('Project ID:', this.projectIdNumber2);
      if (!isNaN(projectIdNumber)) {
        this.fetchProjectTasks(projectIdNumber);
        this.initializeCategories();
     
      } else {
        console.error('Project ID is not set or is not a number');
      }
    });



   
  
  }



  initializeCategories(): void {
    this.categories = [
      { name: 'GENERAL REQUIREMENTS', path: this.generatePath('general') },
      { name: 'SITE WORKS', path: this.generatePath('site') },
      { name: 'CONCRETE & MASONRY WORKS', path: this.generatePath('metal') },
      { name: 'METAL REINFORCEMENT WORKS', path: this.generatePath('forms') },
      { name: 'FORMS & SCAFFOLDINGS', path: this.generatePath('steel') },
      { name: 'TINSMITHRY WORKS', path: this.generatePath('tinsmithry') },
      { name: 'PLASTERING WORKS', path: this.generatePath('plastering') },
      { name: 'PAINTS WORKS', path: this.generatePath('paint') },
      { name: 'PLUMBING WORKS', path: this.generatePath('plumbing') },
      { name: 'ELECTRICAL WORKS', path: this.generatePath('electrical') },
      { name: 'CEILING WORKS', path: this.generatePath('ceiling') },
      { name: 'ARCHITECTURAL', path: this.generatePath('architectural') },
    ];
  }

  generatePath(category: string): string {
    return `${category}`;
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
  

  sideBarOpen=false;
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


  selectProject(project: any) {
    this.router.navigate(['/sowa', project.id]);
  }
  

    

  

  
  
  selecttask(task: any) {
    this.router.navigate(['/task-details', task.id]);
  }
 
  


  

  get progressPercentage(): number {
    return (this.projectDetails.total_used_budget / this.projectDetails.totalBudget) * 100;
  }
}
