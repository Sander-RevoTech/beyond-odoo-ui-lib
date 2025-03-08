import { Observable } from 'rxjs';
import { BydAbstractComponent } from './abstractComponent';
import * as i0 from "@angular/core";
export declare abstract class BydBasePage extends BydAbstractComponent {
    constructor();
    protected _getPathParams<T extends object>(data: T): Observable<T>;
    protected _getQueryParams<T extends object>(data: T): Observable<T>;
    private _filterParams;
    private _getParamsTyped;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydBasePage, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydBasePage, "ng-component", never, {}, {}, never, never, true, never>;
}
