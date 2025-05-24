import { OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ViewType } from '../../models/types';
import { BydAbstractGridComponent } from '../abstract.component';
import * as i0 from "@angular/core";
export declare class BydGridControlComponent extends BydAbstractGridComponent<any> implements OnInit {
    show: {
        switchView?: boolean;
        filters?: boolean;
    };
    readonly dialog: MatDialog;
    constructor();
    ngOnInit(): void;
    switchView(type: ViewType): void;
    openFilters(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGridControlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydGridControlComponent, "byd-grid-control", never, { "show": { "alias": "show"; "required": false; }; }, {}, never, never, true, never>;
}
interface FiltersModalData {
    gridId: string;
}
export declare class FiltersModal {
    readonly dialogRef: MatDialogRef<any, any>;
    readonly data: FiltersModalData;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FiltersModal, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FiltersModal, "ng-component", never, {}, {}, never, never, true, never>;
}
export {};
