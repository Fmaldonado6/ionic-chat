import { DatabaseService } from './../../services/database/database.service';
import { Status } from './../../models/models';
import { UsersService } from 'src/app/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/models';
import { Router } from '@angular/router';
import { NavController, Platform, ViewWillEnter, ToastController } from '@ionic/angular';

interface FormValues {
  email: string
  password: string
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements ViewWillEnter {

  Status = Status
  currentStatus = Status.loading
  form: FormGroup

  constructor(
    private usersService: UsersService,
    private platform: Platform,
    private databaseService: DatabaseService,
    private navController: NavController,
    public toastController: ToastController
  ) { }
  ionViewWillEnter(): void {

    //Si existe un token entonces no es necesario el login y cambiamos a la pantalla de inicio
    if (this.databaseService.token)
      return this.changePage()

    //Si no existe un token establecemos el estado a cargando e iniciamos el formulario
    this.currentStatus = Status.loaded

    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    })
  }




  submitForm(values: FormValues) {

    //Al dar clic en iniciar sesión obtenemos los valores del form y los ponemos en un objeto user
    const user = new User()
    user.email = values.email
    user.password = values.password
    //Usamos el objeto user para hacer un post al backend a través del usersService
    this.usersService.login(user).subscribe(async e => {
      //Si el login fue exitoso guardamos el token en sqlite o localstorage dependiendo de la plataforma
      if (this.platform.is('capacitor'))
        await this.databaseService.insertToken(e)
      else
        this.databaseService.insertTokenStorage(e)

      //Obtenemos y guardamos la información del token
      this.usersService.setUser(this.usersService.getTokenInfo(e) as User)
      this.changePage()
    }, async () => {
      //Si el login no es exitoso mandamos un toast de valores incorrectos
      const toast = await this.toastController.create({
        message: "Usuario o contraseña incorrectos",
        duration: 2000
      })

      toast.present()
    })
  }
  //Redirecciona a la pagina principal
  changePage() {
    this.navController.navigateRoot("/main")
  }

}
