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

  
  

  

  @Input() taskId: number | null = null;
  @Output() close = new EventEmitter<void>();
  
  closeModal() {
    this.close.emit();
  }

  constructor(private route: ActivatedRoute, private router: Router , private http: HttpClient) { }





  tasks: { [key: string]: string } = {};
  selectedTaskId: number | null = null;

  private updateTaskUrl = 'http://127.0.0.1:8000/api/updatetask/';
  apiUrl: string ='';


  
  toggleChecklist(event: Event): void {
    this.isChecklistChecked = (event.target as HTMLInputElement).checked;
  }



  ngOnInit(): void {

   
    // Extract projectId from the current URL
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




  onSubmit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const payload = this.tasks;
    console.log('Task payload:', payload);

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
