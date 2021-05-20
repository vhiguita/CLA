import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { AlertService } from './alert.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class PointsService {

  constructor(
    private http: HttpClient,
    private httpClient: HttpClient,
    private commonService: CommonService,
    private alertService: AlertService
  ) { }

  getPointById(idPoint): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'Service.svc/getPointById/' + idPoint;
    return this.http.get(url, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json; ; charset=UTF-8'}})
      .toPromise()
      .then(obj => {
        const response = JSON.parse(obj.toString());
        return response;
      });
  }
  getPointByUser(userAccount): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'Service.svc/getCtrlPointByUser/' + userAccount;
    return this.http.get(url, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json; ; charset=UTF-8'}})
      .toPromise()
      .then(obj => {
        const response = JSON.parse(obj.toString());
        return response;
      });
  }
  getPoints(idRoute): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'Service.svc/getCtrlPts/' + idRoute;
    return this.http.get(url, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json; ; charset=UTF-8'}})
      .toPromise()
      .then(obj => {
        const response = JSON.parse(obj.toString());
        return response;
      });
  }
  saveUpdatePoint(point:any): Promise<any>{
    return this.http.post(this.commonService.obtenerPrefijoUrlServicio() + 'Service.svc/saveCtrlPt',
      JSON.stringify(point), {headers: {'Accept': 'application/json', 'Content-Type': 'application/json; ; charset=UTF-8'}})
      .toPromise()
      .then(obj => {
        const response = JSON.parse(obj.toString());
        if (response && response['message']) {
          //this.alertService.success(response['message']);
          } else {
          //this.alertService.error('error')
        }
        return response;
      });
  }
  deletePoint(id: any): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'Service.svc/deleteCtrlPt';
    var param = { "Id" : id };
    return this.http.post(url, JSON.stringify(param), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; ; charset=UTF-8'
      }
    }).toPromise().then(obj => {
        const response = JSON.parse(obj.toString());
        console.log('response delete : ', response)
        return response;
    });
  }
  getTypePoint(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'Service.svc/getTypePt/';
    return this.http.get(url, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json; ; charset=UTF-8'}})
      .toPromise()
      .then(obj => {
        const response = JSON.parse(obj.toString());
        return response;
      });
  }

crearActualizarVehiculo(vehiculo: any): Promise<any>{
    // console.log('vehiculo.service.crearActualizarVehiculo.vehiculo:', vehiculo);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/VehiclesByCompany/';
    return this.http.post(url, vehiculo)
    .toPromise()
    .then(response => {
      //console.log('usuario.service.crearActualizarVehiculo:', response);
      return response;
    })
    .catch((err) => this.commonService.handlePromiseError(err));
  }

  saveUpdateCheckingPoint(point: any): Promise<any>{
    console.log('point : : : ', point)

    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/routeControlPoints/';
    return this.http.post(url, point)
      .toPromise()
      .then(response => {
        return response;
      });
  }




  deleteCheckingPoint(del: any): Promise<any> {
    console.log('ingresando al servicio ')
    console.log('ingresando al servicio ', del)
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/routeControlPoints/';
    return this.http.post(url, del)
    .toPromise()
    .then(response => {
      console.log('deleteCheckingPoint().response:', response);
      if (response && response['estado'] && response['estado'] == 'EXITO') {
        return response;
      } else {
        if (response && response['estado'] == 'ERROR') {
          this.alertService.error(response['mensaje']);
        }
      }
    });
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

  getCheckingPoints(idRoute): Promise<any> {
    console.log(idRoute)
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/routeControlPoints/?routeId=' + idRoute;
    console.log('url : ', url)
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('getCheckingPoints().response:', response);
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      });
  }
  //getTypeCheckingPoint(userAccount): Promise<any> {
  getTypeCheckingPoint(idCompany: any): Promise<any> {
    console.log('getTypeCheckingPoint().idCompany:', idCompany);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/pointsByCompany/?idPointType=5' ;
    return this.http.get(url, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json; ; charset=UTF-8'}})
      .toPromise()
      .then(response => {
        console.log('getTypeCheckingPoint().response:', response);
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      });
  }
  getCheckingPoint(id): Promise<any> {
    console.log('id : ', id)
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/routeControlPoints/?Id=' + id;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('getCheckingPoint().response:', response);
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      });
  }
}
