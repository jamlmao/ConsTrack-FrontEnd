import { Component, EventEmitter,OnInit,Output,Input} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, RequiredValidator,ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet, Router, RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import intlTelInput from 'intl-tel-input';
import Swal from 'sweetalert2';
import { AppConfig } from '../../../../app.config';
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



  private editUrl:string;

  constructor(private http: HttpClient) {
    this.editUrl= `${AppConfig.baseUrl}/api/Etasks/`;
  }
  ngOnInit(): void {
   // console.log('Fetched taskId:', this.taskId);
  //  console.log(this.editUrl)
  }




  task: any = {
    pt_task_name: '',
    pt_completion_date: '',
    pt_starting_date: '',
    pt_allocated_budget: '',
  };


  closeModal() {
    
    this.close.emit();
  }

  



  onSubmit() {
    if (!this.task.pt_task_name && !this.task.pt_starting_date && !this.task.pt_completion_date && !this.task.pt_allocated_budget) {
      console.error('Form is invalid');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

  

    Swal.fire({
      title: 'Loading...',
      text: 'Submitting...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

   // console.log('Form data:', this.task);
    this.http.put(`${this.editUrl}${this.taskId}`, this.task, { headers }).subscribe(response => {
      Swal.close();
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
      console.clear();
      // console.error('Error:', error);
    });
  }
}
