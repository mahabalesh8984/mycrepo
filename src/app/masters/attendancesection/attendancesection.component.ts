import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatSortModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MasterService } from './../../services/index';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
@Component({

    selector: 'app-attendancesection',
    templateUrl: './attendancesection.component.html',
    styleUrls: ['../../shared/myc.style.css'],
    providers: [MasterService,DatePipe],
    encapsulation: ViewEncapsulation.None,


})
export class AttendanceSecComponent {
    color = 'accent';
    checked = 1;
    modeldata: as_lst[];
    dataSource: MatTableDataSource<as_lst[]>;
    model: any = {};
    tempdbnm: string = "myc0091819";
    oprtype: string = "update";
    mascls: any = [];
    massec: any = [];
    clssub: any = [];
    studata: any = [];
    masbranch:any=[];
    asnamehead: string;
    tabledata: any = {};

    constructor(private http: HttpClient, private datePipe: DatePipe, private _global: AppGlobals, private SService: MasterService) { }
    ngOnInit() {

        this.model.clid = '31';
        this.model.secid = '1';
        var attdt = new Date();
        var dates = this.datePipe.transform(attdt, "yyyy-MM-dd")
        this.model.attdt = dates
        console.log(this.datePipe.transform(attdt, "yyyy-MM-dd")); //output : 2018-02-13

    }
    displayedColumns = ['rollno', 'name', 'attstatus', 'attstatusaf', 'attrmk'];
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
            },
            error => console.log("Error :: " + error)
            );
    }
    SelectAttdDetails() {
        debugger
        var clid = this.model.clid;
        var secid = this.model.secid;
        var attdt = this.datePipe.transform(this.model.attdt, "yyyy-MM-dd");
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        
        var asgnmtdata = { clid: clid, secid: secid, attdt: attdt,seltag:'selbyclid',clcd:clcd,aycd:aycd };
        console.log('model-by', asgnmtdata);
        this.SService.by_sp_clmattendance(asgnmtdata)
            .subscribe(resultArray => {
                console.log('ret-by-atd', resultArray);
//alert(resultArray.length);
                if (resultArray.length>0)
                {

                   // alert('1');
                this.dataSource = new MatTableDataSource(resultArray);
                this.oprtype="update";
                }

                else{
                  //  alert('2');
                    this.SelectAttdDtlsifnotavail();
                    this.oprtype="insert";
                }
                //alert(resultArray.message);

            }, error =>
                alert('error in connection')
            );
    }

    SelectAttdDtlsifnotavail() {
        debugger
        var clid = this.model.clid;
        var secid = this.model.secid;
        var attdt = this.datePipe.transform(this.model.attdt, "yyyy-MM-dd");
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        
        var asgnmtdata = { clid: clid, secid: secid, attdt: attdt,seltag:'selstubyclid',clcd:clcd,aycd:aycd };
        console.log('model-by', asgnmtdata);
        this.SService.by_sp_clmattendance(asgnmtdata)
            .subscribe(resultArray => {
                console.log('ret-by-atd', resultArray);
                this.dataSource = new MatTableDataSource(resultArray);

                //alert(resultArray.message);

            }, error =>
                alert('error in connection')
            );
    }
    AttendanceDetails() {
        debugger
        console.log('testdata', this.dataSource.data);
        this.tabledata.loopdata = this.dataSource.data;
        this.tabledata.dbnm = this.tempdbnm;
        this.tabledata.oprtag=this.oprtype;
        this.tabledata.attdt = this.model.attdt;
        this.tabledata.clid = this.model.clid;
        this.tabledata.secid = this.model.secid;

        this.tabledata.clcd=localStorage.getItem('clcd');
        this.tabledata.aycd=localStorage.getItem('aycd');
       // this.tabledata.attdt = this.model.attdt;
        //this.tabledata.loopdata.attdt=this.model.attdt;
        console.log('class-sec',this.model.clid+','+this.model.secid);
        console.log("dbnm--dd",this.tabledata.loopdata);

        console.log('attendance-data', this.tabledata);
        this.SService.loop_clmattendance(this.tabledata)
             .subscribe(resultArray => {
                console.log('ret-loop', resultArray);

                alert(resultArray.message);
            }, error =>
                alert('error in connection')
            );
    }
}


export interface as_lst {
    stuid: number;
    ayid: number;
    clid: number;
    secid: number;
    subid: number;
    rollno: number;
    attdt: string;
    attstatus: number;
    attrmk: string;

    routeno: number;
    type: string;
    attstatusaf: number;
    vcid: number;
    assid: number;
}