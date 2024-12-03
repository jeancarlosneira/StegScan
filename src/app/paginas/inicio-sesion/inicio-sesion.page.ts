import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { UsuariosService } from 'src/app/services/usuarios.service';


@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {
  constructor(
    public servU: UsuariosService,
    public servG: GeneralService,
    private load: LoadingController
  ) { }
  usuario: string = "";
  contrasena: string = "";
  lista: any[] = [];
  id: any;
  showRegisterSection = false;
  idusu: any;
  ngOnInit() {
  }
  async login() {
    const loading = await this.load.create();
    await loading.present();
    console.log('Usuario:', this.usuario, 'Contraseña:', this.contrasena);
    this.servU.validar(this.usuario, this.contrasena).subscribe(
      async (respuesta: any) => {
        console.log('Respuesta de la API:', respuesta);
        this.lista = respuesta.data;
        if (this.lista.length > 0) {
          const userId = this.lista[0].id_usuario;
          localStorage.setItem('idusu', userId.toString());
          console.log(`Inicio de sesión exitoso: Usuario ${userId}`);
          this.servG.irA('/reginv');
        } else {
          this.servG.fun_Mensaje('Usuario o contraseña inválidos');
        }

        await loading.dismiss();
      },
      async (error: any) => {
        console.error('Error al validar credenciales:', error);
        await loading.dismiss();
        this.servG.fun_Mensaje('Error al iniciar sesión');
      }
    );
  }
  usuarionuevo() {
    this.servG.irA('/usuario')

  }

} 
