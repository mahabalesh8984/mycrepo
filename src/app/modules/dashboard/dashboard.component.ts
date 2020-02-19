import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NgbModal, ModalDismissReasons,NgbModalOptions,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  colorsList: object;
  model: any = {};
  private modalRef: NgbModalRef;
  private alertref: NgbModalRef;
  oprtype:string="update";
  alertmessage:string;
  closeResult:string;
  modalOption: NgbModalOptions = {}; 
  constructor(public ngdialog: NgbModal) {

    this.colorsList = [
      {
        "isbn": "9781593275846",
        "title": "Eloquent JavaScript, Second Edition",
        "author": "Marijn Haverbeke"
      },
      {
        "isbn": "9781449331818",
        "title": "Learning JavaScript Design Patterns",
        "author": "Addy Osmani",
      },
      {
        "isbn": "9781449365035",
        "title": "Speaking JavaScript",
        "author": "Axel Rauschmayer"
      },
      {
        "isbn": "9781491950296",
        "title": "Programming JavaScript Applications",
        "author": "Eric Elliott"
      },
      {
        "isbn": "9781593277574",
        "title": "Understanding ECMAScript 6",
        "author": "Nicholas C. Zakas",
      },
      {
        "isbn": "9781491904244",
        "title": "You Don't Know JS",
        "author": "Kyle Simpson",
      },
      {
        "isbn": "9781449325862",
        "title": "Git Pocket Guide",
        "author": "Richard E. Silverman",
      },
      {
        "isbn": "9781449337711",
        "title": "Designing Evolvable Web APIs with ASP.NET",
         "author": "Glenn Block, et al.",
      }
    ];
   }

  //  openDialog() {
  //   const dialogRef = this.dialog.open(DialogContentExampleDialog, {
  //     width: '500px',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // };

  openalert(alertmsg:string ,content) {
    debugger
    //this.Asmtdetls(asid);

   
    

  //  this.modalOption.backdrop = 'static';
  //  this.modalOption.keyboard = false;
  this.alertref=this.ngdialog.open(content,this.modalOption);

  this.alertref.result.then((result) => {

       // this.Asmtdetls(asid);
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
  } else {
      return  `with: ${reason}`;
  }
} 

  ngOnInit() {
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  template: `<h2 >Install Angular</h2>
  
`,
})
export class DialogContentExampleDialog {}
 

 
