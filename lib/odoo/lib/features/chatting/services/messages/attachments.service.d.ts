import { BydBaseOdooService } from '../../../../services/baseService';
import { FileStructure } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class BydAttachementsService extends BydBaseOdooService {
    constructor();
    post$(id: number, model: string, files: FileStructure[]): Promise<import("rxjs").Observable<number[]>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydAttachementsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydAttachementsService>;
}
