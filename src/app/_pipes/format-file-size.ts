import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatFileSize'
})
export class FormatFileSizePipe implements PipeTransform {

    constructor () {}

    public transform(bytes: number = 0, precision: number = 2 ): string {
        if ( isNaN( parseFloat( String(bytes) )) || ! isFinite( bytes ) ) {
            return ' ';
        }

        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        let unit = 0;

        while ( bytes >= 1024 ) {
            bytes /= 1024;
            unit ++;
        }

        return bytes.toFixed( + precision ) + ' ' + units[ unit ];
    }
}
