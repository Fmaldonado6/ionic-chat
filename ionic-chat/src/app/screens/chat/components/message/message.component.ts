import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/models/models';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {

  @Input() sender = false
  @Input() message: Message

  constructor() { }

  ngOnInit() { }

}
