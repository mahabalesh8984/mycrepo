import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { AppGlobals } from '../shared/app.global';
 

@Injectable()
export class AuthService {
    public token: string;
    public username: string;
  constructor(private http: HttpClient, private _global: AppGlobals) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }
 
login(userData: any): Observable<boolean> {
    return this.http.post( this._global.baseAPIUrl+'login', userData)
        .map((data: any) => {
            // login successful if there's a jwt token in the response
            let token = data && data.token;
            let unm = data && data.username;
            let photo = data && data.photo;
            if (token) {
                // set token property
                this.token = token;
                // store username and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify({ username: unm, token: token,photo:photo }));
                localStorage.setItem('token', token);
                localStorage.setItem('clcd', data.clcd);
                localStorage.setItem('aycd', data.ayid);
                

                // return true to indicate successful login
                return true;
            } else {
                // return false to indicate failed login
                return false;
            }
        });
}
logout() {
    // remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
}



public getToken(): string {
    return localStorage.getItem('token');
  }

 




}
