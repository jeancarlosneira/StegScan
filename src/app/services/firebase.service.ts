import { inject, Injectable } from '@angular/core';
import { getStorage, updateMetadata,uploadString,ref,getDownloadURL } from 'firebase/storage';
import {AngularFireStorage} from '@angular/fire/compat/storage'
import {AngularFirestore} from '@angular/fire/compat/firestore'
import { finalize, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {



  constructor( 
    private storage: AngularFireStorage
  ) { }

  
  uploadImage(file: File): Observable<string> {
    const filePath = `images/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

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
}
