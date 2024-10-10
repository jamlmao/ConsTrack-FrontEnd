import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guidemodal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guidemodal.component.html',
  styleUrl: './guidemodal.component.css'
})
export class GuidemodalComponent {
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
