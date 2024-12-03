import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';
import { getStorage, ref, getMetadata, updateMetadata } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  constructor(private storage: AngularFireStorage) { }
  
  uploadImageWithMetadata(file: File, metadata: any): Observable<string> {
    const filePath = `images/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file, { customMetadata: metadata });

    return new Observable((observer) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            observer.next(url);
            observer.complete();
          });
        })
      ).subscribe();
    });
  }

  // Método para obtener los metadatos de la imagen
  

  // Método para actualizar los metadatos de la imagen si es necesario
  updateImageMetadata(filePath: string, newMetadata: any): Promise<any> {
    const storage = getStorage();
    const imageRef = ref(storage, filePath);

    return updateMetadata(imageRef, newMetadata)
      .then((metadata) => {
        console.log("Updated metadata:", metadata);
        return metadata;
      })
      .catch((error) => {
        console.error("Error updating metadata:", error);
        throw error;
      });
  }

  reposarimg(e: any){
    return e
  }
  
  
}
