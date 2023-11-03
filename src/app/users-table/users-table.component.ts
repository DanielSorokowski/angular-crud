import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { Observable, Subscription, filter, tap } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent {
  headers = ['name', 'surname', 'email', 'age', 'premium'];
  properties = [
    { key: 'name', type: 'text' },
    { key: 'surname', type: 'text' },
    { key: 'email', type: 'text' },
    { key: 'age', type: 'text' },
    { key: 'premium', type: 'checkbox' },
  ];

  @Input()
  users: User[] | null = [];

  @Output()
  private userChangedSubscription: Subscription;

  editForm!: FormGroup;

  constructor(public userService: UserService, private formBuilder: FormBuilder) {
    this.userChangedSubscription = this.userService.usersChanged$.subscribe(() => {
      this.updateUsers();
    });

    this.editForm = this.formBuilder.group({
      name: [
        '', 
        [Validators.required]
      ],
      surname: [
        '', 
        [Validators.required]
      ],
      email: [
        '', 
        [Validators.required, Validators.email]
      ],
      age: [
        '', 
        [Validators.required, this.isTooYoung(), this.isTooOld()]
      ],
      premium: [
        false, 
        [Validators.required]
      ],
    }, { validators: [this.doesUserExist(), this.canBePremium()] });
  }

  ngOnDestroy() {
    this.userChangedSubscription.unsubscribe();
  }

  updateUsers() {
    this.userService.loadAllUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  startEditing(user: any): void {
    user.editing = true;
    this.editForm.patchValue(user)
  }

  finishEditing(user: User): void {
    if (user.editing && this.editForm.valid) {
      user.editing = false;

      const changes: Partial<User> = this.editForm.value;

      this.userService.saveUser(user._id!, changes).subscribe();
    }
  }

  deleteUser(userId: string) {
    this.userService.deleteUser(userId).subscribe(
      () => {
        console.log('Deleted')
      }
    )
  }

  doesUserExist() {
    return (control: AbstractControl) => {
      const name = control.get('name')?.value
      const surname = control.get('surname')?.value

      const isValid = this.users?.filter(user => user.name === name && user.surname === surname).length! > 1;

      return isValid ? { userExists: true } : null;
    };
  }

  isTooYoung() {
    return (control: AbstractControl) => {
      const isValid = control.value < 18;
      return isValid ? { userTooYoung: true } : null
    }
  }

  isTooOld() {
    return (control: AbstractControl) => {
      const isValid = control.value > 99;
      return isValid ? { userTooOld: true } : null
    }
  }

  canBePremium() {
    return (control: AbstractControl) => {
      const premium = control.get('premium')?.value
      const age = control.get('age')?.value

      const isValid = premium && age <= 35
    
      return isValid ? { userCantBePremium: true } : null;
    };
  }

  sortUsers(by: string) {
    this.users!.sort((a, b) => {
      if (typeof a[by] === 'string' && typeof b[by] === 'string') {
        return a[by].localeCompare(b[by])
      }

      return a[by] - b[by]
    })
  }
}
