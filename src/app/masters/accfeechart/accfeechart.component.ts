import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';
import { MasterService } from './../../services/index';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-feechart',
  templateUrl: './accfeechart.component.html',
  styleUrls: ['../../shared/myc.style.css'],
  providers:[MasterService],
  encapsulation: ViewEncapsulation.None,
})
export class AccfeechartComponent {
   _postsArray:any[];
   // modeldata:sp_model[];
    dataSource: MatTableDataSource<any[]>;
    model: any = {};
    feemodel: any = {};
    tempdbnm:string="mycplvdev";
    oprtype:string="update";
    asnamehead:string;
    
    clssub:any=[];
    masins:any=[];
    asshead:any=[];
    mascls:any=[];
    masfeequta:any=[];
    maspayopt:any=[];
    ayid:any="0";
    ddt:any=[{}];
    tabledata: any = {};
    achead:any=[];

    admtype = [
        {value: '1', viewValue: 'NEW'},
        {value: '0', viewValue: 'OLD'},
       
        
      ];

      houses = [
        {value: '1', viewValue: 'Red'},
        {value: '2', viewValue: 'Green'},
        {value: '3', viewValue: 'Yellow'},
        {value: '4', viewValue: 'Blue'}
      ];
      public row: any = [{name:"vinay"}];

constructor(private http: HttpClient, private _global: AppGlobals,private SService:MasterService) { }
  ngOnInit() {
    //this.Getsel_sp_reportcard(); 
    // var admtypeid = this.model.admtypeid;
    // var feeqtid = this.model.feeqtid;
    // var payoptid = this.model.payoptid; 
    // var insid = this.model.insid;
    this.model.clid ='31';
    this.model.admtypeid ='0';
    this.model.feeqtid ='3';
    this.model.payoptid ='3';
    this.model.insid ='3';
    
   
  }
displayedColumns = ['action','Particulars', 'Company','Fees','act2'];
@ViewChild(MatSort, {static: true}) sort: MatSort;
@ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

ngAfterViewInit() {


this.Getclasslist();
this.feequota();
this.payoptions();
this.installments();
this.Getperticulars();
}

 deletefnc(modeldata:any)
{
  this.model=modeldata;
  this.model.dbnm=this.tempdbnm;
  this.model.oprtag='delete';
  let clcd=localStorage.getItem('clcd');
  let aycd=localStorage.getItem('aycd');
  this.model.clcd=clcd;
  this.model.aycd=aycd;
  console.log('deldata',this.model);
  this.SService.save_sp_model(this.model)
  .subscribe(result => {
  console.log('ret',JSON.stringify(result));
  alert (result.message);
 // this.Getsel_sp_reportcard();
}, error => 
alert('error in connection')
);
}


test()
{

  alert('hi');
  console.log('rowdata',JSON.stringify( this.row));
}

Getclasslist()
{
  this.SService.ClassList()
  .subscribe(    
   resultArray =>{
    console.log('class-result',resultArray) ;
    this.mascls=resultArray;
    //this.SelectClsSubDetails(this.model.clid);
    },
   error => console.log("Error :: " + error)
)
}


feequota()
{
  debugger
  this.SService.sel_sp_accfeequota()
  .subscribe(
  resultArray =>{
  console.log('result',resultArray) ;
  this.masfeequta=resultArray;
  //this.dataSource = new MatTableDataSource(resultArray);
    },
error => console.log("Error :: " + error)
)
}


payoptions()
{
  debugger
  this.SService.sel_sp_accpayoptions()
  .subscribe(
  resultArray =>{
  console.log('result',resultArray) ;
  this.maspayopt=resultArray;
  //this.dataSource = new MatTableDataSource(resultArray);
    },
error => console.log("Error :: " + error)
)
}

getaccounthead()
{
  debugger
  this.SService.sel_sp_accaccounthead()
  .subscribe(
  resultArray =>{
  console.log('result',resultArray) ;
  this.achead = resultArray;
    },
error => console.log("Error :: " + error)
)
}

installments()
{
  debugger
  this.SService.sel_sp_accinstallments()
  .subscribe(
  resultArray =>{
  console.log('result',resultArray) ;
  this.masins=resultArray;
    },
error => console.log("Error :: " + error)
)
}
SelectClsSubDetails(f: NgForm) {
        debugger
        var clid = this.model.clid;
        var clssubdata = { clid: clid };
        console.log('model-clssub', clssubdata);
        this.SService.by_sp_masclasssubject(clssubdata)
            .subscribe(resultArray => {
                console.log('ret-select', resultArray.by_sp_clsSub);
                this.clssub=resultArray.by_sp_clsSub; 
                //alert (resultArray.message);

            }, error =>
                alert('error in connection')
            );
        this.closeAddExpenseModal.nativeElement.click();
    }
                //this.clssub=resultArray;   
 
Getperticulars()
{
  debugger
 var clid = this.model.clid;
 var admtypeid = this.model.admtypeid;
 var feeqtid = this.model.feeqtid;
 var payoptid = this.model.payoptid; 
 var insid = this.model.insid;

var modeldata ={clid:clid,asstypeid:admtypeid,feeqtid:feeqtid,payoptid:payoptid,insid:insid};
    //console.log('model',assid);   
    this.model.dbnm=this.tempdbnm;    
    //this.model=f.value;
    console.log('model',this.model);
    this.SService.selaccfeechart(modeldata)
    .subscribe(resultArray => {
        console.log('ret-select',resultArray);
         this.dataSource = new MatTableDataSource(resultArray.accfeechartdata);
        //alert (resultArray.message);
        
    }, error => 
    alert('error in connection')
    );

//this.closeAddExpenseModal.nativeElement.click();
}


opendialog(deptdata:any,cmd:string)
{
debugger
if(cmd=='insert')
{
    this.getaccounthead();
    this.feemodel={};
    this.feemodel.accid='1';
    this.feemodel.feeamt=0;
    this.feemodel.coid='1';
    this.asnamehead='Add Class Details';
}
else if(cmd=='update')
{
    this.feemodel=deptdata;
    this.asnamehead='Modify Class Details';
}
this.oprtype=cmd;
}


savedetails(f:NgForm)
{

  var clid = this.model.clid;
  var admtypeid = this.model.admtypeid;
  var feeqtid = this.model.feeqtid;
  var payoptid = this.model.payoptid; 
  var insid = this.model.insid;
  var coid=f.value.coid;
  var accid=f.value.accid;
  var feeamt=f.value.feeamt;
  var oprtype=this.oprtype;
  var dbnm='myc0091819';
  let clcd=localStorage.getItem('clcd');
  let aycd=localStorage.getItem('aycd');

 
 var modeldata ={clid:clid,admtypeid:admtypeid,feeqtid:feeqtid,payoptid:payoptid,insid:insid,coid:coid,accid:accid,feeamt:feeamt,oprtype:oprtype,dbnm:dbnm,clcd:clcd,aycd:aycd};
 this.SService.saveaccfeechart(modeldata)
 .subscribe(resultArray => {
     console.log('ret-select',resultArray);
      //this.dataSource = new MatTableDataSource(resultArray.by_sp_model);
     alert ('clalled');
     
 }, error => 
 alert('error in connection')
 );

this.closeAddExpenseModal.nativeElement.click();

 console.log('modeldata',modeldata);
  
}
checknumber1(ele)
{
  if (ele.maxscore>100)
  {
   alert ('Marks should be less than or equal to 100(maxscore)') ;
   ele.maxscore =  ele.maxscore1;

   console.log("maxscore1",ele.maxscore1 + " & "+ele.maxscore);
  }
 }
checknumber2(ele)
{
  if(ele.minscore>ele.maxscore)
    {
      alert ('Marks should be less than or equal to maxscore') ;
      ele.minscore =  ele.minscore1;

      console.log("minscore1",ele.minscore1 + " & "+ele.minscore);
    }
 }
MarksDetails()
{
  debugger
  console.log('testdata',this.dataSource.data);
  this.tabledata.loopdata=this.dataSource.data;
  this.tabledata.dbnm=this.tempdbnm;
  // this.tabledata.oprtag='update';
  
  console.log('marks-data',this.tabledata);
  this.SService.loop_model(this.tabledata)
  .subscribe(result => {
  console.log('ret-loop',result);
  alert (result.message);
  //this.Getsel_sp_masassmodel();
}, error => 
alert('error in connection')
);
}


addRow() {
  this.row.push({});
}

// Delete Rows
deleteRow(index: number) {
  this.row.splice(index, 1);
}

// Get All Row Values
getRowValue() {
  console.log(this.row);
}
}
// export interface sp_model {
//     ayid: number;
//     assid: number;
//     clid: number;
//     asstypeid: number;
//     subid: number;
//     subcbid: number;
//     maxscore: number;
//     minscore: number;
//     maxscore1: number;
//     minscore1: number;
// }