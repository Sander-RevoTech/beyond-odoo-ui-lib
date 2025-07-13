import { BydBaseOdooService } from '@beyond/odoo';
import { Observable } from 'rxjs';
import { ajaxRequestFuncParams, ajaxResponse } from '../models/types';
import * as i0 from "@angular/core";
export declare const gridSearchFieldsName = "search";
export declare class BydGridViewService extends BydBaseOdooService {
    constructor();
    getData$<T>(model: string, ajaxParam: ajaxRequestFuncParams, fields: (keyof T)[]): Observable<ajaxResponse<T>>;
    private _buildOrDomain;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGridViewService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydGridViewService>;
}
