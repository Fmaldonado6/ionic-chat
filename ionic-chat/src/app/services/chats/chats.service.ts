import { catchError, map } from 'rxjs/internal/operators';
import { DataService } from './../data.service';
import { Injectable } from '@angular/core';
import { Chat, FullChatInfo } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})
export class ChatsService extends DataService {


  getUserChats() {
    return this.http.get<FullChatInfo[]>(`${this.url}/chat`).pipe(catchError(this.handleError),
      map(e => e.map(c => Object.assign(new Chat(), c))))
  }

  getChatInfo(receiverId: string) {
    return this.http.get<FullChatInfo>(`${this.url}/chat/${receiverId}`).pipe(catchError(this.handleError),
      map(e => Object.assign(new FullChatInfo(), e)))
  }

}
