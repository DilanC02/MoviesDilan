import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IuserLogin } from '../interface/IUser';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);


  constructor() { }

  login(email: string, password: string) {
     return  this.http.post<IuserLogin>('http://localhost:3000/api/login', { email: email, password: password })

  }
  register(name: string, email: string, password: string) {
    return this.http.post('http://localhost:3000/api/register', { user: name, email: email, password: password });
  }

}
