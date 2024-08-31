import { Component } from '@angular/core';


import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FormsModule } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CreateClientAcctComponent } from "../../../Staff/create-client-acct/create-client-acct.component";
import { CreateStaffAcctComponent } from "../../../Admin/create-staff-acct/create-staff-acct.component";
import { StaffsidenavComponent } from "../staffsidenav/staffsidenav.component";
import { StafftoolbarComponent } from "../stafftoolbar/stafftoolbar.component";
import { EditprofileComponent } from "../../editprofile/editprofile.component";
import { AdddetailsComponent } from "../../adddetails/adddetails.component";
import { AddtaskComponent } from "../../addtask/addtask.component";
import { GeneralComponent } from "../../general/general.component";
import { SiteComponent } from "../../site/site.component";
import { ArchiComponent } from "../../archi/archi.component";



@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [MatTableModule, MatListModule, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, RouterModule, RouterOutlet, CommonModule, HttpClientModule, FormsModule, FontAwesomeModule, CreateClientAcctComponent, CreateStaffAcctComponent, StaffsidenavComponent, StafftoolbarComponent, EditprofileComponent, AdddetailsComponent, AddtaskComponent, GeneralComponent, SiteComponent, ArchiComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent {
  constructor(private router: Router, private http: HttpClient) { }
  
  isCreateClientModalOpen = false;
  
  isTaskOpen = false;
  isGeneralOpen = false;
  isSiteOpen = false;
  isArchiOpen = false;
  

  sideBarOpen=true;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }

  
  openCreateClientModal() {
    this.isCreateClientModalOpen = true;
    console.log('Opening details Modal');
    console.log(this.isCreateClientModalOpen);
  }

  closeCreateClientModal() {
    this.isCreateClientModalOpen = false;
    console.log('xd');
  }

  openTaskModal() {
    this.isTaskOpen = true;
    console.log('Opening Task Modal');
    console.log(this.isTaskOpen);
  }

  closeTaskModal() {
    this.isTaskOpen = false;
    console.log('xd');
  }
  openGeneralModal() {
    this.isGeneralOpen = true;
    console.log('Opening Task Modal');
    console.log(this.isGeneralOpen);
  }

  closeGeneralModal() {
    this.isGeneralOpen = false;
    console.log('xd');
  }
  openSiteModal() {
    this.isSiteOpen = true;
    console.log('Opening Task Modal');
    console.log(this.isSiteOpen);
  }

  closeSiteModal() {
    this.isSiteOpen = false;
    console.log('xd');
  }
  openArchiModal() {
    this.isArchiOpen = true;
    console.log('Opening Task Modal');
    console.log(this.isArchiOpen);
  }

  closeArchiModal() {
    this.isArchiOpen = false;
    console.log('xd');
  }
  
  
  project: any = {
    site_location: '',
    client_id: '',
    completion_date: '',
    starting_date: '',
    totalBudget: 0,
    pj_image: null,
    pj_pdf: null
  };

  selectProject(project: any) {
    this.router.navigate(['/timeline', project.id]);
  }


}
