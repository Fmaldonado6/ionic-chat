import { InfoMessageComponent } from './components/info-message/info-message.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    InfoMessageComponent
  ],
  imports: [
    CommonModule,
    IonicModule,

  ],
  exports: [
    InfoMessageComponent
  ]
})
export class SharedModule { }
