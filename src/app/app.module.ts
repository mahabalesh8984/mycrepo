import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import {
  LoginComponent,
  HeaderComponent,
  SidebarComponent,
  LayoutComponent,
  FooterComponent
 } from './components/index';

 import {
  BookissueComponent,

 } from './Library/index';

 import { 
  
  StudentaddComponent,
  EnquiryComponent,
  TableComponent
  
  
} from './admission/index';


import { 
  
  AcreceiptComponent,
  MiscreceiptComponent,
  AcmiscrecsComponent,
  
  
} from './accounts/index';

import {
  DashboardComponent,
  DialogContentExampleDialog,
  HomeComponent,
} from './modules/index';
import { 
  ClassesComponent,
  AssheadComponent,
  SectionComponent,
  AsstypeComponent,
  ModelComponent,
  SubcatComponent,
  SubcombComponent,
  SubgpComponent,
  SubjectComponent,
  OccationComponent,
  AccheadComponent,
  AccdeptComponent,
  AccfeequotaComponent,
  AccinstallmentsComponent,
  AccpayoptionsComponent,
  CompanyComponent,
  ReportcardComponent,
  ClassSubjectComponent,
  AssignmentComponent,
  MotComponent,
  HouseComponent,
  MarksDetailComponent,
  AttendanceSecComponent,
  AttendancePerComponent,
  AccfeechartComponent,
  InvitemsComponent,
  VendorsComponent,
  StfdepartmentComponent,
  
  
} from './masters/index';
import {
  C404Component,
  C401HComponent,
} from './http-status/index';
import { 
  
  StaffComponent,
  ClassteacherComponent,
  SuballotComponent,
    
} from './hr/index';
import { 
  
  AssschComponent,
  HolidaysComponent,
  YrcalenderComponent,
    
} from './schedule/index';
import { AppGlobals } from './shared/app.global';
import { AppRoutingModule } from './app.router';

import {TokenInterceptor} from './services/token.interceptor';
import { AuthService, AuthGuard,SidebarService } from './services/index';
import { MenulistComponent } from './components/sidebar/menulist/menulist.component';
import { MaterialModule } from './material.module';
import { ChartModule } from 'angular2-highcharts';
//import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import {MatSortModule,MatDatepickerModule, MatNativeDateModule, DateAdapter}  from '@angular/material';
import { Select2Module } from 'ng2-select2';
import * as jQuery from 'jquery';
import { DateFormat } from './date-format';


// export function highchartsFactory() {
//   const hc = require('highcharts/highstock');
//   const dd = require('highcharts/modules/exporting');
//   dd(hc);
//   return hc;
//   }

declare var require: any;
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    DashboardComponent,
    HomeComponent,
    ClassesComponent,
    AccfeequotaComponent,
    AssheadComponent,
    SectionComponent,
    AsstypeComponent,
    SubcatComponent,
    SubcombComponent,
    SubgpComponent,
    ModelComponent,
    SubjectComponent,
    OccationComponent,
    AccheadComponent,
    AccdeptComponent,
    AccinstallmentsComponent,
    AccpayoptionsComponent,
    CompanyComponent,
    ReportcardComponent,
    ClassSubjectComponent,
    AssignmentComponent,
    MotComponent,
    HouseComponent,
    MarksDetailComponent,
    AttendanceSecComponent,
    AttendancePerComponent,
    StudentaddComponent,
    StaffComponent,
    EnquiryComponent,
    AccfeechartComponent,
    MiscreceiptComponent,
    InvitemsComponent,
    VendorsComponent,
    AcmiscrecsComponent,
ClassteacherComponent,
SuballotComponent,
StfdepartmentComponent,
AssschComponent,
HolidaysComponent,
YrcalenderComponent,
    AcreceiptComponent,
    SidebarComponent,
    LayoutComponent,
    FooterComponent,
    MenulistComponent,
    C404Component,
    C401HComponent ,
    DialogContentExampleDialog,
    TableComponent,
    BookissueComponent
    ],
  imports: [
    MatDatepickerModule, MatNativeDateModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    MatSortModule,
    Select2Module,
    ChartModule.forRoot(
      require('highcharts'),
      require('highcharts/modules/exporting'),
      require('highcharts/highcharts-3d')
    ),
     NgbModule
  ],
  entryComponents: [DialogContentExampleDialog],
  providers: [

//     {provide: HighchartsStatic,
// useFactory: highchartsFactory},
    AuthGuard,
    AuthService,
    AppGlobals,
    {provide: DateAdapter, useClass: DateFormat},
    SidebarService,
     {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
     
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private dateAdapter:DateAdapter<Date>) {
		dateAdapter.setLocale('en-in'); // DD/MM/YYYY
	}
 }
 