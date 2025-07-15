import { HandleComplexRequest } from '@beyond/server';
import { FileStructure } from '@beyond/utils';
import { BydBaseOdooService } from '../../../../services/baseService';
import { Attachment } from './dto/attachment';
import * as i0 from "@angular/core";
export declare class BydAttachementsService extends BydBaseOdooService {
    readonly attachmentsByIds: HandleComplexRequest<Attachment[]>;
    readonly attachments: HandleComplexRequest<Attachment[]>;
    constructor();
    keyByIds(ids: number[]): string;
    key(id: number, model: string): string;
    fetchByIds$(ids: number[]): import("rxjs").Observable<Attachment[]>;
    fetch$(id: number, model: string): import("rxjs").Observable<Attachment[]>;
    post$(id: number, model: string, files: FileStructure[]): Promise<import("rxjs").Observable<number[]>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydAttachementsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydAttachementsService>;
}
