import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inspecitonType'
})


export class InspecitonTypePipe implements PipeTransform {
  transform(value: string) {
    switch (value) {
      case 'Entry':
        return 'Initial entry inspection before moving in';
      case 'Exit':
        return 'Final inspection on moving out';
      default:
        return 'Routine inspection';
    }
  }
}
