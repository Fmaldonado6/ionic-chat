import { RouterModule } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewChatPageRoutingModule } from './new-chat-routing.module';

import { NewChatPage } from './new-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    /* 
    Este modulo yo lo hice ahí se encuentran componentes
    que vamos a usar en muchas pantallas, como los mensajes de 
    error, agreguenlo a las pantallas nuevas que hagan 
    */
    SharedModule,
    NewChatPageRoutingModule
  ],
  declarations: [NewChatPage]
})
export class NewChatPageModule { }
