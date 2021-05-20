 import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { CommonService } from './common.service';
import { AlertService } from './alert.service';


@Injectable()
export class ReportsServiceService {

  	constructor(
  		private http: HttpClient,
    	private commonService: CommonService,
    	private alertService: AlertService
   	) { }
  	
   	getReports(ownfleet, driverId, plateId): Promise<any> {
	    if(plateId == 'null' || plateId == null || plateId == undefined || plateId == 'undefined'){plateId = '-1'};
	    if(driverId == 'null' || driverId == null|| driverId == undefined || driverId == 'undefined'){driverId = '-1'};
	    if(ownfleet == 'null' || ownfleet == null|| ownfleet == undefined || ownfleet == 'undefined'|| ownfleet == 2 || ownfleet == '2'){ownfleet = '-1'};
	    const url = this.commonService.obtenerPrefijoUrlServicio() + 'reports/productivityReport/' + ownfleet + '/' + driverId + '/' + plateId + '/';
	    return this.http.get(url)
	    	.toPromise()
	      	.then(response => {
	        	if( response && response['estado'] && response['estado'] == 'EXITO' ) {
	          		return response['registros'];
	        	}
        		else {
	          		if (response && response['estado'] == 'ERROR') {
	            		this.alertService.error(response['mensaje']);
	          		}
	          	}
	        })
	        .catch((err) => this.commonService.handlePromiseError(err));
	}	


	getPlates(): Promise<any> {
	    const url = this.commonService.obtenerPrefijoUrlServicio() + 'reports/getPlatesByReport/';
	    return this.http.get(url)
	    	.toPromise()
	      	.then(response => {
	        	if( response && response['estado'] && response['estado'] == 'EXITO' ) {
	          		return response['registros'];
	        	}
        		else {
	          		if (response && response['estado'] == 'ERROR') {
	            		this.alertService.error(response['mensaje']);
	          		}
	          	}
	        })
	        .catch((err) => this.commonService.handlePromiseError(err));
	}
}
