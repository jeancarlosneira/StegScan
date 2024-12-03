import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-estegoanalisis2',
  templateUrl: './estegoanalisis2.page.html',
  styleUrls: ['./estegoanalisis2.page.scss'],
})
export class Estegoanalisis2Page {
  selectedImage: any = null;
  analysisResult: any = null;

  constructor(private http: HttpClient) {}

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = URL.createObjectURL(file);
    }
  }

  analyzeImage() {
    if (!this.selectedImage) {
      alert('Seleccione una imagen primero.');
      return;
    }

    const formData = new FormData();
    const fileInput: any = document.getElementById('imageUpload');
    formData.append('image', fileInput.files[0]);

    this.http.post('http://localhost:80/APPTESIS/app', formData).subscribe(
      (response: any) => {
        this.analysisResult = response;
      },
      (error) => {
        console.error('Error al analizar la imagen:', error);
      }
    );
  }
}
