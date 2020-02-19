import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatSortModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';
import { MasterService } from './../../services/index';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-reportcard',
  templateUrl: './reportcard.component.html',
  styleUrls: ['../../shared/myc.style.css'],
  providers: [MasterService],
  encapsulation: ViewEncapsulation.None,
})
export class ReportcardComponent {
  _postsArray: any[];
  modeldata: sp_report[];
  dataSource: MatTableDataSource<sp_report[]>;
  model: any = {};
  tempdbnm: string = "myc0091819";
  oprtype: string = "update";
  asnamehead: string;
  subject: any = [];

  clssub: any = [];
  asshead: any = [];
  mascls: any = [];
  massec: any = [];
  masbranch:any=[];
  studata: any = [];
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
    this.model.stuid = '1';
    this.model.subid = this.model.subid;
    var mdata = {
      assid: this.model.clid, clid: this.model.secid,
      asstypeid: this.model.assid, subid: this.model.asstypeId, secid: this.model.subid
    };

  }
  displayedColumns = ['name', 'maxscore', 'minscore', 'accscore','action'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

  ngAfterViewInit() {
    this.Getsel_sp_masasshead();
    this.Getclasslist();
    this.Getsel_sp_masasstype();
    this.GetSectionList();
    this.by_sp_student(this.model);
  }

  deletefnc(modeldata: any) {
    this.model = modeldata;
    this.model.dbnm = this.tempdbnm;
    this.model.oprtag = 'delete';
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    this.model.clcd=clcd;
    this.model.aycd=aycd;
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
        this.SelectClsSubDetails(this.model.clid);
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
      },
      error => console.log("Error :: " + error)
      );
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
  by_sp_student(model: any) {
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
  SelectClsSubDetails(f: NgForm) {
    debugger
    var clid = this.model.clid;
    //var name = this.studata.name;
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    
    var clssubdata = { clid: clid,clcd:clcd,aycd:aycd };
    console.log('model-clssub', clssubdata);
    this.SService.by_sp_masclasssubject(clssubdata)
      .subscribe(resultArray => {
        console.log('ret-select', resultArray.by_sp_clsSub);
        this.clssub = resultArray.by_sp_clsSub;
        //alert (resultArray.message);

      }, error =>
        alert('error in connection')
      );
    //this.closeAddExpenseModal.nativeElement.click();
  }
  //this.clssub=resultArray;   

  SelectReportDetails() {
    var clid = this.model.clid;
    var secid = this.model.secid;
    var assid = this.model.assid;
    var asstypeid = this.model.asstypeId;
    var subid = this.model.subid;
    //var stuid = this.studata.stuid;
    //var name = this.studata.name;
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');


    var modeldata = { assid: assid, clid: clid, asstypeid: asstypeid, subid: subid, secid: secid,clcd:clcd,aycd:aycd };
    //console.log('model',assid);   
    this.model.dbnm = this.tempdbnm;
   // this.model = f.value;
    console.log('model', modeldata);
    this.SService.select_sp_reportcard(modeldata)
      .subscribe(resultArray => {
        console.log('ret-select', resultArray);
        this.dataSource = new MatTableDataSource(resultArray.by_sp_reportcard);
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

    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    this.tabledata.clcd=clcd;
    this.tabledata.aycd=aycd;
    // this.tabledata.oprtag='update';

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
export interface sp_report {
  ayid: number;
  assid: number;
  clid: number;
  asstypeid: number;
  subid: number;
  stuid: number;
  name: string;
  secid: number;
  accscore: number;
  attstatus: string;
  maxscore: number;
  minscore: number;
  accscore1: number;
}