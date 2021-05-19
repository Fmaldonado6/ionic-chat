import { ChatItemComponent } from './components/chat-item/chat-item.component';
import { EmptyComponent } from './components/empty/empty.component';
import { InfoMessageComponent } from './components/info-message/info-message.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { OptionTileComponent } from './components/option-tile/option-tile.component';



@NgModule({
  declarations: [
    InfoMessageComponent,
    EmptyComponent,
    ChatItemComponent,
    OptionTileComponent
  ],
  imports: [
    CommonModule,
    IonicModule,

  ],
  exports: [
    InfoMessageComponent,
    EmptyComponent,
    ChatItemComponent,
    OptionTileComponent

  ]
})
export class SharedModule { }
