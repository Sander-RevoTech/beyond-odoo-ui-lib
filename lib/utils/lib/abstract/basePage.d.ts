import { Observable } from 'rxjs';
import { TaAbstractComponent } from './abstractComponent';
import * as i0 from "@angular/core";
export declare abstract class TaBasePage extends TaAbstractComponent {
    constructor();
    protected _getPathParams<T extends object>(data: T): Observable<T>;
    protected _getQueryParams<T extends object>(data: T): Observable<T>;
    private _filterParams;
    private _getParamsTyped;
    static ɵfac: i0.ɵɵFactoryDeclaration<TaBasePage, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TaBasePage, "ng-component", never, {}, {}, never, never, true, never>;
}
