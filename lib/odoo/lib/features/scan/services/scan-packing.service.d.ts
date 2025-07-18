import { Subject } from 'rxjs';
import { BydBaseOdooService } from '../../../services/baseService';
import { SearchItem, SearchResult } from './dto/search';
import * as i0 from "@angular/core";
export declare class BydScanPackingService extends BydBaseOdooService {
    askScanning: Subject<unknown>;
    searchScanItem: SearchItem | null;
    constructor();
    lookForPacking$(model: string, id: number | string): import("rxjs").Observable<SearchResult>;
    setActiveScanItem(item: SearchItem): void;
    clearActiveScanItem(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydScanPackingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydScanPackingService>;
}
