import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';

import { MasterService } from './../../services/index';

import { NgForm } from '@angular/forms';
@Component({

  selector: 'app-subgp',
  templateUrl: './stfdepartment.component.html',
  styleUrls: ['../../shared/myc.style.css'],
  providers:[MasterService],
  encapsulation: ViewEncapsulation.None,

})
export class StfdepartmentComponent {
_postsArray:any[];
clsdate:deptlst[];
dataSource: MatTableDataSource<deptlst[]>;
model: any = {};
tempdbnm:string="mycplvdev";
oprtype:string="update";
asnamehead:string;
//dataSource = new MatTableDataSource(ELEMENT_DATA);
constructor(private http: HttpClient, private _global: AppGlobals,private SService:MasterService) { }

  ngOnInit() {
    this.sel_sp_hrmdept();
   // this.dataSource.sort = this.sort;
  // console.log('date',this.clsdate);
   
  }
 
displayedColumns = ['action','code', 'name','act2'];
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
    this.model.depid=0;
    this.asnamehead='Add Class Details';
}
else if(cmd=='update')
{

    console.log('upddata',clsdata);
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
    this.SService.save_sp_massubgp(this.model)
.subscribe(result => {
    console.log('ret',JSON.stringify(result));
    alert (result.message);
    //this.alertmessage=result.message;

    this.sel_sp_hrmdept();
}, error => 
alert('error in connection')
//this.alertmessage='error in connection'
);
this.closeAddExpenseModal.nativeElement.click();
}

SaveSubgpDetails(f:NgForm)
{
    debugger
//alert ('hi');
var subgpid = this.model.depid;
var subgpnm = this.model.depnm;
var subgpcd = this.model.depcd;
//var fyear = this.user.fyear;


this.model=f.value;
let clcd=localStorage.getItem('clcd');
let aycd=localStorage.getItem('aycd');
this.model.clcd=clcd;
this.model.aycd=aycd;
var clsdata ={depid:subgpid, depnm:subgpnm,depcd:subgpcd,clcd:clcd,aycd:aycd,oprtag:this.oprtype};
console.log('model',clsdata);
this.SService.save_sp_hrmdept(clsdata)
.subscribe(result => {
    console.log('ret',JSON.stringify(result));
    alert (result.message);
    //this.alertmessage=result.message;

    this.sel_sp_hrmdept();
}, error => 
alert('error in connection')
//this.alertmessage='error in connection'
);

this.closeAddExpenseModal.nativeElement.click();

}
sel_sp_hrmdept()
{
  debugger
  this.SService.sel_sp_hrmdept()
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
export interface deptlst {
     depcd: string;
     depid: number;
     depnm: number;
}