import { Component, OnInit,ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import { MasterService } from './../../services/index';
import { NgbModal, ModalDismissReasons,NgbModalOptions,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {MatTableDataSource, MatSort ,MatSortModule} from '@angular/material';
import {FormControl, FormGroupDirective, NgForm, Validators,FormControlDirective} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { Select2OptionData } from 'ng2-select2';
import { Observable } from 'rxjs/Observable';




export class MyErrorStateMatcher1 implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({

  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css','../../shared/myc.style.css'],
  providers:[MasterService,FormGroupDirective,FormControlDirective],
  encapsulation: ViewEncapsulation.None,
  

  
})

export class EnquiryComponent implements OnInit {
    @ViewChild('closeBtn', {static: true}) closeBtn: ElementRef;


    emailFormControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);
  
    matcher = new MyErrorStateMatcher1();
    // customClasses = {
    //     sortAscending: 'fa fa-sort-asc',
    //     sortDescending: 'fa fa-sort-desc',
    //     pagerLeftArrow: 'fa fa-chevron-left',
    //     pagerRightArrow: 'fa fa-chevron-right',
    //     pagerPrevious: 'fa fa-step-backward',
    //     pagerNext: 'fa fa-step-forward'
    // };

    tempdbnm:string="myc0091819";
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
    displayedColumns = ['action', 'name','fatname','fatmobile','act2'];

    rows=[];
    date = new FormControl(new Date());

    student: any = {};
    stuadm:any={};
    model: any = {};
    private modalRef: NgbModalRef;
    private alertref: NgbModalRef;
    oprtype:string="update";
    alertmessage:string;
    tab=1;
    acYears = [
        {value: '1', viewValue: '2017-2018'},
        {value: '2', viewValue: '2018-2019'},
        {value: '3', viewValue: '2019-2000'}
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
        {value: 'Enquired', viewValue: 'Enquired'},
        {value: 'Enrolled', viewValue: 'Enrolled'},
       
        
      ];
      stustatus = [
        {value: 'Active', viewValue: 'Active'},
        {value: 'Inactive', viewValue: 'Inactive'},
       
        
      ];
      //public exampleData: Observable<Array<Select2OptionData>>;
      public exampleData: Array<Select2OptionData>;
      public startValue: string;
      public selected1: string;

      dataSource: MatTableDataSource<any[]>;
  constructor(private modalService: NgbModal,private masservice: MasterService,private SService:MasterService) { }

  ngOnInit() {

   //this.getclassec();
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
  this.getstudents();
    this.classlist();
 this.GetSectionList();
 this.Getpayoptions();
this.Getfeequota();
 this.Getubcomb();
  }


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

    this.SService.save_enquiry(fdata)
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

  saveadmdtls(fdata)
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

  classlist()
  {
    debugger
    this.SService.ClassList()
    .subscribe(
      
     resultArray =>{
      console.log('result',resultArray) ;
      //this.clsdate=resultArray;
      this.masclass = resultArray;

      console.log(this.masclass);
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


// getclassec()
// {
//   debugger
//   this.SService. ClasssecList()
//   .subscribe(
//   resultArray =>{
//   console.log('ClasssecList',resultArray) ;
//   alert(resultArray);
//   this.exampleData=resultArray;
//   this.startValue = '1';
//     },
// error => console.log("Error :: " + error)
// )
// }


// getclasseclike(stlike)
// {
//   debugger
//   this.SService. ClasssecListlike(stlike)
//   .subscribe(
//   resultArray =>{
//   console.log('ClasssecList',resultArray) ;
//   alert(resultArray);
//   this.exampleData=resultArray;
//     },
// error => console.log("Error :: " + error)
// )
// }
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

getstudents()
{
  debugger
  this.SService.sel_enquiry(this.tempdbnm)
  .subscribe(
    
   resultArray =>{
    console.log('result',resultArray) ;
    //this.clsdate=resultArray;
    this.dataSource = new MatTableDataSource(resultArray);
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
//  changed(e: any) {
//   debugger
//   this.selected1 = e.value;
//   alert(this.selected1);
//  this.getstudents(this.selected1);
// }

// test()
// {

//   alert('test');
// }
  opendialog(clsdata:any,cmd:string)
  {
  debugger
  
  if(cmd=='insert')
  {
      this.student={};
      this.student.enid=0;
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
     let fdoa=new FormControl(new Date(clsdata.endt));
    
     console.log('date3',fdob)
      this.student.dob=fdob.value;
      this.student.endt=fdoa.value;
      this.student.oprtag=cmd;
      this.student.dbnm=this.tempdbnm;
      this.asnamehead='Modify Class Details';
  }
  this.oprtype=cmd;
  
  }




  admdialog(enqdata:any,cmd:string)
  {
  debugger
  

  //{"enid":"2","ayid":"1","endt":"2018-03-06T13:00:00.000Z","name":"teststudent","dob":{"validator":null,"asyncValidator":null,"pristine":true,"touched":false,"_onDisabledChange":[],"_onChange":[],"_pendingValue":null,"value":null,"status":"VALID","errors":null,"valueChanges":{"_isScalar":false,"observers":[],"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false},"statusChanges":{"_isScalar":false,"observers":[],"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"__isAsync":false}},"gender":"M","clid":"42","preinstitute":"sdsdsds","inplace":"agadi collage","preacscore":"60","fatname":"aa","fatedu":"xcxcx","fatprof":"xcxcx","fatmobile":"1212121211","fatemail":"wewewe@fg.com","motname":"xcxcx","motedu":"xcxcxc","motprof":"xcxc","motmobile":"1212121256","motemail":"rest@123.c","gardname":"xcxcx","gardrelation":"xxcxc","gardmobile":"2334344545","mothertoungue":"kannada","address":"sdsdsdsdsd","caste":"caste","refname":"gfgfgf","refmobile":"1222222222","enstatus":"Enquired","enremarks":"asdasdd","linedt":"2018-03-13 17:47:19","oprtag":"insert","dbnm":"mycplvdev"}
  let fdob=new FormControl(new Date(enqdata.dob));
  //let fdoa=new FormControl(new Date(enqdata.endt));
 this.stuadm.name=enqdata.name;
 this.stuadm.dob=fdob.value;
 this.stuadm.caste=enqdata.caste;
 this.stuadm.gender=enqdata.gender;
 this.stuadm.fatname=enqdata.fatname;
 this.stuadm.fatprofession=enqdata.fatprof;
 this.stuadm.fatmobile=enqdata.fatmobile
 this.stuadm.fatemail=enqdata.fatemail;
 this.stuadm.motname=enqdata.motname;
 this.stuadm.motprofession=enqdata.motprof;
 this.stuadm.motmobile=enqdata.motmobile;
 this.stuadm.motemail=enqdata.motemail;
 this.stuadm.admclid=enqdata.clid;
 this.stuadm.clid=enqdata.clid;
 this.stuadm.address=enqdata.address;
 this.stuadm.mothertongue=enqdata.mothertoungue;
 this.stuadm.stuId=0;
 this.stuadm.adayid=1;
 this.stuadm.doa='';
 this.stuadm.admno='';
 this.stuadm.bloodgroup='O+';
 this.stuadm.nationality='Indian';
 this.stuadm.religion='';
 this.stuadm.subcaste='';
 this.stuadm.aadharno='';
 this.stuadm.category='GM';
 this.stuadm.stustatush='Active';
 this.stuadm.enqid=enqdata.enid;
 this.stuadm.stsno='';
 this.stuadm.rollno='';
 this.stuadm.city='';
 this.stuadm.state='Karnataka';
 this.stuadm.pincode='';
 this.stuadm.feqid=0;
 this.stuadm.payoptid=0;
 this.stuadm.mot='By Cycle';
 this.stuadm.payopttranid=0;
 this.stuadm.rootno='';
 this.stuadm.locdist='';
 this.stuadm.secid=1;
 this.stuadm.house='';
 this.stuadm.subcombid=1;
 this.stuadm.country='India';
 this.stuadm.house='';
 this.stuadm.house='';
 this.stuadm.house='';
 
// {"stuId":"14","admno":"31","adayid":"2","doa":"2018-03-11T13:00:00.000Z","name":"sidram","dob":"2018-02-28T13:00:00.000Z","gender":"M","bloodgroup":"AB+","nationality":"INDIAN",
// "religion":"Hindu","caste":"vaishnava","subcaste":"u","aadharno":"4535345234143346","mothertongue":"kannada","category":"GM",
// "fatname":"BASAVA","fatedu":null,
//   // "fatprofession":"NILAMBIKA","fatorg":null,"fatdesig":null,"fatincome":null,"motname":"FORMER","motprofession":"HouseWife",
//   "gdnm":null,"gdrelation":null,"stustatush":"Active","dol":null,"linedt":null,"admclid":"41","slno":null,"enqid":null,
//   "stsno":"31","rollno":"31","address":"r m k y u s g j k y","city":"bang","pincode":"560056","state":"kar",
//   "fatemail":"b@gmail.com","motemail":"m@gmail.com","gardmobile":"","fatmobile":"454545","motmobile":"454545",
//"feqid":"1","payoptid":"3","mot":"By Cycle","pndid":null,"payopttranid":"1","tpfeeid":null,"rootno":"24","locdist":"200","lastdt":null,
//"clid":"31","secid":"1","house":"Red","subcombid":"4","country":"ind","class":"GRADE-1","oprtag":"update","dbnm":"mycplvdev"}
  
 this.stuadm.oprtag='insert';
 this.stuadm.dbnm=this.tempdbnm;
  console.log('admdata',JSON.stringify( this.stuadm));
  }
}

export interface Enqdata {
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