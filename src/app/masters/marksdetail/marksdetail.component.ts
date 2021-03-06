
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatSortModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';
import { MasterService } from './../../services/index';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-marksdetail',
  templateUrl: './marksdetail.component.html',
  styleUrls: ['../../shared/myc.style.css'],
  providers: [MasterService],
  encapsulation: ViewEncapsulation.None,
})
export class MarksDetailComponent {

  _postsArray: any[];
  modeldata: sp_mark[];
  dataSource: MatTableDataSource<sp_mark[]>;
  model: any = {};
  tempdbnm:string = "";
  oprtype: string = "update";
  asnamehead: string;
  subject: any = [];

  clssub: any = [];
  asshead: any = [];
  mascls: any = [];
  studata: any = [];
  massec: any = [];
  masbranch:any=[];
  masasstype: any = [];
  ayid: any = "0";
  tabledata: any = {};

  constructor(private http: HttpClient, private _global: AppGlobals, private SService: MasterService) { }
  ngOnInit() {
    //this.Getsel_sp_reportcard(); 
    this.model.clid = '31';
    this.model.secid = '1';
    this.model.assid = '4';
    this.model.asstypeId = '1';
    this.model.subid = this.model.subid;
    var mdata = {
      assid: this.model.clid, clid: this.model.secid,
      asstypeid: this.model.assid, subid: this.model.asstypeId, secid: this.model.subid
    };

  }
  displayedColumns = ['subname', 'maxscore', 'minscore', 'accscore','action'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

  ngAfterViewInit() {
    this.Getsel_sp_masasshead();
    this.Getclasslist();
    this.Getsel_sp_masasstype();
    this.GetSectionList();
  }

  deletefnc(modeldata: any) {
    this.model = modeldata;
    //this.model.dbnm = this.tempdbnm;
    this.model.oprtag = 'delete';
    console.log('deldata', this.model);
    this.SService.save_sp_reportcard(this.model)
      .subscribe(result => {
        console.log('ret', JSON.stringify(result));
        alert(result.message);
        // this.Getsel_sp_reportcard();
      }, error =>
        alert('error in connection')
      );
  }

  Getclasslist() {
    this.SService.ClassList()
      .subscribe(
      resultArray => {
        console.log('class-result', resultArray);
        this.mascls = resultArray;
        this.by_sp_student();
      },
      error => console.log("Error :: " + error)
      );
  }
  GetSectionList() {
    this.SService.SectionList()
      .subscribe(
      resultArray => {
        console.log('section-result', resultArray);
        this.massec = resultArray;
        this.by_sp_student();
      },
      error => console.log("Error :: " + error)
      );
  }

  getbranch() {
    this.SService.branch()
        .subscribe(
        resultArray => {
            console.log('branch-result', resultArray);
            this.masbranch = resultArray;
            if(resultArray.length>0)
            {
              this.model.brid=resultArray[0].id;
            }
            
        },
        error => console.log("Error :: " + error)
        )
  }
  Getsel_sp_masasshead() {
    this.SService.sel_sp_masasshead()
      .subscribe(
      resultArray => {
        console.log('asshead-result', resultArray);
        this.asshead = resultArray;
      },
      error => console.log("Error :: " + error)
      );
  }
  Getsel_sp_masasstype() {
    this.SService.sel_sp_masasstype()
      .subscribe(
      resultArray => {
        console.log('astypresult', resultArray);
        this.masasstype = resultArray;
      },
      error => console.log("Error :: " + error)
      );
  }
  by_sp_student() {
    debugger
   var dbnm = this.tempdbnm;
     var clid = this.model.clid;
     var secid = this.model.secid;
     var brid = this.model.brid;
     this.SService.by_sp_student(clid, secid, dbnm,brid)
      .subscribe(
      resultArray => {
        console.log('std-result', resultArray);
        this.studata = resultArray;        
      },
      error => console.log("Error :: " + error)
      );
  }
    
  // SelectSubjectDetails() {
  //   debugger
  //   var clid = this.model.clid;
  //   var clssubdata = { clid: clid };
  //   console.log('model-clssub', clssubdata);
  //   this.SService.by_sp_masclasssubject(clssubdata)
  //     .subscribe(resultArray => {
  //       console.log('ret-select', resultArray.by_sp_clsSub);
  //       this.clssub = resultArray.by_sp_clsSub;
  //       //alert (resultArray.message);

  //     }, error =>
  //       alert('error in connection')
  //     );
  //   this.closeAddExpenseModal.nativeElement.click();
  // }
  //this.clssub=resultArray;   

  SelectReportDetails(f: NgForm) {
    this.dataSource
    // var clid = this.model.clid;
    // var secid = this.model.secid;
    // var assid = this.model.assid;
    // var asstypeid = this.model.asstypeId;
    // var stuid = this.model.stuid;
    // var name = this.model.name;

    // var modeldata = { assid: assid, clid: clid, asstypeid: asstypeid, subid: stuid, secid: secid ,
    // name:name};
    //console.log('model',assid);   
    this.model.dbnm = this.tempdbnm;
    this.model = f.value;
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    this.model.clcd=clcd;
    this.model.aycd=aycd;
    console.log('model', this.model);
    this.SService.select_sp_marksdetail(this.model)
      .subscribe(resultArray => {
        console.log('ret-select', resultArray);
        this.dataSource = new MatTableDataSource(resultArray.by_sp_marksdetail);
        //alert (resultArray.message);

      }, error =>
        alert('error in connection')
      );

    this.closeAddExpenseModal.nativeElement.click();
  }

  checknumber(ele) {
    if (ele.accscore > ele.maxscore) {
      alert('Marks should be less than or equal to maxscore');
      ele.accscore = ele.accscore1;

      console.log("accscore1", ele.accscore1 + " & " + ele.accscore);
    }
    else {
      ele.accscore = parseFloat(ele.accscore).toFixed(2);
    }
  }

  MarksDetails() {
    console.log('testdata', this.dataSource.data);
    this.tabledata.loopdata = this.dataSource.data;
    this.tabledata.dbnm = this.tempdbnm;
    // this.tabledata.oprtag='update';
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    this.tabledata.clcd=clcd;
    this.tabledata.aycd=aycd;

    console.log('marks-data', this.tabledata);
    this.SService.loop_reportcard(this.tabledata)
      .subscribe(result => {
        console.log('ret-loop', result);
        alert(result.message);
        //this.Getsel_sp_masassmodel();
      }, error =>
        alert('error in connection')
      );
  }
}
export interface sp_mark {

  ayid: number;
  assid: number;
  clid: number;
  asstypeid: number;
  subid: number;
  stuid: number;
  secid: number;
  accscore: number;
  attstatus: string;
  maxscore: number;
  minscore: number;
  accscore1: number;
}