import { Component, EventEmitter,OnInit,Output} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, RequiredValidator,ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterOutlet, Router, RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import intlTelInput from 'intl-tel-input';
import { Observable, tap } from 'rxjs';


@Component({
  selector: 'app-site',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './site.component.html',
  styleUrl: './site.component.css'
})
export class SiteComponent {
  @Output() close = new EventEmitter<void>();
  
  closeModal() {
    this.close.emit();
  }
  onSubmit(): void {
    
  }
}
