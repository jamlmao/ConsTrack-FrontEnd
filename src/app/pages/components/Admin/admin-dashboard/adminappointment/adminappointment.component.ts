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

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { take, tap } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StaffsidenavComponent } from "../../../Staff/staff-dashboard/staffsidenav/staffsidenav.component";
import { SidenavComponent } from "../sidenav/sidenav.component";
import { HeaderComponent } from "../header/header.component";
@Component({
  selector: 'app-adminappointment',
  standalone: true,
  imports: [MatPaginatorModule, SweetAlert2Module, MatTableModule, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, CreateStaffAcctComponent, StaffsidenavComponent, SidenavComponent, HeaderComponent],
  templateUrl: './adminappointment.component.html',
  styleUrl: './adminappointment.component.css'
})
export class AdminappointmentComponent {

  sideBarOpen=true;
  appointments: any[] = [];

  private baseUrl = "http://127.0.0.1:8000/";

  
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }


  fetchAppointments() {
    const token = localStorage.getItem('token');

    if(!token) {
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

  

    this.http.get(this.baseUrl + "api/staff/appointments", { headers }).subscribe(
      (response:any) => {
        if(response && Array.isArray(response.appointments)) {
        this.appointments = response.appointments;
          console.log( "appointments:",this.appointments);
      }else {
        console.error('No appointments found');
      }
    }
    );
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
