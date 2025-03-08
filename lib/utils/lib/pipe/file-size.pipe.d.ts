import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class FileSizePipe implements PipeTransform {
    transform(sizeInBytes: number | null, longForm?: boolean): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileSizePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<FileSizePipe, "fileSize", true>;
}
