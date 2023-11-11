import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstLetter'
})
export class CapitalizeFirstLetterPipe implements PipeTransform {

  transform(value: string | null): string {
    if (!value) return ''; // Manejar el caso de valor nulo
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}
