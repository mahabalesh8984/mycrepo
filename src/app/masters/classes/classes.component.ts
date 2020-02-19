import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';

import { MasterService } from './../../services/index';

import { NgForm } from '@angular/forms';
@Component({

  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['../../shared/myc.style.css','./classes.component.css'],
  providers:[MasterService],
  encapsulation: ViewEncapsulation.None,

  
})

export class ClassesComponent implements OnInit {
    // @ViewChild('closeBtn') closeBtn: ElementRef;
   //dataSource:any;
//   constructor() { }
_postsArray:any[];
clsdate:classlst[];
dataSource: MatTableDataSource<classlst[]>;
model: any = {};
tempdbnm:string="mycplvdev";
oprtype:string="update";
asnamehead:string;
//dataSource = new MatTableDataSource(ELEMENT_DATA);
constructor(private http: HttpClient, private _global: AppGlobals,private SService:MasterService) { }

  ngOnInit() {
    this.Getclasslist();
   // this.dataSource.sort = this.sort;
  // console.log('date',this.clsdate);
   
  }
 
displayedColumns = ['action','clcode', 'clname','act2'];
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
    this.model.clid=0;
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
 let clcd=localStorage.getItem('clcd');
 let aycd=localStorage.getItem('aycd');
  this.model=clsdata;
   this.model.dbnm=this.tempdbnm;
  this.model.oprtag='delete';
  this.model.clcd=clcd;
  this.model.aycd=aycd;

  console.log('deldata',this.model);
    this.SService.saveclassdtls(this.model)
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
//alert ('hi');
let clcd=localStorage.getItem('clcd');
let aycd=localStorage.getItem('aycd');
var clid = this.model.clid;
var clname = this.model.clname;
var clcode = this.model.clcode;
//var fyear = this.user.fyear;
var clsdata ={clid:clid, clname:clname,scode:clcode,fyear:clcode,clcd:clcd,aycd:aycd};

//console.log(f.value.clcode);
//this.closeModal();
this.model=f.value;

this.model.clcd=clcd;
this.model.aycd=aycd;
console.log('model',this.model);
this.SService.saveclassdtls(this.model)
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
  this.SService.ClassList()
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

export interface classlst {
  clname: string;
  clid: number;
  clcode: number;
}
//  export interface Element {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }
// }
// const ELEMENT_DATA: Element[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
//   {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
//   {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
//   {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
//   {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
//   {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
//   {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
//   {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
//   {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
//   {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
//   {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
// ];