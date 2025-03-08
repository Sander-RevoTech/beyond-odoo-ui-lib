import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class TimeAgoDirective implements PipeTransform {
    transform(date: string): string;
    private _getTranslationKey;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeAgoDirective, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<TimeAgoDirective, "appTimeAgo", true>;
}
