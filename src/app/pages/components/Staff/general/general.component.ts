import { Component, EventEmitter,Input,OnInit,Output} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, RequiredValidator,ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RouterOutlet, Router, RouterModule, ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import intlTelInput from 'intl-tel-input';
import { Observable, tap } from 'rxjs';
import Swal from 'sweetalert2';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule,FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.css'
})
export class GeneralComponent {

  @Output() close = new EventEmitter<void>();
   private baseUrl = 'http://127.0.0.1:8000';
   category: any = {
      category_name: '',
      category_allocated_budget: '',
 
   }

   projectId: string | null = null;


  isCheckAll: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute) {}
   
  ngOnInit():void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
      console.log ('Project ID:', this.projectId);
    } );
  }
  







  closeModal() {
    this.close.emit();
  }

  onSubmit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    this.category.project_id = this.projectId;
    
    const payload = this.category;
  
    console.log
    
    this.http.post(`${this.baseUrl}/api/addCategory/${this.projectId}`, payload, { headers })
      .subscribe(
        response => {
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
        },
        error => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error adding Category. over the budget",
          });
        }
      );
   



    
  }
}
