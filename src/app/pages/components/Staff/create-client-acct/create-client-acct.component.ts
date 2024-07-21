import { Component, EventEmitter,Output} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-create-client-acct',
  standalone: true,
  imports: [FormsModule,HttpClientModule],
  templateUrl: './create-client-acct.component.html',
  styleUrl: './create-client-acct.component.css'
})
export class CreateClientAcctComponent {
    @Output() close = new EventEmitter<void>();

    client: ClientObj; 

    constructor(private http: HttpClient) {
      this.client = new ClientObj();
    }


    ngOnInit() {
      console.log('Component initialized');
    }
      closeModal() {
        this.close.emit();
      }

      onSubmit() {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No auth token found');
          return;
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.http.post('http://127.0.0.1:8000/api/registerC', this.client, { headers }).subscribe(
          response => {
            console.log('Clientcreated successfully', response);
            this.closeModal();
          },
          error => {
            console.error('Error creating client account', error);
          }
        );
      }

}


export class ClientObj {
  email: string;
  password: string;
  first_name: string;
  last_name: string; 
  name: string
  sex: string;
  address: string;
  city: string;
  country: string;
  zipcode: string;
  company_name: string;
  phone_number: string;
  
  constructor(){
    this.email = '';
    this.password = '';
    this.first_name = '';
    this.last_name = '';
    this.name = '';
    this.sex='';
    this.address='';
    this.city='';
    this.country='';
    this.zipcode='';
    this.company_name='';
    this.phone_number='';
  }
}