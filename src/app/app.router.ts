import { NgModule } from '@angular/core';
import { ExtraOptions,Routes, RouterModule} from "@angular/router";
 
import { 
  LoginComponent,
  HeaderComponent,
  SidebarComponent,
  LayoutComponent,
  FooterComponent
 } from './components/index';
import { 
  DashboardComponent,
  HomeComponent,
} from './modules/index';


import {
  BookissueComponent,
  BooksComponent,

 } from './Library/index';

import { 
  
  AcreceiptComponent,
  MiscreceiptComponent,
  AcmiscrecsComponent,
  
  
} from './accounts/index';

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
  
  StudentaddComponent,
  EnquiryComponent,
  TableComponent,
  
  
} from './admission/index';

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
import { 
  C404Component,
  C401HComponent,
} from './http-status/index';

import { AuthGuard } from './services/index';

const ROUTES: Routes = [
    {path: '', redirectTo: 'Login', pathMatch: 'full'},
    { path: 'Login', component: LoginComponent },
    { 
      path: 'app', component: LayoutComponent,canActivate: [AuthGuard], 
      children: [
        {path: '', redirectTo: 'Home',pathMatch: 'full'}, 
        {path: 'Home', component: HomeComponent}, 
        {path: 'Dashboard', component: DashboardComponent}, 
        {path: 'Classes', component: ClassesComponent}, 
        {path: 'asshead', component: AssheadComponent},
        {path: 'section', component: SectionComponent},
        {path: 'asstype', component: AsstypeComponent},
        {path: 'model', component: ModelComponent},
        {path: 'occation', component: OccationComponent},
        {path: 'subcat', component: SubcatComponent},
        {path: 'subcomb', component: SubcombComponent},
        {path: 'subgp', component: SubgpComponent},
        {path: 'subject', component: SubjectComponent},
        {path: 'acchead', component: AccheadComponent},
        {path: 'accdept', component: AccdeptComponent},
        {path: 'accfeequota', component: AccfeequotaComponent},
        {path: 'accinstallments', component: AccinstallmentsComponent},
        {path: 'accpayoptions', component: AccpayoptionsComponent},
        {path: 'acccompany', component: CompanyComponent},
        {path: 'reportcard', component: ReportcardComponent},
        {path: 'classsubject', component: ClassSubjectComponent},
        {path: 'assignment', component: AssignmentComponent},
        {path: 'mot', component: MotComponent},
        {path: 'house', component: HouseComponent},
        {path: 'student', component: StudentaddComponent},
        {path: 'marksdetail', component: MarksDetailComponent},
        {path: 'attendancesection', component: AttendanceSecComponent},
        {path: 'attendanceperiod', component: AttendancePerComponent},
        {path: 'staff', component: StaffComponent},
        {path: 'enquiry', component: EnquiryComponent},
        {path: 'acfeechart', component: AccfeechartComponent},
       {path: 'miscrec', component: MiscreceiptComponent},
      {path: 'acreceipt', component: AcreceiptComponent},
      {path: 'invitem', component: InvitemsComponent},
      {path: 'vendor', component: VendorsComponent},
      {path: 'acmisc', component: AcmiscrecsComponent},
      {path: 'clteacher', component: ClassteacherComponent},
      {path: 'suballot', component: SuballotComponent},
      {path: 'hrdept', component: StfdepartmentComponent},
      {path: 'assch', component: AssschComponent},
      {path: 'holidays', component: HolidaysComponent},
      {path: 'yrcalender', component: YrcalenderComponent},
      {path: 'bookissue', component: BookissueComponent},
      // {path: 'books', component: BooksComponent},
      {path: 'books/:bookid', component: BooksComponent},
        
      ]
    },
    { path: 'Unauthorized', component: C401HComponent },
];

const config: ExtraOptions = {
    useHash: true,
};

  @NgModule({
    imports: [RouterModule.forRoot(ROUTES, config)],
    exports: [RouterModule],
  })
  export class AppRoutingModule {
  }  