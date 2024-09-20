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
import { StafftoolbarComponent } from "../staff-dashboard/stafftoolbar/stafftoolbar.component";
import { StaffsidenavComponent } from "../staff-dashboard/staffsidenav/staffsidenav.component";
import { AddtaskComponent } from "../addtask/addtask.component";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GeneralComponent } from "../general/general.component";

@Component({
  selector: 'app-sowa',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatProgressBarModule, MatTableModule, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, MatTooltipModule, StafftoolbarComponent, StaffsidenavComponent, AddtaskComponent, GeneralComponent],
  templateUrl: './sowa.component.html',
  styleUrl: './sowa.component.css'
})
export class SowaComponent {


  generatePDF() {
    // Temporarily hide elements with the "no-pdf" class before generating the PDF
    const elements = document.getElementsByClassName('no-pdf');
    for (let i = 0; i < elements.length; i++) {
      (elements[i] as HTMLElement).style.display = 'none';
    }
  
    const data = document.getElementById('pdfContent');
    
    if (data) {
      html2canvas(data).then(canvas => {
        const imgWidth = 295;
        const pageHeight = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
  
        const pdf = new jsPDF('l', 'mm', 'a4');
        let position = 0;
  
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
  
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
  
        pdf.save('statement_of_work.pdf');
  
        // Restore the display property of elements with the "no-pdf" class
        for (let i = 0; i < elements.length; i++) {
          (elements[i] as HTMLElement).style.display = '';
        }
      });
    }
  }
  


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
        this.fetchSortedTask(projectIdNumber);
        this.fetchTaskByCategory(projectIdNumber);
        this.fetchProjectDetails(projectIdNumber);
        this.initializeCategories();
     
      } else {
        console.error('Project ID is not set or is not a number');
      }
    });


    this.fetchAllTask();
   
  
  }



  initializeCategories(): void {
    this.categories = [
      { name: 'GENERAL REQUIREMENTS', path: this.generatePath('general') },
      { name: 'SITE WORKS', path: this.generatePath('site') },
      { name: 'CONCRETE & MASONRY WORKS', path: this.generatePath('concrete') },
      { name: 'METAL REINFORCEMENT WORKS', path: this.generatePath('metal') },
      { name: 'FORMS & SCAFFOLDINGS', path: this.generatePath('forms') },
      { name: 'STEEL FRAMING WORKS', path: this.generatePath('steel') },
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
    this.sideBarOpen = false; 
  }

  closeTaskModal() {
    this.isTaskOpen = false;
    console.log('xd');
    this.sideBarOpen = true; 
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

  calculateProgress(categoryName: string): number {
    const tasks = this.categorizedTasks[categoryName] || [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.pt_status === 'C').length;

    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
}

isCreateProjectModalOpen = false;

openCreateProjectModal() {
  this.isCreateProjectModalOpen = true;
  console.log('Opening Create Staff Project');
  console.log(this.isCreateProjectModalOpen);
  this.sideBarOpen = false;
}

closeCreateProjectModal() {
  this.isCreateProjectModalOpen = false;
  console.log('xd');
  this.sideBarOpen = true;
}


} 
