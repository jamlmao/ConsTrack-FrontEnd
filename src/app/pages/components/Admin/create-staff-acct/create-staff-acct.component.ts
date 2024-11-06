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
import { AppConfig } from '../../../../app.config'; 

@Component({
  selector: 'app-create-staff-acct',
  standalone: true,
  imports: [SweetAlert2Module,FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './create-staff-acct.component.html',
  styleUrls: ['./create-staff-acct.component.css']
})
export class CreateStaffAcctComponent implements OnInit {
      @Output() close = new EventEmitter<void>();

      staff: StaffObj;
      private baseUrl = AppConfig.baseUrl;
      private registerStaffUrl = this.baseUrl+'/api/registerS';
      private companyUrl = this.baseUrl+'/api/companies';
      selectedCompany: string = '';
      companies:any[]= []

      constructor(private http: HttpClient) {
        this.staff = new StaffObj();
      }
      
      ngOnInit():void {

        const inputElement = document.getElementById('phone_number');
        if(inputElement){
          intlTelInput(inputElement,{
            initialCountry: 'PH',
            separateDialCode: true,
            utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.0/js/utils.js'
          });
        }
        
        this.fetchCompanies();
  
      }

      
      closeModal() {
        this.close.emit();
      }


      fetchCompanies(): void {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No auth token found');
          return;
        }
    
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        
        this.http.get<any>(this.companyUrl, { headers }).subscribe(
          (response: any) => {
            if (response && Array.isArray(response.companies)) {
              this.companies = response.companies;
            } else {
              console.error('Response does not contain a valid companies array', response);
            }
            console.log('Companies:', this.companies);
          },
          error => {
            console.error('Error fetching companies', error);
          }
        );
      }










      
      onFileChange<K extends keyof StaffObj>(event: any, field: K): void {
        const file = event.target.files[0];
        if (file) {
            console.log(`File selected: ${file.name}, size: ${file.size}, type: ${file.type}`);
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === FileReader.DONE) {
                    // console.log(`File read successfully: ${file.name}`);
                    const base64String = reader.result as string;
                    if (base64String.startsWith('data:')) {
                        const base64Content = base64String.split(',')[1];
                        // console.log(`Base64 Encoded String: ${base64Content}`);
                        this.staff[field] = base64Content;
                    } else {
                        console.error('The file content is not a valid base64 encoded string.');
                    }
                }
            };
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
            };
            reader.onabort = () => {
                console.warn('File reading was aborted');
            };
            reader.onloadend = () => {
                if (reader.error) {
                    console.error('Error occurred during file reading:', reader.error);
                }
            };
            try {
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error starting file read:', error);
            }
        } else {
            console.warn('No file selected or file is not accessible');
        }
    }


    formSubmitted: boolean = false;
  

      onSubmit() {
        this.formSubmitted = true;
        // console.log('Form Data:', this.staff);
      // console.log('Phone Number Length:', this.staff.phone_number.length);
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No auth token found');
          return;
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        Swal.fire({
          title: 'Loading...',
          text: 'Submitting...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.http.post(this.registerStaffUrl, this.staff, { headers }).subscribe(
          response => {
            Swal.close();
            // console.log('Staff created successfully', response);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Staff created successfully.",
              showConfirmButton: false,
              timer: 2000
            });

            this.closeModal();
          },
          error => {
            console.error('Error creating staff', error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error creating staff account. Something went wrong!",
            });
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
  extension_name: string;
  license_number: string;
  company_logo: string; 
  
  constructor(){
    this.email = '';
    this.password = '';
    this.first_name = '';
    this.last_name = '';
    this.name = '';
    this.extension_name = '';
    this.license_number = '';
    this.sex='';
    this.address='';
    this.city='';
    this.country='';
    this.zipcode='';
    this.company_name='';
    this.phone_number='';
    this.company_logo='';
  }
}
