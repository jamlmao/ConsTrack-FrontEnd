import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.css'
})
export class ImageModalComponent {
  @Input() images: string[] = [];
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  currentIndex: number = 0;
  imageUrl: string= 'http://localhost:8000';
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
