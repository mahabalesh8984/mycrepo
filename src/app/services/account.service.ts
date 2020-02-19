import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpHeaderResponse, HttpRequest } from '@angular/common/http';
//import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Select2OptionData } from 'ng2-select2';

import { AppGlobals } from '../shared/app.global';


@Injectable()
export class AccountService {

    callurl: string = "";

    constructor(private http: HttpClient, private _global: AppGlobals) { }

    converttodate(Datstr:Date)
    {
        debugger
        let mm = Datstr.getMonth() + 1;
return Datstr.getFullYear()+"-"+mm+"-"+Datstr.getDate();

    }

 Acreceiptheader(stuid:string,deptid:string,dbnm:string) {
     debugger
     let clcd=localStorage.getItem('clcd');
     let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'acreceipth/'+stuid+'/'+deptid+'/'+dbnm+'/'+clcd+'/'+aycd)
            .map((data: any) => {

                // console.log=('log',data.classdata)
                return data.rechead;
            })
    }



    Acreceiptdet(stuid:string,deptid:string,insid:string,dbnm:string) {
        debugger
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
           return this.http.get(this._global.baseAPIUrl + 'acreceiptd/'+stuid+'/'+deptid+'/'+insid+'/'+dbnm+'/'+clcd+'/'+aycd)
               .map((data: any) => {
   
                   // console.log=('log',data.classdata)
                   return data.recdet;
               })
       }



       updatereceiptd(clsdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_accreceiptd', clsdata)
            .map((data: any) => {
                console.log('retres', data);
                return data;
            });
    }


    savepartreceipt(recdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_Partreceipt', recdata)
            .map((data: any) => {
                console.log('retres', data);
                return data;
            });
    }

    savemiscreceipt(recdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'Savemiscreceipt', recdata)
            .map((data: any) => {
                console.log('retres', data);
                return data;
            });
    }
}