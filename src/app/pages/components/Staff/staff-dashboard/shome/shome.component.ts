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
import { first, forkJoin, last, take, tap } from 'rxjs';
Chart.register(...registerables);
import Swal from 'sweetalert2';
import { AppConfig } from '../../../../../app.config';
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
  private baseUrl =AppConfig.baseUrl
  private staffUrl = this.baseUrl+'/api/staff-with-extension';
  private clientsUrl = this.baseUrl+'/api/clients';
  private projectsUrl = this.baseUrl+ '/api/staff/projects';
  private userUrl = this.baseUrl+'/api/user/details';
  private companyProjectsUrl = this.baseUrl+'/api/CompanyProjects';
  private projectCountUrl = this.baseUrl+'/api/projectsPM';
  private ProjectYearUrl = this.baseUrl+'/api/projectsY';
  private clientCountUrl = this.baseUrl+'/api/clients-count-by-month';
 
  projects: any[] = [];
  staff: any[] = [];
  selectedProject: any;
  user: any = {};
  projectCount: number | null = null;
  isCreateClientModalOpen = false;
  isCreateStaffModalOpen = false;
  staffId: number | null = null; //  store staffId
  projectsPerMonth: any[] = [];
  clientsPerMonth: any[] = [];
  clientCount: number = 0;
  done: number = 0;
  ongoing: number = 0;
  due: number = 0;  

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
     
        if (this.user.profile_id) {
          this.staffId = this.user.profile_id;
          if (this.staffId !== null) { // Ensure staffId is not null
            this.getCompanyProjects(this.staffId);
          } else {
          }
        } else {
          console.warn('Staff ID not found in user data');
        }
  
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      this.router.navigateByUrl('/');
    }


      this.getLoggedInUserNameAndId(),
      this.fetchClients(),
      this.fetchProjectsPerMonth(),
      this.fetchClientsPerMonth(),
      this.fetchProjectsPerYear()
   
  }
  
  
  showLoading() {
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we load the tasks.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  hideLoading() {
    Swal.close();
  }


  sideBarOpen=true;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
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
        // console.log('Logged in user:', this.user);

      },
      error => {
        console.clear();
        console.error('Error fetching user details', error);
      }
    );
  }
  
  canvas:any;
  ctx:any;
  data=[];





  getCompanyProjects(staffId: number): void {
   
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${this.companyProjectsUrl}/${staffId}`;
  
  
    this.http.get<{ project_count: number, done:number, ongoing:number, due:number}>(url, { headers })
      .subscribe(
        response => {
          // console.log('Project count:', response.project_count)
          this.hideLoading();
          this.projectCount = response.project_count;
          this.done = response.done;
          this.due = response.due;
          // console.log('Done:', this.done);
          // console.log('Ongoing:', response.ongoing);
          // console.log('due', response.due);
          this.ongoing = response.ongoing;


          var myChart = new Chart('myChart',{  
            type: 'pie',
            data:{
              labels: ['Done', 'Ongoing', 'Due'],
              datasets: [
              {
                label: 'Projects',
                data: [this.done, this.ongoing,this.due],
                backgroundColor: ['#8ec669', '#70a8d6', '#ea6060' ],
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
          console.clear();
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
        
            // console.log('Full response:', response);
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
    
            // console.log('Client count:', this.clientCount);
          }),
          take(1) // This will ensure the observable completes after the first emission
        )
        .subscribe(
          () => {},
          error => {
            console.clear();
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

    datayear12:any[]=[];
    datamonth12:any[]=[];
    datadue:any[]=[];
    datacomplete:any[]=[];
    dataongoing:any[]=[];


    projectsStatusPerMonth: any[] = [];


    fetchProjectsPerYear(): void {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in local storage');
        return;
      }
    
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    
      this.http.get<any>(this.ProjectYearUrl, { headers })
        .pipe(
          tap(response => {
            if (response && Array.isArray(response.projects_status_per_month)) {
              this.projectsStatusPerMonth = response.projects_status_per_month;
    
              // Clear previous data arrays
              this.datayear12 = [];
              this.datamonth12 = [];
              this.datadue = [];
              this.datacomplete = [];
              this.dataongoing = [];
             
    
              // Create an object to aggregate project counts by year and month
              const aggregatedData: { [key: string]: { year: number, month: string, due: number, complete: number, ongoing: number } } = {};
    
              // Iterate over the projects and aggregate counts by year and month
              this.projectsStatusPerMonth.forEach(item => {
                const key = `${item.year}-${item.month}`; // Create a unique key combining year and month
                if (!aggregatedData[key]) {
                  aggregatedData[key] = { year: item.year, month: item.month, due: item.due, complete: item.complete, ongoing: item.ongoing };
                } else {
                  aggregatedData[key].due += item.due;
                  aggregatedData[key].complete += item.complete;
                  aggregatedData[key].ongoing += item.ongoing;
                }
              });
    
              // Prepare the chart data
              const labels = [];
              const dueData = [];
              const completeData = [];
              const ongoingData = [];
    
              for (const key in aggregatedData) {
                const item = aggregatedData[key];
                labels.push(`${item.month} ${item.year}`); // X-axis label as month-year
                dueData.push(item.due); // Y-axis value for due projects
                completeData.push(item.complete); // Y-axis value for complete projects
                ongoingData.push(item.ongoing); // Y-axis value for ongoing projects
              }
    
              // Create the line chart for projects per month
              new Chart('myChart12', {
                type: 'line',
                data: {
                  labels: labels, // X-axis labels (Month-Year)
                  datasets: [
                    {
                      label: 'Due Projects',
                      data: dueData, // Y-axis values for due projects
                      borderColor: 'white',
                      backgroundColor: '#ea6060',
                      fill: false
                    },
                    {
                      label: 'Complete Projects',
                      data: completeData, // Y-axis values for complete projects
                      borderColor: 'white',
                      backgroundColor: '#8ec669',
                      fill: false
                    },
                    {
                      label: 'Ongoing Projects',
                      data: ongoingData, // Y-axis values for ongoing projects
                      borderColor: 'white',
                      backgroundColor: '#70a8d6',
                      fill: false
                    }
                  ]
                },
                options: {
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => {
                          const datasetLabel = tooltipItem.dataset.label || '';
                          const value = tooltipItem.raw;
                          return `${datasetLabel}: ${value}`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true
                    },
                    y: {
                      beginAtZero: true
                    }
                  }
                }
              });
            } else {
              console.error('Unexpected response format:', response);
              this.projectsStatusPerMonth = [];
            }
            // console.log('Projects per year:', this.projectsStatusPerMonth);
          }),
          take(1)
        )
        .subscribe(
          () => {},
          error => {
            console.clear();
            console.error('Error fetching projects per year:', error);
          }
        );
    }
    


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
    
              // Clear previous data arrays
              this.datayear = [];
              this.datamonth = [];
              this.dataproject = [];
        
              // Create an object to aggregate project counts by year and month
              const aggregatedData: { [key: string]: { year: number, month: string, project_count: number } } = {};
    
              // Iterate over the projects and aggregate counts by year and month
              this.projectsPerMonth.forEach(item => {
                const key = `${item.year}-${item.month}`; // Create a unique key combining year and month
                if (!aggregatedData[key]) {
                  aggregatedData[key] = { year: item.year, month: item.month, project_count: item.project_count };
                } else {
                  aggregatedData[key].project_count += item.project_count; // Aggregate the project counts
                }
              });
    
              // Prepare the chart data
              const labels = [];
              const data = [];
              for (const key in aggregatedData) {
                const item = aggregatedData[key];
                labels.push(`${item.month} ${item.year}`); // X-axis label as month-year
                data.push(item.project_count); // Y-axis value as aggregated project count
              }
    
              // Create the bar chart for projects per month
              var myChart1 = new Chart('myChart1', {
                type: 'bar',
                data: {
                  labels: labels, // X-axis labels (Month-Year)
                  datasets: [
                    {
                      label: 'Projects',
                      data: data, // Y-axis values (project counts)
                      backgroundColor: '#fcff47',
                    },
                  ],
                },
                options: {
                  aspectRatio: 1,
                }
              });
            } else {
              console.error('Unexpected response format:', response);
              this.projectsPerMonth = [];
            }
            // console.log('Projects per month:', this.projectsPerMonth);
          }),
          take(1)
        )
        .subscribe(
          () => {},
          error => {
            console.clear();
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
        .subscribe(
          response => {
            if (response && Array.isArray(response.clients_per_month)) {
              this.clientsPerMonth = response.clients_per_month;
              
              // Clear arrays before pushing new data
              this.datayear1 = [];
              this.datamonth1 = [];
              this.dataproject1 = [];
    
              // Define the type for aggregatedData
              const aggregatedData: { [key: string]: { year: number, month: string, client_count: number } } = {};
    
              // Aggregate client counts by year and month
              this.clientsPerMonth.forEach(item => {
                const key = `${item.year}-${item.month}`; // Combine year and month for the key
                if (!aggregatedData[key]) {
                  aggregatedData[key] = { year: item.year, month: item.month, client_count: item.client_count };
                } else {
                  aggregatedData[key].client_count += item.client_count;
                }
              });
    
              // Prepare chart data
              const labels = [];
              const data = [];
              for (const key in aggregatedData) {
                const item = aggregatedData[key];
                labels.push(`${item.month} ${item.year}`); // Use month-year as labels
                data.push(item.client_count); // Use aggregated client_count
              }
    
              // Create the bar chart
              var myChart2 = new Chart('myChart2', {
                type: 'bar',
                data: {
                  labels: labels, // X-axis labels (Month-Year)
                  datasets: [
                    {
                      label: 'Clients',
                      data: data, // Y-axis values (client counts)
                      backgroundColor: '#78edf8',
                    }
                  ]
                },
                options: {
                  aspectRatio: 1,
                }
              });
            } else {
              // console.error('Unexpected response format:', response);
            }
          },
          error => {
            console.clear();
            // console.error('Error fetching clients per month:', error);
          }
        );
    }
    
    
    



}
