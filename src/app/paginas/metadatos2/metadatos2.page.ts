import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import exifr from 'exifr';
import * as CryptoJS from 'crypto-js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LoadingController } from '@ionic/angular';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { ReporteService } from 'src/app/services/reporte.service';
import { ImagenesService } from 'src/app/services/imagenes.service';

import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { File as CordovaFile } from '@awesome-cordova-plugins/file/ngx';
import { image } from 'html2canvas/dist/types/css/types/image';


@Component({
  selector: 'app-metadatos2',
  templateUrl: './metadatos2.page.html',
  styleUrls: ['./metadatos2.page.scss'],
})
export class Metadatos2Page implements OnInit {
  id_imagen: number = 0;
  id_repmeta: any;
  idusuario: number;
  nombreimg: string = '';
  imageUrl: string | null = null;
  metadata = {};
  hash = '';
  imageFile: File | null = null;
  imageFile2: File | null = null;
  imageUrl2: string | null = null;
  fecha_inicio: string;
  
  nombrerepmeta: string = '';
  pdfGenerated: boolean = false;
  urlimagenor: string;
  imgEvent: any;
  id_investigacion: any;
  id_imagen1: any;
  constructor(
    public servG: GeneralService,
    private loading: LoadingController,
    private firebaseStorage: FirebaseStorageService,
    private servRe: ReporteService,
    private servI: ImagenesService,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.retornarusu();
    this.retornarinvg();
    this.cargarimagenes();
    const fecha = new Date();
    this.fecha_inicio = fecha.toISOString().slice(0, 19).replace('T', ' ');
    console.log(this.fecha_inicio)
  }
  retornarpage() {
    this.servG.irA('/main');
  }
  retornarusu() {
    const userSession = JSON.parse(localStorage.getItem('idusu'));
    this.idusuario = userSession;
    console.log('ID usuario:', userSession);
    return this.idusuario
  }

  retornarinvg() {
    const userSession1 = JSON.parse(localStorage.getItem('id_investigacion'));
    this.id_investigacion = userSession1;
    console.log('id_investigacion:', userSession1);
    return this.id_investigacion
  }

  listarimgenes:any[]=[];
  async cargarimagenes() {
    const l = await this.loading.create();
    l.present();
  
    this.servI.retornarimg(this.id_investigacion).subscribe(
      (respuesta: any) => {
        if (respuesta.data) {
          this.listarimgenes = respuesta.data;
  
          // Depuración: Verificar que cada imagen tiene la URL correcta
          console.log('Lista de imágenes:', this.listarimgenes);
  
          // Verificar que cada imagen tenga la URL accesible
          this.listarimgenes.forEach(imagen => {
            console.log('Imagen URL:', imagen.urlimagenor);
          });
        } else {
          console.error('No se encontraron imágenes en la respuesta.');
          this.servG.fun_Mensaje('No se encontraron imágenes para la investigación.');
        }
        l.dismiss();
      },
      (error: any) => {
        l.dismiss();
        console.error('Error al recuperar las imágenes:', error);
        this.servG.fun_Mensaje('Error al recuperar las imágenes.');
      }
    );
  }
  metadata1:any;
  async cargarimagenes2() {
    const l = await this.loading.create();
    l.present();
  
    this.servI.retornardataimg(this.id_imagen).subscribe(
      (respuesta: any) => {
        if (respuesta.data && respuesta.data.length > 0) {
          const imagen = respuesta.data[0]; // Accede al primer elemento del arreglo
          this.id_imagen = imagen.id_imagen;
          this.hash = imagen.hash;
          this.urlimagenor = imagen.url_imagen;
          this.nombreimg = imagen.nombreimg;
          this.metadata1 = imagen.metadatos;
          this.imageUrl = this.urlimagenor;
          this.metadata=JSON.parse(this.metadata1)

          console.log(
            'Datos cargados:',
            this.id_imagen,
            this.hash,
            this.urlimagenor,
            this.nombreimg,
            this.metadata
          );
        } else {
          console.error('No se encontraron datos en la respuesta.');
          this.servG.fun_Mensaje('No se encontraron datos para la imagen seleccionada.');
        }
        l.dismiss();
      },
      (error: any) => {
        l.dismiss();
        console.error('Error al recuperar los datos de la imagen:', error);
        this.servG.fun_Mensaje('Error al recuperar los datos de la imagen.');
      }
    );
    
  }
  seleccionarImagen(event: any) {
    this.id_imagen = event.detail.value;
    console.log('ID seleccionado:', this.id_imagen);
    this.cargarimagenes2()
    this.generarnombre();
    this.generateReport1 = true;
  }

  onImageUpload(event: any) {
    this.id_imagen=0;
    this.imageUrl='';
    this.imgEvent = event;
    this.imageFile = event.target.files[0];
    this.imageFile2 = event.target.files[0];
    if (this.imageFile) {
      this.imageUrl = URL.createObjectURL(this.imageFile);
      this.nombreimg = this.imageFile.name;
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageUrl2 = reader.result as string;  // El resultado es un string base64
        this.nombreimg = this.imageFile.name;
      };
      reader.readAsDataURL(this.imageFile2);  // Esto convertirá la imagen a base64
    }
    
  }
  async extractMetadata() {
    if (this.imageFile) {
      this.metadata = await exifr.parse(this.imageFile);
      const fileArrayBuffer = await this.imageFile.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(fileArrayBuffer);
      this.hash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
      if (!this.metadata || Object.keys(this.metadata).length === 0) {
        this.servG.fun_Mensaje('Intentando otro método para extraer metadatos...', 'warning');
        await this.extractMetadataAlternative();
      }
      if (this.metadata && Object.keys(this.metadata).length > 0) {
        this.servG.fun_Mensaje('Metadatos extraídos correctamente', 'success');
      }
    } else {
      this.servG.fun_Mensaje('Error al extraer metadatos', 'danger');
    }
    
    this.generateReport1 = true;
    this.generarnombre();
  }
  generateReport1: boolean = false;
  async extractMetadataAlternative() {
    try {
      const basicMetadata = {
        nommbre: ': ' + this.imageFile.name || null,
        size: ': ' + this.imageFile?.size || null,
        type: ': ' + this.imageFile?.type || null,
        ultima_modificacion: ': ' + this.imageFile?.lastModified ? new Date(this.imageFile.lastModified).toISOString() : null
      };
      this.metadata = basicMetadata;
    } catch (error) {
      console.error('Error en el segundo método de extracción de metadatos:', error);
      this.servG.fun_Mensaje('No se pudieron extraer los metadatos con el segundo método', 'danger');
    }
  }

  verificarImagenExistente(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.servI.fun_validar_imagen({
        hash: this.hash,
        id_invg: this.id_investigacion
      }).subscribe(
        (data: any) => {
          if (data.data && data.data.id_imagen) {
            // Si existe, retornar la id_imagen
            resolve(data.data.id_imagen);
          } else {
            // Si no existe, retornar null
            resolve(null);

          }
        },
        (error) => {
          console.error('Error al verificar la imagen:', error);
          reject(error);
        }
      );
    });

  }
  verificarReportExistente(): Promise<string | null> {
    console.log('datos de retornar reporte: ' + this.nombrerepmeta, this.id_investigacion)
    return new Promise((resolve, reject) => {
      this.servRe.fun_validar_reporte_meta({
        nombrerepmeta: this.nombrerepmeta,
        id_investigacion: this.id_investigacion
      }).subscribe(
        (data: any) => {
          if (data.data && data.data.id_repmeta) {
            // Si existe, retornar la id_investigacion
            resolve(data.data.id_repmeta);
          } else {
            // Si no existe, retornar null
            resolve(null);

          }
        },
        (error) => {
          console.error('Error al verificar la imagen:', error);
          reject(error);
        }
      );
    });

  }

  async generateReport() {
    if (!this.metadata || Object.keys(this.metadata).length === 0) {
      this.servG.fun_Mensaje('Debe extraer metadatos antes de generar el reporte', 'danger');
      return;
    }
    // if (this.nombrerepmeta === '') {
    //   this.servG.fun_Mensaje('Escriba el nombre del reporte para metadatos', 'danger');
    //   return;
    // }

    // Reinicia `id_imagen1` para evitar conflictos
    this.id_imagen1 = null;

    const imagenExiste = await this.verificarImagenExistente();
    this.id_imagen1 = imagenExiste; // Actualiza `id_imagen1`
    console.log('ID de imagen encontrada: ' + this.id_imagen1);
    
    if (imagenExiste) {
      console.log('La imagen ya existe en la base de datos');
      this.servG.fun_Mensaje('La imagen ya existe en la base de datos', 'danger');
      //verificar el nombre del reporte
      const reporteExiste = await this.verificarReportExistente();
      this.id_repmeta = reporteExiste;
      console.log('ID de reporte encontrada: ' + this.id_repmeta);
      if (reporteExiste) {
        console.log('el nombre del reporte ya existe en la base de datos');
        this.servG.fun_Mensaje('el nombre del reporte ya existe en la base de datos', 'danger');
      } else {
        console.log('el nombre del reporte no exite');
        await this.nuevo(); // Procesa el reporte aunque la imagen ya exista        
      }

    } else {

      console.log('La imagen no está en la base de datos');
      const reporteExiste = await this.verificarReportExistente();
      this.id_repmeta = reporteExiste;
      console.log('ID de reporte encontrada: ' + this.id_repmeta);
      if (reporteExiste) {
        console.log('el nombre del reporte ya existe en la base de datos');
        this.servG.fun_Mensaje('el nombre del reporte ya existe en la base de datos', 'danger');

      } else {

        console.log('el nombre del reporte no exite');
        await this.fun_grabarimg_bd();
        await this.nuevo();
      }
    }
    this.isPdfButtonEnabled = true;
    this.cargarimagenes();
  }
  isPdfButtonEnabled: boolean = false;
  async nuevo() {
    await this.delay;
    await this.delay;
    const imagenExiste = await this.verificarImagenExistente();
    this.id_imagen1 = imagenExiste
    console.log('idimagenrretornada: ' + this.id_imagen1)
    await this.guardar_report();
  }
  private loadImageAsBase64(path: string, opacity: number = 0.2): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.crossOrigin = 'Anonymous'; // Evitar problemas de CORS
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.globalAlpha = opacity; // Ajustar opacidad
          ctx.drawImage(img, 0, 0, img.width, img.height);
          resolve(canvas.toDataURL('image/png')); // Convertir a base64
        } else {
          reject(new Error('No se pudo obtener el contexto del canvas'));
        }
      };
      img.onerror = reject;
    });
  }

  async PDF() {
    const doc = new jsPDF();
    let yPosition = 10;

    // Dimensiones del documento
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Cargar la imagen de marca de agua
    const watermarkPath = './assets/images/stegscan.jpg'; // Ruta de la imagen de marca de agua
    const watermarkImage = await this.loadImageAsBase64(watermarkPath, 0.1); // Ajustar opacidad al 10%

    // Agregar marca de agua al fondo
    const watermarkWidth = 100; // Ajustar tamaño de la marca de agua
    const watermarkHeight = 100; // Ajustar tamaño de la marca de agua
    doc.addImage(
      watermarkImage,
      'PNG',
      (pageWidth - watermarkWidth) / 2, // Centrado horizontal
      (pageHeight - watermarkHeight) / 2, // Centrado vertical
      watermarkWidth,
      watermarkHeight,
      undefined,
      'NONE'
    );
    const checkNewPage = (additionalHeight: number) => {
      if (yPosition + additionalHeight > pageHeight - 20) {
        doc.addPage();
        yPosition = 10;
  
        // Agregar marca de agua en páginas adicionales
        doc.addImage(
          watermarkImage,
          'PNG',
          (pageWidth - 100) / 2, // Centrado horizontal
          (pageHeight - 100) / 2, // Centrado vertical
          100,
          100,
          undefined,
          'NONE'
        );
      }
    };

    doc.setFontSize(18);
    doc.text(`Reporte: ${this.nombrerepmeta}`, 10, yPosition);
    yPosition += 10;
    doc.text('Reporte de Metadatos', 10, yPosition);
    yPosition += 10;
    doc.text(`Fecha y hora: ${this.fecha_inicio}`, 10, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text('Nombre de la Imagen:', 10, yPosition);
    doc.text(this.nombreimg, 60, yPosition);
    yPosition += 10;
    doc.text('Hash SHA-256 de la Imagen:', 10, yPosition);
    doc.text(this.hash, 10, yPosition + 10);
    yPosition += 20;

    if (this.imageUrl) {
      const response = await fetch(this.imageUrl);
      const blob = await response.blob();
      const imgData = await this.blobToBase64(blob);
      doc.addImage(imgData, 'JPEG', 10, yPosition, 100, 100);
      yPosition += 110;
    }
    doc.setFontSize(18);
    doc.text('Metadatos de la Imagen:', 10, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    for (const key of Object.keys(this.metadata)) {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 10;
      }
      doc.text(`${key}: ${this.metadata[key]}`, 10, yPosition);
      yPosition += 7;
    }

    // Generar el PDF como blob
    const pdfOutput = doc.output('blob');

    if (Capacitor.isNativePlatform()) {
      // Guardar el archivo en dispositivos móviles
      const fileName = `${this.nombrerepmeta}.pdf`;
      const base64Data = await this.blobToBase64(pdfOutput);

      try {
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents,
        });
        this.servG.fun_Mensaje('Reporte guardado correctamente en el dispositivo');
      } catch (error) {
        console.error('Error guardando el archivo:', error);
        this.servG.fun_Mensaje('Error al guardar el reporte en el dispositivo', 'danger');
      }
    } else {
      // Para navegadores: descargar el archivo directamente
      doc.save(`${this.nombrerepmeta}.pdf`);
      this.servG.fun_Mensaje('Reporte descargado correctamente');
    }
    this.borrarDatos();
  }
  verrep() {
    this.servG.irA('/reportemeta')
  }

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  generarnombre(){
    const fechaActual = new Date();
        const timestamp = Date.now();
    this.nombrerepmeta=`Reporte_${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}_` +
    `${fechaActual.getHours().toString().padStart(2, '0')}${fechaActual.getMinutes()
      .toString()
      .padStart(2, '0')}${fechaActual.getSeconds().toString().padStart(2, '0')}_${timestamp}`;
      console.log('nombre del reporte: '+ this.nombrerepmeta)
  }
  async guardar_report() {
    this.id_repmeta = 0;

    this.delay;
    const imagenExiste = await this.verificarImagenExistente();
    this.id_imagen1 = imagenExiste
    console.log('idimagenrretornada: ' + this.id_imagen1);
    if (imagenExiste) {
      console.log('new: ' + this.id_repmeta, this.id_imagen1, this.nombrerepmeta, this.fecha_inicio)
      if (this.nombrerepmeta) {
        const loading = await this.loadingCtrl.create();
        
        loading.present();
        this.servRe.generatereportmeta({
          id_repmeta: this.id_repmeta,
          id_imagen: this.id_imagen1,
          nombrerepmeta: this.nombrerepmeta,
          fecha_inicio: this.fecha_inicio,
        }).subscribe(
          (data: any) => {
            loading.dismiss();
            this.servG.fun_Mensaje(data.mensaje);

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

    } else {
      this.fun_grabarimg_bd();
    }

  }


  async fun_grabarimg_bd() {

    await this.guardarImagenor(); // Sube la imagen a Firebase
    console.log('datos guardar img: ', this.id_imagen, this.hash, this.metadata, this.id_investigacion, this.urlimagenor, this.nombreimg)
    if (this.urlimagenor) {
      const loading = await this.loadingCtrl.create({
        message: 'Guardando imagen en la base de datos...',
        spinner: 'crescent',
      });
      await loading.present();

      this.servI.fun_grabar_imagenes({
        id_imagen: this.id_imagen,
        hash: this.hash,
        // metadatos: JSON.stringify(this.metadata),

        metadatos: this.metadata,
        id_invg: this.id_investigacion,
        url_imagen: this.urlimagenor,
        nombreimg: this.nombreimg,
      }).subscribe(
        (data: any) => {
          loading.dismiss();
          this.servG.fun_Mensaje(data.mensaje);
          console.log('Imagen guardada exitosamente:', data);
          console.log(this.metadata)
          console.log(JSON.stringify(this.metadata))
        },
        (error) => {
          loading.dismiss();
          this.servG.fun_Mensaje('Error al guardar la imagen en la base de datos', 'danger');
          console.error('Error al guardar la imagen:', error);
        }
      );
    } else {
      console.error('No se pudo obtener la URL de la imagen.');
      this.servG.fun_Mensaje('Error: no se pudo obtener la URL de la imagen', 'danger');
    }

  }
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async guardarImagenor() {
    const file: File = this.imgEvent?.target.files[0];
    if (file) {
      // Mostrar pantalla de carga
      const loading = await this.loading.create({
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
      // Espera a que la imagen se suba y se obtenga la URL
      try {
        this.imageUrl = await new Promise<string>((resolve, reject) => {
          this.firebaseStorage.uploadImageWithMetadata(file, metadata).subscribe(
            (url) => {
              console.log('Imagen y metadatos subidos con éxito. URL:', url);
              resolve(url);
              return this.urlimagenor = url
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
        // Ocultar pantalla de carga al finalizar
        loading.dismiss();
      }
    }
  }

  borrarDatos() {
    this.metadata = {};
    this.hash = '';
    this.nombreimg = '';
    this.imageUrl = null;
    this.imageFile = null;
    this.nombrerepmeta = '';
    this.pdfGenerated = false; // Reactiva el botón
    this.id_imagen1 = 0;
    this.servG.fun_Mensaje('Datos eliminados correctamente');
  }
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
