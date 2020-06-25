import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatSortModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MasterService,LibraryService } from './../../services/index';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';

import { Router,ActivatedRoute } from '@angular/router';







@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
  providers: [MasterService,DatePipe,LibraryService],
  encapsulation: ViewEncapsulation.None,
})
export class BooksComponent implements OnInit {

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<any[]>;

  color = 'accent';
  checked = 1;
 
  dataSource: MatTableDataSource<any[]>;
  model: any = {};
  detmodel: any = {};
  tempdbnm: string = "mycplvdev";
  oprtype: string = "update";
  mascls: any = [];
  massec: any = [];
  masbranch: any = [];
  bookdetails: any = [];
  clssub: any = [];
  studata: any = [];
  
  asnamehead: string;
  tabledata: any = {};

  selbooktitle:string='';
  selbookid:bigint;
  nocopys:any;

  display='none';

  private mdlSampleIsOpen : boolean = false;
  acYears = [
    {value: 'Circular', viewValue: 'Circular'},
    {value: 'Reference', viewValue: 'Reference'},
    {value: 'Journal', viewValue: 'Journal'},
    {value: 'Magazine', viewValue: 'Magazine'},
  
  ];

  bookstatuses = [
    {value: 'Active', viewValue: 'Active'},
    {value: 'Inactive', viewValue: 'Inactive'},
    
  
  ];
  bookid:any;
  constructor(private http: HttpClient, private datePipe: DatePipe, private _global: AppGlobals, private SService: MasterService,private libservice: LibraryService,private route: ActivatedRoute,) { }
  ngOnInit() {


    this.route.params.subscribe(params => {
      console.log("params",params);
    var bookid=params['bookid'];
    if(bookid)
    {
      this.bookid=params['bookid'];
    }
    else
    {
      this.bookid=0;
    }
      // if(this.encRequest.toUpperCase()=="INITIATED")
      // {

      //   this.payresponse="Your Transaction was not Suucessful." 
      // }
      
      // else
      // {
      // this.payresponse=params['retmsg'];
      // }
     
    });

      this.model.clid = '1';
      this.model.secid = '1';
      this.model.stuid = '0';
      var attdt = new Date();
      var dates = this.datePipe.transform(attdt, "yyyy-MM-dd")
      this.detmodel.recdt = dates
      console.log(this.datePipe.transform(attdt, "yyyy-MM-dd")); //output : 2018-02-13

     this.nocopys=1;

  }
  displayedColumns = ['booktitle', 'issue', 'due', 'cnt','status','commands'];
  //displayedColumns = [ 'attstatus'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('closeAddExpenseModal', {static: true}) closeAddExpenseModal: ElementRef;

  ngAfterViewInit() {
    // this.getbranch();
    //   this.Getclasslist();
    //   this.GetSectionList();
    //   this.by_sp_student();
      //this.SaveAttdDetails();
      this.getbookdetails();
      if(this.bookid!=0)
      {
this.opendialog(this.model,'insert');
       
      }
  }
  
  applybooksFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

    if(filterValue.length>=5)
    {
    this.SService.serchbooks(filterValue)
    .subscribe(
    resultArray => {
        console.log('books-result', resultArray);
        this.bookdetails = resultArray;
       
        
    },
    error => console.log("Error :: " + error)
    )
  }
  else{

    this.getbookdetails();
  }
  }

  Genarateqrpdf()
  {


  }
  AutoCompleteDisplay(item: any): string {
    if (item == undefined) { return }
    return  item.booktitle;
    
  }

  Addbook()
  {
    //alert(this.selbooktitle+'-'+this.selbookid);
    var clid = this.model.clid;
    var subid = this.model.stuid;
    var secid = this.model.secid;
    var retdt = this.detmodel.recdt;
    var oprtype = 'issuebook';
    
   // var dbnm = this.tempdbnm;
    //var oprtag = this.model.oprtag;
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    
    var asgnmtdata = {clid: clid,  secid: secid,stuid:subid, retdt: retdt, oprtype: oprtype, clcd:clcd,aycd:aycd,id:this.detmodel.id,bookid:this.selbookid };
    console.log('asgnmtdata-SAVE', asgnmtdata);
    this.SService.issuebook(asgnmtdata)
    .subscribe(result => {
        console.log('ret',JSON.stringify(result));
        alert (result.message);
       // this.getissueddetails();
        //this.alertmessage=result.message;
    
   // this.Getclasslist();
    }, error => 
    alert('error in connection')
    //this.alertmessage='error in connection'
    );
  }
  



  getbookdetails() {
      this.libservice.getbookdetails()
          .subscribe(
          resultArray => {
              console.log('books-result', resultArray);
              this.bookdetails = resultArray;
              
          },
          error => console.log("Error :: " + error)
          )
  }


  opendialog(secdate:any,cmd:string)
  {
  debugger
  if(cmd=='insert')
  {
      this.model={};
      this.model.bookid=0;
      this.asnamehead='New Book  Details';
  }
  else if(cmd=='update')
  {
      this.model=secdate;
      this.asnamehead='Modify Book Details';
  }
  this.model.oprtype=cmd;
  this.mdlSampleIsOpen = true;
  }

  modalclose()
  {

    this.mdlSampleIsOpen = false;
  }

  SaveDetails(f: NgForm) {
    debugger

    // $i_bookid=$data['bookid'];
    // $i_booktitle=$data['booktitle'];
    // $i_bookcategory=$data['bookcategory'];
    // $i_author=$data['author'];
    // $i_publication=$data['publication'];
    // $i_pub_date=$data['pub_date'];
    // $i_edition=$data['edition'];
    // $i_price=$data['price'];
    // $i_mrp=$data['mrp'];
    // $i_invoiceno=$data['invoiceno'];
    // $i_invoice_date=$data['invoice_date'];
    // $i_repbookid=$data['repbookid'];
    // $i_oprtype=$data['oprtype'];
    // $i_bookstatus=$data['bookstatus'];
    // $i_rackno=$data['rackno'];
    var bookid = this.model.bookid;
    var booktitle = this.model.booktitle;
    var bookcategory = this.model.bookcategory;
    var author = this.model.author;
    var publication = this.model.publication;
    var pub_date = this.model.pub_date;
    var edition = this.model.edition;
    var price = this.model.price;
    var mrp = this.model.mrp;
    var invoiceno = this.model.invoiceno;
    var invoice_date = this.model.invoice_date;
    var oprtype = this.model.oprtype;
    var bookstatus = this.model.bookstatus;
    var rackno = this.model.rackno;
    var bookcode = this.model.bookcode;
    var publishplace = this.model.publishplace;
    var nopages = this.model.nopages;

    
   // var dbnm = this.tempdbnm;
    //var oprtag = this.model.oprtag;
    let clcd=localStorage.getItem('clcd');
    let aycd=localStorage.getItem('aycd');
    
    var asgnmtdata = {bookid: bookid,  booktitle: booktitle,bookcategory:bookcategory, author: author, oprtype: oprtype, clcd:clcd,aycd:aycd,publication:publication
      ,pub_date:pub_date,edition:edition,price:price,mrp:mrp ,invoiceno:invoiceno,invoice_date:invoice_date,bookstatus:bookstatus,rackno:rackno,
      bookcode:bookcode,publishplace:publishplace,nopages:nopages};
    console.log('bookdata-SAVE', asgnmtdata);
    this.libservice.savebookdetails(asgnmtdata)
        .subscribe(resultArray => {
            // console.log('ret-by', resultArray);
            // this.dataSource = new MatTableDataSource(resultArray);

            alert(resultArray.message);
           //this.getissueddetails()
            //this.SaveAsgnmtDetails();

        }, error =>
            alert('error in connection')
        );
}
}

