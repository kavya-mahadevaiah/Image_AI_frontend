import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSummary } from '../../../core/models/image.model';
import { ImageService } from '../../../core/services/image.service';
import { ImageRowComponent } from './image-row/image-row.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, ImageRowComponent],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  @Output() imageSelected = new EventEmitter<ImageSummary>();
  @Output() closeSidebar = new EventEmitter<void>();

  images: ImageSummary[] = [];
  selectedImageId: string | null = null;
  isLoading = false;
  isUploading = false;
  hasMore = false;
  offset = 0;
  limit = 10;

  constructor(
    private imageService: ImageService,
    private cdr: ChangeDetectorRef,

  ) {}

private pollingInterval: any;

ngOnInit(): void {
  this.loadImages();
  this.pollingInterval = setInterval(() => {
    const hasProcessing = this.images.some(img => img.status === 'PROCESSING');
    if (!hasProcessing) return;  // ← skip if nothing processing
    this.pollProcessingImages();
  }, 5000);
}
pollProcessingImages(): void {
  const processingImages = this.images.filter(
    img => img.status === 'PROCESSING'
  );

  if (processingImages.length === 0) return;

  processingImages.forEach(img => {
    this.imageService.getImageById(img.id).subscribe({
      next: (updated) => {
        const index = this.images.findIndex(i => i.id === updated.id);

        if (index !== -1) {
          const oldStatus = this.images[index].status;
          this.images[index] = updated;

          // If the currently selected image got updated, notify workspace
          if (this.selectedImageId === updated.id) {
            this.imageSelected.emit(updated);
          }

          // Optional: only trigger detectChanges when something actually changed
          if (oldStatus !== updated.status) {
            this.cdr.detectChanges();
          }
        }
      },
      error: () => {}
    });
  });
}
  loadImages(): void {
    this.isLoading = true;
    this.imageService.getImages(this.limit, this.offset).subscribe({
      next: (res) => {
        this.images = [...this.images, ...res.images];
        this.hasMore = this.images.length < res.total;
        this.offset += res.images.length;
        this.isLoading = false;
        this.cdr.detectChanges();  // ← force view update
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadMore(): void {
    this.loadImages();
  }

  onImageSelected(image: ImageSummary): void {
    this.selectedImageId = image.id;
    this.imageSelected.emit(image);
  }

  onUploadClick(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) this.uploadFile(file);
    };
    input.click();
  }

  uploadFile(file: File): void {
  this.isUploading = true;
  this.imageService.uploadImage(file).subscribe({
    next: (image) => {
      this.images.unshift(image);
      this.selectedImageId = image.id;        // ← mark as selected
      this.imageSelected.emit(image);          // ← notify workspace
      this.isUploading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.isUploading = false;
      this.cdr.detectChanges();
    }
  });
}
}