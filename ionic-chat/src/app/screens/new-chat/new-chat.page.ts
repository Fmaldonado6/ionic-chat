import { UsersService } from 'src/app/services/users/users.service';
import { User, Status } from 'src/app/models/models';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.page.html',
  styleUrls: ['./new-chat.page.scss'],
})
export class NewChatPage implements OnInit {

  /*
   Variable Status splo contiene los estados que puede tener,
   estos pueden ser cargando, cargado, error, se declara aqui
   para usarla en el ngSwitch del HTML, esta declarada en la carpeta
   de models/models.ts
  */
  Status = Status

  /*
  Variable que indica el estado actual de la pantalla, la inicamos
  en loading para mostrar el spinner de cargando en el html
  */
  currentStatus = Status.loading

  /*
    Arreglo de usuarios conectado
  */
  users: User[] = []

  /*
    Inyectamos el servicio
  */
  constructor(
    private usersService: UsersService
  ) { }


  /* Al iniciar la pantalla llamamos a la funcion getUsers */
  ngOnInit() {
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
      /* 
      Esta funcion se ejecuta si existe algun error
      por lo que cambiamos el estado a error
      */

      this.currentStatus = Status.error
    })
  }

}
