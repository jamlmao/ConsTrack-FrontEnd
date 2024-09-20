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
import { AddtaskComponent } from "../addtask/addtask.component";
import { StaffsidenavComponent } from "../staff-dashboard/staffsidenav/staffsidenav.component";
import { StafftoolbarComponent } from "../staff-dashboard/stafftoolbar/stafftoolbar.component";
import { FilterPipe } from '../../../../filter.pipe';


@Component({
  selector: 'app-resourcetable',
  standalone: true,
  imports: [FilterPipe,MatProgressSpinnerModule, MatProgressBarModule, MatTableModule, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, MatTooltipModule, AddtaskComponent, StaffsidenavComponent, StafftoolbarComponent],
  templateUrl: './resourcetable.component.html',
  styleUrl: './resourcetable.component.css'
})
export class ResourcetableComponent {
  
  


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
  private SortedUrl =`${this.url}`+'/api/sortedTask/'
  private allTask = `${this.url}`+'/api/Alltask';
  private taskByCategoryUrl = `${this.url}`+'/api/tasksBycategory/';
  private projectDetailsUrl = `${this.url}`+'/api/projectD/';
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
        // this.fetchSortedTask(projectIdNumber);
        this.fetchTaskByCategory(projectIdNumber);
        this.fetchProjectDetails(projectIdNumber);
        this.initializeCategories();
     
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

  
  
  
  fetchAllTask() { 
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.error('No token found in local storage');
      return;
    }
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});

    this.http.get(this.allTask, { headers }).subscribe(
      (response: any) => {
        this.alltask = response.alltasks;
        console.log('All tasks:', this.alltask);
        
      }
    );

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
        this.currentUserId = response.project.staff_id
        console.log('Current User ID:', this.currentUserId);
        console.log('Project Details:', this.projectDetails);
      },
      (error) => {
        console.error('Failed to fetch project details', error);
      }
    );
  }


  
  paginatedUsers: any[] = [];
  searchText: any = '';
  paginatedTasks: any[] = []; // Holds the data for the current page
  filteredTasks: any[] = []; // Holds the filtered tasks // Holds the data for the current page
  currentPage = 1;
  rowsPerPage = 1; // Number of rows per page
  totalPages = 1;
  
  
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
  
    this.http.get(this.TaskUrl + `${projectId}`, { headers }).subscribe(
      (response: any) => {
        this.tasks = response.tasks;
        Swal.close();
        console.log('Project tasks:', this.tasks);
        this.totalAllocatedBudget = response.totalAllocatedBudget;
        console.log('Total Allocated Budget:', this.totalAllocatedBudget);
  
        // Apply filter and update pagination
        this.filterTasks();
      },
      (error) => {
        console.error('Failed to fetch project tasks', error);
      }
    );
  }
  
  // Filter the tasks based on search text
  filterTasks() {
    // Apply the filter across the entire task list
    if (this.searchText) {
      this.filteredTasks = this.tasks.filter(task =>
        task.pt_task_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        task.pt_task_desc.toLowerCase().includes(this.searchText.toLowerCase()) ||
        task.pt_status.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredTasks = this.tasks; // No filter applied
    }
  
    // Recalculate total pages for filtered tasks
    this.totalPages = Math.ceil(this.filteredTasks.length / this.rowsPerPage);
    
    // Update paginated tasks based on filtered data
    this.updatePaginatedTasks();
  }
  
  // Update the paginated tasks based on the current page
  updatePaginatedTasks() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
  
    this.paginatedTasks = this.filteredTasks.slice(startIndex, endIndex);
    console.log('Paginated Tasks:', this.paginatedTasks);
  }
  
  // For changing pages
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedTasks();
    }
  }
  


  selectProject(project: any) {
    this.router.navigate(['/sowa', project.id]);
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
        
      } else {
        console.error('tasks not found in the response');
      }
    }
    );
  }
  
 




  categorizeTasks() {
    this.categories.forEach(category => {
      this.categorizedTasks[category.name] = this.sortedTask.filter(task => task.pt_task_desc === category.name);
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
 
  


  handleButtonClick(projectId: number): void {

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

   
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });



    this.http.put(this.updateProjectUrl + `${projectId}/update-status`,{},  { headers }).subscribe(
      (response: any) => {
        console.log('Project updated:', response);
        Swal.fire({
          icon: 'success',
          title: 'Project updated successfully',
          timer: 2000
        }).then(() => {
          window.location.reload();
        });
      },
      error => {
        console.error('Error updating project', error);
        Swal.fire({
          icon: 'error',
          title: 'Ooopsieee',
          text: 'Something went wrong',
        });
      }
    );
  }

  get progressPercentage(): number {
    return (this.projectDetails.total_used_budget / this.projectDetails.totalBudget) * 100;
  }
}
