import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';

import { MasterService } from './../../services/index';

import { NgForm } from '@angular/forms';
@Component({

  selector: 'app-subcomb',
  templateUrl: './subcomb.component.html',
  styleUrls: ['../../shared/myc.style.css'],
  providers:[MasterService],
  encapsulation: ViewEncapsulation.None,

})
export class SubcombComponent {
_postsArray:any[];
clsdate:subcomblst[];
dataSource: MatTableDataSource<subcomblst[]>;
model: any = {};
tempdbnm:string="mycplvdev";
oprtype:string="update";
asnamehead:string;
//dataSource = new MatTableDataSource(ELEMENT_DATA);
constructor(private http: HttpClient, private _global: AppGlobals,private SService:MasterService) { }

  ngOnInit() {
    this.Getsel_sp_exmsubcomb();
   
  }
 
displayedColumns = ['action', 'sucbnm','act2'];

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
    this.model.sucbid=0;
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
 
  this.model=clsdata;
   this.model.dbnm=this.tempdbnm;
  this.model.oprtag='delete';
  let clcd=localStorage.getItem('clcd');
  let aycd=localStorage.getItem('aycd');
  this.model.clcd=clcd;
  this.model.aycd=aycd;
  console.log('deldata',this.model);
    this.SService.save_sp_exmsubcomb(this.model)
.subscribe(result => {
    console.log('ret',JSON.stringify(result));
    alert (result.message);
    //this.alertmessage=result.message;

    this.Getsel_sp_exmsubcomb();
}, error => 
alert('error in connection')
//this.alertmessage='error in connection'
);

}

SaveSubcombDetails(f:NgForm)
{
    debugger
//alert ('hi');
var sucbid = this.model.sucbid;
var sucbnm = this.model.sucbnm;
//var fyear = this.user.fyear;
var clsdata ={sucbid:sucbid, sucbnm:sucbnm};

this.model=f.value;
let clcd=localStorage.getItem('clcd');
let aycd=localStorage.getItem('aycd');
this.model.clcd=clcd;
this.model.aycd=aycd;
console.log('model',this.model);
this.SService.save_sp_exmsubcomb(this.model)
.subscribe(result => {
    console.log('ret',JSON.stringify(result));
    alert (result.message);
    //this.alertmessage=result.message;

    this.Getsel_sp_exmsubcomb();
}, error => 
alert('error in connection')
//this.alertmessage='error in connection'
);

this.closeAddExpenseModal.nativeElement.click();

}
Getsel_sp_exmsubcomb()
{
  debugger
  this.SService.sel_sp_exmsubcomb()
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
export interface subcomblst{
     sucbnm: string;
     sucbid: number;
}