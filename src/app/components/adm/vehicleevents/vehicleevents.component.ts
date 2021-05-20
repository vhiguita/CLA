import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Directive, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgxDatatableModule} from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgbTabsetConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { EventsService } from '../../../services/events.service';
import { Globals } from '../../../globals';
import {CommonService} from '../../../services/common.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { ReportsServiceService } from '../../../services/reports-service.service';
import { DualListComponent } from 'angular-dual-listbox';
import { Observable } from 'rxjs/Rx';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import * as $ from 'jquery';
import { TerceroService } from '../../../services/tercero.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-vehicleevents',
  templateUrl: './vehicleevents.component.html',
  styleUrls: ['./vehicleevents.component.css']
})
export class VehicleeventsComponent implements OnInit {
	report: any= {};
  	event: any={}
  	eventos: any;
    evento: any;
    reviewType: any = [];
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
  	eventoentTypesBuffer = [];
  	driversBuffer = [];
	  platesBuffer = [];
  	dataDrivers: any =[];
  	bufferSize = 50;
  	loading1 = false
  	objReview: any= {};
    objReviewAll: any= {};
  	objReviewOne: any= {};
  	modalRev: any;
  	modalRevAll: any;
  	checkObs: any;
  	obs: any;
  	vehicleId: number = -1;
  	eventTypesBuffer = [];

    @ViewChild('modalContent') modalContent: HTMLElement;
    @ViewChild('modalContentAll') modalContentAll: HTMLElement;
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
  	this.vehicleId=this.route.snapshot.params.vehicleId;
  	console.log('this.placaVehiculo : ', this.vehicleId)
    this.paramEvent = '-1';
    this.paramPlate = this.vehicleId;
    this.paramDriver = '-1';
    this.paramTravel = '-1';
    this.obtenerEventos(this.paramEvent, this.paramPlate, this.paramDriver, this.paramTravel)
  }


  openModal(content, id) {

      this.obtenerTiposRevision()
      this.idEvent = id
      console.log('id id idi id di : ', id, this.objReviewOne)   
      this.modalRev = this.modalService.open(content, {backdrop: 'static', size: 'lg'});
      this.modalRev.result.then(value => {
        console.log('referencia.component.abrirDialogoCrearPago.modalRef.result.then', value);

      }).catch(reason => {
          console.log('referencia.component.abrirDialogoCrearPago.modalRef.result.catch', reason);
      })
    
  }  

  openModalAll(content) {
      this.obtenerTiposRevision()
      this.modalRev = this.modalService.open(content, {backdrop: 'static', size: 'lg'});
      this.modalRev.result.then(value => {
        console.log('referencia.component.abrirDialogoCrearPago.modalRef.result.then', value);

      }).catch(reason => {
          console.log('referencia.component.abrirDialogoCrearPago.modalRef.result.catch', reason);
      })
    
  } 

  obtenerEventos(paramEvent, paramPlate, paramDriver, paramTravel): void {
    console.log('paramEvent : ', paramEvent)
    console.log('paramPlate : ', paramPlate)
    console.log('paramDriver : ', paramDriver)
    console.log('paramTravel : ', paramTravel)
    this.eventsService.obtenerEventos(paramEvent, paramPlate ,  paramDriver, paramTravel).then(response => {
      if(response){
        this.eventos = response
        console.log('this.eventos : ', this.eventos)
        this.classes = this.eventos.classEventType
      }
    }); 
  }
  
  obtenerTiposRevision(): void{
      this.eventsService.obtenerTiposRevision().then(response => {
        response.map((i) => { 
          console.log('i : : : :', i)
          i.description = i.event;
          return i; 

        });  
        this.reviewType = response;
      });
  } 

  guardarRevisionCheck(): void {
    this.checkObs = this.objReviewAll
    var checkboxes=document.getElementsByTagName('input');
    let observaciones = $("objReviewAll").val()

    this.objReviewAll.fechaRevision = new Date()
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
    this.obtenerEventos('-1', this.vehicleId, '-1', '-1');
  }

  guardarRevision(): void {
    console.log('objReviewOne : : : ', this.objReviewOne)
    this.objReviewOne.idEvent = this.idEvent
    this.objReviewOne.fechaRevision = new Date()
    this.objReviewOne.usuario = this.commonService.obtenerNombreUsuario()
    console.log('objReview', this.objReviewOne)     
    this.eventsService.guardarRevision(this.objReviewOne)
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
              this.obtenerEventos('-1', this.vehicleId, '-1', '-1');
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
