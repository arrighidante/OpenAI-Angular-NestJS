import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent } from '@components/chat-bubbles/chatMessage/chatMessage.component';
import { MyMessageComponent } from '@components/chat-bubbles/myMessage/myMessage.component';
import {
  TextMessageBoxFileComponent,
  TextMessageEvent,
} from '@components/text-boxes/textMessageBoxFile/textMessageBoxFile.component';
import { TypingLoaderComponent } from '@components/typingLoader/typingLoader.component';
import { AudioToTextResponse, Message } from '@interfaces/index';
import { OpenAiServiceService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-audio-to-text-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxFileComponent,
  ],
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiServiceService);

  handleMessageWithFile({ prompt, file }: TextMessageEvent) {
    const text = prompt ?? file.name ?? 'Translate the audio';
    this.isLoading.set(true);

    this.messages.update((prev) => [...prev, { isGpt: false, text: text }]);

    this.openAiService.audioToText(file, text).subscribe((resp) => {
      this.handleResponse(resp);
    });
  }

  handleResponse(resp: AudioToTextResponse | null) {
    this.isLoading.set(false);

    if (!resp) return;

    const text = `## Transcription:
    __Duration: ${Math.round(resp.duration)} seconds.

    ## The text is:
    ${resp.text}
    `;
    this.messages.update((prev) => [...prev, { isGpt: true, text: text }]);

    resp.segments.forEach((segment) => {
      const segmentMessage = `
      __From: ${Math.round(segment.start)} to ${Math.round(segment.end)} seconds.__
      ${segment.text}
      `;

      this.messages.update((prev) => [
        ...prev,
        { isGpt: true, text: segmentMessage },
      ]);
    });
  }
}
