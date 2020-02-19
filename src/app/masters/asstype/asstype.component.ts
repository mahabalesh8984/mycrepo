import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';
import { MasterService } from './../../services/index';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-asstype',
  templateUrl: './asstype.component.html',
  styleUrls: ['../../shared/myc.style.css'],
  providers:[MasterService],
  encapsulation: ViewEncapsulation.None,
})

export class AsstypeComponent {
 
    _postsArray:any[];
    secdate:sp_asstype[];
    dataSource: MatTableDataSource<sp_asstype[]>;
    model: any = {};
    tempdbnm:string="mycplvdev";
    oprtype:string="update";
    asnamehead:string;
    constructor(private http: HttpClient, private _global: AppGlobals,private SService:MasterService) { }
  ngOnInit() {
    this.Getsel_sp_masasstype();   
  }
 
displayedColumns = ['action','asstypecode', 'asstypename','act2'];
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
    this.model.asstypeId=0;
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
  this.SService.save_sp_masasstype(this.model)
  .subscribe(result => {
  console.log('ret',JSON.stringify(result));
  alert (result.message);
  this.Getsel_sp_masasstype();
}, error => 
alert('error in connection')
);
}
SaveAsstypeDetails(f:NgForm)
{
 debugger
 var asstypeId = this.model.asstypeId;
 var asstypename = this.model.asstypename;
 var asstypecode = this.model.asstypecode;
 var secdate ={asstypeId:asstypeId, asstypename:asstypename,scode:asstypecode,fyear:asstypecode};

    this.model=f.value;
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    this.model.clcd=clcd;
    this.model.aycd=aycd;
    console.log('model',this.model);
    this.SService.save_sp_masasstype(this.model)
    .subscribe(result => {
        console.log('ret',JSON.stringify(result));
        alert (result.message);
        this.Getsel_sp_masasstype();
    }, error => 
    alert('error in connection')
    );

this.closeAddExpenseModal.nativeElement.click();
}
Getsel_sp_masasstype()
{
  debugger
  this.SService.sel_sp_masasstype()
  .subscribe(
  resultArray =>{
  console.log('result',resultArray) ;
  this.dataSource = new MatTableDataSource(resultArray);
    },
error => console.log("Error :: " + error)
)
}
}

export interface sp_asstype {
    asstypename: string;
    asstypeId: number;
    asstypecode: number;
}