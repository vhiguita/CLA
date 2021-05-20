import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {CommonService} from './common.service';
import {AlertService} from './alert.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/of';

@Injectable()
export class ManifiestoService {

  constructor(
    private http: HttpClient,
    private httpClient: HttpClient,
    private commonService: CommonService,
    private alertService: AlertService
  ) { }
  obtenerRiesgos(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getRisks/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          // return response['registros'][0];
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerTipoServicios(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getServiceType/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          // return response['registros'][0];
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerManifiestos(){
    //const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Manifests/';
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelManifests/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          // return response['registros'][0];
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerManifiestosRechazados(){
    //const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Manifests/';
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getRejectedTravelManifests/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          // return response['registros'][0];
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerManifiestosPendientes(){
    //const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Manifests/';
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getPendentTravelManifests/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          // return response['registros'][0];
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerManifiesto(id){
   if(id>-1){
     //const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Manifests/?id='+id;
     const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelManifests/?id='+id;
     return this.http.get(url)
       .toPromise()
       .then(response => {
         if (response && response['estado'] && response['estado'] == 'EXITO') {
           // return response['registros'][0];
           return response['registros'];
         } else {
           if (response && response['estado'] == 'ERROR') {
             this.alertService.error(response['mensaje']);
           }
         }
       })
       .catch((err) => this.commonService.handlePromiseError(err));
   }
  }
  crearActualizarManifiesto(manifiesto: any): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelManifests/';
    return this.http.post(url, manifiesto)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerSolicitudes(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelRequests/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          // return response['registros'][0];
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerSolicitudesRechazadas(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getRejectedTravelRequests/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        //console.log('usuario.service.obtenerSolicitudes:', response);
        if (response && response['estado'] && response['estado'] == 'EXITO') {
           return response['registros'];
          //return JSON.parse(response['registros']);
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerSolicitudesParaAsignar(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getNewTravelRequests/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerSolicitud(id){
   if(id>-1){
     const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelRequests/?id='+id;
     return this.http.get(url)
       .toPromise()
       .then(response => {
         if (response && response['estado'] && response['estado'] == 'EXITO') {
           // return response['registros'][0];
           return response['registros'];
         } else {
           if (response && response['estado'] == 'ERROR') {
             this.alertService.error(response['mensaje']);
           }
         }
       })
       .catch((err) => this.commonService.handlePromiseError(err));
   }
  }
  crearActualizarSolicitud(solicitud: any): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelRequests/';
    return this.http.post(url, solicitud)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  crearActualizarCargue(cargue: any): Promise<any>{
    //const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Loads/';
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelLoads/';
    return this.http.post(url, cargue)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerCargues(idSolicitud): Promise<any> {
    if (idSolicitud > -1) {
      //const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Loads/?cosignmentId=' + idRemesa;
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelLoads/?travelRequestId=' + idSolicitud;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  obtenerCargue(id): Promise<any> {
    if (id > -1) {
      //const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Loads/?id=' + id;
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelLoads/?id=' + id;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  borrarCargue(id):Promise<any> {
    //const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Loads/';
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelLoads/';
    var param = {
              "id" : id,
              "del" : "1",
    };
    return this.http.post(url, JSON.stringify(param))
      .toPromise()
      .then(response => {
        //console.log('tercero.service.borrarContacto:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  crearActualizarDescargue(descargue: any): Promise<any>{
    //const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Unloads/';
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelUnloads/';
    return this.http.post(url, descargue)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerDescargues(idSolicitud): Promise<any> {
    if (idSolicitud > -1) {
      //const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Unloads/?cosignmentId=' + idRemesa;
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelUnloads/?travelRequestId=' + idSolicitud;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  obtenerDescargue(id): Promise<any> {
    if (id > -1) {
      //const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Unloads/?id=' + id;
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelUnloads/?id=' + id;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  borrarDescargue(id):Promise<any> {
    //const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Unloads/';
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelUnloads/';
    var param = {
              "id" : id,
              "del" : "1",
    };
    return this.http.post(url, JSON.stringify(param))
      .toPromise()
      .then(response => {
        //console.log('tercero.service.borrarContacto:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  crearActualizarRemesa(remesa: any): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Cosignments/';
    return this.http.post(url, remesa)
      .toPromise()
      .then(response => {
        console.log('conductor.service.crearActualizarReferencia:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerRemesas(idManifiesto): Promise<any> {
    if (idManifiesto > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getCosignmentsByManifest/?manifestId=' + idManifiesto;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  obtenerRemesa(id): Promise<any> {
    if (id > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Cosignments/?id=' + id;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  obtenerConexos(idManifiesto): Promise<any> {
    if (idManifiesto > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/ManifestRelated/?manifestId=' + idManifiesto;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  obtenerConexo(id): Promise<any> {
    if (id > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/ManifestRelated/?id=' + id;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  borrarConexo(id):Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/ManifestRelated/';
    var param = {
              "id" : id,
              "del" : "1",
    };
    return this.http.post(url, JSON.stringify(param))
      .toPromise()
      .then(response => {
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  crearActualizarConexo(conexo: any): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/ManifestRelated/';
    return this.http.post(url, conexo)
      .toPromise()
      .then(response => {
        //console.log('conductor.service.crearActualizarReferencia:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerListaRequerimientos(): Promise<any> {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getRequirement/';
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerRequerimientosManifiesto(idManifiesto): Promise<any> {
    if (idManifiesto > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getRequirementsByManifest/?manifestId=' + idManifiesto;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  obtenerRequerimientosSolicitud(idSolicitud): Promise<any> {
    if (idSolicitud > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getRequirementsByRequest/?travelRequestId=' + idSolicitud;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  borrarRequerimientosSolicitud(idSolicitud){
    if (idSolicitud > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/DeleteRequirementByRequest/';
      var param = {
                "travelRequestId" : idSolicitud,
                "del" : "1"
      };
      return this.http.post(url, JSON.stringify(param))
        .toPromise()
        .then(response => {
          console.log('tercero.service.borrarRequerimiento:', response);
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  crearRequerimientoSolicitud(idSolicitud,idRequerimiento): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/SaveRequirementByRequest/';
    var param = {
              "travelRequestId" : idSolicitud,
              "requirementId" : idRequerimiento
    };
    console.log(param);
    return this.http.post(url, JSON.stringify(param))
      .toPromise()
      .then(response => {
        console.log('tercero.service.crearRequerimientoSolicitud:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  borrarRequerimientosManifiesto(idManifiesto){
    if (idManifiesto > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/DeleteRequirementByManifest/';
      var param = {
                "manifestId" : idManifiesto,
                "del" : "1"
      };
      return this.http.post(url, JSON.stringify(param))
        .toPromise()
        .then(response => {
          console.log('tercero.service.borrarContacto:', response);
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  crearRequerimientoManifiesto(idManifiesto,idRequerimiento): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/SaveRequirementByManifest/';
    var param = {
              "manifestId" : idManifiesto,
              "requirementId" : idRequerimiento
    };
    console.log(param);
    return this.http.post(url, JSON.stringify(param))
      .toPromise()
      .then(response => {
        console.log('tercero.service.crearRequerimientoManifiesto:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerProductos(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getProducts/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('usuario.service.obtenerRegimenesPorTipo:', response);
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          // return response['registros'][0];
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerTiposEmpaque(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getPackageType/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('usuario.service.obtenerRegimenesPorTipo:', response);
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          // return response['registros'][0];
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerCondiciones(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getConditions/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('usuario.service.obtenerRegimenesPorTipo:', response);
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          // return response['registros'][0];
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerTiposContenedor(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getContainerType/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          // return response['registros'][0];
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerDetallesManifiesto(idManifiesto){
    if (idManifiesto > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getManifestDetail/?travelManifestId=' + idManifiesto;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  crearDetalleManifiesto(idManifiesto,solicitudes,estadoSolicitud): Promise<any>{
    const newObject = {};
    newObject['travelManifestId'] = idManifiesto;
    newObject['requestStatus'] = estadoSolicitud
    newObject['registros'] = solicitudes;
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/saveManifestDetail/';

    return this.http.post(url, newObject)
      .toPromise()
      .then(response => {
        console.log('tercero.service.crearRequerimientoManifiesto:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  actualizarEstadosSolicitudes(solicitudes,estadoSolicitud): Promise<any>{
    const newObject = {};
    newObject['requestStatus'] = estadoSolicitud;
    newObject['registros'] = solicitudes;
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/saveRequestStatus/';

    return this.http.post(url, newObject)
      .toPromise()
      .then(response => {
        console.log('tercero.service.crearRequerimientoManifiesto:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  borrarDetalleManifiesto(idManifiesto){
    if (idManifiesto > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/deleteManifestDetail/';
      var param = {
                "travelManifestId" : idManifiesto
      };
      return this.http.post(url, JSON.stringify(param))
        .toPromise()
        .then(response => {
          console.log('tercero.service.borrarContacto:', response);
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  notificarConductor(idVehiculo, msg){
    if (idVehiculo > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/notifyToDriver/';
      var param = {
                "vehicleId" : idVehiculo,
                "msg" : msg
      };
      return this.http.post(url, JSON.stringify(param))
        .toPromise()
        .then(response => {
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  enviarNotificacionPush(placaVehiculo, mensaje){
    if (placaVehiculo!="") {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/sendPushMsgToDriver/';
      var param = {
                "vehiclePlate" : placaVehiculo,
                "msg" : mensaje
      };
      return this.http.post(url, JSON.stringify(param))
        .toPromise()
        .then(response => {
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  actualizarEstadoSolicitud(solicitud: any): Promise<any>{
    console.log('solicitud : ', solicitud)
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/updateTravelRequestStatus/';
      return this.http.post(url, solicitud)
        .toPromise()
        .then(response => {
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
  }
  actualizarEstadoManifiesto(manifiesto: any): Promise<any>{
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/updateTravelManifestStatus/';
      return this.http.post(url, manifiesto)
        .toPromise()
        .then(response => {
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
  }
  actualizarEstadoCita(manifiesto: any): Promise<any>{
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/updateTravelManifestAppointmentStatus/';
      return this.http.post(url, manifiesto)
        .toPromise()
        .then(response => {
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerTiposRechazo(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getRejectionType/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          // return response['registros'][0];
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  crearHistorialSolicitud(historialSolicitud: any): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelRequestRecords/';
    return this.http.post(url, historialSolicitud)
      .toPromise()
      .then(response => {
        console.log('tercero.service.crearRequerimientoSolicitud:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  crearHistorialViaje(historialViaje: any): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelManifestRecords/';
    return this.http.post(url, historialViaje)
      .toPromise()
      .then(response => {
        console.log('tercero.service.crearRequerimientoSolicitud:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerHistorialViajes(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelManifestRecords/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          // return response['registros'][0];
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerHistorialSolicitudes(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/TravelRequestRecords/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          // return response['registros'][0];
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerManifiestoDetalleInfo(idManifiesto){
    if (idManifiesto > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getManifestDetailInfo/?travelManifestId=' + idManifiesto;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  obtenerSolicitudesDisponibles(idManifiesto){
    if (idManifiesto > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getAvailableManifests/?travelManifestId=' + idManifiesto;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  obtenerRespuestasConductores(idManifiesto){
    if (idManifiesto > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getResponsesByManifest/?travelManifestId=' + idManifiesto;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  borrarRespuestasConductores(idManifiesto){
    if (idManifiesto > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/DeleteResponsesByManifest/';
      var param = {
                "travelManifestId" : idManifiesto,
                "del" : "1"
      };
      return this.http.post(url, JSON.stringify(param))
        .toPromise()
        .then(response => {
          console.log('tercero.service.borrarRequerimiento:', response);
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  guardarRespuestasConductores(idManifiesto, vehiculos): Promise<any>{
      console.log("n viaje 2 : : : : : : : : : : : : : : " , idManifiesto);
      const newObject = {};
      newObject['travelManifestId'] = idManifiesto;
      newObject['registros'] = vehiculos;
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/SaveResponsesByManifest/';
      return this.http.post(url, newObject)
        .toPromise()
        .then(response => {
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
  }
  enviarInvitacion(fecha, origenId, destinoId, vehiculos, comentarios): Promise<any>{
      const newObject = {};
      newObject['date'] = fecha;
      newObject['originCityId'] = origenId;
      newObject['destinationCityId'] = destinoId;
      newObject['comments'] = comentarios;
      newObject['registros'] = vehiculos;
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/saveInvitationToDriver/';
      return this.http.post(url, newObject)
        .toPromise()
        .then(response => {
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
  }
  guardarCondicionesViaje(viajeId, condiciones): Promise<any>{
      const newObject = {};
      newObject['travelManifestId'] = viajeId;
      newObject['registros'] = condiciones;
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/saveManifestConditions/';
      return this.http.post(url, newObject)
        .toPromise()
        .then(response => {
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
  }
  anularViajes(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/CancelManifest/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          //return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            //this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerViajes(): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getApprovedTravels/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerViajesActivos(): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getEnabledTravels/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerViajesCita(): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getTravelsByAppointment/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerUbicacionVehiculo(userAccount, userPass): Promise<any> {
    console.log('ingresando al servicio ', userAccount);
    const url = 'http://www.trackingarea.com:8081/Service.svc/getVehicleLocation/' + userAccount + '/' + userPass;
    return this.http.get(url, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json; charset=UTF-8'}})
      .toPromise()
      .then(obj => {
        return obj;
      });
  }
  obtenerUbicacionVehiculos(): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getCurrentPositions/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));;
  }
  actualizarRutaPuntos(manifiesto: any): Promise<any>{
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/updateRoutePoints/';
      return this.http.post(url, manifiesto)
        .toPromise()
        .then(response => {
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
  }
}
