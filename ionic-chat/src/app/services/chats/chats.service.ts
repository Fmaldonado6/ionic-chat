import { catchError, map } from 'rxjs/internal/operators';
import { DataService } from './../data.service';
import { Injectable } from '@angular/core';
import { Chat, ChatResource, FullChatInfo } from 'src/app/models/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatsService extends DataService {


  //Obtiene los chats creados
  getUserChats() {
    return this.http.get<ChatResource[]>(`${this.url}/chat`).pipe(catchError(this.handleError),
      map(e => e.map(x => Object.assign(new ChatResource(), x))))
  }
  //Obtiene la información del chat actual
  getChatInfo(receiverId: string) {
    return this.http.get<FullChatInfo>(`${this.url}/chat/${receiverId}`).pipe(catchError(this.handleError),
      map(e => Object.assign(new FullChatInfo(), e)))
  }

}
