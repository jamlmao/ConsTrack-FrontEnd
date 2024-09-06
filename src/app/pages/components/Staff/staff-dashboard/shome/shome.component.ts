import { Component, OnInit } from '@angular/core';


import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";

import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";
import { CreateStaffAcctComponent } from "../../../Admin/create-staff-acct/create-staff-acct.component";
import { StaffsidenavComponent } from "../staffsidenav/staffsidenav.component";
import { StafftoolbarComponent } from "../stafftoolbar/stafftoolbar.component";
import { SidenavComponent } from "../../../Admin/admin-dashboard/sidenav/sidenav.component";
import { HeaderComponent } from "../../../Admin/admin-dashboard/header/header.component";
import { Chart,registerables } from 'chart.js';
import { take, tap } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-shome',
  standalone: true,
  imports: [MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, CreateStaffAcctComponent, StaffsidenavComponent, StafftoolbarComponent, SidenavComponent, HeaderComponent],
  templateUrl: './shome.component.html',
  styleUrl: './shome.component.css'
})
export class ShomeComponent implements OnInit {

  public config: any = {
    type : 'bar',

    data:{
      labels: ['jan'],
      datasets: [
      {
        label: 'sales',
        data: ['1'],
        backgroundColor: 'blue',
      },
    ],

    },
    options:{
      aspectRatio: 1,
    }
  }
  chart : any;
  

  private clientsUrl = 'http://127.0.0.1:8000/api/clients';
  private projectsUrl = 'http://127.0.0.1:8000/api/staff/projects';
  private userUrl = 'http://127.0.0.1:8000/api/user/details';
  private companyProjectsUrl = 'http://127.0.0.1:8000/api/CompanyProjects';
  private projectCountUrl = 'http://127.0.0.1:8000/api/projectsPM';
  private clientCountUrl = 'http://127.0.0.1:8000/api/clients-count-by-month';

  projects: any[] = [];
  selectedProject: any;
  user: any = {};
  projectCount: number | null = null;
  isCreateClientModalOpen = false;
  isCreateStaffModalOpen = false;
  staffId: number | null = null; //  store staffId
  projectsPerMonth: any[] = [];
  clientsPerMonth: any[] = [];
  clientCount: number = 0;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    
    const userData = localStorage.getItem('user');
    console.log(localStorage.getItem('user'));
    if (userData) {
      try {
        this.user = JSON.parse(userData);
        console.log('User data:', this.user);
  
        // Detailed logging to inspect the user object
        console.log('User profile_id property:', this.user.profile_id);
        if (this.user.profile_id) {
          console.log('User profile_id property:', this.user.profile_id);
        } else {
          console.warn('User profile_id property is undefined');
        }
  
        // Check if user object has profile_id property
        if (this.user.profile_id) {
          this.staffId = this.user.profile_id;
          if (this.staffId !== null) { // Ensure staffId is not null
            this.getCompanyProjects(this.staffId);
            console.log('Staff ID:', this.staffId);
          } else {
            console.warn('Staff ID is null');
          }
        } else {
          console.warn('Staff ID not found in user data');
        }
  
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      // If no user data is found, redirect to login
      this.router.navigateByUrl('/');
    }
    this.fetchProjects(); // Fetch projects 
    this.getLoggedInUserNameAndId(); // Fetch logged in user details
    this.fetchClients(); // Fetch clients 
    this.fetchProjectsPerMonth(); // Fetch projects per month w
    this.fetchClientsPerMonth(); // Fetch clients per month 
  }
  
 





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

  sideBarOpen=true;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }

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
  
  canvas:any;
  ctx:any;
  data=[];

  getCompanyProjects(staffId: number): void {
    console.log('Fetching projects for staffId:', staffId); // Log the staffId
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${this.companyProjectsUrl}/${staffId}`;
  
  
    this.http.get<{ project_count: number }>(url, { headers })
      .subscribe(
        response => {
          console.log('Project count:', response.project_count)
          this.projectCount = response.project_count;
          var myChart = new Chart('myChart',{  
            type: 'pie',
            data:{
              labels: ['Done', 'Ongoing'],
              datasets: [
              {
                label: 'Projects',
                data: [this.projectCount, 1],
                backgroundColor: ['maroon', 'black'],
              },
            ],
        
            },
            options:{
              aspectRatio: 1,
            }
          }
            
          )

          
        },
        error => {
          console.error('Error fetching projects:', error);
        }
      );
  }

  
  
    fetchClients(): void {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in local storage');
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.get<any>(this.clientsUrl, { headers })
        .pipe(
          tap(response => {
            console.log('Full response:', response);
            if (response && Array.isArray(response.clients)) {
              // Filter out duplicate clients based on the 'id' property
              const uniqueClients = response.clients.filter((client: any, index: number, self: any[]) =>
                index === self.findIndex((c) => c.id === client.id)
              );
            
              this.clientCount = uniqueClients.length;
             
            } else {
              console.error('Unexpected response format:', response);
            
              this.clientCount = 0;
            }
    
            console.log('Client count:', this.clientCount);
          }),
          take(1) // This will ensure the observable completes after the first emission
        )
        .subscribe(
          () => {},
          error => {
            console.error('Error fetching clients:', error);
          }
        );
    }

    datayear:any[]=[];
    datamonth:any[]=[];
    dataproject:any[]=[];
    datayear1:any[]=[];
    datamonth1:any[]=[];
    dataproject1:any[]=[];

    fetchProjectsPerMonth(): void {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in local storage');
        return;
      }
  
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
      this.http.get<any>(this.projectCountUrl, { headers })
        .pipe(
          tap(response => {
            if (response && Array.isArray(response.projects_per_month)) {
              this.projectsPerMonth = response.projects_per_month;
              if(this.projectsPerMonth!=null){ 
                for(let i = 0; i<this.projectsPerMonth.length; i++)
                    this.datayear.push(this.projectsPerMonth[i].year);

                  for(let i = 0; i<this.projectsPerMonth.length; i++)
                    this.datamonth.push(this.projectsPerMonth[i].month);

                  for(let i = 0; i<this.projectsPerMonth.length; i++)
                    this.dataproject.push(this.projectsPerMonth[i].project_count);
               }
               var myChart1 = new Chart('myChart1',{  
                type: 'bar',
                data:{
                  labels: this.datamonth,
                  datasets: [
                  {
                    label: 'Projects',
                    data: this.dataproject,
                    backgroundColor: 'maroon',
                  },
                ],
            
                },
                options:{
                  aspectRatio: 1,
                }
              }
                
              )
            } else {
              console.error('Unexpected response format:', response);
              this.projectsPerMonth = [];

            }
            console.log('Projects per month:', this.projectsPerMonth);
          }),
          take(1) // This will ensure the observable completes after the first emission
        )
        .subscribe(
          () => {},
          error => {
            console.error('Error fetching projects per month:', error);
          }
        );
    }


    
    fetchClientsPerMonth(): void {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in local storage');
        return;
      }
  
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
      this.http.get<any>(this.clientCountUrl, { headers })
        .pipe(
          tap(response => {
            if (response && Array.isArray(response.clients_per_month)) {
              this.clientsPerMonth = response.clients_per_month;
              if(this.clientsPerMonth!=null){ 
                for(let i = 0; i<this.clientsPerMonth.length; i++)
                    this.datayear1.push(this.clientsPerMonth[i].year);

                  for(let i = 0; i<this.clientsPerMonth.length; i++)
                    this.datamonth1.push(this.clientsPerMonth[i].month);

                  for(let i = 0; i<this.clientsPerMonth.length; i++)
                    this.dataproject1.push(this.clientsPerMonth[i].client_count);
               }
               var myChart2 = new Chart('myChart2',{  
                type: 'bar',
                data:{
                  labels: this.datamonth1,
                  datasets: [
                  {
                    label: 'Clients',
                    data: this.dataproject1,
                    backgroundColor: 'maroon',
                  },
                ],
            
                },
                options:{
                  aspectRatio: 1,
                }
              }
                
              )
            } else {
              console.error('Unexpected response format:', response);
              this.clientsPerMonth = [];
            }
            console.log('Clients per month:', this.clientsPerMonth);
          }),
          take(1) // This will ensure the observable completes after the first emission
        )
        .subscribe(
          () => {},
          error => {
            console.error('Error fetching clients per month:', error);
          }
        );
    }
    



}
