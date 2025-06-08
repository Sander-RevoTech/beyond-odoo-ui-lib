import { OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BydBaseComponent } from '@beyond/utils';
import { SearchItem, SearchResult } from '../../services/dto/search';
import * as i0 from "@angular/core";
export interface Scope {
    key: string;
    navigation: (id: SearchItem) => void;
}
export interface ScanPackingDialogData {
    scopes: Scope[];
}
export declare class ScanPackingDialog extends BydBaseComponent implements OnDestroy {
    dialogRef: MatDialogRef<ScanPackingDialog>;
    data?: ScanPackingDialogData | undefined;
    private readonly _scanPackingService;
    private readonly _notificationService;
    step: import("@angular/core").WritableSignal<"scan" | "search">;
    activeScope: Scope | null;
    searchResult: SearchResult | null;
    get scopes(): Scope[];
    get noData(): boolean;
    constructor(dialogRef: MatDialogRef<ScanPackingDialog>, data?: ScanPackingDialogData | undefined);
    scanSuccess(result: string): void;
    getDataByScope(scope: Scope): SearchItem[];
    setScope(scope: Scope): void;
    navigateTo(scope: Scope | null, item: SearchItem): void;
    private _processSearchResult;
    private _getScopeByKey;
    private _extractIdFormUrl;
    private _extractModelFormUrl;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScanPackingDialog, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ScanPackingDialog, "ng-component", never, {}, {}, never, never, true, never>;
}
