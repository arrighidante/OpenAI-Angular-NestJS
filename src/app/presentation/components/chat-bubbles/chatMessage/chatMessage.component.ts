import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './chatMessage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessageComponent {
  @Input({ required: true }) text!: string;
  @Input() audioUrl?: string;
}
