import { Types } from './../../shared/components/info-message/info-message.component';
import { Status } from './../../models/models';
import { UsersService } from 'src/app/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/models/models';
import { Router } from '@angular/router';
import { Conflict } from 'src/app/models/exceptions';

interface FormValues {
  email: string
  username: string
  password: string
  confirmPassword: string
}


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
  form: FormGroup
  //Se usa para cambiar el estio de un componente en el HTML
  Types = Types
  //Indica el estado de la pantalla
  Status = Status
  currentStatus = Status.loaded

  constructor(
    private usersService: UsersService,
    private toastController: ToastController,
    private router: Router
  ) { }


  //Iniciamos el formulario
  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-z|0-9]/i)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/[a-zA-Z0-9]+/)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ])
    })
  }

  async submitForm(values: FormValues) {
    //Verificamos que la contraseña cumpla con las condiciones
    if (values.confirmPassword != values.password)
      return (await this.toastController.create({ message: "Las contraseñas no coinciden", duration: 2000 })).present()
    if (values.password.length < 8)
      return (await this.toastController.create({ message: "La contraseña debe tener al menos 8 caracteres", duration: 2000 })).present()

    //Cambiamos el estado a loading
    this.currentStatus = Status.loading

    //Llenamos un objeto user con los valores del formulario
    const user = new User()
    user.email = values.email
    user.username = values.username
    user.password = values.password

    //Llamamos al servicio para registrar usuario
    this.usersService.register(user).subscribe(e => {
      this.currentStatus = Status.success

      setTimeout(() => {
        this.changePage()
      }, 2000);
    }, async (e) => {

      //Si el error es de tipo Conflict es por que el email ya existe
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

  //Al dar clic en retry volvemos a mostrar el form cambiando el estado
  retry() {
    this.currentStatus = Status.loaded
  }

  //Cambiamos a la página principal
  changePage() {
    this.router.navigate(["/"])
  }
}
