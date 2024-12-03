import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { GeneralService } from 'src/app/services/general.service';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { ReporteService } from 'src/app/services/reporte.service';
import * as CryptoJS from 'crypto-js';
import exifr from 'exifr';

@Component({
  selector: 'app-imagenes',
  templateUrl: './imagenes.page.html',
  styleUrls: ['./imagenes.page.scss'],
})
export class ImagenesPage implements OnInit {
  tipousu: any;
  idusuario: number;
  metadata: any = {};
  imageHash: string = ''; // Variable para almacenar el hash de la imagen
  imageFile: File | null = null; // Archivo de la imagen seleccionada
  metadata1: any = {};
  elaImageUrl: string | null = null;
  public file: any;
  
  id_reportesmeta:number=0;
  fechaActual:string;
  imagenor:any;
  imageUrl: string | null = null;
  imageUrlor: string | null = null;



  id_imagen:number=0;
  constructor(
    
    public servG: GeneralService, 
    private loading: LoadingController,
    private servI: ImagenesService,
    private firebaseStorage: FirebaseStorageService,
    private servRe: ReporteService
  ) { }

  ngOnInit() {
    this.retornarusu1();
    this.retornarinvg();
  }
  retornarusu1() {
    const userSession = JSON.parse(localStorage.getItem('idusu'));
    this.idusuario = userSession;
    console.log('id usuario: ' + userSession);
  }
  id_investigacion:any;
  retornarinvg() {
    const userSession = JSON.parse(localStorage.getItem('id_investigacion'));
    this.id_investigacion = userSession;
    console.log('id_investigacion:', userSession);
    return this.id_investigacion
  } 
  async generarshash(){
    if (this.imageFile) {
      // Extrae los metadatos usando exifr
      this.metadata = await exifr.parse(this.imageFile);
      console.log('Metadatos:', this.metadata);
      
      // Genera el hash SHA-256 de la imagen
      const fileArrayBuffer = await this.imageFile.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(fileArrayBuffer);
      this.imageHash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
      console.log('Hash SHA-256:', this.imageHash);
    }
  }

  onImageUpload(event: any) {
    
    this.imageFile = event.target.files[0];
    this.generarshash();
    if (this.imageFile) {
      this.imageUrlor = URL.createObjectURL(this.imageFile); // Crear URL de objeto para vista previa
    }
    const file: File = event.target.files[0];
    this.elaImageUrl = null;

    if (file) {
      
      const metadata = {
        name: file.name,
        size: file.size.toString(),
        type: file.type,
        lastModified: file.lastModified.toString(),
      };
      this.file = file;
      this.metadata1 = metadata;
      this.firebaseStorage.uploadImageWithMetadata(file, metadata).subscribe((url) => {
        this.imageUrl = url;
        console.log('Image and metadata uploaded successfully! URL:', this.imageUrl);
      }
    );
    }
  }

  async guardar_imagenes(){
    
      console.log(this.fechaActual,this.imageHash,this.idusuario,this.imageUrl,this.metadata)
    //   const loading = await this.loading.create();
    // loading.present();
    // this.servRe.generatereportmeta({
    //   id_imagen: this.id_imagen,
    //   id_usuario:this.idusuario,
      
    //   hashrepormeta: this.imageHash,
    //   fechareportmeta : this.fechaActual,
    //   urlimagen: this.imageUrl,
    //   metareport: JSON.stringify(this.metadata),
    // }).subscribe((data: any) => {
    //   loading.dismiss();
    //   this.servG.fun_Mensaje(data.mensaje);
    // }, () => {
    //   loading.dismiss();
    //   this.servG.fun_Mensaje('Error al grabar la imagen', 'danger');
    // });
  }
    
  }


