import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import {  MatSidenavModule } from '@angular/material/sidenav';
import { ImageModalComponent } from "../../Staff/image-modal/image-modal.component";
@Component({
  selector: 'app-clientupdates',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, RouterModule, ImageModalComponent],
  templateUrl: './clientupdates.component.html',
  styleUrl: './clientupdates.component.css'
})
export class ClientupdatesComponent {
  
constructor( private http: HttpClient, private router: Router, 
  private route: ActivatedRoute,) { }
projectIdNumber2: number = 0;
projectId: string ="";
history: any[] = [];
task_image: any[] = [];
selectedImages: string[] = [];
isModalVisible: boolean = false;



imageUrl: string= 'http://localhost:8000';
private url ="http://127.0.0.1:8000";






ngOnInit(){
  this.route.paramMap.subscribe(params => {
    this.projectId = params.get('projectId') || ''; 
    const projectIdNumber = Number(this.projectId);
    this.projectIdNumber2 = Number(this.projectId);
    console.log('Project ID:', this.projectIdNumber2);
    
    if (!isNaN(projectIdNumber)) {
      this.fetchHistory(projectIdNumber);
   
    } else {
      console.error('Project ID is not set or is not a number');
    }
  });
   

}


@Output() openModal: EventEmitter<void> = new EventEmitter();

@Output() closeModal: EventEmitter<void> = new EventEmitter();

showLoading(){
  Swal.fire({
    title: 'Loading',
    html: 'Please wait...',
    didOpen: () => {
      Swal.showLoading()
    }
  });
}


hideLoading(){
  Swal.close();
}

sideBarOpen=true;

sideBarToggler(){
  this.sideBarOpen = !this.sideBarOpen;
}

getStatusText(status: string): string {
  switch (status) {
    case 'C':
      return 'Complete';
    case 'OG':
      return 'Ongoing';
    case 'D':
      return 'Due';
    default:
      return status;
  }
}


openModalI2(images: string[]): void {
  this.selectedImages = images;
  this.isModalVisible = true;
  console.log(this.sideBarOpen)
  this.sideBarOpen = false;
  this.openModal.emit();
}

closeModalI2(): void {
  this.isModalVisible = false;
  this.sideBarOpen = true; 
  console.log(this.sideBarOpen)
  this.closeModal.emit();
  
}


toggleImages(task: any) {
  task.showImages = !task.showImages;
}



fetchHistory(projectId: number){
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token not found');
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`
  };


  this.http.get(`${this.url}/api/history/${projectId}`, { headers })
  .subscribe((response: any) => {
    console.log('History:', response);
    if (response.data && response.data.history && response.data.history.length > 0) {
      this.task_image = response.data.history.map((task: any) => {
        const mainImage = task.images[0]; 
        console.log('Main Image:', mainImage);
        return {
          ...task,
          showImages: false,
          mainImage: mainImage
        };
      });
      console.log('Task Image:', this.task_image);
    }
  },(error: any) => {
    console.error('Error fetching task images:', error);
  }
);
}










}
