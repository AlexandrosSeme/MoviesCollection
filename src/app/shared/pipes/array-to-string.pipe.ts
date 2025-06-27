import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinByProperty'
})
export class JoinByPropertyPipe implements PipeTransform {
  transform(array: any[], property: string, separator: string = ', '): string {
    if (!Array.isArray(array) || !property) return '';
    return array.map(item => item && item[property]).filter(Boolean).join(separator);
  }
}

@Pipe({
  name: 'arrayLength'
})
export class ArrayLengthPipe implements PipeTransform {
  transform(array: any[]): number {
    return Array.isArray(array) ? array.length : 0;
  }
} 