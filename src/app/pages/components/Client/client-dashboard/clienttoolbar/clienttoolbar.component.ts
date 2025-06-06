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
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";
import { MatBadgeModule } from '@angular/material/badge';
import { AppConfig } from '../../../../../app.config'; 

@Component({
  selector: 'app-clienttoolbar',
  standalone: true,
  imports: [ MatBadgeModule,MatMenuModule,MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent],
  templateUrl: './clienttoolbar.component.html',
  styleUrl: './clienttoolbar.component.css'
})
export class ClienttoolbarComponent {

  messages: any[] = []; // Adjust type according to your JSON structure
  private userUrl = AppConfig.baseUrl+'/api/user/details';

  // Example JSON array
  private initialMessages = [
    { id: 1, text: 'You have a new message.' },
    { id: 2, text: 'Your order has been shipped.' },
    { id: 3, text: 'Reminder: Meeting at 2 PM.' }
  ];
 //bruh
 

  loadMessages(): void {
    // Simulate fetching data from a JSON array
    this.messages = [...this.initialMessages];
  }

  markAsRead(message: any): void {
    const index = this.messages.indexOf(message);
    if (index > -1) {
      this.messages.splice(index, 1); // Remove the message from the list
    }
  }

  @Output() toggleSidebarForMe: EventEmitter<any>= new EventEmitter();
  user: any;
  isCreateStaffModalOpen = false;
  isCreateClientModalOpen = false;
  private baseUrl = AppConfig.baseUrl;
  private logoutUrl = this.baseUrl+'/api/logout';

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
    
    this.getLoggedInUserNameAndId(); //Fetch logged in user
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
     //   console.log('Logged in user:', this.user);
      },
      error => {
        console.error('Error fetching user details', error);
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
    //    console.log('Logout response:', response);
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
