import { Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import Chart from 'chart.js/auto';
import * as CryptoJS from 'crypto-js';
import exifr from 'exifr';
import annotationPlugin from 'chartjs-plugin-annotation';
import { GeneralService } from 'src/app/services/general.service';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { ReporteService } from 'src/app/services/reporte.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-estegoanalisis',
  templateUrl: './estegoanalisis.page.html',
  styleUrls: ['./estegoanalisis.page.scss'],
})
export class EstegoanalisisPage {
  imageFile: File | null = null;
  imageFile2: File | null = null;
  imageUrl: string | null = null;
  imageUrl2: string | null = null;
  estadoesteg: number;
  chiSquareValues: number[] = [];
  lsbAverages: number[] = [];
  listarimgenes: any[] = [];
  chart: any;
  isLoading: boolean = false;
  resultado: string;
  fecha_inicio: string;
  nombrerepstego: string = '';
  idusuario: number;
  id_investigacion: any;
  hash: any;
  metadata: any = {};
  id_imagen1: any;
  id_repestega: any;
  id_imagen: number = 0;
  imgEvent: any;
  nombreimg: string = '';
  urlimagenor: string;
  meta: any;
  idimg: number = 0;
  id_repestego: number = 0;



  smallJumpMax: any;
  largeJumpCount: any;
  veryLargeJumpCount: any;
  totalJumpCount: any;
  percentageSteganography: any;
  constructor(
    private alertController: AlertController,
    private servG: GeneralService,
    private servI: ImagenesService,
    private servRe: ReporteService,
    private loadingCtrl: LoadingController,
    private loading: LoadingController,
    private firebaseStorage: FirebaseStorageService,
  ) { }

  ngOnInit(): void {
    this.retornarusu();
    this.cargarimagenes();
    this.retornarinvg();
    const fecha = new Date();

    this.fecha_inicio = fecha.toISOString().slice(0, 19).replace('T', ' ');
    console.log(this.fecha_inicio)
  }
  retornarusu() {
    const userSession = JSON.parse(localStorage.getItem('idusu'));
    this.idusuario = userSession;
    console.log('ID usuario:', userSession);
    return this.idusuario
  }
  retornarinvg() {
    const userSession = JSON.parse(localStorage.getItem('id_investigacion'));
    this.id_investigacion = userSession;
    console.log('id_investigacion:', userSession);
    return this.id_investigacion
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
          this.imageUrl = this.urlimagenor;
          this.metadata = JSON.parse(this.meta)

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
  seleccionarImagen(event: any) {
    this.id_imagen = event.detail.value;
    console.log('ID seleccionado:', this.id_imagen);
    this.cargarimagenes2();
    this.generarnombre();
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
  retornarpage() {
    this.servG.irA('/main');
  }
  onFileSelected(event: any): void {
    this.id_imagen = 0;
    this.imageUrl = '';
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
    this.extractMetadata();
    this.generarnombre();
  }
  generarnombre() {
    const fechaActual = new Date();
    const timestamp = Date.now();
    this.nombrerepstego = `Reporte_${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}_` +
      `${fechaActual.getHours().toString().padStart(2, '0')}${fechaActual.getMinutes()
        .toString()
        .padStart(2, '0')}${fechaActual.getSeconds().toString().padStart(2, '0')}_${timestamp}`;
    console.log('nombre del reporte: ' + this.nombrerepstego)
  }
  /**
   * Análisis de la imagen cargada.
   */

  uno: number = 1;
  async analyzeImage(): Promise<void> {
    if (!this.imageFile && !this.imageUrl) {
      this.showAlert('Error', 'Por favor, selecciona una imagen.');
      return;
    }
    let imageSrc: string;
    if (this.imageUrl) {
      imageSrc = this.imageUrl; 
      if (!this.imageFile.type.startsWith('image/')) {
        this.showAlert('Error', 'Por favor selecciona un archivo de imagen válido.');
        return;
      }
      imageSrc = URL.createObjectURL(this.imageFile); // Crea un URL de objeto local
    }
    this.isLoading = true;
    const img = new Image();
    // Configuración para imágenes externas (CORS)
    if (this.imageUrl) {
      img.crossOrigin = 'Anonymous';
    }
    img.src = imageSrc;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, img.width, img.height);
        // Calcular valores de chi-cuadrado
        const { chiSquareValues, lsbAverages } = this.calculateChiSquare(imageData);
        this.chiSquareValues = chiSquareValues;
        this.lsbAverages = lsbAverages;
        // Determinar los saltos más pequeños
        const differences = chiSquareValues
          .map((val, index) => (index > 0 ? Math.abs(val - chiSquareValues[index - 1]) : 0))
          .filter(diff => diff > 0); // Excluir el primer índice y diferencias nulas
        const sortedDiffs = differences.sort((a, b) => a - b); // Ordenar de menor a mayor
        const smallJumpMax = Math.floor(sortedDiffs[Math.min(sortedDiffs.length - 1, Math.ceil(sortedDiffs.length * 0.70))]); // Redondear a entero
        console.log('sortedDiffs:', sortedDiffs);
        console.log('smallJumpMax (sin decimales):', smallJumpMax);
        // Evaluar proporción de saltos grandes
        const largeJumpCount = differences.filter(diff => diff > smallJumpMax).length;
        let veryLargeJumpCount = differences.filter(diff => diff > smallJumpMax * 2).length; // Saltos muy grandes
        const totalJumpCount = differences.length;
        if (veryLargeJumpCount == 0) {
          veryLargeJumpCount = this.uno
        }
        console.log('largeJumpCount:', largeJumpCount);
        console.log('veryLargeJumpCount:', veryLargeJumpCount);
        console.log('totalJumpCount:', totalJumpCount);
        // Determinar el porcentaje de esteganografía
        let percentageSteganography = 0;
        if (largeJumpCount > 0) {
          percentageSteganography = ((largeJumpCount * veryLargeJumpCount) / totalJumpCount) * 10; // Basado en saltos grandes
        }
        console.log('Resultado final 1:', percentageSteganography);
        // Limitar el porcentaje máximo al 99%
        percentageSteganography = Math.min(percentageSteganography, 99);
        if (percentageSteganography > 25) {
          this.estadoesteg = 1
        } else {
          this.estadoesteg = 0
        }
        console.log('Resultado final:', percentageSteganography);
        this.smallJumpMax = smallJumpMax;
        this.largeJumpCount = largeJumpCount;
        this.veryLargeJumpCount = veryLargeJumpCount;
        this.totalJumpCount = totalJumpCount
        this.percentageSteganography = percentageSteganography
        // Mostrar el resultado
        this.resultado = `La imagen tiene un ${percentageSteganography.toFixed(2)}% de esteganografía.`;
        this.showAlert('Resultado', this.resultado);
        // Graficar resultados
        this.plotGraph();
      } catch (error) {
        console.error('Error durante el análisis de la imagen:', error);
        this.showAlert('Error', 'Ocurrió un error al analizar la imagen.');
      } finally {
        this.isLoading = false; // Asegurar que siempre se desactive el estado de carga
      }
    };

    img.onerror = () => {
      this.isLoading = false;
      this.showAlert('Error', 'No se pudo cargar la imagen. Verifica el archivo o la URL.');
    };
  }
  drawThresholdOverlay(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, chiThreshold: number, lsbThreshold: number): void {
    context.font = '20px Arial';
    context.fillStyle = 'rgba(255, 0, 0, 0.7)'; // Color del texto y línea
    context.fillText(`Chi-Cuadrado Umbral: ${chiThreshold.toFixed(2)}`, 10, 30);
    context.fillText(`LSB Umbral: ${lsbThreshold.toFixed(2)}`, 10, 60);
    context.beginPath();
    const thresholdLineY = canvas.height / 2;
    context.moveTo(0, thresholdLineY);
    context.lineTo(canvas.width, thresholdLineY);
    context.strokeStyle = 'rgba(255, 0, 0, 0.7)';
    context.lineWidth = 2;
    context.stroke();
  }

  calculateChiSquare(imageData: ImageData): { chiSquareValues: number[]; lsbAverages: number[]; avgSmallJumps: number } {
    const { data, width, height } = imageData;
    const chiSquareValues: number[] = [];
    const lsbAverages: number[] = [];
    for (let step = 1; step <= 100; step++) {
      const maxRow = Math.floor((step * height) / 100);
      const sample = this.getSample(data, width, maxRow);
      const observed = this.getObservedValues(sample);
      const expected = this.getExpectedValues(observed);
      const { chiSquare, lsbAverage } = this.computeChiSquare(observed, expected);
      chiSquareValues.push(chiSquare);
      lsbAverages.push(lsbAverage);
    }
    const jumps = [];
    for (let i = 1; i < chiSquareValues.length; i++) {
      const jump = Math.abs(chiSquareValues[i] - chiSquareValues[i - 1]);
      jumps.push(jump);
    }
    const sortedJumps = [...jumps].sort((a, b) => a - b);
    const smallJumps = sortedJumps.slice(0, Math.floor(sortedJumps.length / 2));

    const avgSmallJumps = smallJumps.reduce((a, b) => a + b, 0) / smallJumps.length;

    return { chiSquareValues, lsbAverages, avgSmallJumps };
  }
  getObservedValues(sample: number[]): number[] {
    const observed = new Array(256).fill(0);
    sample.forEach((value) => {
      observed[value]++;
    });
    return observed;
  }
  getExpectedValues(observed: number[]): number[] {
    const expected = [];
    for (let i = 0; i < observed.length; i += 2) {
      const avg = (observed[i] + observed[i + 1]) / 2;
      expected.push(avg, avg);

    }

    return expected;
  }
  computeChiSquare(observed: number[], expected: number[]): { chiSquare: number; lsbAverage: number } {
    let chiSquare = 0;
    let lsbSum = 0;
    let lsbCount = 0;

    observed.forEach((obs, i) => {
      if (expected[i] !== 0) {
        chiSquare += Math.pow(obs - expected[i], 2) / expected[i];
      }
      if (i % 2 === 1) {
        lsbSum += obs;
        lsbCount++;
      }
    });

    const lsbAverage = lsbCount > 0 ? lsbSum / lsbCount : 0;

    return { chiSquare, lsbAverage };
  }

  getSample(data: Uint8ClampedArray, width: number, maxRow: number): number[] {
    // Tamaño del bloque para análisis..................................................................................
    const blockSize = 8;
    const sample: number[] = [];

    for (let y = 0; y < maxRow; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        const index = (y * width + x) * 1; // Canal rojo
        sample.push(data[index]);
      }
    }
    return sample;
  }

  detectSignificantIndices(values: number[], threshold: number): number[] {
    const significantIndices: number[] = [];
    values.forEach((value, index) => {
      if (Math.abs(value) > threshold) {
        significantIndices.push(index + 1); // +1 para alinearlo con las etiquetas de la gráfica
      }
    });
    return significantIndices;
  }
  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  plotGraph(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy(); // Eliminar gráfica previa si existe
    }
    const differences = this.chiSquareValues.map(
      (chi, index) => Math.abs(chi - this.lsbAverages[index])
    );
    const chiThreshold = Math.max(...this.chiSquareValues) * 0.8;
    const lsbThreshold = Math.max(...this.lsbAverages) * 0.8;
    const significantChiIndices = this.detectSignificantIndices(this.chiSquareValues, chiThreshold);
    const significantLsbIndices = this.detectSignificantIndices(this.lsbAverages, lsbThreshold);
    const canvas = document.getElementById('chiSquareChart') as HTMLCanvasElement;
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: Array.from({ length: 100 }, (_, i) => i + 1),
        datasets: [
          {
            label: 'Valores Chi-Cuadrado',
            data: this.chiSquareValues,
            borderColor: 'red',
            fill: false,
            pointRadius: 2,
            borderWidth: 1,
          },
          {
            label: 'Promedios LSB',
            data: this.lsbAverages,
            borderColor: 'green',
            fill: false,
            pointRadius: 2,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Tamaño de la muestra (%)' } },
          y: { title: { display: true, text: 'Valor' } },
        },
        plugins: {
          annotation: {
            annotations: {
              ...Object.fromEntries(
                significantChiIndices.map((index) => [
                  `chi-${index}`,
                  {
                    type: 'line',
                    xMin: index,
                    xMax: index,
                    borderColor: 'rgba(255, 0, 0, 0.5)',
                    borderWidth: 1,
                    label: {
                      content: `Chi-${index}`,
                      display: true,
                      position: 'end',
                    },
                  },
                ])
              ),
              ...Object.fromEntries(
                significantLsbIndices.map((index) => [
                  `lsb-${index}`,
                  {
                    type: 'line',
                    xMin: index,
                    xMax: index,
                    borderColor: 'rgba(0, 255, 0, 0.5)',
                    borderWidth: 1,
                    label: {
                      content: `LSB-${index}`,
                      display: true,
                      position: 'start',
                    },
                  },
                ])
              ),
            },
          },
        },
      },
    });
    console.log(significantChiIndices, significantLsbIndices)
  }
  

  async reporteestego() {
    if (!this.metadata || Object.keys(this.metadata).length === 0) {
      this.servG.fun_Mensaje('Debe analizar la imagen antes de generar el reporte', 'danger');
      return;
    }
    if (this.nombrerepstego === '') {
      this.servG.fun_Mensaje('Escriba el nombre del reporte para metadatos', 'danger');
      return;
    }
    this.id_imagen1 = null;

    const imagenExiste = await this.verificarImagenExistente();
    this.id_imagen1 = imagenExiste; // Actualiza `id_imagen1`
    console.log('ID de imagen encontrada: ' + this.id_imagen1);

    if (imagenExiste) {
      console.log('La imagen ya existe en la base de datos');
      this.servG.fun_Mensaje('La imagen ya existe en la base de datos', 'danger');

      //verificar el nombre del reporte
      const reporteExiste = await this.verificarReportExistente();
      this.id_repestega = reporteExiste;
      console.log('ID de reporte encontrada: ' + this.id_repestega);
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
      this.id_repestega = reporteExiste;
      console.log('ID de reporte encontrada: ' + this.id_repestega);
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
    await this.delay;
  }
  async nuevo() {
    await this.delay;
    await this.delay;
    const imagenExiste = await this.verificarImagenExistente();
    this.id_imagen1 = imagenExiste
    console.log('idimagenrretornada: ' + this.id_imagen1)
    await this.guardar_report();
  }
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  verificarReportExistente(): Promise<string | null> {
    console.log('daos para verificar el report: ', this.nombrerepstego, this.id_investigacion)
    return new Promise((resolve, reject) => {
      this.servRe.fun_validar_reporte_estega({
        nombrerepstego: this.nombrerepstego,
        id_investigacion: this.id_investigacion
      }).subscribe(
        (data: any) => {
          if (data.data && data.data.id_repestego) {
            // Si existe, retornar la id_imagen
            resolve(data.data.id_repestego);
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
  datatemp: string = 'hola'
  async guardar_report() {
    const dataToSave = {
      chiSquareValues: this.chiSquareValues,
      lsbAverages: this.lsbAverages
    };
    const jsonData = JSON.stringify(dataToSave);
    this.id_repestega = 0;
    this.delay;
    const imagenExiste = await this.verificarImagenExistente();
    this.id_imagen1 = imagenExiste
    console.log('idimagenrretornada: ' + this.id_imagen1);
    if (imagenExiste) {
      console.log('datos: ', this.id_repestego, this.nombrerepstego, jsonData, this.fecha_inicio, this.id_imagen1)
      console.log('datos2: ', this.smallJumpMax, this.largeJumpCount, this.veryLargeJumpCount, this.totalJumpCount, this.percentageSteganography)
      if (this.nombrerepstego) {
        const loading = await this.loadingCtrl.create();
        loading.present();
        this.servRe.generatereportstega({
          id_repestego: this.id_repestego,
          nombrerepstego: this.nombrerepstego,
          chis: jsonData,
          fecharepestego: this.fecha_inicio,
          id_imagen: this.id_imagen1,
          estadoesteg: this.estadoesteg,
          smallJumpMax: this.smallJumpMax,
          largeJumpCount: this.largeJumpCount,
          veryLargeJumpCount: this.veryLargeJumpCount,
          totalJumpCount: this.totalJumpCount,
          percentageSteganography: this.percentageSteganography
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
  isPdfButtonEnabled: boolean = false;
  verrep() {
    this.servG.irA('/reporteestega')
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
    // Función para verificar si es necesario agregar una nueva página
    const checkNewPage = (additionalHeight: number) => {
      if (yPosition + additionalHeight > pageHeight - 20) {
        doc.addPage();
        yPosition = 10;

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
    doc.text('Reporte de estegoanálisis STEGSCAN', 10, yPosition);
    yPosition += 10;
    checkNewPage(20);
    doc.text(`Reporte: ${this.nombrerepstego}`, 10, yPosition);
    yPosition += 10;
    checkNewPage(20);
    doc.text(`Fecha: ${this.fecha_inicio}`, 10, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text('Nombre de la Imagen:', 10, yPosition);
    doc.text(this.nombreimg, 60, yPosition);
    yPosition += 10;
    checkNewPage(20);
    doc.text('Hash SHA-256 de la Imagen:', 10, yPosition);
    yPosition += 10;
    doc.text(this.hash, 10, yPosition);
    yPosition += 20;
    if (this.imageUrl) {
      const response = await fetch(this.imageUrl);
      const blob = await response.blob();
      const imgData = await this.blobToBase64(blob);
      const imgWidth = 180;
      const imgHeight = 180;
      checkNewPage(imgHeight + 10);
      doc.addImage(imgData, 'JPEG', 10, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;
    }
    doc.setFontSize(18);
    checkNewPage(20);
    doc.text('Metadatos de la Imagen:', 10, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    for (const key of Object.keys(this.metadata)) {
      checkNewPage(10);
      doc.text(`${key}: ${this.metadata[key]}`, 10, yPosition);
      yPosition += 7;
    }
    if (this.chart) {
      checkNewPage(140);
      doc.setFontSize(18);
      yPosition += 10;
      doc.text('Análisis de la Imagen:', 10, yPosition);
      yPosition += 10;
      try {
        const chartImage = this.chart.toBase64Image();
        const imgWidth = 180;
        const imgHeight = 120;
        doc.addImage(chartImage, 'PNG', 10, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      } catch (error) {
        console.error('Error al agregar el gráfico al PDF:', error);
      }
    }
    checkNewPage(20);
    doc.setFontSize(15);
    doc.text('Estado de la Imagen:', 10, yPosition);
    yPosition += 10;
    doc.setFontSize(15);
    
    doc.text(`Promedio saltos de bits: ${this.smallJumpMax}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Saltos mayores al promedio: ${this.largeJumpCount}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Saltos mucho mas grandes: ${this.veryLargeJumpCount}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Total de bits escaneados: ${this.totalJumpCount}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Porcentaje de esteganografia: ${this.percentageSteganography}`, 10, yPosition);
    yPosition += 10;

    doc.save(`${this.nombrerepstego}.pdf`);
    this.servG.fun_Mensaje('Reporte generado correctamente');
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
  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

}
