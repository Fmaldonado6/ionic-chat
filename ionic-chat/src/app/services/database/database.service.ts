import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  //Identifica el token en localstorage
  TOKEN_STRING = "token-chat-app"
  //Almacena la conexión a la base de datos
  db: SQLiteObject
  //Almacena el token
  token: string
  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private router:Router
  ) { }

  //Se abre inicia la base de datos
  async openDatabase() {
    this.db = await this.sqlite.create({
      name: "chats.db",
      location: 'default'
    })

  }

  //Crea las tablas en sqlite
  configureDatabase() {
    return this.db.executeSql('create table if not exists AuthToken(tokenId integer not null primary key, token text not null);', [])
  }

  //Inserta los valores del token en sqlite
  insertToken(token: string) {
    this.token = token
    return this.db.executeSql(`
    REPLACE INTO AuthToken(tokenId, token)
    VALUES (1,"${token}")
    `, [])
  }

  //Obtiene los valores del token desde sqlite
  getToken() {
    return this.db.executeSql(`SELECT * FROM AuthToken`, [])
  }

  //Obtiene los valores del token desde localstorage
  getTokenStorage() {
    return localStorage.getItem(this.TOKEN_STRING)
  }

  //Inserta los valores del token desde localstorage
  insertTokenStorage(token: string) {
    this.token = token
    localStorage.setItem(this.TOKEN_STRING, token);
  }

  //Elimina los valores del token de sqlite
  deleteToken() {
    this.token = null
    return this.db.executeSql('delete from AuthToken;', [])
  }

  //Elimina los valores del token de localstorage
  deleteTokenStorage() {
    this.token = null
    localStorage.removeItem(this.TOKEN_STRING)
  }



}
