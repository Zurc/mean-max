import { HttpInterceptor, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

// official feature created by Angular HttpClient
// Interceptors: functions that run on any outgoing http request
// we can manipulate this outgoing http request e.g. to attach our token

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // retrieve the token from our service
    const authToken = this.authService.getToken();
    // clone and edit the incoming request
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    })

    return next.handle(authRequest);
  }
}
