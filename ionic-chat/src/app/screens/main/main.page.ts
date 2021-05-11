import { ChatsService } from './../../services/chats/chats.service';
import { WebsocketService } from './../../services/websocket/websocket.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chat } from 'src/app/models/models';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  ngOnInit(): void {
  }
}