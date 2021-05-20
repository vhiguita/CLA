import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {CommonService} from './common.service';
import {AlertService} from './alert.service';
import {Observable} from 'rxjs/Rx';


@Injectable()
export class TraveltransitService {

constructor(
	private http: HttpClient,
	private httpClient: HttpClient,
	private commonService: CommonService,
	private alertService: AlertService
	) { }

	obtenerViajes(): Promise<any> {
			const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getTravelByCompany/';
		return this.http.get(url)
		.toPromise()
		.then(response => {
			if( response && response['estado'] && response['estado'] == 'EXITO' ) {
				return response['travels'];
			} else {
				if (response && response['estado'] == 'ERROR') {
					this.alertService.error(response['mensaje']);
				}
			}
		})
		.catch((err) => this.commonService.handlePromiseError(err));
	}
	
	obtenerViajePorId(id): Promise<any> {
			const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getEventsByTravel/?id='+ id;
		return this.http.get(url)
		.toPromise()
		.then(response => {
			console.log('travelTransit.service.obtenerViaje:', response);
			console.log('response viaje 1: ', response)
			console.log('response 2222 2 2 2 2 2 : ', response['estado'])
			if( response && response['estado'] && response['estado'] == 'EXITO' ) {
				return response;
			} else {
				if (response && response['estado'] == 'ERROR') {
					this.alertService.error(response['mensaje']);
				}
			}
		})
		.catch((err) => this.commonService.handlePromiseError(err));
	}

}
