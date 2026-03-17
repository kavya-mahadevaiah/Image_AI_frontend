import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageStatus } from '../../../core/models/image.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="badgeClass" class="text-xs font-semibold px-2 py-1 rounded-full">
      {{ label }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status: ImageStatus = 'UPLOADED';

  get label(): string {
    const labels: Record<ImageStatus, string> = {
        UPLOADED: 'Uploaded',
        PROCESSING: 'Processing',
        COMPLETED: 'Completed',
        FAILED: 'Failed'
    };
    return labels[this.status];
  }

  get badgeClass(): string {
    const classes: Record<ImageStatus, string> = {
        UPLOADED: 'bg-blue-500 text-white',
        PROCESSING: 'bg-yellow-500 text-white',
        COMPLETED: 'bg-green-500 text-white',
        FAILED: 'bg-red-500 text-white'
    };
    return classes[this.status];
  }
}