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
import {MatTabsModule} from '@angular/material/tabs';


import { MatDialog } from '@angular/material/dialog';
import { ClientsidenavComponent } from "../client-dashboard/clientsidenav/clientsidenav.component";
import { ClienttoolbarComponent } from "../client-dashboard/clienttoolbar/clienttoolbar.component";
import { ClientsowaComponent } from "../clientsowa/clientsowa.component";
import { ClientupdatesComponent } from "../client-dashboard/clientupdates/clientupdates.component";
import { ClienthistoryComponent } from "../clienthistory/clienthistory.component";
import { AppConfig } from '../../../../app.config'; 
@Component({
  selector: 'app-clientproject',
  standalone: true,
  imports: [MatTabsModule, MatProgressSpinnerModule, MatProgressBarModule, MatTableModule, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, MatTooltipModule, ClientsidenavComponent, ClienttoolbarComponent, ClientsowaComponent, ClientupdatesComponent, ClienthistoryComponent],
  templateUrl: './clientproject.component.html',
  styleUrl: './clientproject.component.css'
})
export class ClientprojectComponent {

  
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
  user: any = {};
  profileId: number =0;
  imageUrl= AppConfig.imageUrl;
  private url =AppConfig.baseUrl;
  private TaskUrl = `${this.url}`+'/api/projectsTasks/'; 
  private SortedUrl =`${this.url}`+'/api/sortedTask/'
  private allTask = `${this.url}`+'/api/Alltask';
  private taskByCategoryUrl = `${this.url}`+'/api/tasksBycategory/';
  private projectDetailsUrl = `${this.url}`+'/api/projectD/';
  private updateProjectUrl = `${this.url}`+'/api/projects/';
  private userUrl = this.url+'/api/user/details';

  projectDetails: any = {};


  totalBudget: number = 100; // Example value
  totalUsedBudget: number = 75; // Example value
  radius: number = 45; // Circle's radius
  circumference: number = 0; // Will be calculated
  usedBudgetPercentage: number = 0;
  strokeDashOffset: number = 0;

  categorizedTasks: { [key: string]: any[] } = {};
  SortedTask: any = {};


  calculateProgress() {
    // Calculate the circle's circumference
    
  }

  selectedTabIndex: number = 0; 
  
  tabChanged(event: any) {
    // When the tab is changed, update the selectedTabIndex
    this.selectedTabIndex = event.index;

    // Store the new tab index in localStorage
    localStorage.setItem('selectedTabIndex', this.selectedTabIndex.toString());
  }

ngOnInit(){

    const storedIndex = localStorage.getItem('selectedTabIndex');
    
    // If there's a stored value, set it as the selected tab index, otherwise default to 0
    this.selectedTabIndex = storedIndex ? +storedIndex : 0;
    
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we load the tasks.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
 
    this.calculateProgress();
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);


      this.profileId = this.user.profile_id; 

    }

    this.route.queryParams.subscribe(params => {
      this.projectId =params['projectId'] || ''; 
      const projectIdNumber = Number(this.projectId);
      this.projectIdNumber2 = Number(this.projectId);
     //  console.log('Project ID:', this.projectId);
     //  console.log('Project ID2:',  this.projectIdNumber2);

      if (!isNaN(projectIdNumber)) {
        this.fetchProjectDetails(projectIdNumber);
        
      } else {
        console.error('Project ID is not set or is not a number');
      }
    });

   
  
  }


  closeSidenav() {
    this.sideBarOpen = false;  // Close sidenav when modal opens
  }

  constructor(
        private dialog: MatDialog,
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
     //    console.log('All tasks:', this.alltask);
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
     //    console.log('Project Details:', this.projectDetails);
        this.circumference = 2 * Math.PI * this.radius;
        
      // Calculate the used percentage
      this.usedBudgetPercentage = (this.projectDetails.total_used_budget / this.projectDetails.totalBudget) * 100;
    //     console.log('Used Budget Percentage:', this.usedBudgetPercentage);
      // Calculate the stroke-dashoffset based on the percentage
      this.strokeDashOffset = this.circumference * (1 - this.usedBudgetPercentage / 100);
    Swal.close();
      },
      (error) => {
        console.error('Failed to fetch project details', error);
      }
    );
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
     //    console.log('Project updated:', response);
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


  openTaskModal() {
    this.isTaskOpen = true;
    // console.log('Opening Task Modal');
    // console.log(this.isTaskOpen);
    this.sideBarOpen = false; 
  }

  closeTaskModal() {
    this.isTaskOpen = false;
    // console.log('xd');
    this.sideBarOpen = true; 
  }

}

