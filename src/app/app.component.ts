import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './interfaces/user';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-crud';

  users$!: Observable<User[]>;

  constructor(public userService: UserService) {}

  ngOnInit() {
    this.updateUser()
  }

  updateUser() {
    this.users$ = this.userService.loadAllUsers()
  }
}
