import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  responseClone: any;

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.authService.isAuthenticated) {
      const token = this.authService.getToken();
      this.responseClone = req.clone({ headers: req.headers.append('Authorization', `Bearer ${token}`) });
      return next.handle(this.responseClone);
    }
    return next.handle(req);
  }
}
