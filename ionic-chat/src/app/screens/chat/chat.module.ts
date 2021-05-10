import { MessageComponent } from './components/message/message.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    ChatPageRoutingModule
  ],
  declarations: [
    ChatPage,
    MessageComponent,
  ]
})
export class ChatPageModule { }
