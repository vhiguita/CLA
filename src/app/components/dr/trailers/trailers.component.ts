import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TrailerService} from '../../../services/trailer.service';
import {UsuarioService} from '../../../services/usuario.service';
import {CommonService} from '../../../services/common.service';
import { Globals } from '../../../globals';

@Component({
  selector: 'app-trailers',
  templateUrl: './trailers.component.html',
  styleUrls: ['./trailers.component.css']
})
export class TrailersComponent implements OnInit {

  trailers: any []=[];
  btnIsVisible: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trailerService: TrailerService,
    private usuarioService: UsuarioService,
    private globals: Globals,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    try {
      clearInterval(this.globals.intVal);
    }catch(error) {}
    
    this.moduloEsLecturaEscritura(9);
    this.obtenerTrailers();
  }
  moduloEsLecturaEscritura(moduleId){
    var rolId = this.commonService.obtenerIdCodigoPerfilUsuario();
    this.usuarioService.moduloEsLecturaEscritura(rolId,moduleId).then(response => this.btnIsVisible = response);
  }
  obtenerCodigoPerfilUsuario(): string {
    return this.commonService.obtenerCodigoPerfilUsuario();
  }
  obtenerTrailers(): void {
    this.trailerService.obtenerTrailers().then(response => {
      this.trailers = response;
    });
  }
  edit(index){
     var id=this.trailers[index].id;
     this.router.navigate(['/home/dr/trailer',id]);
  }

}
