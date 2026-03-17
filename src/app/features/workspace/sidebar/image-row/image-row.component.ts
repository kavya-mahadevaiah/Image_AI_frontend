import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSummary } from '../../../../core/models/image.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-image-row',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  templateUrl: './image-row.component.html'
})
export class ImageRowComponent {
  @Input() image!: ImageSummary;
  @Input() isSelected: boolean = false;
  @Output() imageSelected = new EventEmitter<ImageSummary>();

  onClick(): void {
    this.imageSelected.emit(this.image);
  }
}