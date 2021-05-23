import { Types } from './../../shared/components/info-message/info-message.component';
import { Status } from './../../models/models';
import { UsersService } from 'src/app/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/models/models';
import { Router } from '@angular/router';

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
  Status = Status
  Types = Types
  currentStatus = Status.loaded

  constructor(
    private usersService: UsersService,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
      ]),
      username: new FormControl('', [
        Validators.required,
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
    if (values.confirmPassword != values.password)
      return (await this.toastController.create({ message: "Passwords don't match!", duration: 2000 })).present()
    if (values.password.length < 8)
      return (await this.toastController.create({ message: "Password must be 8 characters", duration: 2000 })).present()
    this.currentStatus = Status.loading
    const user = new User()
    user.email = values.email
    user.username = values.username
    user.password = values.password

    this.usersService.register(user).subscribe(e => {
      this.currentStatus = Status.success

      setTimeout(() => {
        this.changePage()
      }, 2000);
    }, () => {
      this.currentStatus = Status.error

    })
  }

  retry() {
    this.currentStatus = Status.loaded
  }

  changePage() {
    console.log("Yes")
    this.router.navigate(["/"])
  }
}
