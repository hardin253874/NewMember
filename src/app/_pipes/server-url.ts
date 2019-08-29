import { Pipe, PipeTransform } from '@angular/core';
import { environment }         from '../../environments/environment';

@Pipe({
  name: 'serverUrl'
})

export class ServerUrlPipe implements PipeTransform {
  transform(value: string) {
    return environment.serverUrl + value;
  }
}
