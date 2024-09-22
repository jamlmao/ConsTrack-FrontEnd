import { Component, EventEmitter,Input,OnInit,Output} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, RequiredValidator,ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterOutlet, Router, RouterModule, ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import intlTelInput from 'intl-tel-input';
import { Observable, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-archi',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './archi.component.html',
  styleUrl: './archi.component.css'
})
export class ArchiComponent {

  isChecklistChecked = false;

  isFileSelected: boolean = false;  // To track if a file is selected
  @Input() categoryId!: number;

  

  

  @Input() taskId: number | null = null;
  @Output() close = new EventEmitter<void>();
  
  closeModal() {
    this.close.emit();
  }

  constructor(private route: ActivatedRoute, private router: Router , private http: HttpClient) { }





  tasks: any = {};
  selectedTaskId: number | null = null;
  private baseUrl = 'http://127.0.0.1:8000/'
  private updateTaskUrl = this.baseUrl+'api/updatetask/';
  private resourceUrl = this.baseUrl+'api/tasks/';
  apiUrl: string ='';
  resources: any[] = [];  
  usedQty: string | number = '' ;
  availableQty: number = 0;
  selectedResource: any = null;
  resource_id: number | null = null;


  toggleChecklist(event: Event): void {
    this.isChecklistChecked = (event.target as HTMLInputElement).checked;
  }


  validateQty(): void {
    if (typeof this.usedQty === 'string') {
      this.usedQty = parseInt(this.usedQty, 10) || 0;
    }
    if (this.usedQty > this.availableQty) {
      this.isFileSelected = false;
    } else {
      this.isFileSelected = true;
    }
  }

  onResourceChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedResourceId =  Number(selectElement.value);;
    this.selectedResource = this.resources.find(resource => resource.id === selectedResourceId);
  
    if (this.selectedResource) {
      this.availableQty = this.selectedResource.left_qty; 
      this.resource_id = this.selectedResource.id;
    } else {
      this.availableQty = 0;
      console.error('Selected resource not found');
    }
  }


  clearDefaultValue(): void {
    if (this.usedQty === 0) {
      this.usedQty = '';
    }
  }

  ngOnInit(): void {
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we load the tasks.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
   
    this.route.paramMap.subscribe(params => {
      this.taskId = Number(params.get('taskId')) || null;
      const taskIdNumber = Number(this.taskId);
      console.log('Task ID:', this.taskId);
      if (!isNaN(taskIdNumber)) {
        this.selectedTaskId = taskIdNumber;
        this.fetchResource(taskIdNumber);
      }
    });
    this.apiUrl = this.updateTaskUrl + this.taskId;
    console.log('API URL:', this.apiUrl);
   
  }

 

  

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      this.isFileSelected = true;
      console.log(`File selected: ${file.name}, size: ${file.size}, type: ${file.type}`);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === FileReader.DONE) {
          const base64String = reader.result as string;
          if (base64String.startsWith('data:')) {
            const base64Content = base64String.split(',')[1];
  
            // Ensure tasks is an object with string keys and string values
            this.tasks[field] = base64Content;
          } else {
            console.error('The file content is not a valid base64 encoded string.');
            
          }
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.warn('No file selected or file is not accessible');
      this.isFileSelected = false;  
    }
  }


  


  fetchResource(taskId: number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });


    this.http.get(this.resourceUrl + `${taskId}/resources`, { headers }).subscribe(
      (response :any) => {
        this.resources = response.resources;
        Swal.close();
        
        console.log('Resources:', this.resources);
        this.resources.forEach(resource => {
          console.log('Resource ID:', resource.id);
        });

      }
    );


  }
  


  onSubmit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    if (this.resource_id === null || this.usedQty === 0) {
      console.error('Resource ID or used quantity is missing');
      return;
    }
    const resources = [
      {
        resource_id: this.resource_id,
        used_qty: this.usedQty
      }
    ];

    const formData = {
      task_id: this.selectedTaskId,
      resources: resources,
      update_img: this.isChecklistChecked ? 'update_img' : 'placeholder_image'
    };

    const payload = { ...this.tasks, ...formData };
    console.log('Payload:', payload);


    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    Swal.fire({
          position: "center",
          icon: "success",
          title: "Task updated successfully",
          showConfirmButton: true,
          timer: 2000
        }).then(() => {
          window.location.reload();
        });
    this.http.post(this.apiUrl, payload, { headers }).subscribe(response => { 
        console.log('Task updated successfully', response);
        this.closeModal();
    },error => {
      console.error('Error updating task', error);
      Swal.fire({
        icon: "error",
        title:"Ooopsieee",
        text:"Something went wrong",
      });
    }
  );


  }




}
