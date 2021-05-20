import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TerceroService} from '../../../services/tercero.service';
import {UsuarioService} from '../../../services/usuario.service';
import {CommonService} from '../../../services/common.service';
import { Globals } from '../../../globals';

@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.css']
})
export class TercerosComponent implements OnInit {

  terceros: any []=[];
  btnIsVisible: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private terceroService: TerceroService,
    private usuarioService: UsuarioService,
    private globals: Globals,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    try {
      clearInterval(this.globals.intVal);
    }catch(error) {}

    this.moduloEsLecturaEscritura(7);
    this.obtenerTerceros();
  }
  moduloEsLecturaEscritura(moduleId){
    var rolId = this.commonService.obtenerIdCodigoPerfilUsuario();
    this.usuarioService.moduloEsLecturaEscritura(rolId,moduleId).then(response => this.btnIsVisible = response);
  }
  obtenerCodigoPerfilUsuario(): string {
    return this.commonService.obtenerCodigoPerfilUsuario();
  }
  obtenerTerceros(): void {
    this.terceroService.obtenerTerceros().then(response => {
      this.terceros=response;
    });
  }
  edit(index){
     var id=this.terceros[index].id;
     this.router.navigate(['/home/dr/tercero',id]);
  }

}
