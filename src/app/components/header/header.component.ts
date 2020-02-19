import { Component, OnInit } from '@angular/core';
 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  logname: any = {};
  logphoto:any={};
  constructor() { }

  ngOnInit() {
  	this.getLoggedUser();
  }

  getLoggedUser(){
  	 var currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.logname = currentUser.username;
     this.logphoto = currentUser.photo;
  }
    


}
