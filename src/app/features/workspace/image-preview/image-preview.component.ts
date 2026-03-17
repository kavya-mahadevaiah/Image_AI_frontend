import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ImageSummary } from '../../../core/models/image.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-image-preview',
  standalone: true,
  imports: [CommonModule, DatePipe, StatusBadgeComponent],
  templateUrl: './image-preview.component.html'
})
export class ImagePreviewComponent {
  @Input() image: ImageSummary | null = null;
}