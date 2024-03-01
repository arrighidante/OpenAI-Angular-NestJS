import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent } from '@components/chat-bubbles/chatMessage/chatMessage.component';
import { MyMessageComponent } from '@components/chat-bubbles/myMessage/myMessage.component';
import { TextMessageBoxComponent } from '@components/text-boxes/textMessageBox/textMessageBox.component';
import { TypingLoaderComponent } from '@components/typingLoader/typingLoader.component';
import { Message } from '@interfaces/message.interface';
import { OpenAiServiceService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-assistant-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './assistantPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AssistantPageComponent implements OnInit {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiServiceService);

  public threadId = signal<string | undefined>(undefined);

  ngOnInit() {
    this.openAiService.createThread().subscribe((threadId) => {
      this.threadId.set(threadId);
    });
  }

  handleMessage(question: string) {
    this.isLoading.set(true);

    this.messages.update((prev) => [
      ...prev,
      {
        isGpt: false,
        text: question,
      },
    ]);

    this.openAiService
      .postQuestion(this.threadId()!, question)
      .subscribe((replies) => {
        this.isLoading.set(false);

        // Crear un conjunto con los textos de los mensajes actuales para evitar duplicados
        const currentMessages = new Set(this.messages().map((msg) => msg.text));

        for (const reply of replies) {
          for (const message of reply.content) {
            // Solo agregar el mensaje si no está ya en currentMessages
            if (!currentMessages.has(message)) {
              this.messages.update((prev) => [
                ...prev,
                {
                  isGpt: reply.role === 'assistant',
                  text: message,
                },
              ]);
              // Agregar el nuevo mensaje a currentMessages
              currentMessages.add(message);
            }
          }
        }
      });
  }

  // handleMessage(question: string) {
  //   this.isLoading.set(true);

  //   this.messages.update((prev) => [
  //     ...prev,
  //     {
  //       isGpt: false,
  //       text: question,
  //     },
  //   ]);

  //   this.openAiService
  //     .postQuestion(this.threadId()!, question)
  //     .subscribe((replies) => {
  //       this.isLoading.set(false);

  //       for (const reply of replies) {
  //         for (const message of reply.content) {
  //           this.messages.update((prev) => [
  //             ...prev,
  //             {
  //               isGpt: reply.role === 'assistant',
  //               text: message,
  //             },
  //           ]);
  //         }
  //       }
  //     });
  // }
}
