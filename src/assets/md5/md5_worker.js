import { Md5 } from 'ts-md5';

// Escuchar mensajes del hilo principal
self.onmessage = function(event) {
    const fileBlob = event.data;
    const reader = new FileReader();

    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const md5Hash = Md5.hashStr(arrayBuffer);
        // Enviar de vuelta el hash al hilo principal
        self.postMessage(md5Hash);
    };

    // Leer el Blob como ArrayBuffer
    reader.readAsArrayBuffer(fileBlob);
};