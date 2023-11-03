import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, shareReplay, tap } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'https://crudcrud.com/api/c8b251e7ebe446c9a5af384b390e919f/users';
  usersChanged$ = new Subject<void>()
  constructor(private http: HttpClient) {}

  loadAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url).pipe(shareReplay());
  }

  saveUser(userId: string, changes: Partial<User>): Observable<any> {
    return this.http.put(`${this.url}/${userId}`, changes).pipe(
      shareReplay(),
      tap(() => this.usersChanged$.next())
    );
  }

  addUser(user: User): Observable<any> {
    return this.http.post(this.url, user).pipe(
      tap(() => this.usersChanged$.next())
    );
  }

  deleteUser(userid: string): Observable<any> {
    return this.http.delete(`${this.url}/${userid}`).pipe(
      tap(() => this.usersChanged$.next())
    )
  }
}
