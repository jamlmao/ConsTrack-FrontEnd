import { Component, EventEmitter,Input,OnInit,Output} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, RequiredValidator,ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet, Router, RouterModule, ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import intlTelInput from 'intl-tel-input';
import Swal from 'sweetalert2';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { AppConfig } from '../../../../app.config'; 

@Component({
  selector: 'app-editcategory',
  standalone: true,
  imports: [MatInputModule,MatIconModule,MatFormFieldModule,FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './editcategory.component.html',
  styleUrl: './editcategory.component.css'
})
export class EditcategoryComponent {
  @Input() categoryId!: number;
  @Output() close = new EventEmitter<void>();
  closeModal() {
    
    this.close.emit();
  }

  

  private editUrl :string;


  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.editUrl = `${AppConfig.baseUrl}/api/editCategory/`;
  }

  category: any = {
    category_name: '',
    c_allocated_budget: ''
  };

  ngOnInit(): void {
   // console.log('Fetched categoryId:', this.categoryId);
  //  console.log(this.editUrl)
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
    Swal.fire({
      title: 'Loading...',
      text: 'Submitting...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });


    this.http.put(`${this.editUrl}${this.categoryId}`, this.category, { headers })
      .subscribe(
        (response) => {
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
        },
        (error) => {
          console.error('Error:', error);
        }
      );

  }
}
