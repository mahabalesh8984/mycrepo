import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpHeaderResponse, HttpRequest } from '@angular/common/http';
//import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Select2OptionData } from 'ng2-select2';

import { AppGlobals } from '../shared/app.global';


@Injectable()
export class LibraryService {

    callurl: string = "";

    constructor(private http: HttpClient, private _global: AppGlobals) { }

    converttodate(Datstr:Date)
    {
        debugger
        let mm = Datstr.getMonth() + 1;
return Datstr.getFullYear()+"-"+mm+"-"+Datstr.getDate();

    }

 
    getbookdetails(): Observable<any> {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        let postdat={clcd:clcd,aycd:aycd}
        return this.http.post(this._global.baseAPIUrl + 'getlibbooks', postdat)
            .map((data: any) => {
                console.log('retres', data);
                return data.bookdetails;
            });
    }


    savebookdetails(bookdata: any): Observable<any> {
                        
        debugger
        // let clcd=localStorage.getItem('clcd');
        //         let aycd=localStorage.getItem('aycd');
        // var admdata={bookid:bookid,stuid:stuid,clcd:clcd,aycd:aycd}
        return this.http.post(this._global.baseAPIUrl + 'savebookdetails', bookdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

   


}