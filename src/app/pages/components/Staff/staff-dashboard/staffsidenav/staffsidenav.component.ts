import { Component } from '@angular/core';

import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";
import { CreateStaffAcctComponent } from "../../../Admin/create-staff-acct/create-staff-acct.component";

@Component({
  selector: 'app-staffsidenav',
  standalone: true,
  imports: [MatListModule, MatSidenavModule, MatIconModule, MatButtonModule, RouterLink, RouterLinkActive, MatToolbarModule, RouterModule, RouterOutlet, CreateClientAcctComponent, CreateStaffAcctComponent],
  templateUrl: './staffsidenav.component.html',
  styleUrl: './staffsidenav.component.css'
})
export class StaffsidenavComponent {
 
}
