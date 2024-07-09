import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterOutlet, RouterModule, FontAwesomeModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  faUserTie = faUserTie; // icon 
}
