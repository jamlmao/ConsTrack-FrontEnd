import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any; // Replace with your user model

  constructor() {
    // Initialize currentUser from localStorage or API
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Add other authentication methods as needed
}