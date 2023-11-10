import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConnectionStringService, LocalStorageService } from '@ecommerce/services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private ls:LocalStorageService, private con:ConnectionStringService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.ls.getItem('token');
    const isAPIUrl = request.url.startsWith(this.con.API_URL);
    if(token && isAPIUrl){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    return next.handle(request);
  }
}
