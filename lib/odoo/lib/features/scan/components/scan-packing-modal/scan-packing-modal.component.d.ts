import { OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BydBaseComponent } from '@beyond/utils';
import { SearchItem, SearchResult } from '../../services/dto/search';
import * as i0 from "@angular/core";
export interface Scope {
    key: string;
    navigation: (id: number) => void;
}
export declare class ScanPackingDialog extends BydBaseComponent implements OnDestroy {
    dialogRef: MatDialogRef<ScanPackingDialog>;
    scopes: Scope[];
    private readonly _scanPackingService;
    private readonly _notificationService;
    step: 'scan' | 'search';
    activeScope: Scope | null;
    searchResult: SearchResult | null;
    get noData(): boolean;
    constructor(dialogRef: MatDialogRef<ScanPackingDialog>);
    scanSuccess(result: string): void;
    permissionResponse(repsonse: boolean): void;
    getDataByScope(scope: Scope): SearchItem[];
    setScope(scope: Scope): void;
    navigateTo(scope: Scope | null, item: SearchItem): void;
    private _processSearchResult;
    private _getScopeByKey;
    private _extractIdFormUrl;
    private _extractModelFormUrl;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScanPackingDialog, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ScanPackingDialog, "ng-component", never, { "scopes": { "alias": "scopes"; "required": false; }; }, {}, never, never, true, never>;
}
