import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Observable} from 'rxjs/Observable';
import {any} from "codelyzer/util/function";
import swal from 'sweetalert2';
import {PointsService} from '../../../services/points.service';
import {RutaService} from '../../../services/ruta.service';
import {AlertService} from '../../../services/alert.service';
import {CommonService} from '../../../services/common.service';
// declare const google: any;
// var originMarker: any;
// var destinationMarker:any;
// var directionsService: any;
// var directionsDisplay: any;
// var originLat:number;
// var originLng:number;
// var destinationLat:number;
// var destinationLng:number;
// var marker: any;
// var map: any;
// var cl:any;
// var isLocCreated: boolean = false;
// var lat:number;
// var lng:number;
// var isRouteCreated: boolean = false;
@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.css']
})
export class PointsComponent implements OnInit {
  pointId: any;
  pointIdSave: any;
  point: any = {};
  points: any = [];
  circles: any =[];
  routes: any = [];
  checkingPoints: any = [];
  pointsType: any = [];
  routetrace: any = {};
  pointDel: any = {};
  modalPoint: any;
  data: any = {};
  wAux: any [] = [];
  public isPtCreated = false;
  public isValid = true;
  public isCollapsed = true;
  public routeId = 0;
  public isDisable = true;
  public isDisableInput = true;

  @ViewChild('modalUpdatePoint') modalUpdatePoint: HTMLElement;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routesService: RutaService,
    //private routeService: RouteService,
    private pointsService: PointsService,
    private commonService: CommonService,
    private alertService: AlertService,
    private modalService: NgbModal

  ) { }

  ngOnInit() {
    //this.point.pointtypeId = null;
    //this.point.consecutive  = 0;
    //this.point.time = 0;
    this.getCheckingType();
    this.getRoutes();

  }
  openModalPoint(pointId: any): void {
    console.log('this.pointId : ', pointId)
    console.log('oinys : : : ', this.points)
    //this.getTypePoints();
    let that = this;
    if(pointId>-1){
      this.pointIdSave = pointId;
      this.pointId = Object.assign({}, pointId);
      this.getCheckingType();
      // this.getrfids();
      this.pointsService.getCheckingPoint(pointId).then(response => {
        if (response) {
          console.log(response);
          this.point = {};
          this.point.Id = pointId;
          this.point.IdRoute = response[0].routeId;
          this.point.IdCtrlPoint = response[0].interestPointId;
          this.point.Consecutive = response[0].order;
          this.point.Time = response[0].time;
        }
      });
    }else{
      this.point = {};
      this.point.IdRoute =this.routeId;
    }

    this.modalPoint = this.modalService.open(this.modalUpdatePoint, {size: 'lg'});
    this.modalPoint.result.then(value => {
      console.log('component.abrirDialogoCrearCuenta.modalRef.result.then', value);
    }).catch(reason => {
        console.log('component.abrirDialogoCrearCuenta.modalRef.result.catch', reason);
    });
  }


  saveUpdatePt(): void {
    let that = this;
    console.log('guardando el punto de chequeo  ')
    this.pointsService.saveUpdateCheckingPoint(this.point)
      .then(response => {
        console.log('this.point.Id : : : : : ', this.point.Id);
        console.log('response : ', response)
        if (response.estado == 'EXITO') {
          if(this.point.Id != null){
            swal({ 
              title: 'Punto de chequeo actualizado exitosamente.',
              text: '',
              type: 'success'
            }).catch(swal.noop);
          }else{
            swal({
              title: 'Punto de chequeo guardado exitosamente.',
              text: '',
              type: 'success'
            }).catch(swal.noop);
          }


            this.modalPoint.close();
            this.pointsService.getCheckingPoints(this.routeId).then(response => {
              if(response){
                var len=response.length;
                if(len>0){
                   this.points=response;
               }
              }
            });
        }
        });
  }
  getRoutes():void{
   //this.routesService.getRoutesByUsername(this.commonService.obtenerNombreUsuario()).then(response => {
   this.routesService.obtenerRutas().then(response => {
     if(response){
       this.routes = response;
     }
   });
  }
  getTypePoints():void{
    this.pointsService.getTypePoint().then(response => {
      if(response){
        this.pointsType = response;
        console.log(this.pointsType);
      }
    });
  }
  getCheckingType():void{
    // this.pointsService.getTypeCheckingPoint(this.commonService.obtenerNombreUsuario()).then(response => {
    this.pointsService.getTypeCheckingPoint(this.commonService.obtenerIdEmpresaLogueada()).then(response => {
      if(response){
        console.log(response);
        this.checkingPoints = response;
      }
    });
  }
  /*onSelectTypePointId(value):void{
    if(value!="0" || value!=null){
      this.point.pointtypeId = parseInt(value);
    }
    if(value!="1"){
      this.point.consecutive  = 0;
      this.point.time = 0;
      this.isDisableInput=true;
    }else{
      this.isDisableInput=false;
    }
  }*/

  onSelectRoute(value):void{
    this.points = [];
    if(value!="0"){
      console.log(value);
      this.routeId=value;
      //this.routetrace.id =value;
	    //this.loadRoute(value);
      this.isDisable=false;
      console.log('value : ', value)
      this.pointsService.getCheckingPoints(value).then(response => {
        console.log(response);
        if(response){
          var len=response.length;
          if(len>0){
             this.points=response;
          }
        }
      });
     }else{
        this.isDisable=true;
     }
  }

  removePt(index){
     var id=this.points[index].id;
     this.pointDel.Id = id
     this.pointDel.del = 1
     console.log(id);
     let that = this;
     this.pointsService.deleteCheckingPoint(this.pointDel).then(response => {
          if (response){
            console.log('response : : : ', response)
            if (response.estado == 'EXITO') {
              swal({ 
                title: 'Punto de chequeo eliminado exitosamente.',
                text: '',
                type: 'success'
              }).catch(swal.noop);

              this.pointsService.getCheckingPoints(this.routeId).then(response => {
                if(response){
                  var len=response.length;
                  if(len>0){
                     this.points=response;
                 }
                }
              })
            }
          }
      })
  }
}
