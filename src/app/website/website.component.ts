import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-website',
  standalone: true,
  imports: [RouterOutlet, RouterModule ],
  templateUrl: './website.component.html',
  styleUrl: './website.component.css'
})
export class WebsiteComponent {

}
