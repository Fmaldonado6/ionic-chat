import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chat, FullChatInfo, Status } from 'src/app/models/models';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { UsersService } from 'src/app/services/users/users.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  Status = Status
  currentStatus = Status.loading

  chats: FullChatInfo[] = []

  constructor(
    private usersService: UsersService,
    private websocketService: WebsocketService,
    private chatService: ChatsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.websocketService.connect()
    this.getChats()
  }


  getChats() {
    this.chatService.getUserChats().subscribe(e => {

      this.chats = e

      if (this.chats.length == 0)
        return this.currentStatus = Status.empty



      this.currentStatus = Status.loaded
    })
  }

}
