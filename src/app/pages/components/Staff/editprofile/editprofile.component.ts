import { Component, EventEmitter,Input,OnInit,Output} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, RequiredValidator,ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet, Router, RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import intlTelInput from 'intl-tel-input';
import Swal from 'sweetalert2';
import { AppConfig } from '../../../../app.config';
@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.css'
})
export class EditprofileComponent {
  @Input() clientId!: number;
  @Output() close = new EventEmitter<void>();
  uniqueId: string;
  private baseUrl: string;
  constructor(private http: HttpClient,private router: Router) {
    this.uniqueId = this.generateUniqueId();
    this.baseUrl = AppConfig.baseUrl;
  }
  closeModal() {
    
    this.close.emit();
  }

  generateUniqueId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  
  user:any;
  extensionName: string = '';
  licenseNumber: string = '';
  client: any = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    country: '',
    zipcode: '',
    password: '',
  }


  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);

    } else {
      // If no user data is found, redirect to login
      this.router.navigateByUrl('/');
    }

    const inputElement = document.getElementById('phone_number');
    if(inputElement){
      intlTelInput(inputElement,{
        initialCountry: 'PH',
        separateDialCode: true,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.0/js/utils.js'

      });
  }
  this.getLoggedInUserNameAndId()
} 



    getLoggedInUserNameAndId(): void {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in local storage');
        return;
      }
     // console.log('Token:', token);

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.get(this.baseUrl +'/api/user/details', { headers }).subscribe(
        (response: any) => {
          this.user = response;
        //  console.log('Logged in user:', this.user);
          if (this.user && this.user.staff) {
            this.extensionName = this.user.staff.extension_name;
            this.licenseNumber = this.user.staff.license_number;
          }

        },
        error => {
          console.clear();
          // console.error('Error fetching user details', error);
        }
      );
    }




  onSubmit() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No auth token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    interface Payload {
      [key: string]: any;
    }


    const payload: Payload = Object.keys(this.client).reduce((acc: Payload, key: string) => {
      if (this.client[key]) {
        acc[key] = this.client[key];
      }
      return acc;
    }, {});
  
    // Add user_id to the payload
    payload['client_id'] = this.clientId;
  //  console.log('Payload:', payload);
    Swal.fire({
      title: 'Loading...',
      text: 'Submitting...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.http.post(this.baseUrl + '/api/admin/update-password', payload, { headers }).subscribe(
      response => {
        Swal.close();
      //  console.log('Client updated successfully', response);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Client updated successfully.",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          window.location.reload();
        });
       
        this.closeModal();
      },
      error => {
        console.clear();
        // console.error('Error updating client account', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error updating client account. Something went wrong!",
        });
      }
    );

  }
}
