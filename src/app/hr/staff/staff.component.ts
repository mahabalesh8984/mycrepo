import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { HrService } from './../../services/index';
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource, MatSort, MatSortModule } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators, FormControlDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Select2OptionData } from 'ng2-select2';
import { Observable } from 'rxjs/Observable';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css', '../../shared/myc.style.css'],
  providers: [HrService, FormGroupDirective, FormControlDirective],
  encapsulation: ViewEncapsulation.None,
})

export class StaffComponent implements OnInit {
  @ViewChild('closeBtn', {static: true}) closeBtn: ElementRef;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  prid: number;
  tag: string;
  public row: any = [{name:"vinay"}];

  // fieldArray started
  fieldArray: any = [];
  //newAttribute: any={rid: 0,corid:'',perc: '',board: '',strid: '',attempts: '',institute: '',place: '',medium: ''};

  addFieldValue() {
        this.fieldArray.push({rid: 0,corid:'',perc: '',board: '',strid: '',attempts: '',institute: '',place: '',medium: ''});
        console.log('this.fieldArray',this.fieldArray);
    }
  deleteFieldValue(index) {
        this.fieldArray.splice(index, 1);
    }

// expArray started
  expArray: any = [];
  //newExpArray: any={rid: 0,institute:'',frdt:'',todt:'',post:'',rmk:''};
    addExpValue() {
        this.expArray.push({rid: 0,institute:'',frdt:'',todt:'',post:'',rmk:''});
        console.log('this.expArray',this.expArray);
    }

    deleteExpValue(index) {
        this.expArray.splice(index, 1);
    }
// awrdArray
  awrdArray: any = [];
  //newAwrdArray: any={rid: 0,name:'',year: '',remark:'',tag:'AW'};
    addAwrdValue() {
        this.awrdArray.push({rid: 0,name:'',year: '', remark:'',tag:'AW'})
        console.log('this.awrdArray',this.awrdArray);
    }

    deleteAwrdValue(index) {
        this.awrdArray.splice(index, 1);
    }
// courseArray
  courseArray: any = [];
  //newCourseArray: any={rid: 0,name:'',year: '',remark:'',tag:'VA'};
    addCourseValue() {
        this.courseArray.push({rid: 0,name:'',year: '',remark:'',tag:'VA'})
        console.log('this.courseArray',this.courseArray);
    }

    deleteCourseValue(index) {
        this.courseArray.splice(index, 1);
    }

  tempdbnm: string = "mycplvdev";
  loadingIndicator: boolean = false;
  reorderable: boolean = true;
  asnamehead: string;
  modalOption: NgbModalOptions = {};
  closeResult: string;
  hrmdeptarr = [];
  hrmdesigarr = [];
  hrmemcatarr = [];
  hrmlevelsegarr = [];
  acminstitutearr = [];
  hrmprofileqarr = [];
  emid: number = 0;  
  displayedColumns = ['action', 'emnm', 'depnm', 'doj', 'gender', 'blood', 'statush','act2'];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;
  rows = [];
  date = new FormControl(new Date());

  staff: any = {};
  field: any = {};
  exp: any = {};
  awrd: any = {};
  model: any = {};
  private modalRef: NgbModalRef;
  private alertref: NgbModalRef;
  oprtype: string = "update";
  alertmessage: string;
  tab = 1;
  acYears = [
    { value: '1', viewValue: '2017-2018' },
    { value: '2', viewValue: '2018-2019' },
    { value: '3', viewValue: '2019-2000' }
  ];
  houses = [
    { value: '1', viewValue: 'Red' },
    { value: '2', viewValue: 'Green' },
    { value: '3', viewValue: 'Yellow' },
    { value: '4', viewValue: 'Blue' }
  ];
  motlst = [
    { value: '1', viewValue: 'By Cycle' },
    { value: '2', viewValue: 'By School Transport' },
    { value: '3', viewValue: 'By Parent Pickup' }

  ];
  castecodes = [
    { value: 'GM', viewValue: 'GM' },
    { value: 'SC', viewValue: 'SC' },
    { value: 'ST', viewValue: 'ST' },
    { value: 'OBC', viewValue: 'OBC' }
  ];
  bldgps = [
    { value: 'A+', viewValue: 'A+' },
    { value: 'A-', viewValue: 'A-' },
    { value: 'B+', viewValue: 'B+' },
    { value: 'B-', viewValue: 'B-' },
    { value: 'AB+', viewValue: 'AB+' },
    { value: 'AB-', viewValue: 'AB-' },
    { value: 'O+', viewValue: 'O+' },
    { value: 'O-', viewValue: 'O-' },
  ];

  gndr = [
    { value: 'M', viewValue: 'Male' },
    { value: 'F', viewValue: 'Female' },
  ];
  mstatus = [
    { value: 'Married', viewValue: 'Married' },
    { value: 'Unmarried', viewValue: 'Unmarried' },
  ];
  strm = [
    { value: '1', viewValue: 'Regular' },
    { value: '2', viewValue: 'Open University' },
    { value: '3', viewValue: 'Correspondence' },
  ];
  // sttsh = [
  //   { value: 'Active', viewValue: 'Active' },
  //   { value: 'Inactive', viewValue: 'Inactive' },


  // ];

  dataSource: MatTableDataSource<any[]>;
  constructor(private modalService: NgbModal, private masservice: HrService, private SService: HrService) { }

  ngOnInit() {
    debugger
    this.getstaffs();
    this.hrmdeptlist();
    this.hrmdesiglist();
    this.hrmemcatlist();
    this.hrmlevelseglist();
    this.staff.statush = "Active";
  }
  acminstitutelist() {
    debugger
    this.SService.sel_sp_acminstitute()
      .subscribe(

      resultArray => {
        console.log('result-acminstitute', resultArray);

        this.acminstitutearr = resultArray;
      },
      error => console.log("Error :: " + error)
      )
  }
  byid_hrmprofileq() {
    debugger
    this.SService.selbyid_hrmprofileq(this.prid)
      .subscribe(

      resultArray => {
        console.log('selbyid_profileq', resultArray);
        this.fieldArray = resultArray.sp_hrmprofileq;
        console.log("fieldarr",resultArray.rcount);
        if(resultArray.rcount==0){
          this.fieldArray = [{rid: 0,corid:'',perc: '',board: '',strid: '',attempts: '',institute: '',place: '',medium: ''}];
        }

      },
      error => console.log("Error :: " + error)
      )
  }
  byid_hrmprofilex() {
    debugger
    this.SService.selbyid_hrmprofilex(this.prid)
      .subscribe(

      resultArray => {
        console.log('selbyid_profilex', resultArray);
        this.expArray = resultArray.sp_profileex;
        console.log("fieldarr",resultArray.rcount);
        if(resultArray.rcount==0){
          this.expArray = [{rid: 0,institute:'',frdt:'',todt:'',post:'',rmk:''}];
        }

      },
      error => console.log("Error :: " + error)
      )
  }
  byid_hrmawardaw() {
    debugger
    var tag = "AW";

    this.SService.selbyid_hrmaward(this.prid,tag)
      .subscribe(

      resultArray => {
        console.log('selbyid_hrmawardaw', resultArray);
        this.awrdArray = resultArray.sp_hrmaward;
        console.log("fieldarr",resultArray.rcount);
        if(resultArray.rcount==0){
          this.awrdArray = [{rid: 0,name:'',year: '',remark:'',tag:'AW'}];
        }

      },
      error => console.log("Error :: " + error)
      )
  }
  byid_hrmawardva() {
    debugger
    var tag = "VA";

    this.SService.selbyid_hrmaward(this.prid,tag)
      .subscribe(

      resultArray => {
        console.log('selbyid_hrmawardva', resultArray);
        this.courseArray = resultArray.sp_hrmaward;
        console.log("fieldarr",resultArray.rcount);
        if(resultArray.rcount==0){
          this.courseArray = [{rid: 0,name:'',year: '',remark:'',tag:'VA'}];
        }

      },
      error => console.log("Error :: " + error)
      )
  }
  hrmlevelseglist() {
    debugger
    this.SService.sel_sp_hrmlevelseg()
      .subscribe(

      resultArray => {
        console.log('result-hrmlevelseg', resultArray);

        this.hrmlevelsegarr = resultArray;
      },
      error => console.log("Error :: " + error)
      )
  }
  hrmemcatlist() {
    debugger
    this.SService.sel_sp_hrmemcat()
      .subscribe(

      resultArray => {
        console.log('result-hrmdept', resultArray);

        this.hrmemcatarr = resultArray;
      },
      error => console.log("Error :: " + error)
      )
  }
  hrmdeptlist() {
    debugger
    this.SService.sel_sp_hrmdept()
      .subscribe(

      resultArray => {
        console.log('result-hrmdept', resultArray);

        this.hrmdeptarr = resultArray;
      },
      error => console.log("Error :: " + error)
      )
  }
  hrmdesiglist() {
    debugger
    this.SService.sel_sp_hrmdesig()
      .subscribe(

      resultArray => {
        console.log('result-hrmdesig', resultArray);

        this.hrmdesigarr = resultArray;
      },
      error => console.log("Error :: " + error)
      )
  }
  getstaffs() {
    debugger
    this.SService.sel_sp_hrmemployee()
      .subscribe(result => {
        //console.log('ret-empdata', JSON.stringify(result));
        //alert(result.message);

        this.dataSource = new MatTableDataSource(result);
      },
      error => console.log("Error :: " + error)
      )

    this.closeAddExpenseModal.nativeElement.click();
  }

  opendialog(clsdata: any, cmd: string) {
    debugger
    

    if (cmd == 'insert') {
      debugger
      this.staff = {};
      this.staff.emid = 0;
      this.fieldArray = [{rid: 0,corid:'',perc: '',board: '',strid: '',attempts: '',institute: '',place: '',medium: ''}];
      this.expArray = [{rid: 0,institute:'',frdt:'',todt:'',post:'',rmk:''}];
      this.awrdArray = [{rid: 0,name:'',year: '',remark:'',tag:'AW'}];
      this.courseArray = [{rid: 0,name:'',year: '',remark:'',tag:'VA'}];
      this.staff.emno = "";
      this.staff.emnm = "";
      this.staff.dob = "";
      this.staff.gender = "";
      this.staff.blood = "";
      this.staff.pob = "";
      this.staff.mtongue = "";
      this.staff.nationality = "";
      this.staff.religion = "";
      this.staff.caste = "";
      this.staff.subcaste = "";
      this.staff.edu = "";
      this.staff.doj = "";
      this.staff.desid = "";
      this.staff.depid = "";
      this.staff.emcatid = "";
      this.staff.leid = "";
      this.staff.dol = "";
      this.staff.tospeak = "";
      this.staff.toread = "";
      this.staff.towrite = "";
      this.staff.aadhaar = "";
      this.staff.pan = "";
      this.staff.pf = "";
      this.staff.esi = "";
      this.staff.insno = "";
      this.staff.mobile = "";
      this.staff.email = "";
      this.staff.acno = "";
      this.staff.acnm = "";
      this.staff.bkid = "";
      this.staff.bkbrnm = "";
      this.staff.ifsc = "";
      this.staff.marital = "";
      this.staff.dom = "";
      this.staff.fnm = "";
      this.staff.fprof = "";
      this.staff.fmobile = "";
      this.staff.femail = "";
      this.staff.mnm = "";
      this.staff.mprof = "";
      this.staff.mmobile = "";
      this.staff.memail = "";
      this.staff.snm = "";
      this.staff.sprof = "";
      this.staff.smobile = "";
      this.staff.semail = "";
      this.staff.gnm = "";
      this.staff.gprof = "";
      this.staff.gmobile = "";
      this.staff.gemail = "";
      this.staff.ccountryid = "";
      this.staff.cstateid = "";
      this.staff.cdistrictid = "";
      this.staff.ccityid = "";
      this.staff.clocality = "";
      this.staff.cpin = "";
      this.staff.caddress = "";
      this.staff.clandmark = "";
      this.staff.pcountryid = "";
      this.staff.pstateid = "";
      this.staff.pdistrictid = "";
      this.staff.pcityid = "";
      this.staff.plocality = "";
      this.staff.ppin = "";
      this.staff.paddress = "";
      this.staff.plandmark = "";
      this.staff.photo = "";
      this.staff.awards = "";
      this.staff.valadd = "";

      this.staff.oprtag = cmd;
      this.staff.insid = "1";
      this.staff.dbnm = this.tempdbnm;
      this.asnamehead = 'Add Class Details';
    }
    else if (cmd == 'update') {
     this.staff = clsdata;
     this.emid = clsdata.emid;
     this.prid = clsdata.emid;
     let fdob=new FormControl(new Date(clsdata.dob));
     let fdoj=new FormControl(new Date(clsdata.doj));
     this.staff.dob=fdob.value;
     this.staff.doj=fdoj.value;

      this.staff.oprtag = cmd;
      this.staff.dbnm = this.tempdbnm;
      this.staff.fieldArray = this.fieldArray;
      this.staff.expArray = this.expArray;
      this.staff.awrdArray = this.awrdArray;
      this.staff.courseArray = this.courseArray;
    //  let ffrdt=new FormControl(new Date(this.expArray.frdt));
    //  let ftodt=new FormControl(new Date(this.expArray.todt));
    //  this.staff.expArray.frdt = ffrdt.value;
    //  this.staff.expArray.todt = ftodt.value;
      
      console.log('data-update', this.staff)
      this.asnamehead = 'Modify Class Details';
      this.byid_hrmprofileq();
      this.byid_hrmprofilex();
      this.byid_hrmawardaw();
      this.byid_hrmawardva();
      
    }
    this.oprtype = cmd;

  }

  checkes(e){
    if(e.target.checked == true){
          this.staff.paddress = this.staff.caddress;
          this.staff.pcityid = this.staff.ccityid;
          this.staff.pcountryid = this.staff.ccountryid;
          this.staff.plocality = this.staff.clocality;
          this.staff.plandmark = this.staff.clandmark;
          this.staff.pdistrictid = this.staff.cdistrictid;
          this.staff.ppin = this.staff.cpin;
          this.staff.pstateid = this.staff.cstateid;
    }else{
          this.staff.paddress = "";
          this.staff.pcityid = "";
          this.staff.pcountryid = "";
          this.staff.plocality = "";
          this.staff.plandmark = "";
          this.staff.pdistrictid = "";
          this.staff.ppin = "";
          this.staff.pstateid = "";
    }
  }

  deletefnc(staffdata: any) {
    this.staff = staffdata;
    this.staff.dbnm = this.tempdbnm;
    this.staff.oprtag = 'delete';
    this.staff.statush = 'Inactive'
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    this.staff.clcd=clcd;
    this.staff.aycd=aycd;
    console.log('deldata', this.staff);
    this.SService.save_sp_hrmemployee(this.staff)
      .subscribe(result => {
        console.log('ret', JSON.stringify(result));
        alert(result.message);
        this.getstaffs();
      }, error =>
        alert('error in connection')
      );
  }
  // insert_hrmprofileq(ddata){
  //   ddata.prid = this.emid;
  //   ddata.rid = 0;
  //   ddata.oprtag = "insert";
  //   console.log("insert_hrmprofileq", ddata);
  //   this.SService.insert_hrmprofileq(ddata)
  //     .subscribe(result => {
  //       //console.log('ret-insert_hrmprofileq', JSON.stringify(result));
  //       this.fieldArray;
  //       alert(result.message);
  //     }, error =>
  //       alert('error in connection')
  //     //this.alertmessage='error in connection'
  //     );
  // }

  deleteawards(adata) {
    adata.oprtag = "delete";
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    adata.clcd=clcd;
    adata.aycd=aycd;
    console.log('delawarddata',adata.rid);
    if(adata.rid!=0)
      this.SService.insdel_hrmawards(adata)
    .subscribe(result => {
    console.log('ret',JSON.stringify(result));
    }
      , error => 
    alert('error in connection')
    );
}
  deleteprofileq(ddata) {
    ddata.oprtag = "delete";
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    ddata.clcd=clcd;
    ddata.aycd=aycd;
    console.log('deldata',ddata.rid);
    if(ddata.rid!=0)
      this.SService.insert_hrmprofileq(ddata)
    .subscribe(result => {
    console.log('ret',JSON.stringify(result));
    }
      , error => 
    alert('error in connection')
    );
}
  deleteprofilex(expdata){
    expdata.oprtag = "delete";
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    expdata.clcd=clcd;
    expdata.aycd=aycd;
    console.log('deldata',expdata.rid);
    if(expdata.rid!=0)
      this.SService.insdel_hrmprofileex(expdata)
    .subscribe(result => {
    console.log('ret',JSON.stringify(result));
    //alert (result.message);
    }
      , error => 
    alert('error in connection')
    );
}
  insertstaffdtls(fdata) {
    debugger
    fdata.dob = this.SService.converttodate( fdata.dob);
    fdata.doj = this.SService.converttodate( fdata.doj);
    fdata.statush = "Active";
    fdata.fieldArray = this.fieldArray;
    fdata.expArray = this.expArray;
    fdata.awrdArray = this.awrdArray;
    fdata.courseArray = this.courseArray;
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    fdata.clcd=clcd;
    fdata.aycd=aycd;
    console.log("fdata", fdata);
    this.SService.save_sp_hrmemployee(fdata)
      .subscribe(result => {
        console.log('ret-empdata', JSON.stringify(result));
        alert(result.message);
        //this.alertmessage=result.message;

        this.getstaffs();
      }, error =>
        alert('error in connection')
      //this.alertmessage='error in connection'
      );
}

}
export interface empawd {
  name: string; 
  year: number;
  nemark: string;
  tag:  string;
}
export interface empexp {
  institute: string; 
  frdt: string;
  todt: string;
  post:  string;
  rmk:  string;
}
export interface empqual {
  rid : number;
  prid: number; 
  corid: string; 
  perc: number; 
  board: string; 
  strid: number; 
  attempts: number; 
  institute: string; 
  place:  string;
  medium:  string;
  u_type: string;
  crby:number;
  cron:string;
}
export interface staffdata {

  //hr-empolyee data
  emid: number;
  emno: number;
  emnm: string;
  dob: string;
  depnm: string;
  gender: string;
  blood: string;
  pob: string;
  mtongue: string;
  nationality: string;
  religion: string;
  caste: string;
  subcaste: string;
  edu: string;
  insid: string;
  doj: string;
  desid: string;
  depid: string;
  emcatid: string;
  leid: string;
  dol: string;
  desnm: string;
  tospeak: string;
  toread: string;
  towrite: string;
  aadhaar: string;
  pan: string;
  pf: string;
  esi: string;
  insno: string;
  mobile: string;
  email: string;
  acno: string;
  acnm: string;
  bkid: string;
  bkbrnm: string;
  ifsc: string;
  marital: string;
  dom: string;
  fnm: string;
  fprof: string;
  fmobile: string;
  femail: string;
  mnm: string;
  mprof: string;
  mmobile: string;
  memail: string;
  snm: string;
  sprof: string;
  smobile: string;
  semail: string;
  gnm: string;
  gprof: string;
  gmobile: string;
  gemail: string;
  ccountryid: string;
  cstateid: string;
  cdistrictid: string;
  ccityid: string;
  clocality: string;
  cpin: string;
  caddress: string;
  clandmark: string;
  pcountryid: string;
  pstateid: string;
  pdistrictid: string;
  pcityid: string;
  plocality: string;
  ppin: string;
  paddress: string;
  plandmark: string;
  photo: string;
  awards: string;
  valadd: string;
  statush: string;

}