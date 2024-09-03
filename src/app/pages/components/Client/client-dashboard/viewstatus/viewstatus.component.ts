import { Component } from '@angular/core';


import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";
import { CreateStaffAcctComponent } from "../../../Admin/create-staff-acct/create-staff-acct.component";
import { ClientsidenavComponent } from "../clientsidenav/clientsidenav.component";
import { ClienttoolbarComponent } from "../clienttoolbar/clienttoolbar.component";

@Component({
  selector: 'app-viewstatus',
  standalone: true,
  imports: [MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, CreateStaffAcctComponent, ClientsidenavComponent, ClienttoolbarComponent],
  templateUrl: './viewstatus.component.html',
  styleUrl: './viewstatus.component.css'
})
export class ViewstatusComponent {

  constructor(private router: Router) { }

  events: any[] = [];
  ngOnInit(){
    this.events=[
      {content: '1ST ', date: '05/12/1212',details: 'lot is prepared in the construction site', status: 'R'},//details = task name , status = status of the task 
      {content: '2ND ', date: '05/12/1212',details: 'lot is prepared in the construction site', status: 'R'},
      {content: '3RD ', date: '05/12/1212',details: 'lot is prepared in the construction site', status: 'N'},
      {content: '4TH ', date: '05/12/1212',details: 'lot is prepared in the construction site', status: 'N'},
      {content: '5TH ', date: '05/12/1212',details: 'lot is prepared in the construction site', status: ''},

    ]
  
  }

  sideBarOpen=false;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }
}
