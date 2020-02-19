import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatSortModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';
import {FormControl, FormGroupDirective, NgForm, Validators,FormControlDirective} from '@angular/forms';
import { MasterService,ScheduleService } from './../../services/index';

@Component({

    selector: 'app-asssch',
    templateUrl: './asssch.component.html',
    styleUrls: ['../../shared/myc.style.css'],
    providers: [MasterService,ScheduleService],
    encapsulation: ViewEncapsulation.None,
})
export class AssschComponent {

    _postsArray: any[];
    data: assch[];
    dataSource: MatTableDataSource<assch[]>;
    model: any = {};
    tempdbnm: string = "mycplvdev";
    oprtype: string = "update";
    asnamehead: string;
    selclid: number = 0;
    mascls: any = [];
    massub: any = [];
    masass: any = [];
    masasstype: any = [];
    diseditcontl:Boolean;
    constructor(private http: HttpClient, private _global: AppGlobals, private SService: MasterService,private SchService: ScheduleService) { }
    ngOnInit() {
        this.model.clid ='31';
        //this.Getsel_sp_masclasssubject();
        //this.SelectClsSubDetails();
        this.Getsel_sp_massubjects();
        this.Getclasslist();
        this.Getsel_sp_masasshead();
        this.Getsel_sp_masasstype();
    }

    displayedColumns = ['actedit', 'subname','date','portion','remarks','action'];
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

    ngAfterViewInit() {

        // this.Getsel_sp_massubjects();
        // this.Getclasslist();
        // debugger
    }
    opendialog(deptdata: any, cmd: string) {
        console.log('ed-data', deptdata);
        debugger
        if (cmd == 'insert') {
            this.diseditcontl=false;
            //this.model = {};
            this.model.subid = 0;
            //this.asnamehead = 'Add Class Details';
        }
        else if (cmd == 'update') {
            this.diseditcontl=true;
            this.model = deptdata;
            let asdt=new FormControl(new Date(deptdata.assdt));
            this.model.assdt=asdt.value;
            //let fdoa=new FormControl(new Date(clsdata.doa));
            this.asnamehead = 'Modify Class Details';
        }
        this.oprtype = cmd;
    }
    deletefnc(deptdata: any) {

        var clid = this.model.clid;
      
        var assid = this.model.assid;
        var asstypeid = this.model.asstypeid;
        var subid = deptdata.subid;
        var assdt = deptdata.assdt;
        var portion = '';
        var remarks = '';

        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
       // var oprtag = "insert"
        var clssubdata = { clid: clid, subid: subid, oprtag: 'delete',assid:assid,asstypeid:asstypeid,portion:portion,remarks:remarks,assdt:assdt,clcd:clcd,aycd:aycd };
        
        
       
        console.log('save-model', clssubdata);
        this.SchService.save_sp_schasssch(clssubdata)
            .subscribe(resultArray => {
                console.log('ret-save', resultArray);
                
                alert (resultArray.message);
                this.Bindtable();

            }, error =>
                alert('error in connection')
            );
        this.closeAddExpenseModal.nativeElement.click();
    }
    SaveDetails() {
        var clid = this.model.clid;
        var subid = this.model.subid;
        var assid = this.model.assid;
        var asstypeid = this.model.asstypeid;
        var assdt = this.model.assdt;
        var portion = this.model.portion;
        var remarks = this.model.remarks;

        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
       // var oprtag = "insert"
        var clssubdata = { clid: clid, subid: subid, oprtag: this.oprtype,assid:assid,asstypeid:asstypeid,portion:portion,remarks:remarks,assdt:assdt,clcd:clcd,aycd:aycd };
        
        
       
        console.log('save-model', clssubdata);
        this.SchService.save_sp_schasssch(clssubdata)
            .subscribe(resultArray => {
                console.log('ret-save', resultArray);
                
                //alert (resultArray.message);
                this.Bindtable();

            }, error =>
                alert('error in connection')
            );
        this.closeAddExpenseModal.nativeElement.click();
    }
    Bindtable() {
        debugger
        var clid = this.model.clid;
        var assid = this.model.assid;
        var asstypeid = this.model.asstypeid;
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        //var clssubdata = { clid: clid,assid:assid,asstypeid:asstypeid,clcd:clcd,aycd:aycd};
        //console.log('model', clssubdata);
        this.SchService.sel_sp_schasssch(clid,assid,asstypeid)
            .subscribe(resultArray => {
               console.log('ret-select', resultArray);
                this.dataSource = new MatTableDataSource(resultArray);
                //alert (resultArray.message);

            }, error =>
                alert('error in connection')
            );
        this.closeAddExpenseModal.nativeElement.click();
    }
    Getclasslist() {
        this.SService.ClassList()
            .subscribe(
            resultArray => {
                console.log('class-result', resultArray);
                this.mascls = resultArray;
            },
            error => console.log("Error :: " + error)
            )
    }

    Getsel_sp_masasshead()
    {
      debugger
      this.SService.sel_sp_masasshead()
      .subscribe(
      resultArray =>{
     
      this.masass=resultArray;
        },
    error => console.log("Error :: " + error)
    )
    }


    Getsel_sp_masasstype()
    {
      debugger
      this.SService.sel_sp_masasstype()
      .subscribe(
      resultArray =>{
        this.masasstype=resultArray;
        },
    error => console.log("Error :: " + error)
    )
    }
    Getsel_sp_massubjects() {
        this.SService.sel_sp_massubjects()
            .subscribe(
            resultArray => {
               // console.log('sub-result', resultArray);
                this.massub = resultArray;
            },
            error => console.log("Error :: " + error))
    }

    // Getsel_sp_masclasssubject() {
    //     debugger
    //     this.SService.sel_sp_masclasssubject()
    //         .subscribe(
    //         resultArray => {
    //             console.log('result-clssubjct', resultArray);
    //             // this.dataSource = new MatTableDataSource(resultArray);
    //         },
    //         error => console.log("Error :: " + error)
    //         )
    // }
}
export interface assch {
    subname: string;
    subid: string;
    assdt: string;
    remarks: string;
    portion: string;
}
