import { Component, EventEmitter,OnInit,Output} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, RequiredValidator,ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterOutlet, Router, RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import intlTelInput from 'intl-tel-input';
import { Observable, tap, take } from 'rxjs';


import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { AppConfig } from '../../../../app.config'; 
@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [MatFormFieldModule,MatFormFieldModule,MatIconModule,SweetAlert2Module,FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent {
  @Output() close = new EventEmitter<void>();
  
  closeModal() {
    this.close.emit();
  }
  
  project: any = {
    site_city: '',
    site_province: '',
    site_address: '',
    project_name: '',
    project_type: '',
    client_id: '',
    completion_date: '',
    starting_date: '',
    totalBudget: 0,
    pj_image: null,
    pj_image1: null,
    pj_image2: null,
    pj_pdf: null
  };

  showForm = false;
  clients: any[] = [];
  staff: any[] = [];
  user: any;
  loggedInUser: any = null;


  private addUrl = AppConfig.baseUrl+'/api/addproject';
  private clientsUrl = AppConfig.baseUrl+'/api/clients';
  private staffUrl = AppConfig.baseUrl+'/api/staff-with-extension';
  private userUrl = AppConfig.baseUrl+'/api/user/details';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
   
    this.fetchClients(); // Fetch clients when the component is initialized
    this.fetchStaff(); // Fetch staff when the component is initialized
    this.getLoggedInUserNameAndId(); // Fetch logged-in user information
    // console.log('Project data on init:', this.project);
    
  }

  openForm(): void {
    this.showForm = true;
  }

  getLoggedInUserNameAndId(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      // console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(this.userUrl, { headers }).subscribe(
      (response: any) => {
        this.loggedInUser = response.staff;
        // console.log('Logged in user:', this.loggedInUser);
      },
      error => {
        // console.error('Error fetching user details', error);
      }
    );
  }
    
  isLoggedInUserStaff(): boolean {
    return this.loggedInUser && this.loggedInUser.extension_name;
  }

    fetchStaff(): void {
      const token = localStorage.getItem('token');
      if (!token) {
        // console.error('No token found in local storage');
        return;
      }
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      this.http.get(this.staffUrl, { headers }).subscribe(
        (response: any) => {
          if (response.status) {
            // console.log('Staff fetched successfully:', response.staff_with_extension);
            this.staff = response.staff_with_extension;
          } else {
            // console.error('Failed to fetch staff');
          }
        },
        error => {
          // console.error('Error fetching staff', error);
        }
      );
    
    
    }

  fetchClients(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      // console.error('No token found in local storage');
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    this.http.get<any>(this.clientsUrl, { headers })
    .pipe(
      tap(response => {
        // console.log('Full response:', response);
        if (response && Array.isArray(response.clients)) {
          // Filter out duplicate clients based on the 'id' property
          const uniqueClients = response.clients.filter((client: any, index: number, self: any[]) =>
            index === self.findIndex((c) => c.id === client.id)
          );
          this.clients = uniqueClients;
        } else {
          // console.error('Unexpected response format:', response);
          this.clients = [];
        }
        // console.log('Fetched clients:', this.clients);
      }),
      take(1) // This will ensure the observable completes after the first emission
    )
    .subscribe(
      () => {},
      error => {
        // console.error('Error fetching clients:', error);
      }
    );
  }
 
 
  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
        // console.log(`File selected: ${file.name}, size: ${file.size}, type: ${file.type}`);
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === FileReader.DONE) {
                // console.log(`File read successfully: ${file.name}`);
                const base64String = reader.result as string;
                if (base64String.startsWith('data:')) {
                    const base64Content = base64String.split(',')[1];
                    // console.log(`Base64 Encoded String: ${base64Content}`);
                    this.project[field] = base64Content;
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

  onSubmit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };

    const formData = new FormData();
    for (const key in this.project) {
      if (this.project.hasOwnProperty(key) && this.project[key] !== null) {
        formData.append(key, this.project[key]);
      }
    }

    this.http.post(this.addUrl, formData, { headers }).subscribe(
      response => {
        // console.log('Project added successfully', response);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Project added successfully.",
          showConfirmButton: true,
          timer: 2000
        }).then(() => {
          // window.location.reload();
        });

        this.closeModal();
      },
      error => {
        console.error('Error adding project', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error adding project. Something went wrong!",
        });
      }
    );
  }
}
