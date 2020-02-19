import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';

import { MasterService } from './../../services/index';

import { NgForm } from '@angular/forms';
@Component({

  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['../../shared/myc.style.css','./vendor.component.css'],
  providers:[MasterService],
  encapsulation: ViewEncapsulation.None,

  
})

export class VendorsComponent implements OnInit {
    // @ViewChild('closeBtn') closeBtn: ElementRef;
   //dataSource:any;
//   constructor() { }
_postsArray:any[];
clsdate:any[];
dataSource: MatTableDataSource<any[]>;
model: any = {};
tempdbnm:string="mycplvdev";
oprtype:string="update";
asnamehead:string;
itmgrp:any[];
status = [
    {value: 'Active', viewValue: 'Active'},
    {value: 'Inactive', viewValue: 'Inactive'},
   
    
  ];
//dataSource = new MatTableDataSource(ELEMENT_DATA);
constructor(private http: HttpClient, private _global: AppGlobals,private SService:MasterService) { }

  ngOnInit() {
    
    this.getitmgrp();
    this.Getclasslist();
   // this.dataSource.sort = this.sort;
  // console.log('date',this.clsdate);
   
  }
 
displayedColumns = ['action','vname', 'telno','mobile','email','website','status','act2'];
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
    this.model.vnid=0;
    
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
 debugger
  this.model=clsdata;
   this.model.dbnm=this.tempdbnm;
  this.model.oprtag='delete';
  let clcd=localStorage.getItem('clcd');
  let aycd=localStorage.getItem('aycd');
  this.model.clcd=clcd;
  this.model.aycd=aycd;
  console.log('deldata',this.model);
    this.SService.saveinvitem(this.model)
.subscribe(result => {
    console.log('ret',JSON.stringify(result));
    alert (result.message);
    //this.alertmessage=result.message;

    this.Getclasslist();
}, error => 
alert('error in connection')
//this.alertmessage='error in connection'
);

}

SaveclassDetails(f:NgForm)
{
    debugger


console.log('subvalue',f.value);
this.model=f.value;
let clcd=localStorage.getItem('clcd');
let aycd=localStorage.getItem('aycd');
this.model.clcd=clcd;
this.model.aycd=aycd;
this.SService.savevendors(this.model)
.subscribe(result => {
    console.log('ret',JSON.stringify(result));
    alert (result.message);
    //this.alertmessage=result.message;

this.Getclasslist();
}, error => 
alert('error in connection')
//this.alertmessage='error in connection'
);

this.closeAddExpenseModal.nativeElement.click();

}
Getclasslist()
{
  debugger
  this.SService.getinvvendors(this.tempdbnm)
  .subscribe(
    
   resultArray =>{
    console.log('result',resultArray) ;
    //this.clsdate=resultArray;
    this.dataSource = new MatTableDataSource(resultArray);
    },
   error => console.log("Error :: " + error)
)
}


getitmgrp()
{
  debugger
  this.SService.getitmgrp(this.tempdbnm)
  .subscribe(
    
   resultArray =>{
    console.log('result',resultArray) ;
    this.itmgrp=resultArray;
    //this.dataSource = new MatTableDataSource(resultArray);
    },
   error => console.log("Error :: " + error)
)
}
}

