import { Component, EventEmitter,OnInit,Output} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, RequiredValidator,ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterOutlet, Router, RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent {
  @Output() close = new EventEmitter<void>();
  
  closeModal() {
    this.close.emit();
  }
  
  project: any = {
    site_location: '',
    client_id: '',
    completion_date: '',
    starting_date: '',
    totalBudget: 0,
    pj_image: null,
    pj_pdf: null
  };

  showForm = false;
  clients: any[] = [];


  private apiUrl = 'http://127.0.0.1:8000/api/addproject';
  private clientsUrl = 'http://127.0.0.1:8000/api/clients';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
   
    this.fetchClients(); // Fetch clients when the component is initialized
    
  }

  openForm(): void {
    this.showForm = true;
  }

  fetchClients(): void {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    if (!token) {
      console.error('No token found in local storage');
      return;
    }
    console.log('Token:', token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Add the Bearer token to the headers
    });

    this.http.get(this.clientsUrl, { headers }).subscribe(
      (response: any) => {
        console.log('Full response:', response);
        this.clients = response;
        console.log('Fetched clients:', this.clients); // Assuming the response has a 'clients' field
      },
      error => {
        console.error('Error fetching clients', error);
      }
    );
  }
 
 
  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
        console.log(`File selected: ${file.name}, size: ${file.size}, type: ${file.type}`);
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === FileReader.DONE) {
                console.log(`File read successfully: ${file.name}`);
                const base64String = reader.result as string;
                if (base64String.startsWith('data:')) {
                    const base64Content = base64String.split(',')[1];
                    console.log(`Base64 Encoded String: ${base64Content}`);
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
      if (this.project.hasOwnProperty(key)) {
        formData.append(key, this.project[key]);
      }
    }

    this.http.post('http://127.0.0.1:8000/api/addproject', formData, { headers }).subscribe(
      response => {
        console.log('Project added successfully', response);
        this.closeModal();
      },
      error => {
        console.error('Error adding project', error);
      }
    );
  }
}