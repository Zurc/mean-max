import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  // we'll use a subject to push auth status to components interested
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    // return this as observable so we can emit changes and listen from the rest of the app
    return  this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password};
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        this.token = response.token;
        if (this.token) {
          const expiresInDuration = response.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresInDuration * 1000);
          // emit true when the user is authenticated
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          // navigate to the home page
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    // clear the token
    this.token = null;
    // send the status to the rest of the app
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    // go back to the home page
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }
}
