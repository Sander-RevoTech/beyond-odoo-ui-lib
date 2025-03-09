import { OnDestroy } from '@angular/core';
import { OdooJsonConnector } from './connector/json.service';
import { OdooXmlConnector } from './connector/xml.service';
import { BydBaseService } from '@beyond/server';
import * as i0 from "@angular/core";
export declare abstract class BydBaseOdooService extends BydBaseService implements OnDestroy {
    protected _odooService: OdooXmlConnector;
    protected _odooJsonService: OdooJsonConnector;
    constructor();
    protected _handleJoinData<T>(entity: T, props: Array<{
        from?: keyof T;
        to: keyof T;
    }>): T;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydBaseOdooService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydBaseOdooService>;
}
