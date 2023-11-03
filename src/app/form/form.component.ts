import { Component, Input, Output } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  @Input()
  users: User[] | null = [];

  myForm!: FormGroup;

  @Output()
  private userChangedSubscription: Subscription;

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.userChangedSubscription = this.userService.usersChanged$.subscribe(() => {
      this.updateUsers();
    });

    this.myForm = this.formBuilder.group({
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

  doesUserExist() {
    return (control: AbstractControl) => {
      const name = control.get('name')?.value
      const surname = control.get('surname')?.value

      const isValid = this.users?.find(user => user.name === name && user.surname === surname);

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

  ngOnDestroy() {
    this.userChangedSubscription.unsubscribe();
  }

  updateUsers() {
    this.userService.loadAllUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  onSubmit() {
    if(this.myForm.valid) {
      this.userService.addUser(this.myForm.value).subscribe();
      this.myForm.reset()

    } else {
      console.log('error')
    } 
  }
}
