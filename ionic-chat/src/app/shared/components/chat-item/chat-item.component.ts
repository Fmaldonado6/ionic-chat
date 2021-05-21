import { Component, Input, OnInit } from '@angular/core';
import { Chat, Message, MessageType } from 'src/app/models/models';

@Component({
  selector: 'chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
})
export class ChatItemComponent {
  MessageType = MessageType
  @Input() label: string
  @Input() newMessageCounter: number = 0
  @Input() latestMessage = null
  @Input() myId: string = ""

}
