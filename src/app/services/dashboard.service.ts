import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {CommonService} from './common.service';
import {AlertService} from './alert.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/of';

@Injectable()
export class DashboardService {

  constructor(
  	private http: HttpClient,
    private httpClient: HttpClient,
    private commonService: CommonService,
    private alertService: AlertService) {}

  	obtenerUbicacioVehiculos(){
  		console.log('ingresando al servicio de vehiculo');
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'traveltracking/vehiculeLocation/';
  		return this.http.get(url)
  		.toPromise()
  		.then(response => {
        if (response) {
          console.log('respuesta de vehiculos', response)
          return response;
        } else {
            this.alertService.error(response['mensaje']);
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  	}
}
