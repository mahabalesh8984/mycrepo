import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';

import { MasterService } from './../../services/index';

import { NgForm } from '@angular/forms';
@Component({

  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['../../shared/myc.style.css'],
  providers:[MasterService],
  encapsulation: ViewEncapsulation.None,

})
export class CompanyComponent {

    _postsArray:any[];
    secdate:companylst[];
    dataSource: MatTableDataSource<companylst[]>;
    model: any = {};
    tempdbnm:string="mycplvdev";
    oprtype:string="update";
    asnamehead:string;
    constructor(private http: HttpClient, private _global: AppGlobals,private SService:MasterService) { }
  ngOnInit() {
    this.Getsel_sp_acccompany();   
  }
 
displayedColumns = ['action','cocd', 'conm','act2'];
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
    this.model.coid=0;
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
  this.SService.save_sp_acccompany(this.model)
  .subscribe(result => {
  console.log('ret',JSON.stringify(result));
  alert (result.message);
  this.Getsel_sp_acccompany();
}, error => 
alert('error in connection')
);
}
SaveOccationDetails(f:NgForm)
{
 debugger
 var coid = this.model.coid;
 var conm = this.model.conm;
 var cocd = this.model.cocd;
 var secdate ={coid:coid, conm:conm, scode:cocd,fyear:cocd};

    this.model=f.value;
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    this.model.clcd=clcd;
    this.model.aycd=aycd;
    console.log('model',this.model);
    this.SService.save_sp_acccompany(this.model)
    .subscribe(result => {
        console.log('ret',JSON.stringify(result));
        alert (result.message);
        this.Getsel_sp_acccompany();
    }, error => 
    alert('error in connection')
    );

this.closeAddExpenseModal.nativeElement.click();
}
Getsel_sp_acccompany()
{
  debugger
  this.SService.sel_sp_acccompany()
  .subscribe(
  resultArray =>{
  console.log('result',resultArray) ;
  this.dataSource = new MatTableDataSource(resultArray);
    },
error => console.log("Error :: " + error)
)
}
}

export interface companylst{
    coid: number;
    cocd: string;
    conm: string;
    copnm: string;
    codrno: string;
    cobunm: string;
    costreet: string;
    coarea: string;
    cocity: string;
    copin: string;
    costate: string;
    cocountry: string;
    cotel: string;
    cormk: string;
    cologo: string;
    coemail: string;
    cowebsite: string;
    imagepathip: string;
    comobile: string;
    conmdisp: string;
    smsurl: string;
    lvmobile: string;
    prplnm: string;
    disecode: string;
    cogroup: string;
    prplsign: string;
    prplremark: string;

}