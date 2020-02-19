import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpHeaderResponse, HttpRequest } from '@angular/common/http';
//import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Select2OptionData } from 'ng2-select2';

import { AppGlobals } from '../shared/app.global';


@Injectable()
export class HrService {
    callurl: string = "";
    constructor(private http: HttpClient, private _global: AppGlobals) { }



     converttodate(Datstr:Date)
     {
         debugger
         let mm = Datstr.getMonth() + 1;
return Datstr.getFullYear()+"-"+mm+"-"+Datstr.getDate();

     }
 //sp_hrmlevelseg started
    sel_sp_acminstitute() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_acminstitute/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_acminstitute;
            })
    }

    //sp_hrmlevelseg started
    sel_sp_hrmlevelseg() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_hrmlevelseg/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_hrmlevelseg;
            })
    }

    //sp_hrmemcat started
    sel_sp_hrmemcat() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_hrmemcat/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_hrmemcat;
            })
    }

    //sp_hrmemployee started
    sel_sp_hrmdept() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_hrmdept/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_hrmdept;
            })
    }

    //sel_sp_hrmdesig started
    sel_sp_hrmdesig() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_hrmdesig/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_hrmdesig;
            })
    }

    //sp_hrmemployee started 
    sel_sp_hrmemployee() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_hrmemployee/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_hrmemployee;
            })
    }
    save_sp_hrmemployee(empdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_hrmemployee', empdata)
            .map((data: any) => {
                console.log('retres', data);
                return data;
            });
    }

    //sp_hrmprofileq started insert_sp_hrmprofileq
    selbyid_hrmprofileq(prid:number) {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_hrmprofileq/'+prid+'/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data;
            })
    }
    insert_hrmprofileq(empdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'insert_sp_hrmprofileq', empdata)
            .map((data: any) => {
                console.log('retres', data);
                return data;
            });
    }

    //sel_sp_hrmprofileex 
    selbyid_hrmprofilex(prid:number) {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_hrmprofileex/'+prid+'/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data;
            })
    }
        
    insdel_hrmprofileex(empdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'insdel_sp_hrmprofileex', empdata)
            .map((data: any) => {
                console.log('retres', data);
                return data;
            });
    }
        
    //sel_sp_hrmaward
    selbyid_hrmaward(prid:number,tag:string) {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_hrmaward/'+prid+'/'+tag+'/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data;
            })
    }
        
    insdel_hrmawards(empdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'insdel_sp_hrmaward', empdata)
            .map((data: any) => {
                console.log('retres', data);
                return data;
            });
    }


    save_sp_classteacher(empdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_classteacher', empdata)
            .map((data: any) => {
                console.log('retres', data);
                return data;
            });
    }


    sel_sp_classteacher() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_classteacher/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data;
            })
    }


    save_sp_hrsuballot(empdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_hrsuballocation', empdata)
            .map((data: any) => {
                console.log('retres', data);
                return data;
            });
    }

    sel_sp_hrsuballot(clid) {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_hrsuballocation/'+clid+'/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data;
            })
    }



}