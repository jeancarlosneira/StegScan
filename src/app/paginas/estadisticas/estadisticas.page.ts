import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Chart, PieController, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { EstadisticasService } from 'src/app/services/estadisticas.service';
import { GeneralService } from 'src/app/services/general.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvestigacionesService } from 'src/app/services/investigaciones.service';
import { LoadingController } from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
Chart.register(PieController, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit, OnDestroy {
  @ViewChild('barChart') barChart: any;
  @ViewChild('elaChart') elaChart: any;
  @ViewChild('stegChart') stegChart: any;

  chart: any;
  elaPieChart: any;
  stegPieChart: any;

  usuarioId: number;
  id_investigacion: any;
  cantidadrepesteg: number = 0;
  cantidadrepela: number = 0;
  cantidadrepmeta: number = 0;
  cantidadConModificaciones: number = 0;
  cantidadSinModificaciones: number = 0;
  cantidadConModificaciones1: number = 0;
  cantidadSinModificaciones1: number = 0;


  name_invg: any;
  fecha_inicio: any;
  fecha_fin: any;
  estadoinvg: any;
  descripcion_ing: any;
  constructor(
    public servG: GeneralService,
    public servE: EstadisticasService,
    private loading: LoadingController,
    private servI: InvestigacionesService
  ) { }

  ngOnInit() {
    this.retornarusu1();
    this.retornarinvg();
    this.obtenerModificaciones();
    this.obtenerDatos();

    this.retornarinvgfinalgraficos();
  }

  infoinvg() {
    this.servI.retornartodoinvrg(this.id_investigacion)
  }
  ngOnDestroy() {
    // Destruir gráficos si existen
    if (this.chart) this.chart.destroy();
    if (this.elaPieChart) this.elaPieChart.destroy();
    if (this.stegPieChart) this.stegPieChart.destroy();
  }

  retornar() {
    this.servG.irA('/main');
  }

  async retornarinvgfinalgraficos() {

    const l = await this.loading.create();
    l.present();

    this.servI.retornarinvgpdf(this.id_investigacion, this.usuarioId).subscribe(
      (respuesta: any) => {
        if (respuesta.data && respuesta.data.length > 0) {
          const investigacion = respuesta.data[0]; // Accede al primer elemento del arreglo
          this.name_invg = investigacion.name_invg;
          this.fecha_inicio = investigacion.fecha_inicio;
          this.fecha_fin = investigacion.fecha_fin;
          this.estadoinvg = investigacion.estadoinvg;
          this.descripcion_ing = investigacion.descripcion_ing;


          console.log(
            'Datos cargados:',
            this.name_invg,
            this.fecha_inicio,
            this.fecha_fin,
            this.estadoinvg,
            this.descripcion_ing
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

  retornarusu1() {
    const userSession = JSON.parse(localStorage.getItem('idusu'));
    this.usuarioId = userSession;
    console.log('id usuario: ' + userSession);
  }

  retornarinvg() {
    const userSession1 = JSON.parse(localStorage.getItem('id_investigacion'));
    this.id_investigacion = userSession1;
    console.log('id_investigacion:', userSession1);
    return this.id_investigacion;
  }

  obtenerDatos() {
    this.servE.obtenerCantidadReportesestega(this.id_investigacion).subscribe((response: any) => {
      this.cantidadrepesteg = response?.data?.total_reportes || 0;
      console.log('Cantidad de reportes estego:', this.cantidadrepesteg);

    });

    this.servE.obtenerCantidadReportela(this.id_investigacion).subscribe((response: any) => {
      this.cantidadrepela = response?.data?.total_reportes || 0;
      console.log('Cantidad de reportes ela:', this.cantidadrepela);
    });

    this.servE.obtenerCantidadReportesMeta(this.id_investigacion).subscribe((response: any) => {
      this.cantidadrepmeta = response?.data?.total_reportes || 0;
      console.log('Cantidad de reportes meta:', this.cantidadrepmeta);
    });

  }

  obtenerModificaciones() {
    this.servE.obtenerCantidadela(this.id_investigacion).subscribe((response: any) => {
      this.cantidadConModificaciones = response?.data?.total_reportes || 0;
      console.log('Cantidad modi ela:', this.cantidadConModificaciones);

    });

    this.servE.obtenerCantidadsinela(this.id_investigacion).subscribe((response: any) => {
      this.cantidadSinModificaciones = response?.data?.total_reportes || 0;
      console.log('Cantidad sin modi ela:', this.cantidadSinModificaciones);
    });

    this.servE.obtenerCantidadsteg(this.id_investigacion).subscribe((response: any) => {
      this.cantidadConModificaciones1 = response?.data?.total_reportes || 0;
      console.log('Cantidad modi steg:', this.cantidadConModificaciones1);

    });

    this.servE.obtenerCantidadsinsteg(this.id_investigacion).subscribe((response: any) => {
      this.cantidadSinModificaciones1 = response?.data?.total_reportes || 0;
      console.log('Cantidad sin modi steg:', this.cantidadSinModificaciones1);
    });
  }
  total: number;
  crearGraficoELA() {
    if (this.elaPieChart) this.elaPieChart.destroy();

    this.elaPieChart = new Chart(this.elaChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Con Modificaciones:' + this.cantidadConModificaciones, 'Sin Modificaciones: ' + this.cantidadSinModificaciones],
        datasets: [{
          data: [this.cantidadConModificaciones, this.cantidadSinModificaciones],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Integridad: Modificaciones vs Sin Modificaciones' }
        }
      }
    });
  }

  crearGraficoSteg() {
    if (this.stegPieChart) this.stegPieChart.destroy();
    console.log(this.cantidadConModificaciones1, this.cantidadSinModificaciones1)
    this.stegPieChart = new Chart(this.stegChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Con Modificaciones: ' + this.cantidadConModificaciones1, 'Sin Modificaciones: ' + this.cantidadSinModificaciones1],
        datasets: [{
          data: [this.cantidadConModificaciones1, this.cantidadSinModificaciones1],
          backgroundColor: ['#FF9F40', '#66BB6A'],
          hoverBackgroundColor: ['#FF9F40', '#66BB6A']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Stegoanalisis: Modificaciones vs Sin Modificaciones' }
        }
      }
    });
  }

  generargraficos() {
    // Asegúrate de que los datos estén disponibles antes de generar los gráficos
    this.obtenerDatos(); // Actualiza los datos necesarios para el gráfico de barras
    this.obtenerModificaciones(); // Actualiza los datos necesarios para los gráficos de ELA y Steg

    // Genera los gráficos después de que los datos se hayan actualizado
    setTimeout(() => {
      this.crearGrafico();
      this.crearGraficoELA();
      this.crearGraficoSteg();
    }, 500); // Retraso breve para asegurarse de que los datos se carguen
  }
  // crearGrafico() {
  //   if (this.chart) this.chart.destroy();

  //   this.chart = new Chart(this.barChart.nativeElement, {
  //     type: 'bar',
  //     data: {
  //       labels: ['Stegoanálisis', 'Integridad', 'Metadatos'],
  //       datasets: [{
  //         data: [this.cantidadrepesteg, this.cantidadrepela, this.cantidadrepmeta],
  //         backgroundColor: ['#42A5F5', '#66BB6A', '#FF6384'],
  //         borderColor: ['#1E88E5', '#43A047', '#FF6384'],
  //         borderWidth: 1,
  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       scales: {
  //         y: { beginAtZero: true },
  //       },
  //       plugins: {
  //         title: {
  //           display: true,
  //           text: 'Cantidad de imágenes analizadas por tipo',
  //         },
  //         datalabels: {
  //           color: 'white',
  //           anchor: 'end',
  //           align: 'start',
  //           formatter: (value) => value.toString(),
  //         },
  //       },
  //     }
  //   });
  // }
  crearGrafico() {
    if (this.chart) this.chart.destroy();
  
    this.chart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Stegoanálisis', 'Integridad', 'Metadatos'],
        datasets: [{
          data: [this.cantidadrepesteg, this.cantidadrepela, this.cantidadrepmeta],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FF6384'],
          borderColor: ['#1E88E5', '#43A047', '#FF6384'],
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { 
            beginAtZero: true,
            ticks: {
              precision: 0, // Asegura que no haya decimales en los valores del eje Y
            }
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Cantidad de imágenes analizadas por tipo',
          },
          datalabels: {
            color: 'white',
            anchor: 'center', // Coloca la etiqueta dentro de la barra
            align: 'center', // Asegura que se centre en ambas direcciones
            formatter: (value) => value.toString(), // Formatea los valores como texto
            font: {
              weight: 'bold', // Resalta las etiquetas con texto en negrita
            }
          },
        },
      },
      plugins: [ChartDataLabels], // Activa el plugin de etiquetas
    });
  }
  


  async loadImageAsBase64(imagePath: string): Promise<string> {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return await this.blobToBase64(blob);
  }

  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async generarPDF() {
    const doc = new jsPDF();
    let yPosition = 10;

    // Dimensiones del documento
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Cargar la imagen de marca de agua
    const watermarkPath = './assets/images/stegscan.jpg'; // Ruta de la imagen de marca de agua
    const watermarkImage = await this.loadImageAsBase64(watermarkPath);

    // Función para agregar la marca de agua
    const addWatermark = () => {
      const watermarkWidth = 100; // Ancho de la marca de agua
      const watermarkHeight = 100; // Alto de la marca de agua
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
    };

    // Agregar marca de agua a la primera página
    addWatermark();

    // Función para verificar si hay espacio en la página
    const checkNewPage = (additionalHeight: number) => {
      if (yPosition + additionalHeight > pageHeight - 20) {
        doc.addPage();
        yPosition = 10;
        addWatermark(); // Agregar marca de agua en páginas adicionales
      }
    };

    const pdfOutput = doc.output('blob');

    if (Capacitor.isNativePlatform()) {
      // Guardar el archivo en dispositivos móviles
      const fileName = `${this.name_invg}.pdf`;
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
      // Descargar el archivo en navegadores
      doc.save(`${this.name_invg}.pdf`);
      this.servG.fun_Mensaje('Reporte descargado correctamente');
    }


  }

}
