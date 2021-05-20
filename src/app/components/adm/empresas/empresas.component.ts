import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EmpresaService} from '../../../services/empresa.service';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  empresas: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empresaService: EmpresaService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.obtenerEmpresas();
  }

  obtenerEmpresas(): void {
    this.empresaService.obtenerEmpresas().then(response => this.empresas = response);
  }
}
