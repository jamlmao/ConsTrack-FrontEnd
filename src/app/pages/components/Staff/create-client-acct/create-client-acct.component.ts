import { Component, EventEmitter,OnInit,Output} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, RequiredValidator,ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet, Router, RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import intlTelInput from 'intl-tel-input';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-create-client-acct',
  standalone: true,
  imports: [SweetAlert2Module,FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './create-client-acct.component.html',
  styleUrl: './create-client-acct.component.css'
})
export class CreateClientAcctComponent implements OnInit {
    faYoutube = faYoutube;
    @Output() close = new EventEmitter<void>();

    registerForm!:FormGroup;
    client: ClientObj; 

    constructor(private http: HttpClient) {
      this.client = new ClientObj();
    }


    ngOnInit():void {
      console.log('Component initialized');
      const inputElement = document.getElementById('phone_number');
      if(inputElement){
        intlTelInput(inputElement,{
          initialCountry: 'US',
          separateDialCode: true,
          utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.0/js/utils.js'

        });
      }


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
        
        this.http.post('http://127.0.0.1:8000/api/registerC', this.client, { headers }).subscribe(
          response => {
            console.log('Clientcreated successfully', response);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Client created successfully.",
              showConfirmButton: false,
              timer: 2000
            });

            this.closeModal();
          },
          error => {
            console.error('Error creating client account', error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error creating client account. Something went wrong!",
            });
          }
        );
      }

}


export class ClientObj {
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