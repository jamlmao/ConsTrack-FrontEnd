import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  
  projectForm!: FormGroup;
  showForm = false;
  clients: any[] = [];
  private apiUrl = 'http://127.0.0.1:8000/api/addproject';
  private clientsUrl = 'http://127.0.0.1:8000/api/clients';
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      site_location: ['', Validators.required],
      client_id: ['', Validators.required],
      completion_date: ['', Validators.required],
      starting_date: ['', Validators.required],
      totalBudget: ['', Validators.required],
      pj_image: [''],
      pj_pdf: ['']
    });
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
 
  onFileChange(event: any, controlName: string): void {
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
            this.projectForm.patchValue({
              [controlName]: base64Content
            });
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
    if (this.projectForm.valid) {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      if (!token) {
        console.error('No token found in local storage');
        return;
      }

      console.log('Token:', token); // Log the token for debugging

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add the Bearer token to the headers
      });

      this.http.post(this.apiUrl, this.projectForm.value, { headers }).subscribe(
        response => {
          console.log('Project added successfully', response);
          this.showForm = false;
        },
        error => {
          console.error('Error adding project', error);
        }
      );
    }
  }
}