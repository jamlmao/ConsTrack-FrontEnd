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


@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [FilterPipe,MatPaginatorModule,SweetAlert2Module,MatTableModule, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, CreateStaffAcctComponent, StaffsidenavComponent, StafftoolbarComponent, EditprofileComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent {
  searchText:any;
  

  sideBarOpen=true;
  appointments: any[] = [];
  uniqueClients: string[] = []; 
  weeklySchedule: any = {}; // Your schedule data
  currentDate: Date = new Date();
  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  getUniqueClientNames(appointments: any[]): string[] {
    const namesSet = new Set<string>();
    appointments.forEach(appointment => {
      if (appointment.client_first_name) {
        namesSet.add(appointment.client_first_name);
      }
    });
    return Array.from(namesSet);
  }
  

  private baseUrl = "http://127.0.0.1:8000/";

  
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAppointments();
    this.uniqueClients = this.getUniqueClientNames(this.appointments);

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
        } else {
          console.error('No appointments found');
        }
      }
    );
  }

 

isPM(appointment: any): boolean {
    const appointmentDate = new Date(appointment.appointment_datetime);
    const hour = appointmentDate.getHours();
    return appointment.status === 'A' && hour >= 13 && hour <= 17; // PM between 1:00 and 5:00
}

organizeAppointmentsByMonth() {
  const currentDate = new Date(); // Current date
  const monthStart = startOfMonth(currentDate); // Get the start of the month
  const monthEnd = endOfMonth(currentDate); // Get the end of the month

  this.weeklySchedule = {}; // Clear the existing schedule

  // Iterate over each day in the calendarDaysInMonth
  for (const week of this.calendarDaysInMonth) {
    for (const day of week) {
      const dayKey = formatDate(day.date, 'yyyy-MM-dd', 'en-US');
      
      // Filter appointments that match the current day and have status "A"
      this.weeklySchedule[dayKey] = this.appointments.filter(appointment =>
        appointment.appointment_datetime.startsWith(dayKey) && appointment.status === 'A'
      );
    }
  }
}

  getWeekStart(date: Date): Date {
    const dayOfWeek = date.getDay();
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - dayOfWeek);
    return weekStart;
  }

  getDaysInWeek(): Date[] {
    const days: Date[] = [];
    const weekStart = this.getWeekStart(new Date());
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  }

  get calendarDaysInMonth() {
    const start = startOfWeek(startOfMonth(this.currentDate));
    const end = endOfWeek(endOfMonth(this.currentDate));
    const days = [];
    let currentDay = start;

    while (currentDay <= end) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push({
          date: currentDay,
          isCurrentMonth: isSameMonth(currentDay, this.currentDate)
        });
        currentDay = addDays(currentDay, 1);
      }
      days.push(week);
    }
    return days;
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
