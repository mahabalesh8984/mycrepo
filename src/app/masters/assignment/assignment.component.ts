import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatSortModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';
import { MasterService } from './../../services/index';
import { NgForm } from '@angular/forms';
@Component({
    selector: 'app-assignment',
    templateUrl: './assignment.component.html',
    styleUrls: ['../../shared/myc.style.css'],
    providers: [MasterService],
    encapsulation: ViewEncapsulation.None,
})

export class AssignmentComponent {

    modeldata: asignlst[];
    dataSource: MatTableDataSource<asignlst[]>;
    model: any = {};
    tempdbnm: string = "mycplvdev";
    oprtype: string = "update";
    mascls: any = [];
    massec: any = [];
    clssub: any = [];
    asnamehead:string;
    constructor(private http: HttpClient, private _global: AppGlobals, private SService: MasterService) { }
    ngOnInit() {

        this.model.clid = '31';
        this.model.secid = '1';
        this.model.subid = this.model.subid;

    }
    displayedColumns = ['action', 'hwdt', 'duedt', 'hwdetails','act2'];
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

    ngAfterViewInit() {
        this.Getclasslist();
        this.GetSectionList();
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
    SelectClsSubDetails(f: NgForm) {
        debugger
        var clid = this.model.clid;
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
        this.closeAddExpenseModal.nativeElement.click();
    }
    SaveDetails(f: NgForm) {
        debugger
        var clid = this.model.clid;
        var subid = this.model.subid;
        var secid = this.model.secid;
        var hwdt = this.model.hwdt;
        var hwid = this.model.hwid;
        var duedt = this.model.duedt;
        var hwdetails = this.model.hwdetails;
       // var dbnm = this.tempdbnm;
        var oprtag = this.model.oprtag;
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        
        var asgnmtdata = {oprtag:oprtag, clid: clid, subid: subid, secid: secid, hwdt: hwdt, duedt: duedt, hwdetails: hwdetails,clcd:clcd,aycd:aycd,hwid:hwid };
        console.log('asgnmtdata-SAVE', asgnmtdata);
        this.SService.save_sp_assignment(asgnmtdata)
            .subscribe(resultArray => {
                // console.log('ret-by', resultArray);
                // this.dataSource = new MatTableDataSource(resultArray);

                alert(resultArray.message);
                this.SaveAsgnmtDetails();

            }, error =>
                alert('error in connection')
            );
    }
        SaveAsgnmtDetails() {
        debugger
        var clid = this.model.clid;
        var subid = this.model.subid;
        var secid = this.model.secid;
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
       
        var asgnmtdata = {clid: clid, subid: subid, secid: secid,clcd:clcd,aycd:aycd};
        console.log('model-by', asgnmtdata);
        this.SService.by_sp_assignment(asgnmtdata)
            .subscribe(resultArray => {
                console.log('ret-by', resultArray.by_sp_agnmtclid);
                this.dataSource = new MatTableDataSource(resultArray.by_sp_agnmtclid);

                //alert(resultArray.message);

            }, error =>
                alert('error in connection')
            );
    }
    deletefnc(modeldata: any) {
        this.model = modeldata;
        this.model.secid = '1';
        this.model.dbnm = this.tempdbnm;
        this.model.oprtag = 'delete';
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        this.model.clcd=clcd;
        this.model.aycd=aycd;
        console.log('deldata', this.model);
        this.SService.save_sp_assignment(this.model)
            .subscribe(result => {
                console.log('ret', JSON.stringify(result));
                alert(result.message);
                this.SaveAsgnmtDetails();
                // this.Getsel_sp_reportcard();
            }, error =>
                alert('error in connection')
            );
    }
    opendialog(deptdata: any, cmd: string) {

        
        if (cmd == 'insert') {
            this.model.oprtag="insert";
            this.model.hwid=0;
            //this.model = deptdata;
            this.asnamehead = 'Add Assignment Details';
        }
        else if (cmd == 'update') {
            this.model = deptdata;
            this.model.oprtag="update";
           // this.model.hwid=deptdata.hwid;
            this.asnamehead = 'Modify Assignment Details';
        }
        this.oprtype = cmd;
    }



}

export interface asignlst {
    hwid: number;
    ayid: number;
    clid: number;
    secid: number;
    subid: number;
    hwdt: string;
    duedt: string;
    hwdetails: string;
    empid: number;
}