import { Component, OnInit } from '@angular/core';


import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { HeaderComponent } from "../header/header.component";
import { SidenavComponent } from "../sidenav/sidenav.component";

import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule} from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CreateStaffAcctComponent } from "../../create-staff-acct/create-staff-acct.component";
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";

import { Chart,registerables } from 'chart.js';
import { first, last, take, tap } from 'rxjs';
Chart.register(...registerables);
import { NgCircleProgressModule } from 'ng-circle-progress';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CreateStaffAcctComponent, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, SidenavComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  private baseUrl = 'http://127.0.0.1:8000';
  private StaffCountUrl = this.baseUrl+'/api/staff/CountPerMonthA';
  private totalUsersUrl = this.baseUrl+'/api/counts';
  private userUrl = this.baseUrl+'/api/user/details';
  private ProjectsCountUrl = this.baseUrl+'/api/projectCount';
  private ClientsCountUrl = this.baseUrl+'/api/clients/count-by-month';
  private CompanyAndProjectCountUrl = this.baseUrl+'/api/projects/count-by-month';




  projects: any[] = [];
  selectedProject: any;
  user: any = {};
  projectCount: number | null = null;
  isCreateClientModalOpen = false;
  isCreateStaffModalOpen = false;
  done_count: number | null = null;
  ongoing_count: number | null = null;
  clientsPerMonth: any[] = [];
  
  
  companycount: number | null = null;
  completedProjectCount: number | null = null;
  delayedProjectCount: number | null = null;
  staffcount: number | null = null;
  totalProjectCount: number | null = null;
  clientcount: number | null = null;
  totalUserCount: number | null = null;
  StaffPerMonth:[] = [];

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    console.log(localStorage.getItem('user'));
    if (userData) {
      this.user = JSON.parse(userData);
      console.log('User data:', this.user);
       
    } else {
      // If no user data is found, redirect to login
      this.router.navigateByUrl('/');
    }

    this.getLoggedInUserNameAndId(); // Fetch logged in user details
   this.getCompanyProjects();
   this.getTotalUsers();
   this.getStaffCountPerMonth();
   this.getClientCountPerMonth();
   this.getProjectAndCompanyCount();
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

  getTotalUsers(): void {
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    
  
  
    this.http.get<{ totalUserCount: number, companycount: number, staffcount: number, clientcount: number,delayedProjectCount:number}>(this.totalUsersUrl, { headers })
      .subscribe(
        response => {
          console.log('count:', response)
          this.totalUserCount = response.totalUserCount;
          this.companycount = response.companycount;
          this.staffcount = response.staffcount;
          this.clientcount = response.clientcount;
          
          this.delayedProjectCount = response.delayedProjectCount;

          var myChart10 = new Chart('myChart10',{  
            type: 'bar',
            data:{
              labels: ['2024'],
              datasets: [
              {
                label: 'Company',
                data: [this.companycount, ],
                backgroundColor: ['maroon'],
              },
            ],
        
            },
            options:{
              aspectRatio: 1,
            }
          }
            
          )

          var myChart11 = new Chart('myChart11',{  
            type: 'bar',
            data:{
              labels: ['2024'],
              datasets: [
              {
                label: 'Users',
                data: [this.totalUserCount, ],
                backgroundColor: ['maroon'],
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


  getStaffCountPerMonth(): void {
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in local storage');
        return;
      }
    
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    
      
      this.http.get<{ StaffPerMonth: []}>(this.StaffCountUrl, { headers })
        .subscribe(
          response => {
            console.log('Staff count:', response)
            this.StaffPerMonth = response.StaffPerMonth;
            
  
          },
          error => {
            console.error('Error fetching projects:', error);
          }
        );

  }



  
  datayear:any[]=[];
  datamonth:any[]=[];
  dataproject:any[]=[];


  getClientCountPerMonth(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>(this.ClientsCountUrl, { headers }).subscribe((response)=>{
      console.log('Clients count:', response)
      this.clientsPerMonth = response.clients_per_month;
      if(this.clientsPerMonth!=null){ 
        for(let i = 0; i<this.clientsPerMonth.length; i++)
            this.datayear.push(this.clientsPerMonth[i].year);

          for(let i = 0; i<this.clientsPerMonth.length; i++)
            this.datamonth.push(this.clientsPerMonth[i].month);

          for(let i = 0; i<this.clientsPerMonth.length; i++)
            this.dataproject.push(this.clientsPerMonth[i].count);
       }
       var myChart2 = new Chart('myChart2',{  
        type: 'bar',
        data:{
          labels: this.datayear,
          datasets: [
          {
            label: 'Clients',
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
      


    });

  }





  getProjectAndCompanyCount(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>(this.CompanyAndProjectCountUrl, { headers }).subscribe((response)=>{
      console.log('Company and projects:', response)

    });

  }



  getCompanyProjects(): void {
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    
  
  
    this.http.get<{ project_count: number,ongoing_count: number ,done_count: number}>(this.ProjectsCountUrl, { headers })
      .subscribe(
        response => {
          console.log('Project count:', response)
          this.ongoing_count = response.ongoing_count;
          this.done_count = response.done_count;
          this.projectCount = response.project_count;

          var myChart = new Chart('myChart1',{  
            type: 'pie',
            data:{
              labels: ['Done', 'Ongoing'],
              datasets: [
              {
                label: 'Projects',
                data: [this.done_count, this.ongoing_count ],
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

}
