import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import 'rxjs/add/operator/switchMap';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import {RouterModule} from '@angular/router';

import {routing} from './app.routing';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import {InterceptorService} from './interceptors/interceptor.service';
import {AuthGuard} from './guards/auth.guard';
import { CabezoteComponent } from './components/cabezote/cabezote.component';
import {AlertService} from './services/alert.service';
import {AuthenticationService} from './services/authentication.service';
import {CommonService} from './services/common.service';
import { MenuComponent } from './components/menu/menu.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { IeWarningComponent } from './components/ie-warning/ie-warning.component';
import { EmpresaComponent } from './components/adm/empresa/empresa.component';
import { UsuarioComponent } from './components/adm/usuario/usuario.component';
import { PerfilComponent } from './components/adm/perfil/perfil.component';
import {EmpresaService} from './services/empresa.service';
import {UsuarioService} from './services/usuario.service';
import {PerfilService} from './services/perfil.service';
import {ConductorService} from './services/conductor.service';
import {PuntoService} from './services/punto.service';
import {VehiculoService} from './services/vehiculo.service';
import { EmpresasComponent } from './components/adm/empresas/empresas.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsuariosComponent } from './components/adm/usuarios/usuarios.component';
import { AlertComponent } from './components/alert/alert.component';
import { NotificacionesUsuarioComponent } from './components/adm/notificaciones-usuario/notificaciones-usuario.component';
import { CambioPasswordComponent } from './components/cambio-password/cambio-password.component';
import { OlvideMiClaveComponent } from './components/olvide-mi-clave/olvide-mi-clave.component';
import { AlertasComponent } from './components/adm/alertas/alertas.component';
import { PerfilesComponent } from './components/adm/perfiles/perfiles.component';
import { NotificacionesJerarquiaComponent } from './components/adm/notificaciones-jerarquia/notificaciones-jerarquia.component';

import { RutasComponent } from './components/rtn/rutas/rutas.component';
import { RutaComponent } from './components/rtn/ruta/ruta.component';
import { PuntosComponent } from './components/rtn/puntos/puntos.component';
import { PuntoComponent } from './components/rtn/punto/punto.component';
import { ConductoresComponent } from './components/dr/conductores/conductores.component';
import { ConductorComponent } from './components/dr/conductor/conductor.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { VehiculosComponent } from './components/dr/vehiculos/vehiculos.component';
import { VehiculoComponent } from './components/dr/vehiculo/vehiculo.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CabezoteComponent,
    MenuComponent,
    PreloaderComponent,
    IeWarningComponent,
    EmpresaComponent,
    UsuarioComponent,
    PerfilComponent,
    EmpresasComponent,

    DashboardComponent,
    UsuariosComponent,
    AlertComponent,
    NotificacionesUsuarioComponent,
    CambioPasswordComponent,
    OlvideMiClaveComponent,
    AlertasComponent,
    PerfilesComponent,


    RutasComponent,
    RutaComponent,
    PuntosComponent,
    PuntoComponent,
    ConductoresComponent,
    ConductorComponent,
    NotificacionesJerarquiaComponent,
    VehiculosComponent,
    VehiculoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    NoopAnimationsModule,
    NgxDatatableModule
  ],
  providers: [
    AlertService,
    AuthGuard,
    AuthenticationService,
    CommonService,
    EmpresaService,
    UsuarioService,
    PerfilService,
    ConductorService,
    PuntoService,
    VehiculoService,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
