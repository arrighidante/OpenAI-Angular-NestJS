import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [MarkdownModule],
  templateUrl: './chatMessage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessageComponent implements OnInit {
  @Input({ required: true }) text!: string;
  @Input() audioUrl?: string;

  ngOnInit(): void {
    if (this.audioUrl) {
      console.log(this.audioUrl);
    }
  }
}
