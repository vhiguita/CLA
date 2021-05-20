import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {CommonService} from '../../../services/common.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbTabsetConfig, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../../../services/alert.service';
import { TraveltransitService } from '../../../services/traveltransit.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-travel-transit',
  templateUrl: './travel-transit.component.html',
  styleUrls: ['./travel-transit.component.css'],
})

export class TravelTransitComponent implements OnInit {
	exp: any = {};
	pago: any = {};
	travelId: any = {};
	traveltransit: any []=[];
	traveltransitApp: any []=[];
	traveltransitUnl: any []=[];
	traveltransitLoad: any []=[];

	constructor(
		public parserFormatter: NgbDateParserFormatter,
    	private route: ActivatedRoute,
    	private router: Router,
    	private commonService: CommonService,
		private alertService: AlertService,
	    private modalService: NgbModal,
	    private traveltransitService: TraveltransitService,
  	) { }

	ngOnInit() {
		this.obtenerViajes();
	}

	openModal(content, id) {
		

	   	this.pago= {};
	   	this.pago.status=0;
	   	this.exp.paymentDate="";
	   	this.travelId = id
	   	this.traveltransitService.obtenerViajePorId(this.travelId).then(response => {
	   		// this.traveltransit = response;
	   		this.traveltransitApp = response['appointment'];
			this.traveltransitUnl = response['unload'];
			this.traveltransitLoad = response['load'];
			
	   		const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});
	   		this.obtenerViajes();
	   		modalRef.result.then(value => {
		     	console.log('referencia.component.abrirDialogoCrearPago.modalRef.result.then', value);

	   		}).catch(reason => {
		       	console.log('referencia.component.abrirDialogoCrearPago.modalRef.result.catch', reason);
	   		})
 		})
 	}

	obtenerViajes(): void {
		this.traveltransitService.obtenerViajes().then(response => {
			this.traveltransit = response
			console.log('traveltransit  : ', response);
		});
	}

}
