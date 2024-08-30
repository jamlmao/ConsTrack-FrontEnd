import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';

const baseUrl = 'http://127.0.0.1:8000';
const loginApi = `${baseUrl}/api/loginA`;

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterOutlet, RouterModule, FontAwesomeModule, FormsModule, HttpClientModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})



export class MenuComponent {
  faYoutube = faYoutube;
  loginObj: Login;
  
  constructor(private http: HttpClient, private router: Router) {
    this.loginObj = new Login();
  }


  onLogin() {
    this.http.post(loginApi, this.loginObj).subscribe(
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
          if (res.role === 'admin') {
            console.log('Login successful, admin');
            this.router.navigateByUrl('/admin/home').then(success => {
              if (success) {
                console.log('Navigation to admin dashboard successful');
              } else {
                console.log('Navigation to admin dashboard failed');
              }
            });
          } else if (res.role === 'staff') {
            console.log('Login successful, staff');
            this.router.navigateByUrl('/staff/shome').then(success => {
              if (success) {
                console.log('Navigation to staff dashboard successful');
              } else {
                console.log('Navigation to staff dashboard failed');
              }
            });
          } else if (res.role === 'client') {
            console.log('Login successful, client');
            this.router.navigateByUrl('client/chome').then(success => {
              if (success) {
                console.log('Navigation to client dashboard successful');
              } else {
                console.log('Navigation to client dashboard failed');
              }
            });
          } else {
            console.log('Login successful, but role is not recognized');
            // Handle other roles if needed
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

