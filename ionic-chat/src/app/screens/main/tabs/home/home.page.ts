import { Subscription } from 'rxjs';
import { ViewWillEnter } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class HomePage implements ViewWillEnter, OnDestroy, OnInit {

  Status = Status
  currentStatus = Status.loading

  chats: FullChatInfo[] = []
  subscription: Subscription
  constructor(
    private usersService: UsersService,
    private websocketService: WebsocketService,
    private chatService: ChatsService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.websocketService.connect()
    this.getChats()
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe()
  }

  ionViewWillEnter(): void {
    this.chatService.createdChats.asObservable().subscribe(e => {
      this.chats = e

      if (this.chats.length == 0)
        return this.currentStatus = Status.empty
        
    })
  }



  getChats() {
    this.currentStatus = Status.loading

    this.chatService.getUserChats().subscribe(e => {
      this.currentStatus = Status.loaded
    })
  }

}
