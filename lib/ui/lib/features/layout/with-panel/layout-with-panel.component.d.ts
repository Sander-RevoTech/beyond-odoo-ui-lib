import { AfterViewInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { BydBaseComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class BydLayoutWithPanelComponent extends BydBaseComponent implements OnChanges, AfterViewInit {
    open: boolean;
    width: string;
    close: EventEmitter<any>;
    drawer: MatDrawer | null;
    constructor();
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    manageDrawer(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydLayoutWithPanelComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydLayoutWithPanelComponent, "byd-layout-with-panel", never, { "open": { "alias": "open"; "required": false; }; "width": { "alias": "width"; "required": false; }; }, { "close": "close"; }, never, ["byd-layout-panel", "byd-layout-container"], true, never>;
}
