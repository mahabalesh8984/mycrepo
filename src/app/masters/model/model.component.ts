import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';
import { MasterService } from './../../services/index';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['../../shared/myc.style.css'],
  providers:[MasterService],
  encapsulation: ViewEncapsulation.None,
})
export class ModelComponent {
   _postsArray:any[];
    modeldata:sp_model[];
    dataSource: MatTableDataSource<sp_model[]>;
    model: any = {};
    tempdbnm:string="mycplvdev";
    oprtype:string="update";
    asnamehead:string;
    
    clssub:any=[];
    subject:any=[];
    asshead:any=[];
    mascls:any=[];
    massubcomb:any=[];
    masasstype:any=[];
    ayid:any="0";
    ddt:any=[{}];
    tabledata: any = {};

constructor(private http: HttpClient, private _global: AppGlobals,private SService:MasterService) { }
  ngOnInit() {
    //this.Getsel_sp_reportcard(); 
    this.model.clid ='31';
    this.model.subcbid ='4';
    this.model.assid ='4';
    this.model.asstypeId ='1';
    this.model.subid ='28';
    
   
  }
displayedColumns = ['action','maxscore', 'minscore'];
@ViewChild(MatSort, {static: true}) sort: MatSort;
@ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

ngAfterViewInit() {

this.Getsel_sp_masasshead();
this.Getclasslist();
this.Getsel_sp_masasstype();  
this.Getsel_sp_exmsubcomb();
}

 deletefnc(modeldata:any)
{
  this.model=modeldata;
  this.model.dbnm=this.tempdbnm;
  this.model.oprtag='delete';
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

Getclasslist()
{
  this.SService.ClassList()
  .subscribe(    
   resultArray =>{
    console.log('class-result',resultArray) ;
    this.mascls=resultArray;
    this.SelectClsSubDetails(this.model.clid);
    },
   error => console.log("Error :: " + error)
)
}
Getsel_sp_exmsubcomb()
{
  this.SService.sel_sp_exmsubcomb()
  .subscribe(    
   resultArray =>{
    console.log('subcomb-result',resultArray) ;
    this.massubcomb=resultArray;
    },
   error => console.log("Error :: " + error)
)
}
Getsel_sp_masasshead()
{
  this.SService.sel_sp_masasshead()
  .subscribe(
  resultArray =>{
  console.log('asshead-result',resultArray) ;
  this.asshead=resultArray;
    },
error => console.log("Error :: " + error)
)
} 
Getsel_sp_masasstype()
{
  this.SService.sel_sp_masasstype()
  .subscribe(
  resultArray =>{
  console.log('astypresult',resultArray) ;
  this.masasstype=resultArray;
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
 
SelectReportDetails(f:NgForm)
{
  debugger
 var clid = this.model.clid;
 var subcbid = this.model.subcbid;
 var assid = this.model.assid;
 var asstypeid = this.model.asstypeId; 
 var subid = this.model.subid;

var modeldata ={assid:assid,clid:clid,asstypeid:asstypeid,subid:subid,subcbid:subcbid};
    //console.log('model',assid);   
    this.model.dbnm=this.tempdbnm;    
    this.model=f.value;
    console.log('model',this.model);
    this.SService.select_sp_model(this.model)
    .subscribe(resultArray => {
        console.log('ret-select',resultArray);
         this.dataSource = new MatTableDataSource(resultArray.by_sp_model);
        //alert (resultArray.message);
        
    }, error => 
    alert('error in connection')
    );

this.closeAddExpenseModal.nativeElement.click();
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
   this.tabledata.oprtag='update';
  
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
}
export interface sp_model {
    ayid: number;
    assid: number;
    clid: number;
    asstypeid: number;
    subid: number;
    subcbid: number;
    maxscore: number;
    minscore: number;
    maxscore1: number;
    minscore1: number;
}