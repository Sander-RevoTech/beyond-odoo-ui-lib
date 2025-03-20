import { OdooJsonConnector } from './connector/json.service';
import * as i0 from "@angular/core";
export declare abstract class BydBaseOdooService {
    _odooService: OdooJsonConnector;
    constructor();
    protected _handleJoinData<T>(entity: T, props: Array<{
        from?: keyof T;
        to: keyof T;
    }>): T;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydBaseOdooService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydBaseOdooService>;
}
