import { Platform, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database/database.service';
import { UsersService } from 'src/app/services/users/users.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private databaseService: DatabaseService,
    private navController: NavController,
    private platform: Platform,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
  }


  async signOut() {
    this.navController.navigateRoot("/")
    if (this.platform.is('capacitor'))
      await this.databaseService.deleteToken()
    else
      this.databaseService.deleteTokenStorage()

  }
}
