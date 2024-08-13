import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { RouterOutlet, Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-create-staff-acct',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterOutlet, RouterModule],
  templateUrl: './create-staff-acct.component.html',
  styleUrls: ['./create-staff-acct.component.css']
})
export class CreateStaffAcctComponent {
      @Output() close = new EventEmitter<void>();

      staff: StaffObj;

      constructor(private http: HttpClient) {
        this.staff = new StaffObj();
      }
      
    ngOnInit() {
      console.log('CreateStaffAcctComponent initialized');
    }
      closeModal() {
        this.close.emit();
      }

      onSubmit() {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No auth token found');
          return;
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.http.post('http://127.0.0.1:8000/api/registerS', this.staff, { headers }).subscribe(
          response => {
            console.log('Staff created successfully', response);
            this.closeModal();
          },
          error => {
            console.error('Error creating staff', error);
          }
        );
      }
}
export class StaffObj {
  email: string;
  password: string;
  first_name: string;
  last_name: string; 
  name: string
  sex: string;
  address: string;
  city: string;
  country: string;
  zipcode: string;
  company_name: string;
  phone_number: string;
  
  constructor(){
    this.email = '';
    this.password = '';
    this.first_name = '';
    this.last_name = '';
    this.name = '';
    this.sex='';
    this.address='';
    this.city='';
    this.country='';
    this.zipcode='';
    this.company_name='';
    this.phone_number='';
  }
}
