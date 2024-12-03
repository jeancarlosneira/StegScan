import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ComponentesModule } from './componentes/componentes.module';

const routes: Routes = [
  // {
  //   path: 'inicio-sesion',
  //   loadChildren: () => import('./paginas/inicio-sesion/inicio-sesion.module').then( m => m.InicioSesionPageModule)
  // },
  {
    path: 'inicio-sesion',
    loadChildren: () => import('./paginas/inicio-sesion/inicio-sesion.module').then( m => m.InicioSesionPageModule)
  },
  {
    path: '',
    redirectTo: 'reginv',
    pathMatch: 'full'
  },
  
  {
    path: 'inicio-sesion',
    loadChildren: () => import('./paginas/inicio-sesion/inicio-sesion.module').then( m => m.InicioSesionPageModule)
  },
  {
    path: 'usuario',
    loadChildren: () => import('./paginas/usuario/usuario.module').then( m => m.UsuarioPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./paginas/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'ela',
    loadChildren: () => import('./paginas/ela/ela.module').then( m => m.ELAPageModule)
  },
  {
    path: 'metadatos2',
    loadChildren: () => import('./paginas/metadatos2/metadatos2.module').then( m => m.Metadatos2PageModule)
  },
  {
    path: 'estadisticas',
    loadChildren: () => import('./paginas/estadisticas/estadisticas.module').then( m => m.EstadisticasPageModule)
  },
  {
    path: 'subir-img',
    loadChildren: () => import('./paginas/subir-img/subir-img.module').then( m => m.SubirImgPageModule)
  },
  {
    path: 'imagenes',
    loadChildren: () => import('./paginas/imagenes/imagenes.module').then( m => m.ImagenesPageModule)
  },
  {
    path: 'comp-ela',
    loadChildren: () => import('./paginas/comp-ela/comp-ela.module').then( m => m.CompElaPageModule)
  },
  {
    path: 'ia',
    loadChildren: () => import('./paginas/ia/ia.module').then( m => m.IaPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./paginas/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'aggusuaio',
    loadChildren: () => import('./paginas/aggusuaio/aggusuaio.module').then( m => m.AggusuaioPageModule)
  },
  {
    path: 'estegoanalisis',
    loadChildren: () => import('./paginas/estegoanalisis/estegoanalisis.module').then( m => m.EstegoanalisisPageModule)
  },
  {
    path: 'estegoanalisis2',
    loadChildren: () => import('./paginas/estegoanalisis2/estegoanalisis2.module').then( m => m.Estegoanalisis2PageModule)
  },
  {
    path: 'informacion',
    loadChildren: () => import('./paginas/informacion/informacion.module').then( m => m.InformacionPageModule)
  },
  {
    path: 'reporte',
    loadChildren: () => import('./paginas/reporte/reporte.module').then( m => m.ReportePageModule)
  },
  {
    path: 'reportemeta',
    loadChildren: () => import('./paginas/reportemeta/reportemeta.module').then( m => m.ReportemetaPageModule)
  },
  {
    path: 'prueba',
    loadChildren: () => import('./paginas/prueba/prueba.module').then( m => m.PruebaPageModule)
  },
  {
    path: 'investigaciones',
    loadChildren: () => import('./paginas/investigaciones/investigaciones.module').then( m => m.InvestigacionesPageModule)
  },
  {
    path: 'addinvestigacion',
    loadChildren: () => import('./paginas/addinvestigacion/addinvestigacion.module').then( m => m.AddinvestigacionPageModule)
  },
  {
    path: 'invgterminadas',
    loadChildren: () => import('./paginas/invgterminadas/invgterminadas.module').then( m => m.InvgterminadasPageModule)
  },
  {
    path: 'reporteestega',
    loadChildren: () => import('./paginas/reporteestega/reporteestega.module').then( m => m.ReporteestegaPageModule)
  },
  {
    path: 'reportfin',
    loadChildren: () => import('./paginas/reportfin/reportfin.module').then( m => m.ReportfinPageModule)
  },
  {
    path: 'reginv',
    loadChildren: () => import('./paginas/reginv/reginv.module').then( m => m.ReginvPageModule)
  },
  {
    path: 'usoapp',
    loadChildren: () => import('./paginas/usoapp/usoapp.module').then( m => m.UsoappPageModule)
  },
  
  
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ComponentesModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
