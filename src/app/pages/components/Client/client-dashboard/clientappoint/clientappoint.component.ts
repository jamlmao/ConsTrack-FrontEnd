import { Component, EventEmitter,Input,OnInit,Output} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, RequiredValidator,ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RouterOutlet, Router, RouterModule, ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { CommonModule, DatePipe } from '@angular/common';
import intlTelInput from 'intl-tel-input';
import { Observable, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { AppConfig } from '../../../../../app.config'; 
@Component({
  selector: 'app-clientappoint',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule,DatePipe,MatDatepickerModule,MatInputModule,MatNativeDateModule ],
  templateUrl: './clientappoint.component.html',
  styleUrl: './clientappoint.component.css'
})
export class ClientappointComponent {
  @Output() close = new EventEmitter<void>();


  private baseUrl = AppConfig.baseUrl;

  private appointmentUrl = this.baseUrl + "/api/appointments";
  user: any;
  staffList: any[] = [];
  staff_id: number = 0;
  description: string ="";
  appointment_datetime: string ="";
  minDateTime: string = ''; 
  isCreateStaffModalOpen = false;
  isCreateClientModalOpen = false;
  isLoading = false; 
  ngIfWeeklySchedule: any; 

  appointments: any[] = [];
  uniqueClients: string[] = []; 
  weeklySchedule: any = {}; // Your schedule data
  calendarDaysInMonth: { date: Date | null, isAvailable: boolean, appointments: any[] }[][] = [];
  currentDate: Date = new Date();
  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  available_dates: string[]= [];
  appointments2: any[] =[];

  constructor(private router: Router,private http: HttpClient) { }



  ngOnInit(): void {
    
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      // console.log(this.user);
    } else {
      // If no user data is found, redirect to login
      this.router.navigateByUrl('/');
    }
    this.fetchStaff();
    Swal.fire({
      title: 'Submitting...',
      text: 'Please wait getting the available dates...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const now = new Date();
    now.setDate(now.getDate() - 1); 
    this.minDateTime = now.toISOString().slice(0, 16); 
    this.fetchAvailableDates();
  }

  invalidTimeSelected: boolean = false;

  onSubmit() {
    if (this.isValidAppointment(this.appointment_datetime)) {
      // Proceed with your submission logic
      // console.log('Appointment valid:', this.appointment_datetime);
      this.invalidTimeSelected = false; // Reset the invalid time flag
      // Add your appointment submission logic here
    } else {
      this.invalidTimeSelected = true; // Set the invalid time flag
    }
    this.isLoading = true;
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      this.isLoading = false;
      return;
    }
  
    // Validate form fields
    if (!this.staff_id || !this.description || !this.appointment_datetime) {
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
      staff_id: this.staff_id,
      description: this.description,
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
          // console.log('Appointment request sent successfully', response);
          this.isLoading = false;
          this.router.navigateByUrl('/client/chome').then(() => {
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


  fetchAvailableDates() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});

    this.http.get(`${this.baseUrl}/api/client/available-dates`, { headers }).subscribe(
      (response: any) => {
        Swal.close();
        //  console.log(response);
          const availableDates = response.available_dates
              .filter((dateObj: any) => dateObj.status === 'Available')
              .map((dateObj: any) => dateObj.available_date);

          this.available_dates = availableDates;
        //  console.log('Available Dates:', this.available_dates);

          if (response.available_dates && response.available_dates.length > 0) {
              this.appointments2 = response.available_dates.flatMap((dateObj: any) => dateObj.appointments || []);
             // console.log('Appointments:', this.appointments2);
          } else {
              console.error('No appointments found in response');
          }
      },
      (error: any) => {
          console.error('Error fetching available dates:', error);
      }
  );

  }


  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const formattedDate = this.formatDateToDatetimeLocal(date).split('T')[0];
    return this.available_dates.includes(formattedDate);
  };
  
  dateClass = (date: Date): string => {
    const formattedDate = this.formatDateToDatetimeLocal(date).split('T')[0];
    return this.available_dates.includes(formattedDate) ? 'available-date' : '';
  };

  formatted_appointment_datetime: string | null = null;
  onDateChange(event: any): void {
    const date = event.value;
    if (date) {
        // Convert the date to Manila timezone
        const manilaDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
        // Subtract one day
        manilaDate.setDate(manilaDate.getDate() - 1);
        // Format the adjusted date
        this.formatted_appointment_datetime = this.formatDateToDatetimeLocal(manilaDate);
    }
}

formatDateToDatetimeLocal(date: Date): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return date.getFullYear() + '-' +
           pad(date.getMonth() + 1) + '-' +
           pad(date.getDate()) + 'T' +
           pad(date.getHours()) + ':' +
           pad(date.getMinutes());
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


  fetchStaff() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});

    this.http.get<any>(this.baseUrl+"/api/fetchstaff", { headers })
      .subscribe((response: any) => {
     //   console.log('Staff fetched successfully', response);
        if (response && Array.isArray(response.staff)) {
          this.staffList = response.staff; // Assuming the array is in response.data
        } else {
          console.error('No staff found or response format is incorrect');
        }
      }, error => {
        console.error('Error fetching staff', error);
      });
  }

  closeModal() {
    this.close.emit();
  }

  

}
