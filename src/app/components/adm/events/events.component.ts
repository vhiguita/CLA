import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { EventsService } from '../../../services/events.service';
import { CommonService } from '../../../services/common.service';
import { Globals } from '../../../globals';
import { ReportsServiceService } from '../../../services/reports-service.service';
import { TerceroService } from '../../../services/tercero.service';
import swal from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  report: any= {};
  event: any={}
  eventos: any;
  evento: any;
  classes:any;
  plates: any
  driverId: any;
  plateId: any;

  paramEvent: any;
  paramPlate: any;
  paramDriver: any;
  paramTravel: any;

  idEvent: any;

  drivers: any = [];
  eventTypes: any = [];
  eventTypesBuffer = [];
  driversBuffer = [];
  platesBuffer = [];
  dataDrivers: any =[];
  bufferSize = 50;
  loading1 = false
  objReview: any= {};
  objReviewAll: any= {};

  modalRev: any;
  modalRevAll: any;
  checkObs: any;
  obs: any;
  constructor(
	  	private route: ActivatedRoute,
	    private router: Router,
      private reportsService: ReportsServiceService,
	    private eventsService: EventsService,
	    private alertService: AlertService,
	    private globals: Globals,
	    private commonService: CommonService,
      private terceroService: TerceroService,
      private modalService: NgbModal,
	) { }

  ngOnInit() {
    
    this.getPlates();
    this.getActiveDrivers();
    this.getEventTypes()
    this.paramEvent = '-1';
    this.paramPlate = '-1';
    this.paramDriver = '-1';
    this.paramTravel = '-1';
    this.obtenerEventos(this.paramEvent, this.paramPlate, this.paramDriver, this.paramTravel)
  }

  openModal(content, id) {
      this.idEvent = id
      console.log('id id idi id di : ', id)   
      this.modalRev = this.modalService.open(content, {backdrop: 'static', size: 'lg'});
      this.modalRev.result.then(value => {
        console.log('referencia.component.abrirDialogoCrearPago.modalRef.result.then', value);

      }).catch(reason => {
          console.log('referencia.component.abrirDialogoCrearPago.modalRef.result.catch', reason);
      })
    
  }  

  openModalAll(content) {
      this.modalRev = this.modalService.open(content, {backdrop: 'static', size: 'lg'});
      this.modalRev.result.then(value => {
        console.log('referencia.component.abrirDialogoCrearPago.modalRef.result.then', value);

      }).catch(reason => {
          console.log('referencia.component.abrirDialogoCrearPago.modalRef.result.catch', reason);
      })
    
  } 

  guardarRevision(): void {

    let that = this
    that.obs = this.objReview
    console.log('that.obs : ', that.obs)

    this.objReview.idEvent = this.idEvent

    this.obs = this.objReview
    console.log('observaciones', this.obs)

    // console.log('this.objReview.idEvent : ', this.objReview.idEvent)
    this.objReview.observaciones = this.obs.observaciones
    // console.log('this.objReview.observaciones : ', this.objReview.observaciones )
    this.objReview.fechaRevision = new Date()
    // console.log('this.objReview.fechaRevision : ', this.objReview.fechaRevision)
    this.objReview.usuario = this.commonService.obtenerNombreUsuario()
    // console.log('this.objReview.usuario : ', this.objReview.usuario)
    // console.log('guardando observaciones de revision ', that.objReview)
    this.eventsService.guardarRevision(this.objReview)
      .then(response =>{
        if (response) {
          if (response.validate != '0'){
            if (response.estado == 'EXITO') {   
                swal({
                  title: 'Revision guardada correctamente.',
                  text: '',
                  type: 'success'
                }).catch(swal.noop);
              
              this.modalRev.close();
              this.obtenerEventos('-1', '-1', '-1', '-1');
            }
          }
          else{
            swal({
              title: response.mensaje,
              text: '',
              type: 'success'
            }).catch(swal.noop);
          }
        }
      })
  }


  guardarRevisionCheck(): void {
    this.checkObs = this.objReviewAll
    var checkboxes=document.getElementsByTagName('input');
    let observaciones = $("objReviewAll").val()

    this.objReviewAll.fechaRevision = new Date()
    this.objReviewAll.idEvent = new Date()
    this.objReviewAll.usuario = this.commonService.obtenerNombreUsuario()

  
    for(var i=0;i<checkboxes.length;i++){            
        if(checkboxes[i].type == "checkbox" && checkboxes[i].checked == true){
          if(checkboxes[i].value != 'on'){
            console.log('values : ', checkboxes[i].value)        
            console.log('values : ', checkboxes[i].checked)
            this.objReviewAll.idEvent = checkboxes[i].value
            this.eventsService.guardarRevision(this.objReviewAll)
            .then(response=>{
              if (response) {
                if (response.estado == 'EXITO') {  
                  console.log('guardo')
                }
              }              
            })
          }
        }        
    }

    swal({
        title: 'Revision guardada correctamente.',
        text: '',
        type: 'success'
      }).catch(swal.noop);    
    this.modalRev.close();
    this.obtenerEventos('-1', '-1', '-1', '-1');
  }
 

  obtenerEventos(paramEvent, paramPlate, paramDriver, paramTravel): void {
    this.eventsService.obtenerEventos(paramEvent, paramPlate ,  paramDriver, paramTravel ).then(response => {
      if(response){
        this.eventos = response
        console.log('this.eventos : ', this.eventos)
        this.classes = this.eventos.classEventType
      }
    }); 
  }

  getPlates(): void {
    this.reportsService.getPlates().then(response => {
      this.plates = response
      this.platesBuffer = this.plates.slice(0, this.bufferSize);
    });    
  }

  getActiveDrivers(): void {
    this.terceroService.obtenerTerceroPorTipo(1).then(response => {
      this.drivers = response;
      this.driversBuffer = this.drivers.slice(0, this.bufferSize);
    });
  }

  getEventTypes():void {
    this.eventsService.getEvenTypes().then(response => {
      this.eventTypes = response;
      this.eventTypesBuffer = this.eventTypes.slice(0, this.bufferSize);
    });
  }

  filterEvent():void {
    console.log('filter event : ')
    this.eventsService.obtenerEventos(this.event.id,this.event.plateId, this.event.thirdId, this.paramTravel).then(response => this.eventos = response);
  }

}
