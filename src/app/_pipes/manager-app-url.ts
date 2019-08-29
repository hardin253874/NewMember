import { Pipe, PipeTransform } from '@angular/core';
import { environment }         from '../../environments/environment';

@Pipe({
  name: 'managerAppUrl'
})

export class ManagerAppUrlPipe implements PipeTransform {
  transform(value: string) {
    return environment.managerAppUrl + value;
  }
}
