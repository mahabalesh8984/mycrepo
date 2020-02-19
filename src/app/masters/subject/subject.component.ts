import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';

import { MasterService } from './../../services/index';

import { NgForm } from '@angular/forms';
@Component({

  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['../../shared/myc.style.css','./subject.component.css'],
  providers:[MasterService],
  encapsulation: ViewEncapsulation.None,

})
export class SubjectComponent {
 _postsArray:any[];
clsdate:subjectlst[];
dataSource: MatTableDataSource<subjectlst[]>;
model: any = {};
tempdbnm:string="mycplvdev";
oprtype:string="update";
asnamehead:string;


    subcat:any=[];
    subgp:any=[];
    dfsubcdid:number;dfsubgpid:number;

//dataSource = new MatTableDataSource(ELEMENT_DATA);
constructor(private http: HttpClient, private _global: AppGlobals,private SService:MasterService) { }

  ngOnInit() {
    this.Getsel_sp_massubjects();
    this.Getsel_sp_massubcat();
    this.Getsel_sp_massubgp();
   // this.dataSource.sort = this.sort;
  // console.log('date',this.clsdate);
   
  }
 
displayedColumns = ['action','subcode', 'subname','act2'];
//
//
@ViewChild(MatSort, {static: true}) sort: MatSort;
@ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

/**
 * Set the sort after the view init since this component will
 * be able to query its view for the initialized sort.
 */
ngAfterViewInit() {
  debugger
  
}
bindselected(seldata)
  {
this.model=seldata;
console.log('bindvalue',this.model);
  }

opendialog(clsdata:any,cmd:string)
{
debugger

if(cmd=='insert')
{
    this.model={};
    this.model.subid=0;
    this.asnamehead='Add Class Details';
    this.model.subcaId=this.dfsubcdid;
    this.model.subgpId=this.dfsubgpid;
}
else if(cmd=='update')
{
    this.model=clsdata;
    this.asnamehead='Modify Class Details';
}
this.oprtype=cmd;
 this.bindselected(this.model);

}
 deletefnc(clsdata:any)
{
 
  this.model=clsdata;
   this.model.dbnm=this.tempdbnm;
  this.model.oprtag='delete';
  let clcd=localStorage.getItem('clcd');
  let aycd=localStorage.getItem('aycd');
  this.model.clcd=clcd;
  this.model.aycd=aycd;

  console.log('deldata',this.model);
    this.SService.save_sp_massubjects(this.model)
.subscribe(result => {
    console.log('ret',JSON.stringify(result));
    alert (result.message);
    //this.alertmessage=result.message;

    this.Getsel_sp_massubjects();
}, error => 
alert('error in connection')
//this.alertmessage='error in connection'
);

}

SaveSubjectDetails(f:NgForm)
{
    debugger
//alert ('hi');
var subid = this.model.subid;
var subname = this.model.subname;
var subcode = this.model.subcode;
//var fyear = this.user.fyear;
var clsdata ={subid:subid, subname:subname,scode:subcode,fyear:subcode};

this.model=f.value;
let clcd=localStorage.getItem('clcd');
let aycd=localStorage.getItem('aycd');
this.model.clcd=clcd;
this.model.aycd=aycd;
console.log('model',this.model);
this.SService.save_sp_massubjects(this.model)
.subscribe(result => {
    console.log('ret',JSON.stringify(result));
    alert (result.message);
    //this.alertmessage=result.message;

    this.Getsel_sp_massubjects();
}, error => 
alert('error in connection')
//this.alertmessage='error in connection'
);

this.closeAddExpenseModal.nativeElement.click();

}
Getsel_sp_massubjects()
{
  debugger
  this.SService.sel_sp_massubjects()
  .subscribe(
    
   resultArray =>{
    console.log('result',resultArray) ;
    //this.clsdate=resultArray;
    this.dataSource = new MatTableDataSource(resultArray);
    },
   error => console.log("Error :: " + error)
)
}
Getsel_sp_massubgp()
{
  debugger
  this.SService.sel_sp_massubgp()
  .subscribe(
    
   resultArray =>{
    console.log('result',resultArray) ;
    //this.clsdate=resultArray;
    //this.dataSource = new MatTableDataSource(resultArray);
    this.subgp=resultArray;
    this.dfsubgpid=resultArray[0].subgpid;

    },
   error => console.log("Error :: " + error)
)
}
Getsel_sp_massubcat()
{
  debugger
  this.SService.sel_sp_massubcat()
  .subscribe(
    
   resultArray =>{
    console.log('result',resultArray) ;
    //this.clsdate=resultArray;
    //this.dataSource = new MatTableDataSource(resultArray);
    this.subcat=resultArray;
    this.dfsubcdid=resultArray[0].subcaid;
    },
   error => console.log("Error :: " + error)
)
}
}
export interface subjectlst {
     subname: string;
     subid: number;
     subcode: number;  
}