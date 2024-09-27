import { Component, EventEmitter, OnInit, Output } from '@angular/core';


import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";

import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders , HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";

import {MatBadgeModule} from '@angular/material/badge';

@Component({
  selector: 'app-stafftoolbar',
  standalone: true,
  imports: [MatBadgeModule, MatMenuModule,MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent],
  templateUrl: './stafftoolbar.component.html',
  styleUrl: './stafftoolbar.component.css'
})
export class StafftoolbarComponent {

  messages: any[] = []; // Adjust type according to your JSON structure
  clientCount: number = 0;






  @Output() toggleSidebarForMe: EventEmitter<any>= new EventEmitter();
  user: any;
  isCreateStaffModalOpen = false;
  isCreateClientModalOpen = false;
  private baseUrl = 'http://127.0.0.1:8000/';
  private logoutUrl = this.baseUrl+'api/logout';
  private userUrl = 'http://127.0.0.1:8000/api/user/details';

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadMessages();
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      // If no user data is found, redirect to login
      this.router.navigateByUrl('/');
    }
    this.fetchNotifications(); // Fetch notifications when the component is initialized
    
    this.getLoggedInUserNameAndId(); //Fetch logged in user
  }
  
  loadMessages(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>(this.baseUrl+'api/notifications', { headers }).subscribe(
      (response) => {

        this.clientCount = response.client_count;
        this.messages = response.appointments.map((appointment: any, index: number) => ({
          id: index + 1,
          text: `Client ${appointment.first_name} ${appointment.last_name} requested a meeting on ${this.formatDate(appointment.appointment_datetime)}`
        }));
        console.log('Messages loaded successfully', this.messages);
      },
      (error) => {
        console.error('Error fetching notifications', error);
      }
    );
  }

  formatDate(dateTime: string): string {
    const date = new Date(dateTime);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
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






  markAsRead(message: any): void {
    const index = this.messages.indexOf(message);
    if (index > -1) {
      this.messages.splice(index, 1); // Remove the message from the list
    }
  }




  fetchNotifications() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(this.baseUrl + 'api/notifications', { headers }).subscribe(
      (response: any) => {
        console.log('Notifications fetched successfully', response);
      },
      error => {
        console.error('Error fetching notifications', error);
      }
    );
  }




  logout(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

      const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post(this.logoutUrl, {}, { headers }).subscribe(
      (response: any) => {
        console.log('Logout response:', response);
      },
      error => {
        console.error('Error logging out', error);
      }
    );




    localStorage.removeItem('user'); // Remove user data from local storage
    this.router.navigateByUrl('/'); // Redirect to login page

  }
  
  
  
  toggleSidebar(){
    this.toggleSidebarForMe.emit();
  }

}
