import { Component, EventEmitter,Input,OnInit,Output} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, FormControl, Validators, RequiredValidator,ReactiveFormsModule, FormBuilder } from '@angular/forms';
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

  constructor(private route: ActivatedRoute, private router: Router , private http: HttpClient) {
  

}




  user:any = {};
  tasks: any = {};
  description: string = '';
  budget: number | null = null;
  selectedTaskId: number | null = null;
  private baseUrl = 'http://127.0.0.1:8000/'
  private updateTaskUrl = this.baseUrl+'api/updatetask/';
  private resourceUrl = this.baseUrl+'api/tasks/';
  private userUrl = this.baseUrl+'api/user/details';
  private task = `${this.baseUrl}`+'api/tasks';
  status: string = '';
  apiUrl: string ='';
  resources: any[] = [];  
  usedQty: string | number = '' ;
  availableQty = 0;
  selectedResources: { resourceId: number | null, quantity: number | null, isValid: boolean }[] = [{ resourceId: null, quantity: null, isValid: true }];
  selectedResource: any;
  resource_id: number | null = null;
  staffId: number | null = null;
  images: any[] = [{}];



  toggleChecklist(event: Event): void {
    this.isChecklistChecked = (event.target as HTMLInputElement).checked;
  }


  validateQty(index: number): void {
    const selectedResource = this.selectedResources[index];
    if (selectedResource && selectedResource.quantity !== null) {
      const usedQty = typeof selectedResource.quantity === 'string' ? parseInt(selectedResource.quantity, 10) : selectedResource.quantity;
      const resource = this.resources.find(res => res.id === selectedResource.resourceId);
      if (resource && usedQty > resource.left_qty) {
        selectedResource.isValid = false;
      } else {
        selectedResource.isValid = true;
      }
    }
  }


  onResourceChange(event: Event, index: number): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedResourceId = Number(selectElement.value);
    this.selectedResource = this.resources.find(resource => resource.id === selectedResourceId);

    if (this.selectedResource) {
      this.availableQty = this.selectedResource.left_qty;
      this.resource_id = this.selectedResource.id;
    } else {
      this.availableQty = 0;
      console.error('Selected resource not found');
    }

    // Ensure the selectedResources array has an element at the specified index
    if (!this.selectedResources[index]) {
      this.selectedResources[index] = { resourceId: null, quantity: null, isValid: true };
    }

    // Check for duplicates
    const duplicateIndex = this.selectedResources.findIndex(
      (resource, i) => resource.resourceId === selectedResourceId && i !== index
    );
    if (duplicateIndex !== -1) {
      // Remove the duplicate
      this.selectedResources.splice(duplicateIndex, 1);
    }
    this.selectedResources[index].resourceId = selectedResourceId;

    // Ensure the quantity input is enabled
    if (this.selectedResources[index].quantity === null) {
      this.selectedResources[index].quantity = 0;
    }

    // Validate the quantity
    this.validateQty(index);
  }

  addImage() {
    this.images.push({ file: null });
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }




  addResource() {
    this.selectedResources.push({ resourceId: null, quantity: 0, isValid: true });
  }

  removeResource(index: number) {
    this.selectedResources.splice(index, 1);
  }

  clearDefaultValue(index: number): void {
    if (this.usedQty === 0) {
      this.usedQty = '';
    }
  }

  getFilteredResources(index: number): any[] {
    const selectedResourceIds = this.selectedResources.map(resource => resource.resourceId);
    return this.resources.filter(resource => !selectedResourceIds.includes(resource.id) || this.selectedResources[index].resourceId === resource.id);
  }

  isFormValid(): boolean {
    const allTasksUsed = this.selectedResources.length === 0 || this.selectedResources.every(resource => resource.resourceId !== null && resource.quantity !== null && resource.quantity > 0 && resource.isValid);
    const hasSelectedFiles = Object.keys(this.tasks).some(key => this.tasks[key]); // Check if there is any file content in tasks
  
    // Check if description and budgetUsed are not empty
    const isDescriptionValid = this.description.trim() !== '';
    const isBudgetUsedValid = this.budget !== null && this.budget > 0;
  
    const isValid = (hasSelectedFiles || allTasksUsed) && isDescriptionValid && isBudgetUsedValid;
    return isValid;
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
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.error('No user data found in local storage');
        return;
      }
      this.user = JSON.parse(userData);
      console.log('User data:', this.user);
     this.getLoggedInUserNameAndId();
   
     this.staffId = this.user.profile_id;
     console.log('Staff ID:', this.staffId);
      if (!isNaN(taskIdNumber)) {
        this.selectedTaskId = taskIdNumber;
        this.fetchResource(taskIdNumber);
      }
    });
    this.apiUrl = this.updateTaskUrl + this.taskId;
    console.log('API URL:', this.apiUrl);
   
  }

 

  

  onFileChange(event: any, field: string, index: number): void {
    const file = event.target.files[0];
    if (file) {
      console.log(`File selected: ${file.name}, size: ${file.size}, type: ${file.type}`);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === FileReader.DONE) {
          const base64String = reader.result as string;
          if (base64String.startsWith('data:')) {
            const base64Content = base64String.split(',')[1];
  
            // Ensure tasks is an object with string keys and string values
              if (!this.tasks[field]) {
                this.tasks[field] = [];
            }
            this.tasks[field][index] = base64Content;
            console.log(`Base64 content for ${field} stored successfully.`);
          } else {
            console.error('The file content is not a valid base64 encoded string.');
          }
        }
      };
      reader.readAsDataURL(file);
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
  

  getLoggedInUserNameAndId(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(this.userUrl, { headers }).subscribe(
      (response: any) => {
        this.user = response;
        console.log('Logged in user:', this.user);

      },
      error => {
        console.error('Error fetching user details', error);
      }
    );
  }


    onSubmit(): void {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found in local storage');
        return;
      }

      if (!this.isFormValid()) {
        console.error('Form is not valid');
        return;
    }

    const validResources = this.selectedResources
    .filter(resource => resource.resourceId !== null && resource.quantity !== null && resource.quantity > 0)
    .map(resource => ({
        resource_id: resource.resourceId,
        used_qty: resource.quantity
    }));

      // Filter out invalid placeholder images
      const validPlaceholderImages = Object.values(this.tasks)
          .flat()
          .filter(image => image !== null && image !== '');

      const formData: any = {
          task_id: this.selectedTaskId,
          description: this.description,
          estimated_resource_value: this.budget
      };

      if (validResources.length > 0) {
          formData.resources = validResources;
      }

      if (validPlaceholderImages.length > 0) {
          formData.placeholder_images = validPlaceholderImages;
      }

      const payload = { ...formData, staff: this.staffId };
      console.log('Payload:', payload);

      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
   
      this.http.post(this.apiUrl, payload, { headers }).subscribe(response => { 
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Task updated successfully",
          showConfirmButton: true,
          timer: 2000
        }).then(() => {
          // window.location.reload();
          this.closeModal();
        });
          console.log('Task updated successfully', response);
          this.closeModal();
      },error => {
        console.error('Error updating task', error);
        this.closeModal();
      }
    );


  }




}
