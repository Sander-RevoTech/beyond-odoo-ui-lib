import { BydBaseOdooService } from '../../../../services/baseService';
import { FileStructure } from '@beyond/utils';
import { HandleComplexRequest } from '@beyond/server';
import * as i0 from "@angular/core";
export declare class BydAttachementsService extends BydBaseOdooService {
    readonly attachments: HandleComplexRequest<FileStructure[]>;
    constructor();
    key(id: number, model: string): string;
    fetch$(id: number, model: string): import("rxjs").Observable<FileStructure[]>;
    post$(id: number, model: string, files: FileStructure[]): Promise<import("rxjs").Observable<number[]>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydAttachementsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydAttachementsService>;
}
