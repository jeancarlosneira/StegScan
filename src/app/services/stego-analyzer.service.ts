import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StegoAnalyzerService {

  
  async analyzeImage(imageData: string): Promise<string> {
    // Implementación del análisis para cada técnica aquí
    let result = '';

    if (this.detectLSBReplacement(imageData)) {
      result += 'Esteganografía detectada: LSB Replacement (posible OpenStego/OpenPuff).\n';
    }

    if (this.detectLSBMatching(imageData)) {
      result += 'Esteganografía detectada: LSB Matching.\n';
    }

    if (this.detectSteganoGAN(imageData)) {
      result += 'Esteganografía detectada: SteganoGAN.\n';
    }

    if (this.detectHStego(imageData)) {
      result += 'Esteganografía detectada: HStego.\n';
    }

    return result || 'No se detectó esteganografía en la imagen.';
  }

  private detectLSBReplacement(imageData: string): boolean {
    // Convierte la imagen en una matriz de píxeles
    const pixels = this.getPixelsFromImageData(imageData);
    let spaResult = 0;
  
    // Recorre los píxeles en pares y realiza el análisis de pares de muestras (SPA)
    for (let i = 0; i < pixels.length - 1; i += 2) {
      const diff = Math.abs(pixels[i] - pixels[i + 1]);
      if (diff === 1) {
        spaResult++;
      }
    }
  
    // Umbral para detección de esteganografía LSB Replacement
    const threshold = pixels.length * 0.05;
    return spaResult > threshold;
  }
  
  // Función auxiliar para extraer los píxeles de la imagen
  private getPixelsFromImageData(imageData: string): number[] {
    // Aquí iría el código para convertir la imagen en matriz de píxeles
    // Esto depende del método de manipulación de imágenes en tu aplicación Ionic
    return [];
  }
  

  private detectLSBMatching(imageData: string): boolean {
    const pixels = this.getPixelsFromImageData(imageData);
    let matchCount = 0;
  
    for (let i = 0; i < pixels.length - 1; i += 2) {
      const diff = Math.abs(pixels[i] - pixels[i + 1]);
      if (diff === 1) {
        matchCount++;
      }
    }
  
    // Umbral ajustado para detectar LSB Matching
    const threshold = pixels.length * 0.03;
    return matchCount > threshold;
  }
  

  private detectSteganoGAN(imageData: string): boolean {
    const pixels = this.getPixelsFromImageData(imageData);
    let anomalyScore = 0;
  
    for (let i = 0; i < pixels.length; i++) {
      const pixel = pixels[i];
      if (pixel > 250 || pixel < 5) {
        anomalyScore++;
      }
    }
  
    // Umbral basado en propiedades estadísticas de imágenes GAN
    const threshold = pixels.length * 0.02;
    return anomalyScore > threshold;
  }
  

  private detectHStego(imageData: string): boolean {
    const originalSize = this.getImageSize(imageData);
    const compressedSize = this.getCompressedImageSize(imageData);
  
    // Si la compresión reduce mucho el tamaño, es probable que no tenga datos ocultos
    const reductionRatio = (originalSize - compressedSize) / originalSize;
    return reductionRatio < 0.1;  // Ajustar el umbral según los resultados de prueba
  }
  
  // Función para obtener el tamaño original de la imagen
  private getImageSize(imageData: string): number {
    return imageData.length; // Ejemplo para base64, puedes ajustarlo
  }
  
  // Función para obtener el tamaño comprimido de la imagen
  private getCompressedImageSize(imageData: string): number {
    // Aplica compresión para obtener el tamaño de la imagen
    return this.compressImage(imageData).length;
  }
  
  // Función de compresión para imágenes
  private compressImage(imageData: string): string {
    // Implementa la compresión de imagen
    return imageData; // Aquí devolverías la imagen comprimida
  }
  
}
