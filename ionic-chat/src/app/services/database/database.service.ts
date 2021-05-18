import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  TOKEN_STRING = "token-chat-app"

  db: SQLiteObject
  token: string
  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private router:Router
  ) { }

  async openDatabase() {
    this.db = await this.sqlite.create({
      name: "chats.db",
      location: 'default'
    })

  }

  configureDatabase() {
    return this.db.executeSql('create table if not exists AuthToken(tokenId integer not null primary key, token text not null);', [])
  }


  insertToken(token: string) {
    this.token = token
    return this.db.executeSql(`
    REPLACE INTO AuthToken(tokenId, token)
    VALUES (1,"${token}")
    `, [])
  }

  getToken() {
    return this.db.executeSql(`SELECT * FROM AuthToken`, [])
  }

  getTokenStorage() {
    return localStorage.getItem(this.TOKEN_STRING)
  }

  insertTokenStorage(token: string) {
    this.token = token
    localStorage.setItem(this.TOKEN_STRING, token);
  }

  deleteToken() {
    this.token = null
    return this.db.executeSql('delete from AuthToken;', [])
  }

  deleteTokenStorage() {
    this.token = null
    localStorage.removeItem(this.TOKEN_STRING)
  }



}
