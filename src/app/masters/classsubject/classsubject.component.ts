import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatSortModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';
import { MasterService } from './../../services/index';
import { NgForm } from '@angular/forms';
@Component({

    selector: 'app-classsubject',
    templateUrl: './classsubject.component.html',
    styleUrls: ['../../shared/myc.style.css'],
    providers: [MasterService],
    encapsulation: ViewEncapsulation.None,
})
export class ClassSubjectComponent {

    _postsArray: any[];
    data: clsbjct[];
    dataSource: MatTableDataSource<clsbjct[]>;
    model: any = {};
    tempdbnm: string = "mycplvdev";
    oprtype: string = "update";
    asnamehead: string;
    selclid: number = 0;
    mascls: any = [];
    massub: any = [];

    constructor(private http: HttpClient, private _global: AppGlobals, private SService: MasterService) { }
    ngOnInit() {
        this.model.clid ='31';
        //this.Getsel_sp_masclasssubject();
        this.SelectClsSubDetails();
    }

    displayedColumns = [ 'subname','action'];
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

    ngAfterViewInit() {

        this.Getsel_sp_massubjects();
        this.Getclasslist();
        debugger
    }
    opendialog(deptdata: any, cmd: string) {
        debugger
        if (cmd == 'insert') {
            //this.model = {};
            //this.model.subid = 0;
            //this.asnamehead = 'Add Class Details';
        }
        else if (cmd == 'update') {
            this.model = deptdata;
            this.asnamehead = 'Modify Class Details';
        }
        this.oprtype = cmd;
    }
    deletefnc(deptdata: any) {

        var clid = this.model.clid;
        var oprtag = "delete";
        var subid = deptdata.subid;
        var dbnm = this.tempdbnm;
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
       
        var clssubdata = { clid: clid, subid: subid, oprtag: oprtag, dbnm:dbnm,clcd:clcd,aycd:aycd };
        console.log('deldata', clssubdata);
        this.SService.save_sp_masclasssubject(clssubdata)
            .subscribe(resultArray => {
                console.log('ret-delete', resultArray);
                this.dataSource = new MatTableDataSource(resultArray);
                alert (resultArray.message);
                this.SelectClsSubDetails();
            }, error =>
                alert('error in connection')
            );
    }
    SaveclassDetails(f: NgForm) {
        var clid = this.model.clid;
        var subid = this.model.subid;
        var oprtag = "insert"
        var clssubdata = { clid: clid, subid: subid, oprtag: oprtag };
        console.log('model', clssubdata);
        this.model.dbnm = this.tempdbnm;
        this.model = f.value;
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        this.model.clcd=clcd;
        this.model.aycd=aycd;
        console.log('model', this.model);
        this.SService.save_sp_masclasssubject(this.model)
            .subscribe(resultArray => {
                console.log('ret-save', resultArray);
                this.dataSource = new MatTableDataSource(resultArray.by_sp_clsSub);
                //alert (resultArray.message);
                this.SelectClsSubDetails();

            }, error =>
                alert('error in connection')
            );
        this.closeAddExpenseModal.nativeElement.click();
    }
    SelectClsSubDetails() {
        debugger
        var clid = this.model.clid;
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        var clssubdata = { clid: clid,clcd:clcd,aycd:aycd };
        console.log('model', clssubdata);
        this.SService.by_sp_masclasssubject(clssubdata)
            .subscribe(resultArray => {
                console.log('ret-select', resultArray);
                this.dataSource = new MatTableDataSource(resultArray.by_sp_clsSub);
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
    Getsel_sp_massubjects() {
        this.SService.sel_sp_massubjects()
            .subscribe(
            resultArray => {
                console.log('sub-result', resultArray);
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
export interface clsbjct {
    clid: string;
    subid: string;
}
