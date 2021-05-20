import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {EmpresaComponent} from './components/adm/empresa/empresa.component';
import {PerfilComponent} from './components/adm/perfil/perfil.component';
import {UsuarioComponent} from './components/adm/usuario/usuario.component';
import {EmpresasComponent} from './components/adm/empresas/empresas.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {UsuariosComponent} from './components/adm/usuarios/usuarios.component';
import {NotificacionesUsuarioComponent} from './components/adm/notificaciones-usuario/notificaciones-usuario.component';
import {CambioPasswordComponent} from './components/cambio-password/cambio-password.component';
import {OlvideMiClaveComponent} from './components/olvide-mi-clave/olvide-mi-clave.component';
import {AlertasComponent} from './components/adm/alertas/alertas.component';
import {PerfilesComponent} from './components/adm/perfiles/perfiles.component';
import { RutasComponent } from './components/rtn/rutas/rutas.component';
import { RutaComponent } from './components/rtn/ruta/ruta.component';
import { PuntosComponent } from './components/rtn/puntos/puntos.component';
import { PuntoComponent } from './components/rtn/punto/punto.component';
import { ConductoresComponent } from './components/dr/conductores/conductores.component';
import { ConductorComponent } from './components/dr/conductor/conductor.component';
import {NotificacionesJerarquiaComponent} from './components/adm/notificaciones-jerarquia/notificaciones-jerarquia.component';
import { VehiculosComponent } from './components/dr/vehiculos/vehiculos.component';
import { VehiculoComponent } from './components/dr/vehiculo/vehiculo.component';

const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'adm/empresas',
        component: EmpresasComponent
      },
      {
        path: 'adm/empresa/:idEmpresa',
        component: EmpresaComponent
      },
      {
        path: 'adm/perfiles',
        component: PerfilesComponent
      },
      {
        path: 'adm/usuarios',
        component: UsuariosComponent
      },
      {
        path: 'adm/usuario/:idUsuario',
        component: UsuarioComponent
      },
      {
        path: 'adm/notificacionesUsuario/:idUsuario',
        component: NotificacionesUsuarioComponent
      },
      {
        path: 'adm/alertas',
        component: AlertasComponent
      },
      {
        path: 'rtn/rutas',
        component: RutasComponent
      },
      {
        path: 'rtn/ruta/:idRuta',
        component: RutaComponent
      },
      {
        path: 'rtn/puntos',
        component: PuntosComponent
      },
      {
        path: 'rtn/punto/:idPunto',
        component: PuntoComponent
      },
      {
        path: 'dr/conductores',
        component: ConductoresComponent
      },
      {
        path: 'dr/conductor/:idConductor',
        component: ConductorComponent
      },
      {
        path: 'adm/notificacionesJerarquia',
        component: NotificacionesJerarquiaComponent
      },
      {
        path: 'dr/vehiculos',
        component: VehiculosComponent
      },
      {
        path: 'dr/vehiculo/:idVehiculo',
        component: VehiculoComponent
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'changePassword/:token',
    component: CambioPasswordComponent
  },
  {
    path: 'forgotMyPassword',
    component: OlvideMiClaveComponent
  },

  // otherwise redirect to home
  {
    path: '**',
    redirectTo: 'home/dashboard'
  },
];
export const routing = RouterModule.forRoot(appRoutes);
