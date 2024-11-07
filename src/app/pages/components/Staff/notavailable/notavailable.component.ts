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
import { AppConfig } from '../../../../app.config';
@Component({
  selector: 'app-notavailable',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule,DatePipe],
  templateUrl: './notavailable.component.html',
  styleUrl: './notavailable.component.css',
  providers: [DatePipe]
})
export class NotavailableComponent {

  
  isLoading = false; 
  @Output() close = new EventEmitter<void>();
   private baseUrl : string;



  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute,private router: Router, private datePipe: DatePipe) {
    this.baseUrl =`${AppConfig.baseUrl}`;
  }

  minDate: string= '';
  

  selectedDate: string = '';
  selectedDates: string[] = [];
  appointment_datetime: string ="";

  isCreateStaffModalOpen = false;
  isCreateClientModalOpen = false;


  ngOnInit(): void {
    
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

   

  }


  addDate() {
    if (this.selectedDate && !this.selectedDates.includes(this.selectedDate)) {
      const formattedDate = this.datePipe.transform(this.selectedDate, 'MM-dd-yyyy'); // Format the date
      if (formattedDate) {
        this.selectedDates.push(formattedDate);
      }
      this.selectedDate = ''; // Clear the input field
    }
  }


  closeModal() {
    this.close.emit();
  }



  


  onSubmit() {  
    const token = localStorage.getItem('token');

    if(!token) {
      this.router.navigate(['/']);
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    if (!this.selectedDates || !Array.isArray(this.selectedDates)) {
      console.error('selectedDates is not an array or is undefined');
      return;
    }

  

    const days = this.selectedDates.map(date => new Date(date).getDate());
   // console.log('Days:', days);
//
    const payload = { dates: days };
  //  console.log('Payload:', payload);

    this.http.post(`${this.baseUrl}/api/insert-available-dates`,payload, { headers }).subscribe((response:any) => {
     // console.log(response);
      Swal.fire({
        title: 'Success',
        text: 'Added successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        this.closeModal();
        window.location.reload();
        this.router.navigate(['staff/appointment']);
      });

    }, (error) => {
      console.error(error);
    }
  ); 

  

  
  }
}
