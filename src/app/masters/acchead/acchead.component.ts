import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';

import { MasterService } from './../../services/index';

import { NgForm } from '@angular/forms';
@Component({

  selector: 'app-acchead',
  templateUrl: './acchead.component.html',
  styleUrls: ['../../shared/myc.style.css'],
  providers:[MasterService],
  encapsulation: ViewEncapsulation.None,

})
export class AccheadComponent {
   
    _postsArray:any[];
    secdate:accheadlst[];
    dataSource: MatTableDataSource<accheadlst[]>;
    model: any = {};
    tempdbnm:string="mycplvdev";
    oprtype:string="update";
    asnamehead:string;
    constructor(private http: HttpClient, private _global: AppGlobals,private SService:MasterService) { }
  ngOnInit() {
    this.Getsel_sp_accaccounthead();   
  }
 
displayedColumns = ['action','acccode', 'accname','act2'];
@ViewChild(MatSort, {static: true}) sort: MatSort;
@ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

ngAfterViewInit() {
  debugger
}
opendialog(secdate:any,cmd:string)
{
debugger
if(cmd=='insert')
{
    this.model={};
    this.model.accid=0;
    this.asnamehead='Add Class Details';
}
else if(cmd=='update')
{
    this.model=secdate;
    this.asnamehead='Modify Class Details';
}
this.oprtype=cmd;
}
 deletefnc(secdate:any)
{
  this.model=secdate;
  this.model.dbnm=this.tempdbnm;
  this.model.oprtag='delete';
  let clcd=localStorage.getItem('clcd');
  let aycd=localStorage.getItem('aycd');
  this.model.clcd=clcd;
  this.model.aycd=aycd;
  console.log('deldata',this.model);
  this.SService.save_sp_accaccounthead(this.model)
  .subscribe(result => {
  console.log('ret',JSON.stringify(result));
  alert (result.message);
  this.Getsel_sp_accaccounthead();
}, error => 
alert('error in connection')
);
}
SaveAccheadDetails(f:NgForm)
{
 debugger
 var accid = this.model.accid;
 var ag01  = this.model.ag01;
 var ag02  = this.model.ag01;
 var ag03  = this.model.ag01;
 var accname = this.model.accname;
 var acccode = this.model.acccode;
 var secdate ={accid:accid, ag01:ag01, ag02:ag02, ag03:ag03, accname:accname,scode:acccode,fyear:acccode};

    this.model=f.value;
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    this.model.clcd=clcd;
    this.model.aycd=aycd;
    console.log('model',this.model);
    this.SService.save_sp_accaccounthead(this.model)
    .subscribe(result => {
        console.log('ret',JSON.stringify(result));
        alert (result.message);
        this.Getsel_sp_accaccounthead();
    }, error => 
    alert('error in connection')
    );

this.closeAddExpenseModal.nativeElement.click();
}
Getsel_sp_accaccounthead()
{
  debugger
  this.SService.sel_sp_accaccounthead()
  .subscribe(
  resultArray =>{
  console.log('result',resultArray) ;
  this.dataSource = new MatTableDataSource(resultArray);
    },
error => console.log("Error :: " + error)
)
}
}
export interface accheadlst{
    accname: string;
    accid: number;
    acccode: number;
    ag01: string;
    ag02: string;
    ag03: string;
}