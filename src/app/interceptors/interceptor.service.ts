import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {CommonService} from '../services/common.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(
    private commonService: CommonService
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.commonService.getToken();
    const duplicate = req.clone({setHeaders: {Authorization: token}});
    return next.handle(duplicate);
  }

}
