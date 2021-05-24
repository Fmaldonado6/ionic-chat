import { UsersService } from 'src/app/services/users/users.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Chat, FullChatInfo, Status, User } from 'src/app/models/models';
import { Subscription } from 'rxjs';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { IonTabs } from '@ionic/angular';

export class ChatsStatus {
  chats: FullChatInfo[] = []
  currentStatus = Status.loading
}

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {
  private activeTab?: HTMLElement;
  loggedUser = new User()
  subscription: Subscription
  constructor(
    private websocketService: WebsocketService,
    private usersService: UsersService
  ) { }
  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe()
  }

  ngOnInit() {
    this.websocketService.connect()
    this.subscription = this.usersService.userChanged.asObservable().subscribe(e => {
      this.loggedUser = e
    })
  }

  tabChange(tabsRef: IonTabs) {
    this.activeTab = tabsRef.outlet.activatedView.element;
  }

  ionViewWillLeave() {
    this.propagateToActiveTab('ionViewWillLeave');
  }

  ionViewDidLeave() {
    this.propagateToActiveTab('ionViewDidLeave');
  }

  ionViewWillEnter() {
    this.propagateToActiveTab('ionViewWillEnter');
  }

  ionViewDidEnter() {
    this.propagateToActiveTab('ionViewDidEnter');
  }

  private propagateToActiveTab(eventName: string) {
    if (this.activeTab) {
      this.activeTab.dispatchEvent(new CustomEvent(eventName));
    }
  }

}