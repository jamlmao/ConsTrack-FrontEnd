import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-staff-l',
  standalone: true,
  imports: [RouterModule, RouterOutlet, FormsModule, HttpClientModule],
  templateUrl: './staff-l.component.html',
  styleUrl: './staff-l.component.css'
})


export class StaffLComponent {
  loginObj: Login;
  constructor(private http:HttpClient, private router:Router) {
    this.loginObj = new Login();
  }// Remove the closing curly brace
  onLogin() {
    this.http.post('http://127.0.0.1:8000/api/loginA', this.loginObj).subscribe(
      (res: any) => {
        console.log('API Response:', res); // Log the full response // should delete after development
        const token = res.token;
        if (token) {
          localStorage.setItem('user', JSON.stringify(res));
          localStorage.setItem('token', token);
          console.log('Token:', token);
        } else {
          console.error('Token not found in the response');
        }
  
        const storedUser = localStorage.getItem('user');
        console.log('Stored User:', storedUser);
        if (res.role) {
          if (res.role === 'staff') {
            
            console.log('Login successful, xd');
            this.router.navigateByUrl('/staff-dashboard').then((success: any) => {
              if (success) {
                console.log('Navigation successful');
              } else {
                console.log('Navigation failed');
              }
            });
          } else {
            console.log('Login successful, but not an admin');
            // Handle non-admin login if needed
          }
        } else {
          console.log('Login failed:', res.message);
        }
      },
      (error) => {
        console.error('API call error:', error); // Log any errors from the API call
      }
    );
  }
 
}

export class Login {
  email: string;
  password: string;
  constructor(){
    this.email = '';
    this.password = '';
  }
}
