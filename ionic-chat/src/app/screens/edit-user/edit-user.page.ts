import { ToastController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { Status, User } from 'src/app/models/models';
import { Types } from 'src/app/shared/components/info-message/info-message.component';
import { Router } from '@angular/router';
import { Conflict } from 'src/app/models/exceptions';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {

  Types = Types

  Status = Status
  currentStatus = Status.loaded

  form = new FormGroup({})

  constructor(
    private usersService: UsersService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    //Iniciar el formulario
    this.form = new FormGroup({
      username: new FormControl(this.usersService.loggedUser.username, [
        Validators.required,
        Validators.pattern(/^[a-z|0-9]/i)
      ]),
      email: new FormControl(this.usersService.loggedUser.email, [
        Validators.required,
        Validators.email
      ])
    })
  }

  submitForm(values: any) {
    //Se cambia el estado a cargando
    this.currentStatus = Status.loading
    //Se crea un objeto User con la informacion del formulario
    const user = new User()
    user.email = values.email
    user.username = values.username

    //Se llama al service UpdateUser
    this.usersService.updateUser(user).subscribe(e => {
      //Cambiamos el estado a success
      this.currentStatus = Status.success
      //Cambiamos la informacion del usuario actual
      this.usersService.setUser(e)
    }, async e => {

      //Si recibimos un error y es de tipo Conflict
      //es por que ya hay un usuario con ese email
      //si no mostramos el error
      if (e instanceof Conflict) {
        const toast = await this.toastController.create({
          message: "El email ingresado ya existe",
          duration: 2000
        })
        toast.present()
        this.currentStatus = Status.loaded
      }
      else
        this.currentStatus = Status.error
    })
  }

  //Regresa a la pagina de cuenta
  changePage() {
    this.router.navigate(["/main/account"])
    this.currentStatus = Status.loaded

  }

  //Vuelve a mostrar el formulario
  retry() {
    this.currentStatus = Status.loaded
  }

}
