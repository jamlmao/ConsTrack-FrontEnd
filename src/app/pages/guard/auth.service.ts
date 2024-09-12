import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any; 

  constructor(private router: Router) {
  
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  }

  getCurrentUser() {
    return this.currentUser;
    }
    
    isAuthenticated(): boolean {
      return !!localStorage.getItem('user');
      
    }
  
    logout() {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

}