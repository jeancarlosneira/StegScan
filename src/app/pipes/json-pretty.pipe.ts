import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonPretty',
  standalone: true
})
export class JsonPrettyPipe implements PipeTransform {

  transform(value: any): string {
    try {
      return JSON.stringify(value, null, 2); // Formatea el JSON con indentación de 2 espacios
    } catch (e) {
      return value; // En caso de error, retorna el valor original
    }
  }
}
