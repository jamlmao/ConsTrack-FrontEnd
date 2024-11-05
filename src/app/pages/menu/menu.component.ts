import { HttpClient, HttpClientModule} from '@angular/common/http';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppConfig } from '../../app.config'; 
import { catchError , tap} from 'rxjs/operators';
import { of } from 'rxjs';








@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatInputModule,MatFormFieldModule,MatIconModule,SweetAlert2Module,RouterOutlet, RouterModule, FontAwesomeModule, FormsModule, HttpClientModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})



export class MenuComponent {

  private loginApi: string = `${AppConfig.baseUrl}/api/loginA`;
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  simpleNotification(){
    
  };
  
  faYoutube = faYoutube;
  loginObj: Login;
  
  constructor(private http: HttpClient, private router: Router) {
    this.loginObj = new Login();
  }


  onLogin() {
    this.http.post(this.loginApi, this.loginObj).pipe(
      tap({
        error: (error) => {
         //  console.log('Error occurred during login:', error);
         console.clear();
          Swal.fire({
            icon: "error",
            title: "Oops... Log in Unsuccessful",
            text: "Unauthorized access. Please check your credentials.",
          });
          return of(null);
        }
      }),
      catchError((error) => {
        // console.log('Catching error in catchError:', error);
        console.clear();
        return of(null);
      })
    ).subscribe(
      (res: any) => {
        if (res && res.token) {
          localStorage.setItem('user', JSON.stringify(res));
          localStorage.setItem('token', res.token);

          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            
            if (user.role === 'admin') {
              this.router.navigateByUrl('/admin/home').then(success => {
                if (success) {
               //    console.log('Navigation to admin dashboard successful');
                } else {
                 //  console.log('Failed to navigate to admin dashboard');
                }
              });
            } else if (user.role === 'staff') {
              this.router.navigateByUrl('/staff/shome').then(success => {
                if (success) {
                  //console.log('Navigation to staff dashboard successful');
                } else {
                //   console.log('Failed to navigate to staff dashboard');
                }
              });
            } else if (user.role === 'client') {
              this.router.navigateByUrl('client/chome').then(success => {
                if (success) {
                 //  console.log('Navigation to client dashboard successful');
                } else {
                  // console.log('Failed to navigate to client dashboard');
                }
              });
            } else {
              // console.log('Unknown role detected');
            }
          } else {
            // console.log('No user information found in local storage');
          }
        } else {
          // console.log('Invalid response received from server');
        }
      },
      (error) => {
        // console.log('Error occurred after subscribe:', error);
        console.clear();
        Swal.fire({
          icon: "error",
          title: "Oops... Log in Unsuccessful",
          text: "Something went wrong!",
        });
      }
      
    );
    
  }
}
export class Login {
  username: string;
  password: string;
  constructor(){
    this.username = '';
    this.password = '';
  }
}

