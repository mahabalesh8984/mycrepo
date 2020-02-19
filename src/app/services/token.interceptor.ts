import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
 import { Observable } from 'rxjs/Observable';
 import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  token:any={};
  constructor(private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token = localStorage.getItem('token');
    const newRequst = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token}`
      }
    });
     return next.handle(newRequst)
    .do(
      succ=>(console.log(succ)),
      err=>{
        if(err){
          //this.router.navigate(['/Unauthorized']);
          console.error("You are not authenticated");
          return false;
        }
      }
    )
  }
}