import { Forbidden } from './../../models/exceptions';
import { Passwords } from '../../models/models';
import { Types } from '../../shared/components/info-message/info-message.component';
import { Status } from '../../models/models';
import { UsersService } from 'src/app/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
interface FormValues {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.page.html',
  styleUrls: ['./change-pass.page.scss'],
})
export class ChangePassPage implements OnInit {

  form: FormGroup
  Status = Status
  Types = Types
  currentStatus = Status.loaded

  constructor(
    private usersService: UsersService,
    private toastController: ToastController,
    private router: Router,
  ) { }

  ngOnInit() {
    //se crea el formulario
    this.form = new FormGroup({
      oldPassword: new FormControl('', [
        Validators.required
      ]),
      newPassword: new FormControl('', [
        Validators.required
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ])
    })
  }

  async submitForm(values: FormValues) {
    //Error si las contraseñas (nueva y confirmar nueva) no coinciden
    if (values.confirmPassword != values.newPassword)
      return (await this.toastController.create({ message: "Passwords don't match!", duration: 2000 })).present()

    //Cambia el status para que se muestre un spinner
    this.currentStatus = Status.loading
    let passwords = new Passwords();

    //Se guardan las contraseñas en un objeto password para mandarlo al server
    passwords.oldPassword = values.oldPassword;
    passwords.newPassword = values.newPassword;

    //Con el servicio de usuarios nos comunicamos con el server
    this.usersService.updateUserPassword(passwords).subscribe(async e => {
      this.currentStatus = Status.success


    }, async e => {
      // Se muestra error especifico para la contraseña antigua incorrecta
      if (e instanceof Forbidden) {
        const toast = await this.toastController.create({
          message: "La contraseña antigua no es correcta",
          duration: 2000
        })
        toast.present()
        this.currentStatus = Status.loaded
      }
      else
      //se cambia el status para que se muestre el error
        this.currentStatus = Status.error

    })
  }
  //Cambia el status para que se muestre de nuevo el formulario
  retry() {
    this.currentStatus = Status.loaded
  }
  //Nos regresa a la pagina de cuenta
  changePage() {
    this.currentStatus = Status.loaded
    this.router.navigate(["/main/account"])
  }
}
