import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpHeaderResponse, HttpRequest } from '@angular/common/http';
//import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Select2OptionData } from 'ng2-select2';

import { AppGlobals } from '../shared/app.global';


@Injectable()
export class ScheduleService {
    callurl: string = "";
    constructor(private http: HttpClient, private _global: AppGlobals) { }



     converttodate(Datstr:Date)
     {
         debugger
         let mm = Datstr.getMonth() + 1;
return Datstr.getFullYear()+"-"+mm+"-"+Datstr.getDate();

     }


    save_sp_classteacher(empdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_classteacher', empdata)
            .map((data: any) => {
                console.log('retres', data);
                return data;
            });
    }


    sel_sp_schasssch(clid,assid,asstypeid) {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_schasssch/'+clcd+'/'+aycd+'/'+clid+'/'+assid+'/'+asstypeid)
            .map((data: any) => {
                return data.sp_schasssch;
            });
        }
            save_sp_schasssch(empdata: any): Observable<any> {
                return this.http.post(this._global.baseAPIUrl + 'save_sp_schasssch', empdata)
                    .map((data: any) => {
                        console.log('retres', data);
                        return data;
                    });
            }
 
            sel_sp_schholidaylist() {
                let clcd=localStorage.getItem('clcd');
                let aycd=localStorage.getItem('aycd');
                return this.http.get(this._global.baseAPIUrl + 'sel_sp_schholidaylist/'+clcd+'/'+aycd)
                    .map((data: any) => {
                        return data.sp_schholidaylist;
                    });
                }

                save_sp_schholidaylist(empdata: any): Observable<any> {
                    return this.http.post(this._global.baseAPIUrl + 'save_sp_schholidaylist', empdata)
                        .map((data: any) => {
                            console.log('retres', data);
                            return data;
                        });
                }
                sel_sp_schyearlycalendar() {
                    let clcd=localStorage.getItem('clcd');
                    let aycd=localStorage.getItem('aycd');
                    return this.http.get(this._global.baseAPIUrl + 'sel_sp_schyearlycalendar/'+clcd+'/'+aycd)
                        .map((data: any) => {
                            return data.sp_schyearlycalendar;
                        });
                    }
    
                    save_sp_schyearlycalendar(empdata: any): Observable<any> {
                        return this.http.post(this._global.baseAPIUrl + 'save_sp_schyearlycalendar', empdata)
                            .map((data: any) => {
                                console.log('retres', data);
                                return data;
                            });
                    }
}