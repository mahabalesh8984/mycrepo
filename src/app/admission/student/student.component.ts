import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import { MasterService } from './../../services/index';
import { NgbModal, ModalDismissReasons,NgbModalOptions,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {MatTableDataSource, MatSort ,MatSortModule,MatPaginator} from '@angular/material';
import {FormControl, FormGroupDirective, NgForm, Validators,FormControlDirective} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { Select2OptionData } from 'ng2-select2';
import { Observable } from 'rxjs/Observable';




export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({

  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css','../../shared/myc.style.css'],
  providers:[MasterService,FormGroupDirective,FormControlDirective],
  encapsulation: ViewEncapsulation.None,
  

  
})

export class StudentaddComponent implements OnInit {
    @ViewChild('closeBtn', {static: true}) closeBtn: ElementRef;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    emailFormControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);
  
    matcher = new MyErrorStateMatcher();
    // customClasses = {
    //     sortAscending: 'fa fa-sort-asc',
    //     sortDescending: 'fa fa-sort-desc',
    //     pagerLeftArrow: 'fa fa-chevron-left',
    //     pagerRightArrow: 'fa fa-chevron-right',
    //     pagerPrevious: 'fa fa-step-backward',
    //     pagerNext: 'fa fa-step-forward'
    // };

    tempdbnm:string="";
    loadingIndicator: boolean = false;
    reorderable: boolean = true;
    asnamehead:string;
    modalOption: NgbModalOptions = {}; 
    closeResult:string;
    masclass=[];
    massec:any=[];
    maspayopt:any=[];
    subcomb:any=[];
    fequota:any=[];
    masmot:any=[];
    displayedColumns = ['action','photo', 'name','rollno','dob','admno','stsno','motname','fatname','fatmobile','fatemail','action2'];
stuid:number=0;
    
    
    fData: FormData = new FormData;
    rows=[];
    date = new FormControl(new Date());

    student: any = {};
    model: any = {};
    private modalRef: NgbModalRef;
    private alertref: NgbModalRef;
    oprtype:string="update";
    alertmessage:string;
    tab=1;
    acYears = [
        
      ];


      houses = [
        {value: '1', viewValue: 'Red'},
        {value: '2', viewValue: 'Green'},
        {value: '3', viewValue: 'Yellow'},
        {value: '4', viewValue: 'Blue'}
      ];



      motlst = [
        {value: '1', viewValue: 'By Cycle'},
        {value: '2', viewValue: 'By School Transport'},
        {value: '3', viewValue: 'By Parent Pickup'}
       
      ];
      castecodes = [
        {value: 'GM', viewValue: 'GM'},
        {value: 'SC', viewValue: 'SC'},
        {value: 'ST', viewValue: 'ST'},
        {value: 'OBC', viewValue: 'OBC'}
      ];
      bgroops = [
        {value: 'A+', viewValue: 'A+'},
        {value: 'A-', viewValue: 'A-'},
        {value: 'B+', viewValue: 'B+'},
        {value: 'B-', viewValue: 'B-'},
        {value: 'AB+', viewValue: 'AB+'},
        {value: 'AB-', viewValue: 'AB-'},
        {value: 'O+', viewValue: 'O+'},
        {value: 'O-', viewValue: 'O-'},
      ];
    
      genders = [
        {value: 'M', viewValue: 'Male'},
        {value: 'F', viewValue: 'Female'},
       
        
      ];

      status = [
        {value: 'Active', viewValue: 'Active'},
        {value: 'Inactive', viewValue: 'Inactive'},
       
        
      ];

      doctypes = [
        {value: 'Student-Photo', viewValue: 'Student-Photo'},
        {value: 'Mother-photo', viewValue: 'Mother-photo'},
        {value: 'Father-photo', viewValue: 'Father-photo'},
        {value: 'Age-Proof', viewValue: 'Age-Proof'},
        {value: 'Address-proof', viewValue: 'Address-proof'},
        {value: 'Caste-Proof', viewValue: 'Caste-Proof'},
        {value: 'Quota-Proof', viewValue: 'Quota-Proof'},
        {value: 'Markscard-Proof', viewValue: 'Markscard-Proof'},
        {value: 'Other', viewValue: 'Other'},
       
        
      ];
      doclist=[];
      doctype:string;

      //public exampleData: Observable<Array<Select2OptionData>>;
      public exampleData: Array<Select2OptionData>;
      public startValue: string='1';
      public selected1: string;

      dataSource: MatTableDataSource<any[]>;
  constructor(private modalService: NgbModal,private masservice: MasterService,private SService:MasterService) { }
  

  ngOnInit() {

  
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
  this.tempdbnm="myc0091819";
  this.getclassec();
    this.classlist();
this.GetSectionList();
this.Getpayoptions();
this.Getfeequota();
this.Getubcomb();
this.Getaylist();
  }

  // ngAfterViewInit() {
  //   debugger
  //   this.getclassec();

    
  //    // this.dataSource.paginator = this.paginator;
  
  // }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  insertstudentdtls(fdata)
  {
    debugger;
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    fdata.clcd=clcd;
    fdata.aycd=aycd;
    console.log(JSON.stringify(fdata));
    

    this.SService.save_admission(fdata)
    .subscribe(result => {
        console.log('ret',JSON.stringify(result));
        alert (result.message);
        //this.alertmessage=result.message;
    
   // this.Getclasslist();
    }, error => 
    alert('error in connection')
    //this.alertmessage='error in connection'
    );

  }
  Getaylist() {
    this.masservice.getacademicyear()
        .subscribe(
        resultArray => {
            console.log('section-result', resultArray);
            this.acYears = resultArray;
            // if(resultArray.length>0)
            // {
            //  this.user.fyear=resultArray[0].id;
            // }
        },
        error => console.log("Error :: " + error)
        )
}
  public onpaging(evn) {
    debugger
    
}
  classlist()
  {
    debugger
    this.SService.ClassList()
    .subscribe(
      
     resultArray =>{
      console.log('result',resultArray) ;
      //this.clsdate=resultArray;
      this.masclass = resultArray;

      console.log('masclass',this.masclass);
      },
     error => console.log("Error :: " + error)
  )
  }
  GetSectionList()
  {
    debugger
    this.SService.SectionList()
    .subscribe(
      
     resultArray =>{
      console.log('result',resultArray) ;
      //this.clsdate=resultArray;
      this.massec = resultArray;
      },
     error => console.log("Error :: " + error)
  )
  }

  Getfeequota()
  {
    debugger
    this.SService.sel_sp_accfeequota()
    .subscribe(
    resultArray =>{
    console.log('result',resultArray) ;
    this.fequota = resultArray;
      },
  error => console.log("Error :: " + error)
  )
  }
  Getpayoptions()
{
  debugger
  this.SService.sel_sp_accpayoptions()
  .subscribe(
  resultArray =>{
  console.log('result',resultArray) ;
  this.maspayopt=resultArray;
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


getclasseclike(stlike)
{
  debugger
  this.SService. ClasssecListlike(stlike)
  .subscribe(
  resultArray =>{
  console.log('ClasssecList',resultArray) ;
  alert(resultArray);
  this.exampleData=resultArray;
    },
error => console.log("Error :: " + error)
)
}
Getubcomb()
{
  debugger
  this.SService.sel_sp_exmsubcomb()
  .subscribe(
    
   resultArray =>{
    console.log('result',resultArray) ;
    //this.clsdate=resultArray;
    this.subcomb =resultArray;
    },
   error => console.log("Error :: " + error)
)
}

getstudents(clid)
{
  debugger
  this.SService.sel_students(clid,this.tempdbnm,'selbyclsid')
  .subscribe(
    
   resultArray =>{
    console.log('result',resultArray) ;
    //this.clsdate=resultArray;
    
    this.dataSource = new MatTableDataSource(resultArray);
    this.dataSource.paginator = this.paginator;
    },
   error => console.log("Error :: " + error)
)
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

test()
{

  alert('test');
}
  opendialog(clsdata:any,cmd:string)
  {
  debugger
 // this.classlist();
  //this.GetSectionList();
  
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


  docdialog(clsdata:number)
  {
    debugger;
    this.stuid=clsdata;
    this.studocs(this.stuid);
  }

  upload(event: any) {
    let files = event.target.files;
    
   // let fData: FormData = new FormData;

    for (var i = 0; i < files.length; i++) {
        this.fData.append("file[]", files[i]);
    }
    // var _data = {
    //     filename: 'Sample File',
    //     id: '0001'
    // }

    this.fData.append("stuid", this.stuid.toString());
    this.fData.append("docpurpose", "Studentphoto");

    // this.SService.uploadFile(fData).subscribe(
    //     response => this.handleResponse(response),
    //     error => this.handleError(error)
    // )
}


fileupload()
{
debugger
  alert('upload service');
  var fd=this.fData;
console.log('file data',JSON.stringify(fd));

  this.SService.uploadFile(this.fData)
  .subscribe(fresult => {
     // console.log('ret',JSON.stringify(fresult));
      alert (fresult.message);
      
  }, error => 
  alert('error in connection')
  
  );
  this.fData.delete('file[]');
  this.fData.delete('stuid');
  this.fData.delete('docpurpose');

  this.studocs(this.stuid);
}


studocs(stuid)
{
  debugger
  this.SService.sel_studocs(stuid)
  .subscribe(
    
   resultArray =>{
    console.log('result',resultArray) ;
    this.doclist=resultArray;
    //this.dataSource = new MatTableDataSource(resultArray);
    },
   error => console.log("Error :: " + error)
)
}

}

export interface studentdata {
  name: string;
  fatname: string;
  fatmobile: string;
  rollno: number;
  // subid: number;
  // subcbid: number;
  // maxscore: number;
  // minscore: number;
  // maxscore1: number;
  // minscore1: number;
}