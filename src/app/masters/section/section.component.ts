import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';

import { MasterService } from './../../services/index';

import { NgForm } from '@angular/forms';
@Component({

  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['../../shared/myc.style.css'],
  providers:[MasterService],
  encapsulation: ViewEncapsulation.None,

  
})

export class SectionComponent {
   // @ViewChild('closeBtn') closeBtn: ElementRef;
   //dataSource:any;
//   constructor() { }
_postsArray:any[];
clsdate:seclst[];
dataSource: MatTableDataSource<seclst[]>;
model: any = {};
tempdbnm:string="mycplvdev";
oprtype:string="update";
asnamehead:string;
//dataSource = new MatTableDataSource(ELEMENT_DATA);
constructor(private http: HttpClient, private _global: AppGlobals,private SService:MasterService) { }

  ngOnInit() {
    this.GetSectionList();
   // this.dataSource.sort = this.sort;
  // console.log('date',this.clsdate);
   
  }
 
displayedColumns = ['action','seccode', 'secname','act2'];
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


opendialog(clsdata:any,cmd:string)
{
debugger

if(cmd=='insert')
{
    this.model={};
    this.model.secid=0;
    this.asnamehead='Add Class Details';
}
else if(cmd=='update')
{
    this.model=clsdata;
    this.asnamehead='Modify Class Details';
}
this.oprtype=cmd;

}
 deletefnc(clsdata:any)
{
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
  this.model=clsdata;
   this.model.dbnm=this.tempdbnm;
  this.model.oprtag='delete';
  this.model.clcd=clcd;
  this.model.aycd=aycd;
  console.log('deldata',this.model);
    this.SService.save_sp_massection(this.model)
.subscribe(result => {
    console.log('ret',JSON.stringify(result));
    alert (result.message);
    //this.alertmessage=result.message;

    this.GetSectionList();
}, error => 
alert('error in connection')
//this.alertmessage='error in connection'
);

}

SavesectionDetails(f:NgForm)
{
    debugger
//alert ('hi');
let clcd=localStorage.getItem('clcd');
let aycd=localStorage.getItem('aycd');
var secid = this.model.secid;
var secname = this.model.secname;
var seccode = this.model.seccode;
//var fyear = this.user.fyear;
var clsdata ={secid:secid, secname:secname,scode:seccode,fyear:seccode};

this.model=f.value;
this.model.clcd=clcd;
this.model.aycd=aycd;
console.log('model',this.model);
this.SService.save_sp_massection(this.model)
.subscribe(result => {
    console.log('ret',JSON.stringify(result));
    alert (result.message);
    //this.alertmessage=result.message;

    this.GetSectionList();
}, error => 
alert('error in connection')
//this.alertmessage='error in connection'
);

this.closeAddExpenseModal.nativeElement.click();

}
GetSectionList()
{
  debugger
  this.SService.SectionList()
  .subscribe(
    
   resultArray =>{
    console.log('result',resultArray) ;
    //this.clsdate=resultArray;
    this.dataSource = new MatTableDataSource(resultArray);
    },
   error => console.log("Error :: " + error)
)
}
}
export interface seclst{
   secname: string;
   secid: number;
   seccode: number;
}