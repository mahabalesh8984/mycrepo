import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpHeaderResponse, HttpRequest } from '@angular/common/http';
//import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Select2OptionData } from 'ng2-select2';

import { AppGlobals } from '../shared/app.global';


@Injectable()
export class MasterService {
    callurl: string = "";
    constructor(private http: HttpClient, private _global: AppGlobals) { }

    //massclass started
    branch() {

        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_masbranch/'+clcd+'/'+aycd)
            .map((data: any) => {

                // console.log=('log',data.classdata)
                return data.sp_masbranch;
            })
    }

    ClassList() {

        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_masclass/'+clcd+'/'+aycd)
            .map((data: any) => {

                // console.log=('log',data.classdata)
                return data.sp_masclass;
            })
    }


    ClasssecList():Observable<Array<Select2OptionData>>{
        debugger 
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');

        return this.http.get(this._global.baseAPIUrl + 'sel_sp_classection/'+clcd+'/'+aycd)
            .map((data: any) => {

                //console.log=('log',data.classdata)
               // alert ( data.sp_classection);
                return data.sp_classection;
            })
    }


    ClasssecListlike(strlike:string):Observable<Array<Select2OptionData>>{
        debugger
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_classectionlike/'+strlike+'/'+clcd+'/'+aycd)
            .map((data: any) => {

                //console.log=('log',data.classdata)
               // alert ( data.sp_classection);
                return data.sp_classection;
            })
    }
    saveclassdtls(clsdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_masclass', clsdata)
            .map((data: any) => {
                console.log('retres', data);
                return data;
            });
    }

    //masssection started
    SectionList() {

        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_massection/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_massection;
            })
    }
    save_sp_massection(secdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_massection', secdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sp_massubcat started
    sel_sp_massubcat() {

        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_massubcat/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_massubcat;
            })
    }
    save_sp_massubcat(secdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_massubcat', secdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sp_massubgp started
    sel_sp_massubgp() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_massubgp/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_massubgp;
            })
    }
    save_sp_massubgp(secdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_massubgp', secdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }
   //hr departments started
   sel_sp_hrmdept() {
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    return this.http.get(this._global.baseAPIUrl + 'sel_sp_hrmdept/'+clcd+'/'+aycd)
        .map((data: any) => {
            return data.sp_hrmdept;
        })
}
save_sp_hrmdept(secdata: any): Observable<any> {
    return this.http.post(this._global.baseAPIUrl + 'save_sp_hrmdept', secdata)
        .map((data: any) => {
            console.log('retres', 'response');
            return data
        });
}
    //massubject started
    sel_sp_massubjects() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_massubjects/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_massubjects;
            })
    }
    save_sp_massubjects(secdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_massubjects', secdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sp_masasshead started
    sel_sp_masasshead() {

        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_masasshead/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_masasshead;
            })
    }
    save_sp_masasshead(secdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_masasshead', secdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sp_masasstype started
    sel_sp_masasstype() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_masasstype/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_masasstype;
            })
    }
    save_sp_masasstype(secdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_masasstype', secdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sp_masoccation started
    sel_sp_masoccation() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_masoccation/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_masoccation;
            })
    }
    save_sp_masoccation(secdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_masoccation', secdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sp_exmsubcomb started
    sel_sp_exmsubcomb() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_exmsubcomb/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_exmsubcomb;
            })
    }
    save_sp_exmsubcomb(secdata: any): Observable<any> {
       
        return this.http.post(this._global.baseAPIUrl + 'save_sp_exmsubcomb', secdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sp_accaccounthead started
    sel_sp_accaccounthead() {
         let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_accaccounthead/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_accaccounthead;
            })
    }
    save_sp_accaccounthead(secdata: any): Observable<any> {
        
        return this.http.post(this._global.baseAPIUrl + 'save_sp_accaccounthead', secdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sp_accaccountdept started
    sel_sp_accdept() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_accdept/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_accdept;
            })
    }
    save_sp_accdept(deptdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_accdept', deptdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sel_sp_accinstallments started
    sel_sp_accinstallments() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_accinstallment/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_accinstallments;
            })
    }
    save_sp_accinstallments(data: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_accinstallment', data)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sp_accpayoptions started
    sel_sp_accpayoptions() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_accpayoptions/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_accpayoptions;
            })
    }
    save_sp_accpayoptions(data: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_accpayoptions', data)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sp_accfeequota started
    sel_sp_accfeequota() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_accfeequota/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_accfeequota;
            })
    }
    save_sp_accfeequota(data: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_accfeequota', data)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sel_sp_acccompany started
    sel_sp_acccompany() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_acccompany/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_acccompany;
            })
    }
    save_sp_acccompany(data: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_acccompany', data)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }
    //sp_reportcard started

    save_sp_reportcard(modeldata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_reportcard', modeldata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }
    loop_reportcard(modeldata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'loop_reportcard', modeldata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }
    select_sp_reportcard(modeldata: any): Observable<any> {

        debugger
        return this.http.post(this._global.baseAPIUrl + 'select_sp_reportcard', modeldata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sp_masassmodel started

    save_sp_model(modeldata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_model', modeldata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }
    loop_model(modeldata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'loop_model', modeldata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }
    select_sp_model(modeldata: any): Observable<any> {

        debugger
        return this.http.post(this._global.baseAPIUrl + 'select_sp_model', modeldata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sp_accpayoptions started
    sel_sp_masclasssubject() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_masclasssubject/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_masclasssubject;
            })
    }

    by_sp_masclasssubject(clssubdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'by_sp_masclasssubject', clssubdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }
    save_sp_masclasssubject(clssubdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_masclasssubject', clssubdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sp_accpayoptions started
    sel_sp_assignment() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_assignment/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_homework;
            })
    }
    by_sp_assignment(asgnmtdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'by_sp_assignment', asgnmtdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }
    save_sp_assignment(clssubdata: any): Observable<any> {
        debugger;
        return this.http.post(this._global.baseAPIUrl + 'save_sp_assignment', clssubdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

 
            
             select_sp_marksdetail(modeldata: any): Observable<any> {
        
                debugger
                return this.http.post(this._global.baseAPIUrl + 'select_sp_marksdetail', modeldata)
                    .map((data: any) => {
                        console.log('retres', 'response');
                        return data
                    });
            }
    sel_sp_masmot() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_masmot/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_masmot;
            })
    }
    save_sp_masmot(asgnmtdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_masmot', asgnmtdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }

    //sp_mot started
    sel_sp_mashouse() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_mashouse/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_mashouse;
            })
    }
    save_sp_mashouse(asgnmtdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'save_sp_mashouse', asgnmtdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }


    save_admission(admdata: any): Observable<any> {

        debugger
        return this.http.post(this._global.baseAPIUrl + 'studentadmission', admdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data
            });
    }


    save_enquiry(admdata: any): Observable<any> {
        
                debugger
                return this.http.post(this._global.baseAPIUrl + 'enquiry', admdata)
                    .map((data: any) => {
                        console.log('retres', 'response');
                        return data
                    });
            }

    sel_students(clid:string,dbnm:string,tag:string) {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_students/'+clid+'/'+dbnm+'/'+tag+'/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.sp_mashouse;
            })
    }

    sel_enquiry(dbnm:string) {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'selenquiry/'+dbnm+'/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.enquiry;
            })
    }

    by_sp_student(clid:number,secid:number,dbnm:string,brid:string): Observable<any> {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sp_student/'+clid+'/'+secid+'/'+dbnm+'/'+clcd+'/'+aycd+'/'+brid)
            .map((data: any) => {
                console.log('retres', 'response');
                return data.by_sp_clsSec;
            });
    }

//attendance section started
    sel_sp_clmattendance() {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'sel_sp_clmattendance/'+clcd+'/'+aycd)
            .map((data: any) => {
                return data.spclmattendance;
            })
    }
    by_sp_clmattendance(attdtdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'by_sp_clmattendance', attdtdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data.byclmattendance;
            });
    }
    
    loop_clmattendance(attdtdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'loop_attendance', attdtdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data;
            });
    }

//attendance period started

    by_sp_clmattendanceperiod(attdtdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'by_sp_clmattendanceperiod', attdtdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data.byclmattendanceper;
            });
    }
    
    loop_clmattendanceperiod(attdtdata: any): Observable<any> {
        return this.http.post(this._global.baseAPIUrl + 'loop_attendanceperiod', attdtdata)
            .map((data: any) => {
                console.log('retres', 'response');
                return data;
            });
    }
    uploadFile(data: any): Observable<any> {
       /// this._url = 'http://localhost:4200/XXXXXXXXXX/uploadFile';


       console.log("stuid",data.stuid)
        return this.http.post(this._global.baseAPIUrl + 'upfile', data)
        .map((data: any) => {
            console.log('retres', data);
            return data
        });
    }
    sel_studocs(stuid:number) {
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        return this.http.get(this._global.baseAPIUrl + 'selstudocuments/'+stuid+'/'+clcd+'/'+aycd)
            .map((data: any) => {
                console.log('docs', data);
                return data.studocs;
            })
    }

    
    saveaccfeechart(admdata: any): Observable<any> {
        
                debugger
                return this.http.post(this._global.baseAPIUrl + 'saveaccfeechart', admdata)
                    .map((data: any) => {
                        console.log('retres', 'response');
                        return data
                    });
            }


            selaccfeechart(asgnmtdata: any): Observable<any> {
                return this.http.post(this._global.baseAPIUrl + 'selaccfeechart', asgnmtdata)
                    .map((data: any) => {
                        console.log('retres', 'response');
                        return data
                    });
            }



            getinvitems(dbnm:string) {
                debugger
               // alert(this._global.baseAPIUrl + 'getinvitems/'+dbnm);
               let clcd=localStorage.getItem('clcd');
               let aycd=localStorage.getItem('aycd');
                return this.http.get(this._global.baseAPIUrl + 'getinvitems/'+dbnm+'/'+clcd+'/'+aycd)
                    .map((data: any) => {
                        console.log('docs', data);
                        return data.invitems;
                    })
            }


            getitmgrp(dbnm:string) {
                debugger
                //alert(this._global.baseAPIUrl + 'getitemgrp/'+dbnm);
                let clcd=localStorage.getItem('clcd');
                let aycd=localStorage.getItem('aycd');
                return this.http.get(this._global.baseAPIUrl + 'getitemgrp/'+dbnm+'/'+clcd+'/'+aycd)
                    .map((data: any) => {
                        console.log('docs', data);
                        return data.itmgrp;
                    })
            }


            saveinvitem(admdata: any): Observable<any> {
                
                        debugger
                        return this.http.post(this._global.baseAPIUrl + 'save_items', admdata)
                            .map((data: any) => {
                                console.log('retres', 'response');
                                return data
                            });
                    }


                    getinvvendors(dbnm:string) {
                        debugger
                       // alert(this._global.baseAPIUrl + 'getinvitems/'+dbnm);
                       let clcd=localStorage.getItem('clcd');
                       let aycd=localStorage.getItem('aycd');
                        return this.http.get(this._global.baseAPIUrl + 'getvendorlst/'+dbnm+'/'+clcd+'/'+aycd)
                            .map((data: any) => {
                                console.log('docs', data);
                                return data.vendorlst;
                            })
                    }


                    savevendors(admdata: any): Observable<any> {
                        
                                debugger
                                return this.http.post(this._global.baseAPIUrl + 'save_vendors', admdata)
                                    .map((data: any) => {
                                        console.log('retres', 'response');
                                        return data
                                    });
                            }


                            serchbooks(sertext: any): Observable<any> {
                                let clcd=localStorage.getItem('clcd');
                                let aycd=localStorage.getItem('aycd');
                                let postdat={sertxt:sertext,clcd:clcd,aycd:aycd}
                                return this.http.post(this._global.baseAPIUrl + 'serchbook', postdat)
                                    .map((data: any) => {
                                        console.log('retres', data);
                                        return data.bookdetails;
                                    });
                            }


                            
                    issuebook(bookid: any): Observable<any> {
                        
                        debugger
                        // let clcd=localStorage.getItem('clcd');
                        //         let aycd=localStorage.getItem('aycd');
                        // var admdata={bookid:bookid,stuid:stuid,clcd:clcd,aycd:aycd}
                        return this.http.post(this._global.baseAPIUrl + 'issuebook', bookid)
                            .map((data: any) => {
                                console.log('retres', 'response');
                                return data
                            });
                    }

                    getissueddetails(stuid: any): Observable<any> {
                        let clcd=localStorage.getItem('clcd');
                        let aycd=localStorage.getItem('aycd');
                        let postdat={stuid:stuid,clcd:clcd,aycd:aycd}
                        return this.http.post(this._global.baseAPIUrl + 'getissueddetails', postdat)
                            .map((data: any) => {
                                console.log('retres', data);
                                return data.bookdetails;
                            });
                    }
    private handleData(res: Response) {
        let data = res;
        return data;
    }
    private handleError(error: Response | any) {
        return Observable.throw('API failed');
    }

}
