import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-cabezote',
  templateUrl: './cabezote.component.html',
  styleUrls: ['./cabezote.component.css']
})
export class CabezoteComponent implements OnInit {

  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() {
  }

  obtenerNombreUsuario(): string {
    return this.commonService.obtenerNombreUsuario();
  }

  obtenerCodigoPerfilUsuario(): string {
    return this.commonService.obtenerCodigoPerfilUsuario();
  }

  obtenerIdEmpresaLogueada(): number {
    return this.commonService.obtenerIdEmpresaLogueada();
  }

}
