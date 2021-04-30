import { UsersService } from 'src/app/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  signOut() {
    this.usersService.signOut()
    this.router.navigate(["/"])
  }

}
