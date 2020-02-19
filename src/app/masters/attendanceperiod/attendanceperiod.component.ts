import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatSortModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MasterService } from './../../services/index';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
@Component({

    selector: 'app-attendanceperiod',
    templateUrl: './attendanceperiod.component.html',
    styleUrls: ['../../shared/myc.style.css'],
    providers: [MasterService,DatePipe],
    encapsulation: ViewEncapsulation.None,


})
export class AttendancePerComponent {
   color = 'accent';
    checked = 1;
    modeldata: attp_lst[];
    dataSource: MatTableDataSource<attp_lst[]>;
    model: any = {};
    tempdbnm: string = "mycplvdev";
    oprtype: string = "update";
    mascls: any = [];
    massec: any = [];
    clssub: any = [];
    masbranch:any=[];
    studata: any = [];
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
    displayedColumns = ['rollno', 'name', 'attstatus', 'attrmk'];
    //displayedColumns = [ 'attstatus'];
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

    ngAfterViewInit() {
        this.Getclasslist();
        this.GetSectionList();
        this.by_sp_student();
        //this.SaveAttdDetails();
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
    SelectAttdPerDetails() {
        debugger
        var clid = this.model.clid;
        var secid = this.model.secid;
        var attdt = this.datePipe.transform(this.model.attdt, "yyyy-MM-dd");
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        
        var asgnmtdata = { clid: clid, secid: secid, attdt: attdt,clcd:clcd,aycd:aycd };
        console.log('model-by', asgnmtdata);
        this.SService.by_sp_clmattendanceperiod(asgnmtdata)
           .subscribe(resultArray => {
                console.log('ret-by-atdper', resultArray);
                this.dataSource = new MatTableDataSource(resultArray);

                //alert(resultArray.message);

            }, error =>
                alert('error in connection')
            );
    }
    AttendancePerDetails() {
        debugger
        console.log('testdata', this.dataSource.data);
        this.tabledata.loopdata = this.dataSource.data;
        this.tabledata.dbnm = this.tempdbnm;
        this.tabledata.oprtag='update';
        this.tabledata.attdt=this.model.attdt;
        
        console.log("dbnm--dd",this.tabledata);

        console.log('attendance-data', this.tabledata);
        this.SService.loop_clmattendanceperiod(this.tabledata)
             .subscribe(resultArray => {
                console.log('ret-loop', resultArray);

                alert(resultArray.message);
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

    routeno: number;
    type: string;
    attstatusaf: number;
    vcid: number;
    assid: number;
}