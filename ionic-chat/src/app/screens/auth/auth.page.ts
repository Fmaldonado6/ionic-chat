import { Status } from './../../models/models';
import { UsersService } from 'src/app/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/models';
import { Router } from '@angular/router';
import { NavController, ViewWillEnter } from '@ionic/angular';

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
    private router: Router,
    private navController: NavController
  ) { }
  ionViewWillEnter(): void {
    if (this.usersService.loggedIn())
      return this.changePage()

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
    const user = new User()
    user.email = values.email
    user.password = values.password

    this.usersService.login(user).subscribe(e => {
      this.usersService.setToken(e)
      this.usersService.loggedUser = this.usersService.getTokenInfo() as User
      this.changePage()
    })
  }

  changePage() {
    this.navController.navigateRoot("/main")
  }

}
