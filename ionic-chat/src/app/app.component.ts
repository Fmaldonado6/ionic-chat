import { Router } from '@angular/router';
import { UsersService } from './services/users/users.service';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Status } from './models/models';
import { NavController, Platform } from '@ionic/angular';
import { DatabaseService } from './services/database/database.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  /*
   Variable Status solo contiene los estados que puede tener,
   estos pueden ser cargando, cargado, error, se declara aqui
   para usarla en el ngSwitch del HTML,que está declarado en la carpeta
   de models/models.ts
  */
  Status = Status
  /*
  Variable que indica el estado actual de la pantalla, la inicamos
  en loading para mostrar el spinner de cargando en el html
  */
  currentStatus = Status.loading

  //Nos dice si esta siendo ejecutado en un celular
  isMobile = false

  constructor(
    private databaseService: DatabaseService,
    private usersService: UsersService,
    private router: Router,
    private navController: NavController,
    private platform: Platform
  ) {

    //Esperamos a que el dispositivo esté listo e iniciamos sqlite
    platform.ready().then(e => {
      this.isMobile = this.platform.is('capacitor')
      this.initDatabase()

    })
  }

  async initDatabase() {
    //Si ejecutamos en un celular configuramos sqlite
    if (this.isMobile) {
      await this.databaseService.openDatabase()
      await this.databaseService.configureDatabase()
    }
    this.selectDatabase()
  }



  async selectDatabase() {
    try {
      let token: string

      //Obtenemos el token desde localstorage o sqlite dependiendo de la plataforma
      if (this.isMobile) {
        const res = await this.databaseService.getToken()
        token = res.rows.item(0).token as string
      } else
        token = this.databaseService.getTokenStorage()

      //Si el token es null navegamos a la pantalla de login
      if (!token) {
        this.navController.navigateRoot("")
        this.currentStatus = Status.loaded
        return
      }

      //Si el token no es null obtenemos la información del token
      const user = this.usersService.getTokenInfo(token)
      this.databaseService.token = token
      this.usersService.getUserInfo(user.id).subscribe(e => {
        this.usersService.setUser(e)
        this.currentStatus = Status.loaded
      })
    } catch (error) {
      //Si ocurre algún error navegamos a la pantalla de login
      this.currentStatus = Status.loaded
      this.navController.navigateRoot("")
    }
  }

}
