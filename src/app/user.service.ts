import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly firstLoginKey = 'isFirstLogin';
  constructor() { }
  // Check if this is the user's first login
  isFirstLogin(): boolean {
    const firstLogin = localStorage.getItem(this.firstLoginKey);

    // If the key doesn't exist in localStorage, it's the user's first login
    return firstLogin === null || firstLogin === 'true';
  }

  // Set the first login status to false after the first login
  setFirstLogin(): void {
    localStorage.setItem(this.firstLoginKey, 'false');
  }

  // Optionally, reset the first login status (e.g., for testing)
  resetFirstLogin(): void {
    localStorage.removeItem(this.firstLoginKey);
  }
}
