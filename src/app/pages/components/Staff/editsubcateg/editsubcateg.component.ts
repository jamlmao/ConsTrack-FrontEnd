import { Component, EventEmitter,OnInit,Output,Input} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, RequiredValidator,ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet, Router, RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import intlTelInput from 'intl-tel-input';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editsubcateg',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './editsubcateg.component.html',
  styleUrl: './editsubcateg.component.css'
})
export class EditsubcategComponent {
  @Input() taskId!: number;
  @Output() close = new EventEmitter<void>();


  private baseUrl = 'http://127.0.0.1:8000/';
  private editUrl = this.baseUrl+'api/Etasks/';

  ngOnInit(): void {
    console.log('Fetched taskId:', this.taskId);
    console.log(this.editUrl)
  }




  task: any = {
    pt_task_name: '',
    pt_completion_date: '',
    pt_starting_date: '',
    pt_photo_task: '',
  };


  constructor(private http: HttpClient) {
    
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




  onSubmit() {
    if (!this.task.pt_task_name && !this.task.pt_starting_date && !this.task.pt_completion_date && !this.task.pt_photo_task) {
      console.error('Form is invalid');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    const formData = new FormData();
    formData.append('pt_task_name', this.task.pt_task_name);
    formData.append('pt_starting_date', this.task.pt_starting_date);
    formData.append('pt_completion_date', this.task.pt_completion_date);
    if (this.task.pt_photo_task) {
      formData.append('pt_photo_task', this.task.pt_photo_task);
    }



    this.http.put(`${this.editUrl}${this.taskId}`, formData, { headers }).subscribe(response => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Successfully Edited.",
        showConfirmButton: true,
        timer: 1000
      }).then(() => {
        window.location.reload();
      });
      this.closeModal();
    }, (error) => {
      console.error('Error:', error);
    });
  }
}
