import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatSortModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';

import { MasterService } from './../../services/index';

import { NgForm } from '@angular/forms';
@Component({

    selector: 'app-house',
    templateUrl: './house.component.html',
    styleUrls: ['../../shared/myc.style.css'],
    providers: [MasterService],
    encapsulation: ViewEncapsulation.None,


})
export class HouseComponent implements OnInit {

    _postsArray: any[];
    clsdate: hslst[];
    dataSource: MatTableDataSource<hslst[]>;
    model: any = {};
    tempdbnm: string = "mycplvdev";
    oprtype: string = "update";
    asnamehead: string;

    constructor(private http: HttpClient, private _global: AppGlobals, private SService: MasterService) { }

    ngOnInit() {
        this.Getsel_sp_mashouse();
    }

    displayedColumns = ['action', 'hsnm','act2'];
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
            this.model.hsid = 0;
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
        this.SService.save_sp_mashouse(this.model)
            .subscribe(result => {
                console.log('ret-delete', JSON.stringify(result));
                alert(result.message);
                //this.alertmessage=result.message;

                this.Getsel_sp_mashouse();
            }, error =>
                alert('error in connection')
            //this.alertmessage='error in connection'
            );

    }

    Save_sp_mashouse(f: NgForm) {
        debugger
        //alert ('hi');
        
        var hsid = this.model.hsid;
        var hsnm = this.model.hsnm;
        var clsdata = { hsid: hsid, hsnm: hsnm };

        this.model = f.value;
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        this.model.clcd=clcd;
        this.model.aycd=aycd;
        console.log('model-save', this.model);
        this.SService.save_sp_mashouse(this.model)
            .subscribe(result => {
                console.log('ret', JSON.stringify(result));
                alert(result.message);

                this.Getsel_sp_mashouse();
            }, error =>
                alert('error in connection')
            );

        this.closeAddExpenseModal.nativeElement.click();

    }
    Getsel_sp_mashouse() {
        debugger
        this.SService.sel_sp_mashouse()
            .subscribe(

            resultArray => {
                console.log('result-house', resultArray);
                this.dataSource = new MatTableDataSource(resultArray);
            },
            error => console.log("Error :: " + error)
            )
    }
}

export interface hslst {
    hsid: number;
    hsnm: string;
}