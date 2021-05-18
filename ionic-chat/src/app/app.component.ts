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
  Status = Status
  currentStatus = Status.loading
  isMobile = false
  constructor(
    private databaseService: DatabaseService,
    private usersService: UsersService,
    private router: Router,
    private navController: NavController,
    private platform: Platform
  ) {
    platform.ready().then(e => {
      this.isMobile = this.platform.is('capacitor')
      this.initDatabase()

    })
  }

  async initDatabase() {
    try {

      if (this.isMobile) {
        await this.databaseService.openDatabase()
        await this.databaseService.configureDatabase()
      }
      this.selectDatabase()
    } catch (error) {

    }

  }



  async selectDatabase() {
    try {

      let token = this.databaseService.getTokenStorage()

      if (this.isMobile) {
        const res = await this.databaseService.getToken()
        token = res.rows.item(0).token as string
      }

      if (!token) {
        this.navController.navigateRoot("")
        this.currentStatus = Status.loaded
        return
      }

      const user = this.usersService.getTokenInfo(token)
      this.databaseService.token = token
      this.usersService.loggedUser = user
      this.currentStatus = Status.loaded
    } catch (error) {
      this.currentStatus = Status.loaded
      this.navController.navigateRoot("")
    }
  }

}
