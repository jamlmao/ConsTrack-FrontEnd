import { Component, EventEmitter,Input,OnInit,Output} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, RequiredValidator,ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet, Router, RouterModule, ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import intlTelInput from 'intl-tel-input';
import Swal from 'sweetalert2';
import { AppConfig } from '../../../../app.config';


@Component({
  selector: 'app-editresource',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './editresource.component.html',
  styleUrl: './editresource.component.css'
})
export class EditresourceComponent {
  @Input() resourceId!: number;
  @Output() close = new EventEmitter<void>();
  closeModal() {
    
    this.close.emit();
  }
 
  private editUrl:string;

  taskId :string = '';

  resources: any = {
    resource_name:'',
    qty:'',
    unit_cost:'',
  }

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.editUrl = `${AppConfig.baseUrl}/api/tasks/`;
  }
  
  ngOnInit(): void {
  //  console.log('Fetched resourceId:', this.resourceId);
   this.route.paramMap.subscribe(params => {
      this.taskId = params.get('taskId')|| '';
      const taskIdNumber = Number(this.taskId);
    //  console.log('Task ID:', this.taskId);

    });

   
  }


  onSubmit() {
 

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    }); 

    
    this.http.put(`${this.editUrl}${this.taskId}/resources/${this.resourceId}`, this.resources, { headers }).subscribe((response)=>{
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
    },
    (error) => {
      console.error('Error:', error);
      
    });

  }
}
