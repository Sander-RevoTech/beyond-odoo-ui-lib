import { Subject } from 'rxjs';
import { SearchItem, SearchResult } from './dto/search';
import { BydBaseOdooService } from '../../../services/baseService';
import * as i0 from "@angular/core";
export declare class BydScanPackingService extends BydBaseOdooService {
    private readonly _scanPackingService;
    askScanning: Subject<unknown>;
    searchScanItem: SearchItem | null;
    constructor();
    lookForPacking(id: number): import("rxjs").Observable<SearchResult>;
    setActiveScanItem(item: SearchItem): void;
    clearActiveScanItem(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydScanPackingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydScanPackingService>;
}
