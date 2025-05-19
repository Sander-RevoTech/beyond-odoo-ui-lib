import { OnInit } from '@angular/core';
import { ViewType } from '../../models/types';
import { BydAbstractGridComponent } from '../abstract.component';
import * as i0 from "@angular/core";
export declare class BydGridControlComponent extends BydAbstractGridComponent<any> implements OnInit {
    show: {
        switchView?: boolean;
    };
    constructor();
    ngOnInit(): void;
    switchView(type: ViewType): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGridControlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydGridControlComponent, "byd-grid-control", never, { "show": { "alias": "show"; "required": false; }; }, {}, never, never, true, never>;
}
