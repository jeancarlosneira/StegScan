import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { FirebaseStorageService } from '../../services/firebase-storage.service';
import { AlertController, LoadingController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import exifr from 'exifr';
import { ImagenesService } from 'src/app/services/imagenes.service';

import { ReporteService } from 'src/app/services/reporte.service';
import jsPDF from 'jspdf';
import { NavController } from '@ionic/angular';
import { FLOAT } from 'html2canvas/dist/types/css/property-descriptors/float';


@Component({
  selector: 'app-ela',
  templateUrl: './ela.page.html',
  styleUrls: ['./ela.page.scss'],
})
export class ELAPage implements OnInit {

  // imageUrl: string | undefined;
  imageUrl: string;
  urlimagenela: string = '';
  imageUrlor: string | null = null;
  metadata: any = {};
  meta:any;
  hash: any;
  id_imagen: number = 0;
  id_imagen1: any;
  idusuario: number;
  tipousu: any;
  elaImageUrl: string | null = null;

  nombrerep: string = '';
  id_reporteela: number = 0;
  fecha_inicio: string;
  estadorepela: number = 0;
  imageFile: File | null = null;
  imgEvent: any;

  reporteGenerado: boolean = false;
  urlimagenor: string;
  nombreimg: string;
  id_investigacion: any;

  idSeleccionado: number;
  listarimgenes: any[] = []
  public highBrightnessPercentage: any;
  porcentaje: number;
  constructor(
    private servG: GeneralService,
    private firebaseStorage: FirebaseStorageService,
    private loading: LoadingController,
    private servI: ImagenesService,
    private servRep: ReporteService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) { }

  ngOnInit(): void {
    this.cargarimagenes()
    this.retornarinvg();
    const fecha = new Date();
    this.fecha_inicio = fecha.toISOString().slice(0, 19).replace('T', ' ');
    console.log(this.fecha_inicio)
  }
  seleccionarImagen(event: any) {
    this.id_imagen = event.detail.value;
    console.log('ID seleccionado:', this.id_imagen);
    this.cargarimagenes2()
    this.generarnombre();
  }
  // async cargarimagenes2(){
  //   let l=await this.loading.create();
  //   l.present();
  //   this.servI.retornardataimg(this.id_imagen).subscribe(
  //     (respuesta:any)=>{
  //       this.id_imagen=respuesta.data.id_imagen;
  //       this.hash=respuesta.data.hash;
  //       this.urlimagenor=respuesta.data.url_imagen;
  //       this.nombreimg=respuesta.danta.nombreimg;
  //       this.metadata=respuesta.data.metadatos;
  //     console.log( 'lista'+this.listarimgenes,this.hash,this.urlimagenor,this.nombreimg,this.metadata);
  //     l.dismiss();

  //     },(error:any)=>{
  //       l.dismiss();
  //       this.servG.fun_Mensaje("error al recuperar los reportes")
  //     }

  //   );
  // }

  generarnombre() {
    const fechaActual = new Date();
    const timestamp = Date.now();
    this.nombrerep = `Reporte_${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}_` +
      `${fechaActual.getHours().toString().padStart(2, '0')}${fechaActual.getMinutes()
        .toString()
        .padStart(2, '0')}${fechaActual.getSeconds().toString().padStart(2, '0')}_${timestamp}`;
    console.log('nombre del reporte: ' + this.nombrerep)
  }
  //  async cargarimagenes(){
  //   let l=await this.loading.create();
  //   l.present();
  //   this.servI.retornarimg(this.id_investigacion).subscribe(
  //     (respuesta:any)=>{
  //       this.listarimgenes=respuesta.data;
  //     console.log( 'lista reporte'+this.listarimgenes);
  //     l.dismiss();

  //     },(error:any)=>{
  //       l.dismiss();
  //       this.servG.fun_Mensaje("error al recuperar los reportes")
  //     }

  //   );
  // }
  // async cargarimagenes() {
  //   const l = await this.loading.create();
  //   l.present();

  //   this.servI.retornarimg(this.id_investigacion).subscribe(
  //     (respuesta: any) => {
  //       if (respuesta.data) {
  //         this.listarimgenes = respuesta.data;

  //         console.log('Lista de imágenes:', this.listarimgenes);
  //       } else {
  //         console.error('No se encontraron imágenes en la respuesta.');
  //         this.servG.fun_Mensaje('No se encontraron imágenes para la investigación.');
  //       }
  //       l.dismiss();
  //     },
  //     (error: any) => {
  //       l.dismiss();
  //       console.error('Error al recuperar las imágenes:', error);
  //       this.servG.fun_Mensaje('Error al recuperar las imágenes.');
  //     }
  //   );
  // }
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

  retornar() {
    this.servG.irA('/main');
  }
  retornarinvg() {
    const userSession1 = JSON.parse(localStorage.getItem('id_investigacion'));
    this.id_investigacion = userSession1;
    console.log('id_investigacion:', userSession1);
    return this.id_investigacion
  }

  onImageUpload(event: any) {
    this.id_imagen = 0;
    this.imageUrl = '';
    this.imgEvent = event;
    this.imageFile = event.target.files[0];
    if (this.imageFile) {
      this.imageUrlor = URL.createObjectURL(this.imageFile); // Crear URL de objeto para vista previa
      this.nombreimg = this.imageFile.name;
    }
    this.extractMetadata();
    this.generarnombre();
  }
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
          this.meta = imagen.metadatos;
          this.imageUrlor = this.urlimagenor;
          this.metadata = JSON.parse(this.meta)
          // this.metadata  =this.meta

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
  async extractMetadata() {
    if (this.imageFile) {
      this.metadata = await exifr.parse(this.imageFile);
      const fileArrayBuffer = await this.imageFile.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(fileArrayBuffer);
      this.hash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
      if (!this.metadata || Object.keys(this.metadata).length === 0) {
        this.servG.fun_Mensaje('Intentando otro método para extraer metadatos...', 'warning');
        await this.extractMetadataAlter();
      }
      if (this.metadata && Object.keys(this.metadata).length > 0) {
        this.servG.fun_Mensaje('Metadatos extraídos correctamente', 'success');
      }
    } else {
      this.servG.fun_Mensaje('Error al extraer metadatos', 'danger');
    }
    console.log(this.metadata)
    console.log(this.hash)
  }

  async extractMetadataAlter() {
    try {
      const basicMetadata = {
        nommbre: ': ' + this.imageFile.name || null,
        size: ': ' + this.imageFile?.size || null,
        type: ': ' + this.imageFile?.type || null,
        ultima_modificacion: ': ' + this.imageFile?.lastModified ? new Date(this.imageFile.lastModified).toISOString() : null
      };

      // Asignar valores básicos como metadatos en caso de que exifr no funcione
      this.metadata = basicMetadata;
    } catch (error) {
      console.error('Error en el segundo método de extracción de metadatos:', error);
      this.servG.fun_Mensaje('No se pudieron extraer los metadatos con el segundo método', 'danger');
    }
  }

  async escaneo_img() {

    this.elaImageUrl = null;

    if (this.imageUrlor) {
      this.loadImageFromUrl(this.imageUrlor).then((file) => {
        if (file) {

          this.performELA(file);
        }
      }).catch((error) => {

        console.error('Error al cargar la imagen desde la URL:', error);
        this.servG.fun_Mensaje('Error al procesar la imagen remota', 'danger');
      });
    } else if (this.imgEvent) {

      this.onFileChange(this.imgEvent);
    } else {

      console.error('No hay imagen seleccionada para escanear.');
      this.servG.fun_Mensaje('Primero selecciona una imagen para escanear.', 'warning');
    }

  }

  async loadImageFromUrl(url: string): Promise<File | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('No se pudo obtener la imagen de la URL');
      }
      const blob = await response.blob();
      const filename = url.split('/').pop() || 'remote_image.jpg';
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error('Error al obtener la imagen remota como blob:', error);
      return null;
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.performELA(input.files[0]);
    }
  }
  num: any;
  probavilidadalta: number;
  lowBrightnessPercentage:any;

  intermediateBrightnessPercentage:any;
  async performELA(file: File): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Generando imagen',
      spinner: 'crescent',
    });
    await loading.present();

    const originalImage = await this.loadImageFromFile(file);
    const compressedImage = await this.compressImage(originalImage, 90);

    const elaCanvas = document.createElement('canvas');
    elaCanvas.width = originalImage.width;
    elaCanvas.height = originalImage.height;
    const ctx = elaCanvas.getContext('2d');

    if (ctx) {
      const originalData = this.getImageData(originalImage, ctx);
      const compressedData = this.getImageData(compressedImage, ctx);

      const elaImageData = ctx.createImageData(originalData.width, originalData.height);
      const scale = 20;

      let highBrightnessCount = 0;
      let lowBrightnessCount = 0;
      let intermediateBrightnessCount = 0;
      const totalPixelCount = originalData.width * originalData.height;

      for (let i = 0; i < originalData.data.length; i += 4) {
        const rDiff = Math.abs(originalData.data[i] - compressedData.data[i]) * scale;
        const gDiff = Math.abs(originalData.data[i + 1] - compressedData.data[i + 1]) * scale;
        const bDiff = Math.abs(originalData.data[i + 2] - compressedData.data[i + 2]) * scale;

        const brightness = (rDiff + gDiff + bDiff) / 3;

        if (brightness > 200) {
          highBrightnessCount++;
        } else if (brightness > 100) {
          intermediateBrightnessCount++;
        } else if (brightness > 50) {
          lowBrightnessCount++;
        }

        elaImageData.data[i] = Math.min(rDiff, 255);
        elaImageData.data[i + 1] = Math.min(gDiff, 255);
        elaImageData.data[i + 2] = Math.min(bDiff, 255);
        elaImageData.data[i + 3] = 255; // Alpha
      }

      ctx.putImageData(elaImageData, 0, 0);
      this.elaImageUrl = elaCanvas.toDataURL('image/jpg');

      // Cálculo de porcentajes
      const highBrightnessPercentage = (highBrightnessCount / totalPixelCount) * 100;
      const lowBrightnessPercentage = (lowBrightnessCount / totalPixelCount) * 100;
      const intermediateBrightnessPercentage = (intermediateBrightnessCount / totalPixelCount) * 100;

      // Nueva métrica basada en relación de brillo alto a bajo
      const highToLowRatio = highBrightnessPercentage / (lowBrightnessPercentage || 1);
this.intermediateBrightnessPercentage=intermediateBrightnessPercentage
      this.highBrightnessPercentage = highBrightnessPercentage.toFixed(3);
      this.num = lowBrightnessPercentage.toFixed(2);
      this.lowBrightnessPercentage=lowBrightnessPercentage.toFixed(2)
      console.log('low'+this.lowBrightnessPercentage)
      this.porcentaje = this.num;
console.log(this.porcentaje)
      // Detección mejorada basada en métricas calculadas
      if (highBrightnessPercentage > 5 || highToLowRatio > 1.5) {
        this.estadorepela = 1;
        this.analisis = `Posibles manipulaciones detectadas: Brillo alto en ${highBrightnessPercentage.toFixed(3)}%. Relación alto/bajo: ${highToLowRatio.toFixed(2)}.`;
      } else if (lowBrightnessPercentage > 1 || intermediateBrightnessPercentage > 5) {
        this.estadorepela = 1;

        if (highBrightnessPercentage < 0.05 && intermediateBrightnessPercentage < 0.05) {
          this.analisis = `Baja posibilidad de manipulacion`;

        } else {
          this.analisis = `Se detectó pixeles manipulados`;
          if (lowBrightnessPercentage < 2) {
            this.porcentaje = this.porcentaje * 50;
          } else {
            this.porcentaje = this.porcentaje * 20;
          }

          if (this.porcentaje > 100) {
            this.porcentaje = 99
          }

        }
        // this.analisis = `Se detectó una probabilidad de esteganografía en ${lowBrightnessPercentage.toFixed(2)}%. Requiere revisión manual.`;

      } else if (lowBrightnessPercentage > 0.3 || intermediateBrightnessPercentage > 1) {
if(lowBrightnessPercentage<0.5){
  this.porcentaje = this.porcentaje * 150
}else{
  this.porcentaje = this.porcentaje * 100
}
  
        this.analisis = 'la imagen contiene algunos pixeles alterados';

      } else if (lowBrightnessPercentage > 0.01) {
        this.porcentaje=this.porcentaje*10
        this.estadorepela = 0;
        this.analisis = 'baja porcentaje de edicion:';
      }else{
        this.estadorepela = 0;
        this.analisis = 'No se detectaron alteraciones significativas';
      }
console.log(this.porcentaje)
      // Mostrar resultados en la consola
      console.log(`Porcentaje de píxeles con brillo alto: ${highBrightnessPercentage.toFixed(3)}%`);
      console.log(`Porcentaje de píxeles con brillo bajo: ${lowBrightnessPercentage.toFixed(2)}%`);
      console.log(`Porcentaje de píxeles con brillo intermedio: ${intermediateBrightnessPercentage.toFixed(2)}%`);
      console.log(`Relación brillo alto/bajo: ${highToLowRatio.toFixed(2)}`);

      const elaBlob = await (await fetch(this.elaImageUrl)).blob();
      const elaFile = new File([elaBlob], 'ela_image.jpg', { type: 'image/jpeg' });
    }

    loading.dismiss();
  }

  async loadImageFromFile(file: File): Promise<HTMLImageElement> {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    await img.decode();
    URL.revokeObjectURL(url);
    return img;
  }

  async compressImage(img: HTMLImageElement, quality: number): Promise<HTMLImageElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
    const compressedImg = new Image();
    compressedImg.src = dataUrl;
    await compressedImg.decode();
    return compressedImg;
  }

  getImageData(img: HTMLImageElement, ctx: CanvasRenderingContext2D): ImageData {
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height);
  }

  async ifff() {
    const imagenExiste2 = await this.verificarImagenExistente();
    this.id_imagen1 = imagenExiste2
    console.log('idddddddddddd:' + this.id_imagen1)

  }
  async generarReporteForense() {
    if (!this.elaImageUrl === null) {
      this.servG.fun_Mensaje('Debe analizar la imagen antes de generar el reporte', 'danger');
      return;
    }

    const imagenExiste = await this.verificarImagenExistente();
    this.id_imagen1 = imagenExiste
    console.log('idig: ' + this.id_imagen1)

    if (imagenExiste) {
      // Si la imagen existe, procedemos con la carga y guardado
      console.log('si esta la img en la bd')
      this.servG.fun_Mensaje('La imagen ya existe en la base de datos', 'danger');

      const reporteelaExiste = await this.verificarReporteExistente();
      this.id_imagen1 = reporteelaExiste
      console.log('id de reporte ela retornado: ' + this.id_imagen1)
      if (reporteelaExiste) {
        this.servG.fun_Mensaje('el nombre del reporte ya existe en la base de datos', 'danger');
      } else {
        console.log('no existe nombre de reporte en la bd')
        await this.guardarImagenEla()
        await this.grabarreportella();
      }

    } else {
      console.log('no esta la imgen en la bd ')

      const reporteelaExiste = await this.verificarReporteExistente();
      this.id_imagen1 = reporteelaExiste
      console.log('id de reporte ela retornado: ' + this.id_imagen1)
      if (reporteelaExiste) {
        this.servG.fun_Mensaje('el nombre del reporte ya existe en la base de datos', 'danger');
      } else {
        console.log('no existe nombre de reporte en la bd')
        await this.guardarImagenor();
        await this.fun_grabarimg_bd();
        await this.guardarImagenEla();
        await this.grabarreportella();
      }

    }
    this.isPdfButtonEnabled = true;
    this.cargarimagenes();
this.reporteGenerado=true;
  }
  public analisis: string;
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async grabarreportella() {
    
    this.delay;
    const imagenExiste = await this.verificarImagenExistente();
    this.id_imagen1 = imagenExiste
    console.log('idig: ' + this.id_imagen1)

    if (imagenExiste) {
      this.id_reporteela = 0;
      await this.ifff()
      const loading = await this.loading.create();
      await loading.present();
      console.log(this.id_reporteela, this.nombrerep, this.porcentaje, this.fecha_inicio, this.id_imagen1, this.urlimagenela, this.estadorepela)
      // Generar el reporte
      this.servRep.generatereport({
        id_reporteela: this.id_reporteela,
        nombrerep: this.nombrerep,
        highBrightnessPercentage: this.highBrightnessPercentage,
        porcentaje: this.porcentaje,
        fecha_inicio: this.fecha_inicio,
        id_imagen: this.id_imagen1,
        urlimagenela: this.urlimagenela,
        estadorepela: this.estadorepela,
        lowBrightnessPercentage:this.lowBrightnessPercentage,
        intermediateBrightnessPercentage:this.intermediateBrightnessPercentage
      }).subscribe(
        (data: any) => {
          loading.dismiss();
          this.servG.fun_Mensaje(data.mensaje);
        },
        (error: any) => {
          loading.dismiss();
          this.servG.fun_Mensaje('Error al guardar el reporte', 'danger');
        }
      );

      // Marcar el reporte como generado y generar PDF
      this.reporteGenerado = true;
      // await this.generatePdf();
    } else {
      // this.servG.fun_Mensaje('OCURRIO UN ERROR AL GRABAR EL REPORTE')
      // this.delay;
      // this.servG.fun_Mensaje('INTENTE DENUEVO')
      this.grabarreportella();
    }

  }

  async fun_grabarimg_bd() {
    console.log(this.hash, this.metadata, this.id_investigacion, this.imageUrl, this.nombreimg)
    if (this.imageUrl) {

      const loading = await this.loadingCtrl.create();
      loading.present();
      this.servI.fun_grabar_imagenes({
        id_imagen: this.id_imagen,
        hash: this.hash,
        // metadatos: JSON.stringify(this.metadata),
        metadatos: this.metadata,
        id_invg: this.id_investigacion,
        url_imagen: this.imageUrl,
        nombreimg: this.nombreimg,
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
    this.delay;
    this.delay;
  }
  verrep() {
    this.servG.irA('/reporte')
  }
  isPdfButtonEnabled: boolean = false;
  verificarReporteExistente(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.servRep.fun_validar_reporte({
        nombrerep: this.nombrerep,
        id_investigacion: this.id_investigacion
      }).subscribe(
        (data: any) => {
          if (data.data && data.data.id_reporteela) {
            // Si existe, retornar la id_imagen
            resolve(data.data.id_reporteela);
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
  async guardarImagenor() {
    const file: File = this.imgEvent?.target.files[0];
    if (file) {
      // Mostrar pantalla de carga
      const loading = await this.loadingCtrl.create({
        message: 'Subiendo imagen original a la nube...',
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

  async guardarImagenEla() {
    const elaBlob = await (await fetch(this.elaImageUrl)).blob();
    const elaFile = new File([elaBlob], 'ela_image.jpg', { type: 'image/jpeg' });
    if (elaFile) {
      const loading = await this.loadingCtrl.create({
        message: 'Subiendo imagen a la nube...',
        spinner: 'crescent'
      });
      await loading.present()
      const metadata = {
        name: elaFile.name,
        size: elaFile.size.toString(),
        type: elaFile.type,
        lastModified: elaFile.lastModified.toString(),
      };
      try {
        this.elaImageUrl = await new Promise<string>((resolve, reject) => {
          this.firebaseStorage.uploadImageWithMetadata(elaFile, metadata).subscribe(
            (url) => {
              console.log('Imagen ela y metadatos subidos con éxito. URL:', url);
              resolve(url);
              return this.urlimagenela = url
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
  async generatePdf() {
    const doc = new jsPDF();
    const marginLeft = 10;
    const marginTop = 10;

    let yPosition = 10;

    // Dimensiones del documento
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Cargar la imagen de marca de agua
    const watermarkPath = './assets/images/stegscan.jpg'; // Ruta de la imagen de marca de agua
    const watermarkImage = await this.loadImageAsBase64(watermarkPath, 0.1); // Ajustar opacidad al 10%

    // Agregar marca de agua al fondo
    const watermarkWidth = 180; // Ajustar tamaño de la marca de agua
    const watermarkHeight = 180; // Ajustar tamaño de la marca de agua
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
    doc.text('Reporte de estegoanálisis Integridad', 10, yPosition);
    yPosition += 10;
    doc.setFontSize(18);
    doc.text(' Reporte: ' + this.nombrerep, marginLeft, yPosition);
    yPosition += 10;
    doc.setFontSize(18);
    doc.text('Reporte  de Imagen y Metadatos', marginLeft, yPosition);
    yPosition += 10;
    doc.setFontSize(18);
    doc.text('Fecha: ' + this.fecha_inicio, marginLeft, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text('Nombre Imagen: ' + this.nombreimg, marginLeft, yPosition);
    yPosition += 10;
    doc.text('Hash SHA-256 de la Imagen:', marginLeft, yPosition);
    yPosition += 10;
    const hashLines = doc.splitTextToSize(this.hash, 180);
    doc.text(hashLines, marginLeft, yPosition);
    yPosition += hashLines.length * 7;

    yPosition += 10;
    if (this.imageUrlor) {
      const response = await fetch(this.imageUrlor);
      doc.setFontSize(18);
      doc.text('Imagen Original:', marginLeft, yPosition);
      yPosition += 10;
      const blob = await response.blob();
      const imgData = await this.blobToBase64(blob);
      const imgWidth = 150;
      const imgHeight = 150;
      checkNewPage(imgHeight + 10);
      doc.addImage(imgData, 'JPEG', 10, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;
    }

    if (this.elaImageUrl) {
      const elaImage = await fetch(this.elaImageUrl);
      doc.setFontSize(18);
      doc.text('Integridad de Imagen:', marginLeft, yPosition);
      const blob = await elaImage.blob();
      const imgData = await this.blobToBase64(blob);
      const imgWidth = 150;
      const imgHeight = 150;
      checkNewPage(imgHeight + 10);
      doc.addImage(imgData, 'JPEG', 10, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;
    }
    doc.setFontSize(15);
    yPosition += 10;
    yPosition += 10;
    doc.text('Metadatos de la Imagen:', marginLeft, yPosition);
    doc.setFontSize(12);
    yPosition += 10;
    for (const key of this.objectKeys(this.metadata)) {
      const value = this.metadata[key] !== undefined ? this.metadata[key].toString() : '';
      const textLine = `${key}: ${value}`;
      const textLines = doc.splitTextToSize(textLine, 180);
      if (yPosition + textLines.length * 7 > 280) {
        doc.addPage();
        yPosition = marginTop;
      }
      doc.text(textLines, marginLeft, yPosition);
      yPosition += textLines.length * 7;

    }
    checkNewPage(20);
    doc.setFontSize(15);
    yPosition += 10;
    yPosition += 10;
    doc.text('Estado de la Imagen:', 10, yPosition);
    yPosition += 10;
    // if (this.estadorepela == 1) {
    //   doc.text('Se detectaron posibles alteraciones en el análisis ELA. Esto podría indicar manipulación o esteganografía.', 10, yPosition);
    // } else {
    //   doc.text('El análisis no mostró posibles alteraciones. No se detecta manipulación evidente.', 10, yPosition);
    // }
    doc.text('porcentaje de pixeles modificados:' + this.highBrightnessPercentage + '%', marginLeft, yPosition);
    yPosition += 10;
    doc.text('probabilidad de contener alteraciones:' + this.porcentaje + '%', marginLeft, yPosition);
    yPosition += 10;

    doc.save(this.nombrerep + '.pdf');

    this.navCtrl.navigateForward('/ela', { skipLocationChange: true }).then(() => {
      this.navCtrl.navigateBack('/ela');
    });
    this.borrarDatos();
  }


  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }


  borrarDatos() {
    this.imgEvent = null;
    this.imageUrlor = null;
    this.elaImageUrl = null;
    this.imageFile = null;
    this.nombrerep = '';
    this.metadata = {};
    this.hash = null;
    // Habilita el botón de "Generar Reporte Forense"
    this.reporteGenerado = false;
    this.servG.fun_Mensaje('Datos eliminados correctamente');
  }



}