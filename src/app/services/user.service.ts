import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, shareReplay, tap } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'https://crudcrud.com/api/9a693ec099804643893103786cce885d/users';
  usersChanged$ = new Subject<void>()
  constructor(private http: HttpClient) {}

  loadAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url)
  }

  saveUser(userId: string, changes: Partial<User>): Observable<any> {
    return this.http.put(`${this.url}/${userId}`, changes).pipe(
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
