import { Component, EventEmitter,Input,OnInit,Output} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, RequiredValidator,ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterOutlet, Router, RouterModule,ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube,  } from '@fortawesome/free-brands-svg-icons';
import { faPlus,faTrashAlt,faAdd } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import intlTelInput from 'intl-tel-input';
import { Observable, tap } from 'rxjs';

import { MatTooltipModule } from '@angular/material/tooltip';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-addtask',
  standalone: true,
  imports: [SweetAlert2Module,FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule,MatTooltipModule],
  templateUrl: './addtask.component.html',
  styleUrl: './addtask.component.css'
})
export class AddtaskComponent {
  @Input() categoryId!: number;
  @Input() projectId: string | null = null;
  @Output() close = new EventEmitter<void>();

  faTrashAlt = faTrashAlt;
  faPlus = faAdd;


  private baseUrl = 'http://127.0.0.1:8000/api/addtask2/';
  apiUrl: string ='';

  task: any = {
    pt_task_name: '',
    pt_completion_date: '',
    pt_starting_date: '',
    pt_photo_task: '',
    pt_file_task: '',
    pt_allocated_budget: '',
    project_id: '',
    category_id: '',
    resources: []
  };
  
  categories: string[] = [
    
   
  ];



    constructor(private route: ActivatedRoute, private http: HttpClient) {}

    ngOnInit(): void {
      // Extract projectId from the current URL
      this.route.paramMap.subscribe(params => {
        this.projectId = params.get('projectId');
        console.log ('Project ID:', this.projectId);
        if (this.projectId) {
          this.apiUrl = this.getAddTaskUrl(this.projectId);
          // console.log('Full API URL:', this.apiUrl); // Log the full API UR
        } else {
          console.error('Project ID is not available in the URL');
        }
      });
    }


    

    addResource() {
      this.task.resources.push({ resource_name: '', qty: null, unit_cost: null });
    }
  
    removeResource(index: number) {
      this.task.resources.splice(index, 1);
    }

    
    

    getAddTaskUrl(projectId: string): string {
      return `${this.baseUrl}${projectId}`;
    }

    closeModal() {
      this.close.emit();
    }

    onFileChange(event: any, field: string): void {
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
              this.task[field] = base64Content;
            } else {
              console.error('The file content is not a valid base64 encoded string.');
            }
          }
        };
        reader.readAsDataURL(file);
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

      // Set the project_id in the task object
      this.task.project_id = this.projectId;
      this.task.category_id = this.categoryId;
      console.log('Task:', this.task);
      // Example payload for the POST request
      const payload = this.task;
      console.log('Task payload:', payload);
      
      console.log('Token:', token);

      this.http.post(this.apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe(response => {
        console.log('Task added successfully', response);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "successfully added successfully.",
          showConfirmButton: true,
          timer: 2000
        }).then(() => {
          window.location.reload();
        });

        this.closeModal();
      },  error => {
        console.error('Error adding task', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error adding task. over the budget",
        });
      });
    }
  }
