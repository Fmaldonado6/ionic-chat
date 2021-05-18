import { catchError, map } from 'rxjs/internal/operators';
import { DataService } from './../data.service';
import { Injectable } from '@angular/core';
import { Chat, FullChatInfo } from 'src/app/models/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatsService extends DataService {

  private chats: FullChatInfo[] = []


  getUserChats() {
    return this.http.get<FullChatInfo[]>(`${this.url}/chat`).pipe(catchError(this.handleError),
      map(e => {
        this.chats = e.map(c => Object.assign(new FullChatInfo(), c))
        return this.chats
      }))
  }

  getChatInfo(receiverId: string) {
    return this.http.get<FullChatInfo>(`${this.url}/chat/${receiverId}`).pipe(catchError(this.handleError),
      map(e => Object.assign(new FullChatInfo(), e)))
  }

}
