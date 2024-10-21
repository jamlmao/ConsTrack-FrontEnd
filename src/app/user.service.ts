import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly firstLoginKey = 'isFirstLogin';

  constructor() {}

  // Check if this is the user's first login
  isFirstLogin(): boolean {
    const firstLogin = localStorage.getItem(this.firstLoginKey);
    return firstLogin === null || firstLogin === 'true'; // Returns true if first login
  }

  // Set the first login status to false
  setFirstLogin(): void {
    localStorage.setItem(this.firstLoginKey, 'false');
  }

  // Reset first login status (for testing purposes)
  resetFirstLogin(): void {
    localStorage.removeItem(this.firstLoginKey); // Remove the first login entry
  }
}
