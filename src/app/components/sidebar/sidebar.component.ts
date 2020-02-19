import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../shared/app.global';

import { SidebarService } from './../../services/index';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    _postsArray:any[];

  constructor(private http: HttpClient, private _global: AppGlobals,private SService:SidebarService) { }

  ngOnInit() {

      this.getSidebar();
     
  }

 getSidebar() {
       this.SService.modulesList()
       .subscribe(
        resultArray => this._postsArray = resultArray,
        error => console.log("Error :: " + error)
    )

	// .subscribe(menuList => {
    // this.menuListData = menuList.data;
    //     console.log(menuList);
    // });




    












//  <aside class="main-sidebar">
//  <script type="text/ng-template" id="categoryTree">
//      <a ui-sref="app.{{p.url}}" ng-class="{'disabled':p.parent_id=='0'}">
//          <i ng-if="p.icon!='' " class="fa fa-{{p.icon}}"></i>
//          <i ng-if="p.icon =='' " class="fa fa-circle-o"></i>
//          <span>{{p.name}}</span>
//          <i class="fa fa-angle-left pull-right" ng-if="p.parent_id!='0'"></i>
//      </a>
//      <ul ng-if="p.children" class="treeview-menu">
//          <li ng-repeat="p in p.children" ng-include="'categoryTree'" ui-sref-active="active">
//          </li>
//      </ul>
//  </script>
//  <section class="sidebar customSidebar">
//      <ul class="sidebar-menu">
//          <li class="treeview active" ng-repeat="p in MainMenu" ng-include="'categoryTree'" is-active-nav ng-class="{'header':p.parent_id=='0'}" style="padding: 0px;">

//          </li>
//      </ul>


//  </section>
// </aside>
}
  


}
