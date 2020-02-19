import { Component,HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  	key:any;
	@HostListener("window:beforeunload",["$event"])
	beforeunloadHandler(event){
	  localStorage.removeItem(this.key);
	}
  title = 'app';
}
