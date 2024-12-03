import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';  // Importa AlertController
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { GeneralService } from 'src/app/services/general.service';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { ReporteService } from 'src/app/services/reporte.service';
import * as CryptoJS from 'crypto-js';
import exifr from 'exifr';

@Component({
  selector: 'app-subir-img',
  templateUrl: './subir-img.page.html',
  styleUrls: ['./subir-img.page.scss'],
})
export class SubirImgPage implements OnInit {
  
  idusuario: number;
  metadata: any = {};
  hash: string = ''; 
  imageFile: File | null = null;
  imgEvent: any; 
  imageUrl: string | null = null;
  imageUrlor: string | null = null;
  id_imagen: number = 0;
  listarimgenes: any[] = [];
  nombreimg: string;

  constructor(
    public servG: GeneralService, 
    private loadingCtrl: LoadingController,
    private servI: ImagenesService,
    private firebaseStorage: FirebaseStorageService,
    private servRe: ReporteService,
    private loading: LoadingController,
    private alertController: AlertController  // Inyecta AlertController
  ) {}

  ngOnInit() {
    this.retornarusu();
    this.retornarinvg();
  }
  ionViewWillEnter() {
    this.cargarimagenes();
    this.actualizarImagenes();
  }

  async cargarimagenes(){
    let l=await this.loading.create();
    l.present();
    this.servI.retornarimg(this.id_investigacion).subscribe(
      (respuesta:any)=>{
        this.listarimgenes=respuesta.data;
      console.log( 'lista reporte'+this.listarimgenes);
      l.dismiss();
      
      },(error:any)=>{
        l.dismiss();
        this.servG.fun_Mensaje("error al recuperar los reportes")
      }
      
    );
  }

  retornarusu() {
    const userSession = JSON.parse(localStorage.getItem('idusu'));
    this.idusuario = userSession;
    console.log('ID usuario: ' + userSession);
  }
  id_investigacion:any;
  retornarinvg() {
    const userSession1 = JSON.parse(localStorage.getItem('id_investigacion'));
    this.id_investigacion = userSession1;
    console.log('id_investigacion:', userSession1);
    return this.id_investigacion
  } 

  async generarHash() {
    if (this.imageFile) {
      this.metadata = await exifr.parse(this.imageFile);
      console.log('Metadatos:', this.metadata);
      
      const fileArrayBuffer = await this.imageFile.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(fileArrayBuffer);
      this.hash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
      console.log('Hash SHA-256:', this.hash);
    }
  }

  onImageUpload(event: any) {
    this.imgEvent = event;
    this.imageFile = event.target.files[0];
    this.nombreimg = this.imageFile.name;
    console.log('nombre: ' + this.nombreimg);
    this.generarHash();
    if (this.imageFile) {
      this.imageUrlor = URL.createObjectURL(this.imageFile);
    }
  }

  async guardarFire() {
    const file: File = this.imgEvent?.target.files[0];
    if (file) {
      const loading = await this.loadingCtrl.create({
        message: 'Subiendo imagen a la nube...',
        spinner: 'crescent'
      });
      await loading.present();

      const metadata = {
        name: file.name,
        size: file.size.toString(),
        type: file.type,
        lastModified: file.lastModified.toString(),
      };

      try {
        this.imageUrl = await new Promise<string>((resolve, reject) => {
          this.firebaseStorage.uploadImageWithMetadata(file, metadata).subscribe(
            (url) => {
              console.log('Imagen y metadatos subidos con éxito. URL:', url);
              resolve(url);
            },
            (error) => {
              console.error('Error al subir la imagen a Firebase:', error);
              reject(error);
            }
          );
        });
      } catch (error) {
        this.servG.fun_Mensaje('Error al subir la imagen a Firebase', 'danger');
      } finally {
        loading.dismiss();
      }
    }
  }

  async guardarImagenes() {
    // Verificar si la imagen ya está en la base de datos antes de continuar
    const imagenExiste = await this.verificarImagenExistente();
console.log(imagenExiste)
    if (imagenExiste) {
        // Si la imagen existe, procedemos con la carga y guardado
        console.log('si esta')
        this.servG.fun_Mensaje('La imagen ya existe en la base de datos', 'danger');

    } else {
        // Si la imagen no existe, mostramos un mensaje y no hacemos nada
        
        console.log('no esta')
        await this.guardarFire();

        if (this.imageUrl) {
            const loading = await this.loadingCtrl.create();
            loading.present();
            this.servI.fun_grabar_imagenes({
                id_imagen: this.id_imagen,
                hash: this.hash,
                metadatos: JSON.stringify(this.metadata),
                id_invg: this.id_investigacion,
                url_imagen: this.imageUrl,
                nombreimg: this.nombreimg,
            }).subscribe(
                (data: any) => {
                    loading.dismiss();
                    this.servG.fun_Mensaje(data.mensaje);
                    this.actualizarImagenes();  // Actualiza las imágenes al guardar una nueva
                },
                () => {
                    loading.dismiss();
                    this.servG.fun_Mensaje('Error al grabar la imagen', 'danger');
                }
            );
        } else {
            console.error('No se pudo obtener la URL de la imagen.');
            this.servG.fun_Mensaje('Error: no se pudo obtener la URL de la imagen', 'danger');
        }
    }
}

// Función que verifica si la imagen ya existe en la base de datos
verificarImagenExistente(): Promise<boolean> {
  return new Promise((resolve, reject) => {
      this.servI.fun_validar_imagen({
          hash: this.hash,
          id_invg: this.id_investigacion
      }).subscribe(
          (data: any) => {
              if (data.data && data.data.id_imagen) {
                  // Si existe, la imagen ya está registrada
                  resolve(true);
              } else {
                  // Si no existe, no hacemos nada
                  resolve(false);
              }
          },
          (error) => {
              console.error('Error al verificar la imagen:', error);
              resolve(false);
          }
      );
  });}
  

  async actualizarImagenes() {
    // Actualizar la lista de imágenes
    await this.cargarimagenes();  // Llama a cargarimagenes para recargar las imágenes
  }

  // Nueva función para manejar la alerta
  async borrarImagen1(id_imagen: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'Al eliminar la imagen se eliminaran los reportes relacionados a ella.',
      
      buttons: [
        {
          text: 'Eliminar Imagen/Reportes',
          handler: () => {
            this.borrarImagen(id_imagen); // Llama a la función para eliminar imagen y reportes
          }
        },
        
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Operación cancelada');
          }
        }
      ]
    });

    await alert.present();
  }

  borrarImagen(id_imagen: number) {

    interface RespuestaEliminar {
      mensaje: string;
    }
    this.id_imagen = id_imagen;
    console.log('ID de imagen seleccionada:', this.id_imagen);
    this.servI.eliminarimg(id_imagen).subscribe(
      (response: RespuestaEliminar) => {
        this.servG.fun_Mensaje(response.mensaje, 'success');
      },
      (error) => {
        this.servG.fun_Mensaje('Error al eliminar la imagen', 'danger');
      }
    );
    this.actualizarImagenes();
  }
  
}
