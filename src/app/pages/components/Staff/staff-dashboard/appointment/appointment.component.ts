import { Component } from '@angular/core';


import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";

import { CommonModule } from '@angular/common';
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

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { take, tap } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FilterPipe } from '../../../../../filter.pipe';

import { formatDate } from '@angular/common';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth } from 'date-fns';
import { NotavailableComponent } from "../../notavailable/notavailable.component";



@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [FilterPipe, MatPaginatorModule, SweetAlert2Module, MatTableModule, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, CreateStaffAcctComponent, StaffsidenavComponent, StafftoolbarComponent, EditprofileComponent, NotavailableComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent {
  searchText:any;
  

  sideBarOpen=true;
  appointments: any[] = [];
  uniqueClients: string[] = []; 
  weeklySchedule: any = {}; // Your schedule data
  calendarDaysInMonth: { date: Date | null, isAvailable: boolean, appointments: any[] }[][] = [];
  currentDate: Date = new Date();
  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  available_dates: string[]= [];
  appointments2: any[] =[];

  private baseUrl = "http://127.0.0.1:8000/";



  getUniqueClientNames(appointments: any[]): string[] {
    const namesSet = new Set<string>();
    appointments.forEach(appointment => {
      if (appointment.client_first_name) {
        namesSet.add(appointment.client_first_name);
      }
    });
    return Array.from(namesSet);
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
  

  
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAppointments();
    this.uniqueClients = this.getUniqueClientNames(this.appointments);
    this.generateCalendarDays(new Date().getFullYear(), new Date().getMonth());
    this.fetchAvailableDates();

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
}
