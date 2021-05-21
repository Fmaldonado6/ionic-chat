import { Subscription } from 'rxjs';
import { IonVirtualScroll, ViewWillEnter } from '@ionic/angular';
import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chat, ChatResource, FullChatInfo, Status, User } from 'src/app/models/models';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { UsersService } from 'src/app/services/users/users.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { ChatsStatus } from '../../main.page';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements ViewWillEnter, OnDestroy, OnInit {

  private chatContainer: IonVirtualScroll;

  @ViewChild('chatsContainer', { static: false }) set content(content: IonVirtualScroll) {
    if (content) {
      this.chatContainer = content;
    }
  }

  Status = Status
  currentStatus = Status.loading

  chats: ChatResource[] = []
  subscription: Subscription

  loggedUser = new User()

  constructor(
    private chatService: ChatsService,
    private usersService: UsersService,
    private websocketService: WebsocketService
  ) { }

  ngOnInit(): void {

    this.loggedUser = this.usersService.loggedUser

    this.subscription = this.websocketService.message.asObservable().subscribe(e => {
      if (e) {

        for (let chat of this.chats) {
          if (chat.chatId == e.chatId) {
            const index = this.chats.indexOf(chat)
            chat.latestMessage = e
            chat.newMessages++
            this.chats.unshift(this.chats.splice(index, 1).pop())
            if (this.chatContainer)
              this.chatContainer.checkEnd()
            return;
          }
        }



        const newChat = new ChatResource()
        newChat.chatId = e.chatId
        newChat.receiverId = e.senderId
        newChat.receiverName = e.senderName
        newChat.latestMessage = e
        newChat.newMessages++
        this.chats.unshift(newChat)
        this.currentStatus = Status.loaded
        if (this.chatContainer)
          this.chatContainer.checkEnd()
      }
    })
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe()
  }

  ionViewWillEnter(): void {
    this.getChats()

  }

  trackById(index: number, item: ChatResource) {
    return item.chatId
  }

  getChats() {
    this.currentStatus = Status.loading
    this.chatService.getUserChats().subscribe(e => {

      this.chats = e

      if (this.chats.length == 0)
        return this.currentStatus = Status.empty

      this.currentStatus = Status.loaded
    })
  }

}
