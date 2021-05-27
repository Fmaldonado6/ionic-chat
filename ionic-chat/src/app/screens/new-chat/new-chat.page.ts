import { UsersService } from 'src/app/services/users/users.service';
import { User, Status } from 'src/app/models/models';
import { Component, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.page.html',
  styleUrls: ['./new-chat.page.scss'],
})
export class NewChatPage implements ViewWillEnter {

 
  Status = Status
  currentStatus = Status.loading

  /*
    Arreglo de usuarios conectado
  */
  users: User[] = []

 
  constructor(
    private usersService: UsersService
  ) { }


  /* Al iniciar la pantalla llamamos a la funcion getUsers */
  ionViewWillEnter() {
    this.getUsers()
  }

  getUsers() {
    /* 
    Nos aseguramos de que el estado actual sea el de
    cargando
    */
    this.currentStatus = Status.loading

    /*
      Consumimos el servicio
    */
    this.usersService.getUsers().subscribe(users => {
      /*Asignamos el resultado a la variable users */
      this.users = users

      /* Si el arreglo esta vacío cambiamos el estado a empty */
      if (this.users.length == 0)
        return this.currentStatus = Status.empty

      /* Si no lo cambiamos a loaded */
      this.currentStatus = Status.loaded
    }, () => {
      /* cambiamos el estado a error en caso de que ocurra algo*/
      this.currentStatus = Status.error
    })
  }

}
