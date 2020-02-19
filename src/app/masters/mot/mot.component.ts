import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatSortModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';

import { MasterService } from './../../services/index';

import { NgForm } from '@angular/forms';
@Component({

    selector: 'app-mot',
    templateUrl: './mot.component.html',
    styleUrls: ['../../shared/myc.style.css'],
    providers: [MasterService],
    encapsulation: ViewEncapsulation.None,


})

export class MotComponent implements OnInit {

    _postsArray: any[];
    clsdate: motlst[];
    dataSource: MatTableDataSource<motlst[]>;
    model: any = {};
    tempdbnm: string = "mycplvdev";
    oprtype: string = "update";
    asnamehead: string;

    constructor(private http: HttpClient, private _global: AppGlobals, private SService: MasterService) { }

    ngOnInit() {
        this.Getsel_sp_masmot();
    }

    displayedColumns = ['action', 'mot','act2'];
    //
    //
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

    /**
     * Set the sort after the view init since this component will
     * be able to query its view for the initialized sort.
     */
    ngAfterViewInit() {
        debugger

    }


    opendialog(clsdata: any, cmd: string) {
        debugger

        if (cmd == 'insert') {
            this.model = {};
            this.model.motid = 0;
            this.asnamehead = 'Add Class Details';
        }
        else if (cmd == 'update') {
            this.model = clsdata;
            console.log("opendialog data",clsdata);
            this.asnamehead = 'Modify Class Details';
        }
        this.oprtype = cmd;

    }
    deletefnc(clsdata: any) {
        debugger
        this.model = clsdata;
        this.model.dbnm = this.tempdbnm;
        this.model.oprtag = 'delete';
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        this.model.clcd=clcd;
        this.model.aycd=aycd;

        console.log('deldata', this.model);
        this.SService.save_sp_masmot(this.model)
            .subscribe(result => {
                console.log('ret-delete', JSON.stringify(result));
                alert(result.message);
                //this.alertmessage=result.message;

                this.Getsel_sp_masmot();
            }, error =>
                alert('error in connection')
            //this.alertmessage='error in connection'
            );

    }

    Save_sp_masmot(f: NgForm) {
        debugger
        //alert ('hi');
        
        var motid = this.model.motid;
        var mot = this.model.mot;
        var clsdata = { motid: motid, mot: mot };

        this.model = f.value;
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        this.model.clcd=clcd;
        this.model.aycd=aycd;
        console.log('model-save', this.model);
        this.SService.save_sp_masmot(this.model)
            .subscribe(result => {
                console.log('ret', JSON.stringify(result));
                alert(result.message);

                this.Getsel_sp_masmot();
            }, error =>
                alert('error in connection')
            );

        this.closeAddExpenseModal.nativeElement.click();

    }
    Getsel_sp_masmot() {
        debugger
        this.SService.sel_sp_masmot()
            .subscribe(

            resultArray => {
                console.log('result-mot', resultArray);
                this.dataSource = new MatTableDataSource(resultArray);
            },
            error => console.log("Error :: " + error)
            )
    }
}
export interface motlst {
    motid: number;
    mot: string;
}