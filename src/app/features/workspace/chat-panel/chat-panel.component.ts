import {
  Component,
  Input,
  ChangeDetectorRef,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageSummary } from '../../../core/models/image.model';
import { ChatMessage } from '../../../core/models/chat-message.model';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './chat-panel.component.html'
})
export class ChatPanelComponent {
  private _image: ImageSummary | null = null;
  private currentImageId: string | null = null;

  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;

  messages: ChatMessage[] = [];
  draftMessage = '';
  isLoadingHistory = false;
  isSending = false;
  errorMessage = '';

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {}

  @Input()
  set image(value: ImageSummary | null) {
    const nextId = value?.id ?? null;

    this._image = value;

    if (this.currentImageId === nextId) {
      return;
    }

    this.currentImageId = nextId;
    this.messages = [];
    this.draftMessage = '';
    this.errorMessage = '';
    this.isSending = false;

    if (!nextId) {
      this.isLoadingHistory = false;
      this.cdr.detectChanges();
      return;
    }

    this.loadHistory(nextId);
  }

  get image(): ImageSummary | null {
    return this._image;
  }

  private loadHistory(imageId: string): void {
    this.isLoadingHistory = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.chatService.getHistory(imageId).subscribe({
      next: (history) => {
        if (this.currentImageId === imageId) {
          this.messages = [...history];
          this.isLoadingHistory = false;
          this.cdr.detectChanges();
          this.scrollToBottom();
        }
      },
      error: (err) => {
        if (this.currentImageId === imageId) {
          this.errorMessage = 'Failed to load chat history.';
          this.isLoadingHistory = false;
          this.cdr.detectChanges();
        }
      }
    });
  }

  sendMessage(): void {
  if (!this.image) {
    return;
  }

  if (this.image.status !== 'COMPLETED') {
    this.errorMessage = 'Please wait until image processing is complete.';
    this.cdr.detectChanges();
    return;
  }

  if (!this.draftMessage.trim() || this.isSending || this.isLoadingHistory) {
    return;
  }

  const imageId = this.image.id;
  const text = this.draftMessage.trim();

  const tempUserMessage: ChatMessage = {
    id: 'temp-user-' + Date.now(),
    role: 'user',
    content: text,
    createdAt: new Date().toISOString()
  };

  const tempAssistantMessage: ChatMessage = {
    id: 'temp-assistant-' + Date.now(),
    role: 'assistant',
    content: 'Thinking...',
    createdAt: new Date().toISOString()
  };

  this.messages = [...this.messages, tempUserMessage, tempAssistantMessage];
  this.draftMessage = '';
  this.errorMessage = '';
  this.isSending = true;
  this.cdr.detectChanges();
  this.scrollToBottom();

  this.chatService.sendMessage(imageId, text).subscribe({
    next: (assistantReply) => {
      if (this.currentImageId !== imageId) {
        return;
      }

      this.messages = this.messages.map(msg =>
        msg.id === tempAssistantMessage.id ? assistantReply : msg
      );

      this.isSending = false;
      this.cdr.detectChanges();
      this.scrollToBottom();
    },
    error: (err) => {

      if (this.currentImageId !== imageId) {
        return;
      }

      this.messages = this.messages.filter(
        msg => msg.id !== tempUserMessage.id && msg.id !== tempAssistantMessage.id
      );

      this.errorMessage = 'First request failed. Please try again in a moment.';
      this.isSending = false;
      this.cdr.detectChanges();
    }
  });
}

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.messagesContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 0);
  }

  trackByMessageId(index: number, msg: ChatMessage): string {
    return msg.id;
  }
}