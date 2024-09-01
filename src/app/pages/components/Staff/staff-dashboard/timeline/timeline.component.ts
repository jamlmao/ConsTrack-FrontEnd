import { Component } from '@angular/core';


import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { faImages, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";
import { ProjectComponent } from '../../../Admin/project/project.component';
import { StaffsidenavComponent } from "../staffsidenav/staffsidenav.component";
import { StafftoolbarComponent } from "../stafftoolbar/stafftoolbar.component";
import { CreateProjectComponent } from "../../../Admin/create-project/create-project.component";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Pipe, PipeTransform } from '@angular/core';
import { FilterPipe } from '../../../../../filter.pipe';
import { TimelineModule } from "primeng/timeline";

import { CardModule } from "primeng/card";

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CardModule,TimelineModule,FilterPipe,MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, StaffsidenavComponent, StafftoolbarComponent, CreateProjectComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent {
  events: any[] = [];
  ngOnInit(){
    this.events=[
      {content: '1ST WEEK', date: '05/12/1212',details: 'lot is prepared in the construction site', status: 'R'},//details = task name , status = status of the task 
      {content: '2ND WEEK', date: '05/12/1212',details: 'lot is prepared in the construction site', status: 'R'},
      {content: '3RD WEEK', date: '05/12/1212',details: 'lot is prepared in the construction site', status: 'N'},
      {content: '4TH WEEK', date: '05/12/1212',details: 'lot is prepared in the construction site', status: 'N'},
      {content: '5TH WEEK', date: '05/12/1212',details: 'lot is prepared in the construction site', status: ''},

    ]
  
  }

  sideBarOpen=true;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }

}
