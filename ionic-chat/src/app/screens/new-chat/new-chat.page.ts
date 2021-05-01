import { UsersService } from 'src/app/services/users/users.service';
import { User, Status } from 'src/app/models/models';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.page.html',
  styleUrls: ['./new-chat.page.scss'],
})
export class NewChatPage implements OnInit {


  Status = Status
  currentStatus = Status.loading
  users: User[] = []

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.getUsers()
  }

  getUsers() {
    this.currentStatus = Status.loading
    this.usersService.getUsers().subscribe(users => {
      this.users = users
      if (this.users.length == 0)
        return this.currentStatus = Status.empty
      this.currentStatus = Status.loaded
    })
  }

}
