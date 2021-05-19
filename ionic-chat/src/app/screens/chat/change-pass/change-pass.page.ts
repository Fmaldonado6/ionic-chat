import { Passwords } from './../../../models/models';
import { Types } from '../../../shared/components/info-message/info-message.component';
import { Status } from '../../../models/models';
import { UsersService } from 'src/app/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/models/models';
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
    private router: Router
  ) { }

  ngOnInit() {
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
    if (values.confirmPassword != values.newPassword)
      return (await this.toastController.create({ message: "Passwords don't match!", duration: 2000 })).present()

    this.currentStatus = Status.loading
    let passwords = new Passwords();

    passwords.oldPassword = values.oldPassword;
    passwords.newPassword = values.newPassword;
    
    this.usersService.updateUserPassword(passwords).subscribe(e => {
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