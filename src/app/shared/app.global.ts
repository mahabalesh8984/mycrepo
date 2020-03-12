import { Injectable } from '@angular/core';

@Injectable()
export class AppGlobals {
 readonly baseAPIUrl: string = 'http://106.51.136.76:8082/mycampz/v3/';
    // readonly baseAPIUrl: string = 'http://localhost:8182/mycampuztest/api/v3/';
    //readonly baseAPIUrl: string = './v3/';
    readonly reporturl: string = './api/v3/fpdf181/pdfreports/';
  // readonly baseAPIUrl: string = 'http://106.51.136.76:8081/mycampz/v3/';
//    readonly baseAPIUrl: string = 'http://localhost/angular/angular-jwt-auth/api/v3/';
 // readonly baseAPIUrl: string = 'http://122.166.201.111:8081/mycampz/v3/';
}

 