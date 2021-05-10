import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { ChatsService } from 'src/app/services/chats/chats.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  constructor(
    private chatService: ChatsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id
    this.chatService.getChatInfo(id).subscribe(e=>{
      console.log(e)
    })
  }

  sendMessage() {

  }


}
