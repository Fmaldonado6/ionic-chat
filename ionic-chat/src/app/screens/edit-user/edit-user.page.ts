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
    this.form = new FormGroup({
      username: new FormControl(this.usersService.loggedUser.username, [
        Validators.required
      ]),
      email: new FormControl(this.usersService.loggedUser.email, [
        Validators.required
      ])
    })
  }

  submitForm(values: any) {
    this.currentStatus = Status.loading
    const user = new User()
    user.email = values.email
    user.username = values.username

    this.usersService.updateUser(user).subscribe(e => {
      this.currentStatus = Status.success
      this.usersService.setUser(e)
    }, async e => {
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

  changePage() {
    this.router.navigate(["/main/account"])
    this.currentStatus = Status.loaded

  }

  retry() {
    this.currentStatus = Status.loaded
  }

}
