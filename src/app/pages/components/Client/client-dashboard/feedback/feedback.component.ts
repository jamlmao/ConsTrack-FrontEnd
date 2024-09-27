import { Component } from '@angular/core';


import { Router, RouterModule, RouterOutlet } from '@angular/router';
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
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";
import { CreateStaffAcctComponent } from "../../../Admin/create-staff-acct/create-staff-acct.component";
import { ClientsidenavComponent } from "../clientsidenav/clientsidenav.component";
import { ClienttoolbarComponent } from "../clienttoolbar/clienttoolbar.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, CreateStaffAcctComponent, ClientsidenavComponent, ClienttoolbarComponent],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  private baseUrl = "http://127.0.0.1:8000/";
  private appointmentUrl = this.baseUrl + "api/appointments";
  user: any;
  staffList: any[] = [];
  staff_id: number = 0;
  description: string ="";
  appointment_datetime: string ="";
  minDateTime: string = ''; 
  isCreateStaffModalOpen = false;
  isCreateClientModalOpen = false;
  isLoading = false; 
  constructor(private router: Router,private http: HttpClient) { }



  ngOnInit(): void {
    
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      console.log(this.user);
    } else {
      // If no user data is found, redirect to login
      this.router.navigateByUrl('/');
    }
    this.fetchStaff();

    const now = new Date();
    now.setDate(now.getDate() + 1); 
    this.minDateTime = now.toISOString().slice(0, 16); 

  }


  isValidAppointment(dateTime: string): boolean {
    const date = new Date(dateTime);
    const hour = date.getHours();
    const minutes = date.getMinutes();

    // Check if the selected time falls within the allowed ranges
    const isMorningTime = hour >= 7 && hour < 11; // 7 AM to 11 AM
    const isAfternoonTime = hour >= 13 && hour < 17; // 1 PM to 5 PM

    return isMorningTime || isAfternoonTime;
  }


  fetchStaff() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});

    this.http.get<any>(this.baseUrl+"api/fetchstaff", { headers })
      .subscribe((response: any) => {
        console.log('Staff fetched successfully', response);
        if (response && Array.isArray(response.staff)) {
          this.staffList = response.staff; // Assuming the array is in response.data
        } else {
          console.error('No staff found or response format is incorrect');
        }
      }, error => {
        console.error('Error fetching staff', error);
      });
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

  invalidTimeSelected: boolean = false;

  onSubmit() {
    if (this.isValidAppointment(this.appointment_datetime)) {
      // Proceed with your submission logic
      console.log('Appointment valid:', this.appointment_datetime);
      this.invalidTimeSelected = false; // Reset the invalid time flag
      // Add your appointment submission logic here
    } else {
      this.invalidTimeSelected = true; // Set the invalid time flag
    }
    this.isLoading = true;
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      this.isLoading = false;
      return;
    }
  
    // Validate form fields
    if (!this.staff_id || !this.description || !this.appointment_datetime) {
      this.isLoading = false;
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please complete all fields before submitting.',
        showConfirmButton: true
      });
      return;
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    const appointmentDate = new Date(this.appointment_datetime);
    const formattedDate = `${appointmentDate.getFullYear()}-${String(appointmentDate.getMonth() + 1).padStart(2, '0')}-${String(appointmentDate.getDate()).padStart(2, '0')} ${String(appointmentDate.getHours()).padStart(2, '0')}:${String(appointmentDate.getMinutes()).padStart(2, '0')}:${String(appointmentDate.getSeconds()).padStart(2, '0')}`;
  
    const appointmentData = {
      staff_id: this.staff_id,
      description: this.description,
      appointment_datetime: formattedDate,
    };
  
    // Show loading Swal immediately
    Swal.fire({
      title: 'Submitting...',
      text: 'Please wait while we process your request.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.http.post(this.appointmentUrl, appointmentData, { headers })
      .subscribe(
        response => {
          console.log('Appointment request sent successfully', response);
          this.isLoading = false;
          this.router.navigateByUrl('/client/chome').then(() => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Appointment request sent successfully.',
              showConfirmButton: false,
              timer: 2000
            });
          });
          },
          error => {
            console.error('Error creating appointment', error);
            this.isLoading = false;
          
            // Handle specific error messages
            if (error.status === 400 && error.error.message.includes('The appointment date conflicts with another appointment in the same company')) {
              Swal.fire({
                icon: 'error',
                title: 'Duplicate Date',
                text: 'Please pick another date for the appointment.',
                showConfirmButton: true
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to create appointment. Please try again.',
                showConfirmButton: true
              });
            }
          }
      );
  }
    


  }



