import { Component } from '@angular/core';
import { AccountComponent } from "../account/account.component";

import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatListModule, MatSidenavModule, MatIconModule, MatButtonModule, RouterLink, RouterLinkActive, MatToolbarModule, AccountComponent, RouterModule, RouterOutlet, HeaderComponent, SidenavComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {

}
