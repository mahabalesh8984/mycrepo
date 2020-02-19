import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import { MasterService,AccountService } from './../../services/index';
import { NgbModal, ModalDismissReasons,NgbModalOptions,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import {FormControl, FormGroupDirective, NgForm, Validators,FormControlDirective} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { Select2OptionData } from 'ng2-select2';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { animate, state, style, transition, trigger } from '@angular/animations';




// export class MyErroracreceipt implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

const  rows=[];
@Component({

  selector: 'app-acmiscpays',
  templateUrl: './acmiscpays.component.html',
  styleUrls: ['../../shared/myc.style.css','./acmiscpays.component.css'],
  providers:[MasterService,FormGroupDirective,FormControlDirective,AccountService],
  encapsulation: ViewEncapsulation.None,
  
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class MiscpaysComponent implements OnInit {
    @ViewChild('closeBtn', {static: true}) closeBtn: ElementRef;


    emailFormControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);
  
  //  matcher = new MyErroracreceipt();
    // customClasses = {
    //     sortAscending: 'fa fa-sort-asc',
    //     sortDescending: 'fa fa-sort-desc',
    //     pagerLeftArrow: 'fa fa-chevron-left',
    //     pagerRightArrow: 'fa fa-chevron-right',
    //     pagerPrevious: 'fa fa-step-backward',
    //     pagerNext: 'fa fa-step-forward'
    // };
    model:any={};
    
      isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
      expandedElement: any;
    tempdbnm:string="mycplvdev";
    loadingIndicator: boolean = false;
    reorderable: boolean = true;
    asnamehead:string;
    modalOption: NgbModalOptions = {}; 
    closeResult:string;
    masclass=[];
    mascompany=[];
    masdept=[];
    recdetails:any=[];
    recdetail:any={};

    coldetails:any={};
    
    displayedColumns = ['depnm','insnm', 'amount','paid','balance','action'];
stuid:number=0;
    
    
    fData: FormData = new FormData;
   
    date = new FormControl(new Date());

    student: any = {};
   // model: any = {};
    private modalRef: NgbModalRef;
    private alertref: NgbModalRef;
    oprtype:string="update";
    alertmessage:string;
    tab=1;
    admno:string;
    feequota:string;
    recdt:any;
    masachead=[];
      //public exampleData: Observable<Array<Select2OptionData>>;
      public exampleData: Array<Select2OptionData>;
      public startValue: string='1';
      public selected1: string;

      dataSource: MatTableDataSource<any[]>;

      mordet = [
        {value: 'CASH', viewValue: 'CASH'},
        {value: 'CHEQUE', viewValue: 'CHEQUE'},
        {value: 'DD', viewValue: 'DD'}
     
      ];
      @ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;
      @ViewChild('colformModal', {static: true}) colformModal: ElementRef;

      courseArray: any = [];
  //newCourseArray: any={rid: 0,name:'',year: '',remark:'',tag:'VA'};
    addCourseValue() {
        this.courseArray.push({accid:1,amount:0});
        console.log('this.courseArray',this.courseArray);
    }

    deleteCourseValue(index) {
        this.courseArray.splice(index, 1);
    }

  constructor(private modalService: NgbModal,private acservice: AccountService,private SService:MasterService) { }
  

  ngOnInit() {

 
    let recdt=new FormControl(new Date());
    this.model.recdt=recdt.value;
    console.log('recdt',this.model.recdt);
    this.accaccounthead();
  // this.exampleData = [
  //   {
  //     id: 'basic1',
  //     text: 'Basic 1'
  //   },
  //   {
  //     id: 'basic2',
  //     disabled: true,
  //     text: 'Basic 2'
  //   },
  //   {
  //     id: 'basic3',
  //     text: 'Basic 3'
  //   },
  //   {
  //     id: 'basic4',
  //     text: 'Basic 4'
  //   }
  // ];
   
// this.GetSectionList();
// this.Getpayoptions();
// this.Getfeequota();
// this.Getubcomb();
//this.getreceipts();
this.getcompany();
this.Getdepartment();
  }

  ngAfterViewInit() {
    debugger
    this.getclassec();
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  insertstudentdtls()
  {
    debugger;
    console.log(JSON.stringify(this.courseArray));

    

  }


  accaccounthead()
{
  debugger
  this.SService.sel_sp_accaccounthead()
  .subscribe(
  resultArray =>{
  console.log('result',resultArray) ;
  this.masachead = resultArray;
    },
error => console.log("Error :: " + error)
)
}
getcompany()
  {
    debugger
    this.SService.sel_sp_acccompany()
    .subscribe(
    resultArray =>{
    console.log('result',resultArray) ;
    //this.dataSource = new MatTableDataSource(resultArray);
    this.mascompany=resultArray;
      },
  error => console.log("Error :: " + error)
  )
  }
  

  Getdepartment()
{
  debugger
  this.SService.sel_sp_accdept()
  .subscribe(
  resultArray =>{
  console.log('result',resultArray) ;
  this.masdept = resultArray;
    },
error => console.log("Error :: " + error)
)
}


getclassec()
{
  debugger
  this.SService. ClasssecList()
  .subscribe(
  resultArray =>{
  console.log('ClasssecList',resultArray) ;
 // alert(resultArray);
  this.exampleData=resultArray;
  //this.startValue = '1';
    },
error => console.log("Error :: " + error)
)
}



getstudents(clid)
{
  debugger
  this.SService.sel_students(clid,this.tempdbnm,'selbyclsid_name')
  .subscribe(
    
   resultArray =>{
    console.log('result',resultArray) ;
    //this.clsdate=resultArray;
    //this.dataSource = new MatTableDataSource(resultArray);
    this.masclass = resultArray;

    if (resultArray.length>0)
    {
    this.model.stuid=resultArray[0].stuid;
    this.getreceipts();
    }


    else
    {
        this.model.stuid=0  
    }
    },
   error => console.log("Error :: " + error)
)
}

getrecdetails(rw)
{
  debugger
 

   this.acservice.Acreceiptdet(this.model.stuid,rw.deptid,rw.InsId,this.tempdbnm)
  
  //this.acservice.Acreceiptheader('1','1',this.tempdbnm)
  .subscribe(
    
   resultArray =>{
    console.log('result',resultArray) ;
    
    this.recdetails = resultArray;

   this.expandedElement=rw;
    },
   error => {console.log("Error :: " + error);
  
  alert('error while fetching results');}
)

}

Detailsedit(rw)
{
  debugger
  this.recdetail=rw;

//    this.acservice.Acreceiptdet(this.model.stuid,'1',rw.InsId,this.tempdbnm)
  
//   //this.acservice.Acreceiptheader('1','1',this.tempdbnm)
//   .subscribe(
    
//    resultArray =>{
//     console.log('result',resultArray) ;
    
//     this.recdetails = resultArray;

//    this.expandedElement=rw;
//     },
//    error => {console.log("Error :: " + error);
  
//   alert('error while fetching results');}
// )

}

getreceipts()
{
  debugger
  rows.splice(0,rows.length);

  // console.log('rows.length',rows.length);
  //rows.=[]  ;
  this.dataSource = null;
   this.acservice.Acreceiptheader(this.model.stuid,'1',this.tempdbnm)
  
  //this.acservice.Acreceiptheader('1','1',this.tempdbnm)
  .subscribe(
    
   resultArray =>{
    console.log('result',resultArray) ;
    //this.clsdate=resultArray;
    resultArray.forEach(element => rows.push(element, { detailRow: true, element }));
    this.dataSource = new MatTableDataSource(rows);
    //this.masclass = resultArray;

   
    },
   error => console.log("Error :: " + error)
)
}


SaveDetails(f:NgForm)
{
    debugger
//alert ('hi');
var clid = f.value.RecNo;
var clname = f.value.RecAmt;
var clcode = f.value.AccId;
var fyear = f.value.dbnm;
let clcd=localStorage.getItem('clcd');
let aycd=localStorage.getItem('aycd');

var clsdata ={RecNo:clid, RecAmt:clname,AccId:clcode,dbnm:fyear,clcd:clcd,aycd:aycd};



this.acservice.updatereceiptd(clsdata)
.subscribe(result => {
    console.log('ret',JSON.stringify(result));
    alert (result.message);
    //this.alertmessage=result.message;


}, error => 
alert('error in connection')
//this.alertmessage='error in connection'
);

this.closeAddExpenseModal.nativeElement.click();

}
// public changed(e: any): void {
//   debugger
//   this.selected1 = e.value;
//   alert(this.selected1);
//  // this.getstudents(this.selected1);
// }
 changed(e: any) {
  debugger
  this.selected1 = e.value;
 // alert(this.selected1);
 this.getstudents(this.selected1);
}

stuchanged()
{
this.getreceipts();

}
Savepartrec(f:NgForm)
{
  let clcd=localStorage.getItem('clcd');
  let aycd=localStorage.getItem('aycd');
  console.log('colform',f.value);
  var cdt,rdt;
  if (f.value.cqdt !="")
  {
cdt=this.acservice.converttodate( f.value.cqdt);
  }
  else
  {

    cdt="";
  }

  if (f.value.recdt !="")
  {
rdt=this.acservice.converttodate( f.value.recdt);
  }
  else
  {

    rdt="";
  }
  var recdata={RecAmt:f.value.RecAmt,bknm:f.value.bknm,cqdt:cdt,cqno:f.value.cqno,dbnm:f.value.dbnm,deptid:f.value.deptid,ifsc:f.value.ifsc,insid:f.value.insid,mor:f.value.mor,recdt:rdt,recno:f.value.recno,stuid:f.value.stuid,clcd:clcd,aycd:aycd};


  this.acservice.savepartreceipt(recdata)
  .subscribe(result => {
      console.log('ret',JSON.stringify(result));
      alert (result.message);
      //this.alertmessage=result.message;
  this.getreceipts();
  
  }, error => 
  alert('error in connection')
  //this.alertmessage='error in connection'
  );

  this.colformModal.nativeElement.click();
}

test()
{

  alert('test');
}
  opendialog(clsdata:any,cmd:string)
  {
  debugger
  
  if(cmd=='insert')
  {
      this.student={};
      this.student.stuId=0;
      this.student.enqid=0;
      this.student.oprtag=cmd;
      this.student.dbnm=this.tempdbnm;
      this.asnamehead='Add Class Details';
  }
  else if(cmd=='update')
  {
      this.student=clsdata;


      console.log('date',this.date)
      console.log('date2',clsdata.dob)
     
     let fdob=new FormControl(new Date(clsdata.dob));
     let fdoa=new FormControl(new Date(clsdata.doa));
    
     console.log('date3',fdob)
      this.student.dob=fdob.value;
      this.student.doa=fdoa.value;
      this.student.enqid=0;
      this.student.oprtag=cmd;
      this.student.dbnm=this.tempdbnm;
      this.asnamehead='Modify Class Details';
  }
  this.oprtype=cmd;
  
  }


  opencoldialog(colrw)
  {

    this.coldetails.recno=colrw.recno;
    this.coldetails.cqdt='';
    this.coldetails.cqno='';
    this.coldetails.ifsc='';
    this.coldetails.bknm='';
    this.coldetails.mor='CASH';
    this.coldetails.deptid=colrw.deptid;
    this.coldetails.insid=colrw.InsId;
    this.coldetails.stuid=this.model.stuid;

  }



}

