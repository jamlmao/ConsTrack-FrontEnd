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

@Component({
  selector: 'app-notavailable',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './notavailable.component.html',
  styleUrl: './notavailable.component.css'
})
export class NotavailableComponent {

  
  isLoading = false; 
  @Output() close = new EventEmitter<void>();
   private baseUrl = 'http://127.0.0.1:8000';
   category: any = {
      category_name: '',
      category_allocated_budget: '',
 
   }

   projectId: string | null = null;


  isCheckAll: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute,private router: Router) {}
 
  
  private appointmentUrl = this.baseUrl + "api/staffappointments";
  user: any;
  staffList: any[] = [];
  staff_id: number = 0;
  description: string ="";
  appointment_datetime: string ="";
  minDateTime: string = ''; 
  isCreateStaffModalOpen = false;
  isCreateClientModalOpen = false;


  ngOnInit(): void {
    
    

    const now = new Date();
    now.setDate(now.getDate() + 1); 
    this.minDateTime = now.toISOString().slice(0, 16); 

  }




  closeModal() {
    this.close.emit();
  }



  isValidAppointment(dateTime: string): boolean {
    const date = new Date(dateTime);
    const hour = date.getHours();
    const minutes = date.getMinutes();

    // Check if the selected time falls within the allowed ranges
    const isMorningTime = hour >= 7 && hour < 11; // 7 AM to 11 AM
    const isAfternoonTime = hour >= 13 && hour < 17; // 1 PM to 5 PM

    return isMorningTime || isAfternoonTime;
  }


  onSubmit() {
    if (this.isValidAppointment(this.appointment_datetime)) {
      // Proceed with your submission logic
      console.log('Appointment valid:', this.appointment_datetime);
      // Add your appointment submission logic here
    } else 
    this.isLoading = true;
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      this.isLoading = false;
      return;
    }
  
    // Validate form fields
    if (!this.appointment_datetime) {
      this.isLoading = false;
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please complete all fields before submitting.',
        showConfirmButton: true
      });
      return;
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    const appointmentDate = new Date(this.appointment_datetime);
    const formattedDate = `${appointmentDate.getFullYear()}-${String(appointmentDate.getMonth() + 1).padStart(2, '0')}-${String(appointmentDate.getDate()).padStart(2, '0')} ${String(appointmentDate.getHours()).padStart(2, '0')}:${String(appointmentDate.getMinutes()).padStart(2, '0')}:${String(appointmentDate.getSeconds()).padStart(2, '0')}`;
  
    const appointmentData = {
      appointment_datetime: formattedDate,
    };
  
    // Show loading Swal immediately
    Swal.fire({
      title: 'Submitting...',
      text: 'Please wait while we process your request.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.http.post(this.appointmentUrl, appointmentData, { headers })
      .subscribe(
        response => {
          console.log('Appointment request sent successfully', response);
          this.isLoading = false;
          this.router.navigateByUrl('/staff/shome').then(() => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Appointment request sent successfully.',
              showConfirmButton: false,
              timer: 2000
            });
          });
          },
          error => {
            console.error('Error creating appointment', error);
            this.isLoading = false;
          
            // Handle specific error messages
            if (error.status === 400 && error.error.message.includes('The appointment date conflicts with another appointment in the same company')) {
              Swal.fire({
                icon: 'error',
                title: 'Duplicate Date',
                text: 'Please pick another date for the appointment.',
                showConfirmButton: true
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to create appointment. Please try again.',
                showConfirmButton: true
              });
            }
          }
      );
  }
}
