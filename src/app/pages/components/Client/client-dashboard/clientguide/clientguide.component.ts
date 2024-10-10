import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientguide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientguide.component.html',
  styleUrl: './clientguide.component.css'
})
export class ClientguideComponent {
  imageUrl = 'assets/';
  images = ['project1.jpg', 'project3.jpg', 'project2.jpg']; // Array of image filenames
  
    @Input() isVisible: boolean = false;
    @Output() close = new EventEmitter<void>();
    currentIndex: number = 0;
    closeModal(): void {
      this.isVisible = false;
      this.close.emit();
    }
  
  
    nextImage(): void {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
  
    prevImage(): void {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
  }