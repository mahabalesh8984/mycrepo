import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatSortModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';
import { MasterService,HrService } from './../../services/index';
import { NgForm } from '@angular/forms';
@Component({

    selector: 'app-suballot',
    templateUrl: './suballot.component.html',
    styleUrls: ['../../shared/myc.style.css'],
    providers: [MasterService,HrService],
    encapsulation: ViewEncapsulation.None,
})
export class SuballotComponent {

    _postsArray: any[];
    //data: clsbjct[];
    dataSource: MatTableDataSource<subalot[]>;
    model: any = {};
    tempdbnm: string = "mycplvdev";
    oprtype: string = "update";
    asnamehead: string;
    selclid: number = 0;
    mascls: any = [];
    massub: any = [];
    lstemp:any=[];
    massec:any=[];
    diseditcontl:Boolean=false;

    constructor(private http: HttpClient, private _global: AppGlobals, private SService: MasterService,private HrService: HrService) { }
    ngOnInit() {
        this.model.clid ='0';
        //this.Getsel_sp_masclasssubject();
        this.selsuballot();
    }

    displayedColumns = ['actedit','secname', 'subname','emnm','action'];
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

    ngAfterViewInit() {

        this.Getsel_sp_massubjects();
        this.Getclasslist();
        this.GetSectionList();
        this.getstaffs();
    }
    opendialog(deptdata: any, cmd: string) {
        debugger
        if (cmd == 'insert') {
            this.diseditcontl=false;
            //this.model = {};
            //this.model.subid = 0;
            //this.asnamehead = 'Add Class Details';
        }
        else if (cmd == 'update') {
            this.diseditcontl=true;
            this.model = deptdata;
            this.asnamehead = 'Modify Class Details';
        }
        this.oprtype = cmd;
    }
    deletefnc(deptdata: any) {

        var clid = this.model.clid;
        var oprtag = "delete";
        var subid = deptdata.subid;
        var secid = deptdata.secid;
        var emid = deptdata.emid;
       
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
       
        var clssubdata = { clid: clid, secid: secid,subid:subid,emid:emid, oprtag: oprtag,clcd:clcd,aycd:aycd };
        //console.log('deldata', clssubdata);
        this.HrService.save_sp_hrsuballot(clssubdata)
            .subscribe(resultArray => {
                //console.log('ret-delete', resultArray);
                this.dataSource = new MatTableDataSource(resultArray);
                alert (resultArray.message);
                this.selsuballot();
            }, error =>
                alert('error in connection')
            );
    }
    SaveDetails(f: NgForm) {
        console.log('save-model', f.value);
        var clid = this.model.clid;
        var subid = this.model.subid;
        var secid = this.model.secid;
        var oprtag = f.value.oprtag;
        var emid = f.value.emid;
       
        
        let clcd=localStorage.getItem('clcd');
        let aycd=localStorage.getItem('aycd');
        var clssubdata = { clid: clid, secid: secid,subid:subid,emid:emid, oprtag: oprtag,clcd:clcd,aycd:aycd };
      
        this.HrService.save_sp_hrsuballot(clssubdata)
            .subscribe(resultArray => {
                console.log('ret-save', resultArray);
               
                alert (resultArray.message);
                this.selsuballot();

            }, error =>
                alert('error in connection')
            );
        this.closeAddExpenseModal.nativeElement.click();
        
    }
    selsuballot() {
        debugger
        
        this.HrService.sel_sp_hrsuballot(this.model.clid)
            .subscribe(resultArray => {
                console.log('ret-select', resultArray);
                this.dataSource = new MatTableDataSource(resultArray.sp_hrsuballot);
                //alert (resultArray.message);

            }, error =>
                alert('error in connection')
            );
       // this.closeAddExpenseModal.nativeElement.click();
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

    GetSectionList()
    {
      debugger
      this.SService.SectionList()
      .subscribe(
        
       resultArray =>{
        console.log('result',resultArray) ;
        this.massec=resultArray;
        //this.model.secid=resultArray[0].secid;
       // this.dataSource = new MatTableDataSource(resultArray);
        },
       error => console.log("Error :: " + error)
    )
    }

    getstaffs() {
        debugger
        this.HrService.sel_sp_hrmemployee()
          .subscribe(result => {
            //console.log('ret-empdata', JSON.stringify(result));
            //alert(result.message);
    
            //this.dataSource = new MatTableDataSource(result);
            this.lstemp=result;
          },
          error => console.log("Error :: " + error)
          )
    
       // this.closeAddExpenseModal.nativeElement.click();
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
export interface subalot {
    clid: string;
    subid: string;
    secid: string;
    emid: string;
    secname: string;
    subname: string;
    emnm: string;
}
