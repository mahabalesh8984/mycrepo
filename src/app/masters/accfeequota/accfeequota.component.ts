import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';

import { MasterService } from './../../services/index';

import { NgForm } from '@angular/forms';
@Component({

  selector: 'app-accfeequota',
  templateUrl: './accfeequota.component.html',
  styleUrls: ['../../shared/myc.style.css'],
  providers:[MasterService],
  encapsulation: ViewEncapsulation.None,

})
export class AccfeequotaComponent {

    _postsArray:any[];
    data:feequotalst[];
    dataSource: MatTableDataSource<feequotalst[]>;
    model: any = {};
    tempdbnm:string="MYCPLVDEV";
    oprtype:string="update";
    asnamehead:string;
    constructor(private http: HttpClient, private _global: AppGlobals,private SService:MasterService) { }
  ngOnInit() {
    this.Getsel_sp_accfeequota();   
  }
 
displayedColumns = ['action','feqtcd', 'feqtname','act2'];
@ViewChild(MatSort, {static: true}) sort: MatSort;
@ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

ngAfterViewInit() {
  debugger
}
opendialog(deptdata:any,cmd:string)
{
debugger
if(cmd=='insert')
{
    this.model={};
    this.model.feqtId=0;
    this.asnamehead='Add Class Details';
}
else if(cmd=='update')
{
    this.model=deptdata;
    this.asnamehead='Modify Class Details';
}
this.oprtype=cmd;
}
 deletefnc(deptdata:any)
{
  this.model=deptdata;
  this.model.dbnm=this.tempdbnm;
  this.model.oprtag='delete';
  let clcd=localStorage.getItem('clcd');
  let aycd=localStorage.getItem('aycd');
  this.model.clcd=clcd;
  this.model.aycd=aycd;
  console.log('deldata',this.model);
  this.SService.save_sp_accfeequota(this.model)
  .subscribe(result => {
  console.log('ret',JSON.stringify(result));
  alert (result.message);
  this.Getsel_sp_accfeequota();
}, error => 
alert('error in connection')
);
}
SaveDetails(f:NgForm)
{
 debugger
 var feqtId = this.model.feqtId;
 var feqtname = this.model.feqtname;
 var feqtcd = this.model.feqtcd;
 var deptdata ={feqtId:feqtId, feqtname:feqtname,scode:feqtcd,fyear:feqtcd};

    this.model=f.value;
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    this.model.clcd=clcd;
    this.model.aycd=aycd;
    console.log('model',this.model);
    this.SService.save_sp_accfeequota(this.model)
    .subscribe(result => {
        console.log('ret',JSON.stringify(result));
        alert (result.message);
        this.Getsel_sp_accfeequota();
    }, error => 
    alert('error in connection')
    );

this.closeAddExpenseModal.nativeElement.click();
}
Getsel_sp_accfeequota()
{
  debugger
  this.SService.sel_sp_accfeequota()
  .subscribe(
  resultArray =>{
  console.log('result',resultArray) ;
  this.dataSource = new MatTableDataSource(resultArray);
    },
error => console.log("Error :: " + error)
)
}
}
export interface feequotalst {
    feqtId: number;
    feqtcd: string;
    feqtname: string;
}