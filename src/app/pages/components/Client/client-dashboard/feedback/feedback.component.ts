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

import { formatDate } from '@angular/common';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth } from 'date-fns';
import { ClientappointComponent } from "../clientappoint/clientappoint.component";

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, CreateStaffAcctComponent, ClientsidenavComponent, ClienttoolbarComponent, ClientappointComponent],
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
  ngIfWeeklySchedule: any; 

  appointments: any[] = [];
  uniqueClients: string[] = []; 
  weeklySchedule: any = {}; // Your schedule data
  calendarDaysInMonth: { date: Date | null, isAvailable: boolean, appointments: any[] }[][] = [];
  currentDate: Date = new Date();
  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  available_dates: string[]= [];
  appointments2: any[] =[];

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
    this.generateCalendarDays(new Date().getFullYear(), new Date().getMonth());
    this.fetchAvailableDates();

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



  fetchAppointments() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(`${this.baseUrl}api/staff/appointments`, { headers }).subscribe(
      (response: any) => {
        if (response && Array.isArray(response.appointments)) {
          this.appointments = response.appointments;
        console.log('Appointmentss:', this.appointments);
          this.organizeAppointmentsByMonth();
          this.generateCalendarDays(new Date().getFullYear(), new Date().getMonth());
        } else {
          console.error('No appointments found');
        }
      }
    );
  }


  fetchAvailableDates() {
    const token = localStorage.getItem('token');
    if(!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(`${this.baseUrl}api/available-dates`, { headers }).subscribe(
      (response: any) => {
        console.log(response);
        const availableDates = response.available_dates.map((dateObj: any) => dateObj.available_date);
        
        this.available_dates = availableDates;
        console.log('Available Dates:', this.available_dates);

        if (response.available_dates && response.available_dates.length > 0) {
          this.appointments2 = response.available_dates.flatMap((dateObj: any) => dateObj.appointments || []);
          console.log('Appointments:', this.appointments);
        } else {
          console.error('No appointments found in response');
        }



        this.generateCalendarDays(new Date().getFullYear(), new Date().getMonth());
        this.organizeAppointmentsByMonth();
      }
    );

  }






    generateCalendarDays(year: number, month: number): void {
      const date = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const calendarDays = [];

      let week = [];
      for (let i = 0; i < date.getDay(); i++) {
          week.push({ date: null, isAvailable: false, appointments: [] });
      }

      const formatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Manila',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
      });

      for (let day = 1; day <= daysInMonth; day++) {
          const currentDate = new Date(year, month, day);
          const dayKey = formatter.format(currentDate).split('/').reverse().join('-');
          const appointmentsForDay = this.appointments.filter(appointment => {
              const appointmentDate = new Date(appointment.appointment_datetime);
              const appointmentDayKey = formatter.format(appointmentDate).split('/').reverse().join('-');
              return appointmentDayKey === dayKey && appointment.status === 'A';
          });
          const isAvailable = this.available_dates.includes(dayKey) || appointmentsForDay.length > 0;
          // console.log(`Date: ${dayKey}, Is Available: ${isAvailable}, Appointments: ${appointmentsForDay.length}`);
          week.push({ date: currentDate, isAvailable: isAvailable, appointments: appointmentsForDay });

          if (week.length === 7) {
              calendarDays.push(week);
              week = [];
          }
      }

      if (week.length > 0) {
          while (week.length < 7) {
              week.push({ date: null, isAvailable: false, appointments: [] });
          }
          calendarDays.push(week);
      }

      this.calendarDaysInMonth = calendarDays;
  }


 

  isPM(appointment: any): boolean {
      const appointmentDate = new Date(appointment.appointment_datetime);
      const hour = appointmentDate.getHours();
      return appointment.status === 'A' && hour >= 13 && hour <= 17; // PM between 1:00 and 5:00
  }


    organizeAppointmentsByMonth() {
      this.weeklySchedule = {}; // Clear the existing schedule

      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      // Iterate over each day in the calendarDaysInMonth
      for (const week of this.calendarDaysInMonth) {
        for (const day of week) {
          if (day.date) {
            const dayKey = formatter.format(day.date).split('/').reverse().join('-');
            
            // Filter appointments that match the current day and have status "A"
            this.weeklySchedule[dayKey] = day.appointments;
          }
        }
      }
    }



  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }



  updateStatus(appointmentId: number, status: string):void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    Swal.fire({
      title: 'Submitting...',
      text: 'Please wait while we process your request.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.put(this.baseUrl + `api/appointments/${appointmentId}/status`, { status }, { headers }).subscribe((response: any) => {
      if (response && response.status) {
        Swal.close();
        const appointment = this.appointments.find(a => a.id === appointmentId);
        if (appointment) {
          appointment.status = status;
        }
        Swal.fire({
          title: 'Success',
          text: 'Appointment status updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.fetchAppointments();
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to update appointment status',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }, error => { Swal.close();});
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

  isTaskOpen = false;
  

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



