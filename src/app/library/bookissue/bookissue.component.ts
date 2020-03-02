import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatSortModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MasterService } from './../../services/index';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Router,ActivatedRoute } from '@angular/router';



export interface bookdata {
  bookid: string;
  booktitle: string;
  bookcategory: string;
  author: string;
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};



@Component({
  selector: 'app-bookissue',
  templateUrl: './bookissue.component.html',
  styleUrls: ['./bookissue.component.css','../../shared/myc.style.css'],
  providers: [MasterService,DatePipe],
  encapsulation: ViewEncapsulation.None,
  
})
export class BookissueComponent implements OnInit {

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<any[]>;

  color = 'accent';
  checked = 1;
  modeldata: attp_lst[];
  dataSource: MatTableDataSource<any[]>;
  model: any = {};
  detmodel: any = {};
  tempdbnm: string = "mycplvdev";
  oprtype: string = "update";
  mascls: any = [];
  massec: any = [];
  masbranch: any = [];
  clssub: any = [];
  studata: any = [];
  serboks:bookdata[]=[];
  asnamehead: string;
  tabledata: any = {};
  selitem: bookdata ;
  selbooktitle:string='';
  selbookid:bigint;

  acYears = [
    {value: 'return', viewValue: 'Return'},
    {value: 'renew', viewValue: 'Renew'},
  
  ];

  finereasons = [
    {value: 'NONE', viewValue: 'None'},
    {value: 'Latefee', viewValue: 'Latefee'},
    {value: 'Damaged', viewValue: 'Damaged'},
  
  ];
  
  constructor(private http: HttpClient, private datePipe: DatePipe, private _global: AppGlobals, private SService: MasterService,private route:Router) { }
  ngOnInit() {
  
      this.model.clid = '1';
      this.model.secid = '1';
      this.model.stuid = '0';
      var attdt = new Date();
      var dates = this.datePipe.transform(attdt, "yyyy-MM-dd")
      this.detmodel.recdt = dates
      console.log(this.datePipe.transform(attdt, "yyyy-MM-dd")); //output : 2018-02-13

      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }
  displayedColumns = ['booktitle', 'issue', 'due', 'cnt','status','commands'];
  //displayedColumns = [ 'attstatus'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

  ngAfterViewInit() {
    this.getbranch();
      this.Getclasslist();
      this.GetSectionList();
      this.by_sp_student();
      //this.SaveAttdDetails();
  }
  private _filter(value: string): bookdata[] {
    const filterValue = value.toLowerCase();
    this.SService.serchbooks(filterValue)
          .subscribe(
          resultArray => {
              console.log('class-result', resultArray);
              this.serboks = resultArray;
             
              
          },
          error => console.log("Error :: " + error)
          )
return this.serboks;
    //return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  AutoCompleteDisplay(item: any): string {
    if (item == undefined) { return }
    return  item.booktitle;
    
  }
  replacebook(bookid)
  {

    this.route.navigate(['/app/books', bookid]);
    //this.route.navigateByUrl('/books/'+bookid);
  }

  Addbook()
  {
    //alert(this.selbooktitle+'-'+this.selbookid);
    var clid = this.model.clid;
    var subid = this.model.stuid;
    var secid = this.model.secid;
    var retdt = this.detmodel.recdt;
    var oprtype = 'issuebook';
    
   // var dbnm = this.tempdbnm;
    //var oprtag = this.model.oprtag;
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    
    var asgnmtdata = {clid: clid,  secid: secid,stuid:subid, retdt: retdt, oprtype: oprtype, clcd:clcd,aycd:aycd,id:this.detmodel.id,bookid:this.selbookid };
    console.log('asgnmtdata-SAVE', asgnmtdata);
    this.SService.issuebook(asgnmtdata)
    .subscribe(result => {
        console.log('ret',JSON.stringify(result));
        alert (result.message);
        this.getissueddetails();
        //this.alertmessage=result.message;
    
   // this.Getclasslist();
    }, error => 
    alert('error in connection')
    //this.alertmessage='error in connection'
    );
  }
  OnHumanSelected(selitem) {
    console.log('### Trigger');
    console.log(selitem);
    console.log(this.selitem);
    this.selbookid=selitem.bookid;
    this.selbooktitle=selitem.booktitle;
    
  }


  onstudentchange()
  {

    this.getissueddetails();
  }

  getissueddetails() {
    this.SService.getissueddetails(this.model.stuid)
        .subscribe(
        resultArray => {
            console.log('issueddata', resultArray);
            this.dataSource = resultArray;
            
            
        },
        error => console.log("Error :: " + error)
        )
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
  Getclasslist() {
      this.SService.ClassList()
          .subscribe(
          resultArray => {
              console.log('class-result', resultArray);
              this.mascls = resultArray;
              if(resultArray.length>0)
              {
                this.model.clid=resultArray[0].clid;
              }
              
          },
          error => console.log("Error :: " + error)
          )
  }
  GetSectionList() {
      this.SService.SectionList()
          .subscribe(
          resultArray => {
              console.log('section-result', resultArray);
              this.massec = resultArray;
              if(resultArray.length>0)
              {
                this.model.clid=resultArray[0].secid;
              }
          },
          error => console.log("Error :: " + error)
          )
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
              if(resultArray.length>0)
              {
                this.model.stuid=resultArray[0].secid;
              }
          },
          error => console.log("Error :: " + error)
          );
  }

  opendialog(deptdata: any, cmd: string) {

        this.detmodel = deptdata;
        this.model.oprtag="update";
        this.detmodel.amount=0;
        this.detmodel.reason='NONE';
       // this.model.hwid=deptdata.hwid;
        this.asnamehead = 'Return/Renew Book';
   
    //this.oprtype = cmd;
}


  SaveDetails(f: NgForm) {
    debugger
    var clid = this.model.clid;
    var subid = this.model.stuid;
    var secid = this.model.secid;
    var retdt = this.detmodel.recdt;
    var oprtype = this.detmodel.oprtype;
    
   // var dbnm = this.tempdbnm;
    //var oprtag = this.model.oprtag;
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    
    var asgnmtdata = {clid: clid,  secid: secid,stuid:subid, retdt: retdt, oprtype: oprtype, clcd:clcd,aycd:aycd,id:this.detmodel.id,bookid:this.detmodel.bookid,
      reason:this.detmodel.reason,amount:this.detmodel.amount
    };
    console.log('asgnmtdata-SAVE', asgnmtdata);
    this.SService.issuebook(asgnmtdata)
        .subscribe(resultArray => {
            // console.log('ret-by', resultArray);
            // this.dataSource = new MatTableDataSource(resultArray);

            alert(resultArray.message);
           this.getissueddetails()
            //this.SaveAsgnmtDetails();

        }, error =>
            alert('error in connection')
        );
}
}

export interface attp_lst {
  stuid: number;
  ayid: number;
  clid: number;
  secid: number;
  subid: number;
  rollno: number;
  attdt: string;
  attstatus: number;
  attrmk: string;
name:string;
  routeno: number;
  type: string;
  attstatusaf: number;
  vcid: number;
  assid: number;
}