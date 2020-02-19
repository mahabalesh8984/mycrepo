import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';

import { MasterService } from './../../services/index';

import { NgForm } from '@angular/forms';
@Component({

  selector: 'app-occation',
  templateUrl: './occation.component.html',
  styleUrls: ['../../shared/myc.style.css'],
  providers:[MasterService],
  encapsulation: ViewEncapsulation.None,

})
export class OccationComponent {
 
    _postsArray:any[];
    secdate:sp_occation[];
    dataSource: MatTableDataSource<sp_occation[]>;
    model: any = {};
    tempdbnm:string="mycplvdev";
    oprtype:string="update";
    asnamehead:string;
    constructor(private http: HttpClient, private _global: AppGlobals,private SService:MasterService) { }
  ngOnInit() {
    this.Getsel_sp_masoccation();   
  }
 
displayedColumns = ['action','occcode', 'occname','act2'];
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
    this.model.occid=0;
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
  this.SService.save_sp_masoccation(this.model)
  .subscribe(result => {
  console.log('ret',JSON.stringify(result));
  alert (result.message);
  this.Getsel_sp_masoccation();
}, error => 
alert('error in connection')
);
}
SaveOccationDetails(f:NgForm)
{
 debugger
 var occid = this.model.occid;
 var occname = this.model.occname;
 var occcode = this.model.occcode;
 var occtag = this.model.occtag;
 var secdate ={occid:occid, occname:occname, scode:occcode,fyear:occcode};

    this.model=f.value;
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    this.model.clcd=clcd;
    this.model.aycd=aycd;
    console.log('model',this.model);
    this.SService.save_sp_masoccation(this.model)
    .subscribe(result => {
        console.log('ret',JSON.stringify(result));
        alert (result.message);
        this.Getsel_sp_masoccation();
    }, error => 
    alert('error in connection')
    );

this.closeAddExpenseModal.nativeElement.click();
}
Getsel_sp_masoccation()
{
  debugger
  this.SService.sel_sp_masoccation()
  .subscribe(
  resultArray =>{
  console.log('result',resultArray) ;
  this.dataSource = new MatTableDataSource(resultArray);
    },
error => console.log("Error :: " + error)
)
}
}

export interface sp_occation {
    occcode: number;
    occid: number;
    occname: number;
    occtag: string;
}