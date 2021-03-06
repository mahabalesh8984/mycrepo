import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatSortModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';
import {FormControl, FormGroupDirective, NgForm, Validators,FormControlDirective} from '@angular/forms';
import { MasterService,ScheduleService } from './../../services/index';

@Component({

    selector: 'app-yrcalender',
    templateUrl: './yrcalender.component.html',
    styleUrls: ['../../shared/myc.style.css'],
    providers: [MasterService,ScheduleService],
    encapsulation: ViewEncapsulation.None,
})
export class YrcalenderComponent {

    _postsArray: any[];
    //data: assch[];
    dataSource: MatTableDataSource<lstyrcal[]>;
    model: any = {};
    tempdbnm: string = "mycplvdev";
    oprtype: string = "update";
    asnamehead: string;
    selclid: number = 0;
    masocc: any = [];
   
    diseditcontl:Boolean;
    constructor(private http: HttpClient, private _global: AppGlobals, private SService: MasterService,private SchService: ScheduleService) { }
    ngOnInit() {
        
    }

    displayedColumns = ['actedit', 'occnm','date','date1','action'];
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

    ngAfterViewInit() {
        this.Bindtable();
         this.Getsel_sp_masoccation();
        // this.Getclasslist();
        // debugger
    }
    opendialog(deptdata: any, cmd: string) {
        console.log('ed-data', deptdata);
        debugger
        if (cmd == 'insert') {
            this.diseditcontl=false;
            //this.model = {};
            this.model.occid = 0;
            //this.asnamehead = 'Add Class Details';
        }
        else if (cmd == 'update') {
            this.diseditcontl=true;
            this.model = deptdata;
            let asdt=new FormControl(new Date(deptdata.ycdtfrom));
            this.model.ycdtfrom=asdt.value;

            let ycto=new FormControl(new Date(deptdata.ycdtto));
            this.model.ycdtto=ycto.value;
            //let fdoa=new FormControl(new Date(clsdata.doa));
            this.asnamehead = 'Modify Class Details';
        }
        this.oprtype = cmd;
    }
    deletefnc(deptdata: any) {

        var occid = deptdata.occid;
        var hodt = deptdata.hodt;
        

        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
       // var oprtag = "insert"
        var clssubdata = { occid: occid, hodt: hodt, oprtag: 'delete',clcd:clcd,aycd:aycd };
        
        
       
        console.log('save-model', clssubdata);
        this.SchService.save_sp_schholidaylist(clssubdata)
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
        var occid = this.model.occid;
        var ycfr = this.model.ycdtfrom;
        var ycto = this.model.ycdtto;
        
 
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        let holdt=this.SchService.converttodate(ycfr);
        let holdt1=this.SchService.converttodate(ycto);
       // var oprtag = "insert"
        var clssubdata = { occid: occid, ycdtfrom: holdt,ycdtto:holdt1, oprtag: this.oprtype,clcd:clcd,aycd:aycd };
        
        
       
        console.log('save-model', clssubdata);
        this.SchService.save_sp_schyearlycalendar(clssubdata)
            .subscribe(resultArray => {
                console.log('ret-save', resultArray);
                
                alert (resultArray.message);
                this.Bindtable();

            }, error =>
                alert('error in connection')
            );
        this.closeAddExpenseModal.nativeElement.click();
    }

    Getsel_sp_masoccation()
    {
      debugger
      this.SService.sel_sp_masoccation()
      .subscribe(
      resultArray =>{
      console.log('result',resultArray) ;
      this.masocc=resultArray;
      
        },
    error => console.log("Error :: " + error)
    )
    }
    Bindtable() {
        debugger
        
        
        this.SchService.sel_sp_schyearlycalendar()
            .subscribe(resultArray => {
               console.log('ret-select', resultArray);
                this.dataSource = new MatTableDataSource(resultArray);
                //alert (resultArray.message);

            }, error =>
                alert('error in connection')
            );
        this.closeAddExpenseModal.nativeElement.click();
    }
   
    
}
export interface lstyrcal {
    ycdtfrom: string;
    ycdtto: string;
    occid: string;
    occname: string;
   
}
