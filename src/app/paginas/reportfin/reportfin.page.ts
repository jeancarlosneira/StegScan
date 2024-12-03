import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { ReporteService } from 'src/app/services/reporte.service';
import jsPDF from 'jspdf';
import Chart from 'chart.js/auto';
import { PdfsService } from 'src/app/services/pdfs.service';
@Component({
  selector: 'app-reportfin',
  templateUrl: './reportfin.page.html',
  styleUrls: ['./reportfin.page.scss'],
})
export class ReportfinPage implements OnInit {
  listareportes: any[] = [];
  listareporteestega: any[] = [];
  listareportemeta: any[] = [];
  listarimgenes: any = [] = [];
  idusuario: any;

  constructor(
    private loading: LoadingController,
    private servRep: ReporteService,
    private servpdf:PdfsService,
    private alertController: AlertController,
    private servImg: ImagenesService,
    public servG: GeneralService,
  ) { }

  ngOnInit() {
    this.retornarusu();
    this.retornarinvg();

  }
  ionViewWillEnter() {
    this.actualizarImagenes();
  }
  retornarpage() {
    this.servG.irA('/invgterminadas');
  }
  meta: any;
  metadaros: any = {};

  async cargarreportesela() {
    let l = await this.loading.create();
    l.present();
    this.servRep.listarreportes(this.id_investigacion).subscribe(
      (respuesta: any) => {
        this.listareportes = respuesta.data;
        console.log('lista reporte: ' + this.listareportes);
        l.dismiss();
      }, (error: any) => {
        l.dismiss();
        this.servG.fun_Mensaje("error al recuperar los reportes")
      }

    );

  }
  async cargarreportessteg() {
    let l = await this.loading.create();
    l.present();
    this.servRep.listarreportesestega(this.id_investigacion).subscribe(
      (respuesta: any) => {
        this.listareporteestega = respuesta.data;
        console.log('lista reporte' + this.listareporteestega);
        l.dismiss();

      }, (error: any) => {
        l.dismiss();
        this.servG.fun_Mensaje("error al recuperar los reportes")
      }

    );

  }

  async cargarreportesmeta() {
    let l = await this.loading.create();
    l.present();
    this.servRep.listarreportesmeta(this.id_investigacion).subscribe(
      (respuesta: any) => {
        this.listareportemeta = respuesta.data;

        let metadatosExtraidos = respuesta.data.map(item => {
          try {
            return JSON.parse(item.metadatos);  // Convertir la cadena JSON a un objeto
          } catch (e) {
            return {};  // En caso de que no sea un JSON válido
          }

        }
        );


        l.dismiss();

      }, (error: any) => {
        l.dismiss();
        this.servG.fun_Mensaje("error al recuperar los reportes")
      }

    );

  }

  async cargarimagenes() {
    let l = await this.loading.create();
    l.present();
    this.servImg.retornarimg(this.id_investigacion).subscribe(
      (respuesta: any) => {
        this.listarimgenes = respuesta.data;
        console.log('lista reporte' + this.listarimgenes);
        l.dismiss();

      }, (error: any) => {
        l.dismiss();
        this.servG.fun_Mensaje("error al recuperar los reportes")
      }

    );
    console.log(this.listarimgenes)
  }
  retornarusu() {
    const userSession = JSON.parse(localStorage.getItem('idusu'));
    this.idusuario = userSession;
    console.log('ID usuario:', userSession);
    return this.idusuario
  }
  id_investigacion: any;
  retornarinvg() {
    const userSession = JSON.parse(localStorage.getItem('id_investigacion'));
    this.id_investigacion = userSession;
    console.log('id_investigacion:', userSession);
    return this.id_investigacion
  }
  nombre_reporte_steg:any;
  fecha_inicio_steg:any;
  estado_steg:any;
  mensaje_estado_steg:any;
  chis_steg:any;
  url_imagen_steg:any;
  hash_imagen_steg:any;
  nombre_imagen_steg:any;
lsbAverages:any;
chiSquareValues:any;
metadatos_steg:any;
  async cargardatosteg(idrepesteg){
  const l = await this.loading.create();
  l.present();
  this.servpdf.listarReportesestegapdf(idrepesteg).subscribe(
    (respuesta: any) => {
      if (respuesta.data && respuesta.data.length > 0) {
        const imagen = respuesta.data[0]; // Accede al primer elemento del arreglo
        this.nombre_reporte_steg = imagen.nombre_reporte;
        this.fecha_inicio_steg = imagen.fecha_inicio;
        this.estado_steg = imagen.estado;
        this.metadatos_steg = imagen.metadatos;
        this.mensaje_estado_steg = imagen.mensaje_estado;
        this.chis_steg = JSON.parse(imagen.chis); // Parseamos chis a un objeto
        this.url_imagen_steg = imagen.url_imagen;
        this.hash_imagen_steg = imagen.hash_imagen;
        this.nombre_imagen_steg = imagen.nombre_imagen;

        // Extraemos los valores directamente de this.chis_steg
        this.chiSquareValues = this.chis_steg.chiSquareValues;
        this.lsbAverages = this.chis_steg.lsbAverages;

        console.log('Chi-Square Values:', this.chiSquareValues);
        console.log('LSB Averages:', this.lsbAverages);

        console.log(
          'Datos cargados:',
          this.nombre_reporte_steg,
          this.fecha_inicio_steg,
          this.estado_steg,
          this.mensaje_estado_steg,
          this.chis_steg,
          this.url_imagen_steg,
          this.hash_imagen_steg,
          this.nombre_imagen_steg
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
async pdfesteg(idrepesteg) {
  console.log('generar reporte pdf esteg', idrepesteg);
  
  const alert = await this.alertController.create({
    header: 'Confirmación',
    message: 'Descargar el PDF del reporte?.',
    
    buttons: [
      {
        text: 'SI',
        handler: async () => {
          await this.cargardatosteg(idrepesteg); // Llama a la función para eliminar imagen y reportes
          await this.PDFsteg();
        }
      },
      
      {
        text: 'Cancelar',
        role: 'NO',
        handler: () => {
          console.log('Operación cancelada');
        }
      }
    ]
  });

  await alert.present();

  
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
  chart: any;
  detectSignificantIndices(values: number[], threshold: number): number[] {
    const significantIndices: number[] = [];
    values.forEach((value, index) => {
      if (Math.abs(value) > threshold) {
        significantIndices.push(index + 1); // +1 para alinearlo con las etiquetas de la gráfica
      }
    });
    return significantIndices;
  }
  plotGraph(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy(); // Eliminar gráfica previa si existe
    }

    const differences = this.chiSquareValues.map(
      (chi, index) => Math.abs(chi - this.lsbAverages[index])
    );

    // Detectar valores destacados
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
          // {
          //   label: 'Diferencias Absolutas',
          //   data: differences,
          //   borderColor: 'blue',
          //   fill: false,
          //   pointRadius: 2,
          //   borderWidth: 1,
          // },
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
    
  }
  async PDFsteg() {
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

  doc.setFontSize(18);
    doc.text('Reporte de estegoanálisis STEGSCAN', 10, yPosition);
    yPosition += 10;
    doc.text(`Nombre del Reporte: ${this.nombre_reporte_steg}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Fecha: ${this.fecha_inicio_steg}`, 10, yPosition);
    yPosition += 10;

    // Datos generales
    doc.setFontSize(12);
    doc.text('Nombre de la Imagen:', 10, yPosition);
    doc.text(this.nombre_imagen_steg, 60, yPosition);
    yPosition += 10;
    doc.text('Hash SHA-256 de la Imagen:', 10, yPosition);
    doc.text(this.hash_imagen_steg, 10, yPosition + 10);
    yPosition += 20;


    if (this.url_imagen_steg) {
      try {
        const imgWidth = 120; // Ancho máximo de la imagen en el PDF
        const imgHeight = 120; // Alto máximo de la imagen en el PDF
        doc.addImage(this.url_imagen_steg, 'JPEG', 10, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10; // Ajustar posición para no solapar
      } catch (error) {
        console.error('Error al cargar la imagen:', error);
      }
    }

    // Agregar gráfico al PDF
    if (this.chart) {
      try {
        // Convertir el gráfico a imagen en base64
        const chartImage = this.chart.toBase64Image();

        // Calcular proporción dinámica de la imagen
        const imgWidth = 160; // Ancho máximo de la imagen en el PDF
        const imgHeight = 100; // Alto máximo de la imagen en el PDF

        // Agregar la imagen del gráfico al PDF
        doc.addImage(chartImage, 'PNG', 10, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10; // Ajustar posición para no solapar
      } catch (error) {
        console.error('Error al agregar el gráfico al PDF:', error);
      }
    }

    // Metadatos
    doc.text('Metadatos de la Imagen:', 10, yPosition);
    yPosition += 10;
    for (const key of Object.keys(this.metadatos_steg)) {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 10;

        // Agregar marca de agua en páginas adicionales
        doc.addImage(watermarkImage, 'PNG', (pageWidth - watermarkWidth) / 2, (pageHeight - watermarkHeight) / 2, watermarkWidth, watermarkHeight, undefined, 'NONE');
      }
      doc.text(`${key}: ${this.metadatos_steg[key]}`, 10, yPosition);
      yPosition += 7;
    }
    yPosition += 10;
    doc.setFontSize(15);
    doc.text('Estado de la Imagen.', 10, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text('posible resultado:', 10, yPosition);
    doc.text(this.mensaje_estado_steg, 60, yPosition);
    yPosition += 10;

    // Guardar PDF
    doc.save(`${this.nombre_reporte_steg}.pdf`);
    this.servG.fun_Mensaje('Reporte generado correctamente');
  }







  pdfrepela(idrepela) {
    console.log('generar reporte pdf ela', idrepela)
  }
  pdfrepmeta(idrepmeta) {
    console.log('generar reporte pdf meta', idrepmeta)
  }


  async actualizarImagenes() {
    await this.cargarreportesela();
    await this.cargarreportesmeta();
    await this.cargarreportessteg();
    await this.cargarimagenes();
  }
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
