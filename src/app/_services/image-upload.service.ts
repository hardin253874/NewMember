import { Injectable} from '@angular/core';
import { Http, RequestOptionsArgs, RequestOptions, Response } from '@angular/http';
import { Observable} from 'rxjs/Observable';
import {forEach} from '@angular/router/src/utils/collection';

@Injectable()
export class ImageService {

  constructor(private http : Http) { }

  public postImage(url : string, image: File, partName : string = 'image', dto : any = null): Observable<Response> {
    if (!url || url === '') {
      throw new Error('Url is not set! Please set it before doing queries');
    }

    const options: RequestOptionsArgs = new RequestOptions();

    options.withCredentials = true;

    // if (headers) {
    //   for (let header of headers)
    //     options.headers.append(header.header, header.value);
    // }

    const formData: FormData = new FormData();

    for (const key in dto) {
      if (dto.hasOwnProperty(key)) {
        formData.append(key, dto[key]);
      }
    }

    formData.append(partName, image);

    return this.http.post(url, formData, options);
  }
}
