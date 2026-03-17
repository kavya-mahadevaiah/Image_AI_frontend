import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { ChatPanelComponent } from './chat-panel/chat-panel.component';
import { ImageSummary } from '../../core/models/image.model';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ImagePreviewComponent, ChatPanelComponent],
  templateUrl: './workspace.component.html'
})
export class WorkspaceComponent {
  selectedImage: ImageSummary | null = null;
  sidebarOpen = true;

  constructor(private authService: AuthService) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onImageSelected(image: ImageSummary): void {
    this.selectedImage = image;
  }

  onImageUploaded(image: ImageSummary): void {
    this.selectedImage = image;
  }

  logout(): void {
    this.authService.logout();
  }
}