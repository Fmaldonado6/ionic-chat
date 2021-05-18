import { Subscription } from 'rxjs';
import { ViewWillEnter } from '@ionic/angular';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Chat, FullChatInfo, Status } from 'src/app/models/models';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { UsersService } from 'src/app/services/users/users.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { ChatsStatus } from '../../main.page';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements ViewWillEnter {


  Status = Status
  currentStatus = Status.loading

  chats: FullChatInfo[] = []
  subscription: Subscription
  constructor(
    private chatService: ChatsService
  ) { }

  ionViewWillEnter(): void {
    this.getChats()
  }

  getChats() {
    this.currentStatus = Status.loading
    this.chatService.getUserChats().subscribe(e => {
      this.currentStatus = Status.loaded
      this.chats = e
    })
  }

}
