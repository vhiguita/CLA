import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { CommonService } from './common.service';
import { AlertService } from './alert.service';

@Injectable()
export class EventsService {

  constructor(
  		private http: HttpClient,
    	private commonService: CommonService,
    	private alertService: AlertService
    ) { }

  guardarRevision(review: any): Promise<any>{
    // console.log('vehiculo.service.crearActualizarVehiculo.vehiculo:', vehiculo);
    console.log('riviewwwwwwwwwww : ', review)
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'events/saveReview/';
    return this.http.post(url, review)
    .toPromise()
    .then(response => {
      //console.log('usuario.service.crearActualizarVehiculo:', response);
      return response;
    })
    .catch((err) => this.commonService.handlePromiseError(err));
  }

  getListVehiclesEvents(): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'events/eventsMain/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('events.service.getListVehiclesEvents:', response);
        if( response && response['estado'] && response['estado'] == 'EXITO' ) {
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));

  }


obtenerTiposRevision(): Promise<any> {
    //console.log('obtener tipos de carroceria : : ')
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'events/getReviewTypes/';    
    return this.http.get(url)
    .toPromise()
    .then(response => {
      console.log('events .service.obtenerTiposRevision:', response);
      if( response && response['estado'] && response['estado'] == 'EXITO' ) {
        return response['registros'];
      } else {
        if (response && response['estado'] == 'ERROR') {
          this.alertService.error(response['mensaje']);
        }
      }
    })
    .catch((err) => this.commonService.handlePromiseError(err));
  }

/*
  obtenerTiposRevision(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'events/getReviewTypes/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('events.service.obtenerTiposRevision:', response);
        if( response && response['estado'] && response['estado'] == 'EXITO' ) {
          console.log('response[registros] : ', response['registros'])
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
*/

  obtenerEventos(event, plate, driver, manifest): Promise<any> {
    console.log('servicio eventos-. -. -. -. ', plate)
    console.log('servicio manifest-. -. -. -. ', manifest)
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'events/getEvents/' + event + '/' + plate + '/' + driver + '/' + manifest;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('events.service.obtenerEventos:', response);
        if( response && response['estado'] && response['estado'] == 'EXITO' ) {
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }

  getEvenTypes(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'events/getEventTypes/';
    return this.http.get(url)
    .toPromise()
    .then(response =>{
      console.log('response : ', response)
      if(response && response['estado'] && response['estado'] == 'EXITO'){
        return response['registros'];
      }
      else{
        if (response && response['estado'] == 'ERROR') {
          this.alertService.error(response['mensaje']);
        }
      }
    })
  }
}
