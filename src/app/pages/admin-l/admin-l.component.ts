import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-l',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule],
  templateUrl: './admin-l.component.html',
  styleUrl: './admin-l.component.css'
})
export class AdminLComponent {

  loginObj: Login;

  constructor(private http: HttpClient, private router: Router) {
    this.loginObj = new Login();
  }


  onLogin() {
    this.http.post('http://127.0.0.1:8000/api/loginA', this.loginObj).subscribe(
      (res: any) => {
        console.log('API Response:', res); // Log the full response
        if (res.status) {
          if (res.role === 'admin') {
            console.log('Login successful, navigating to /Staff');
            this.router.navigateByUrl('/Staff');
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
